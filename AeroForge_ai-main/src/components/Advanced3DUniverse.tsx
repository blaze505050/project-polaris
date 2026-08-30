import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut, Info, Settings } from "lucide-react";
import {
  NBodyGravitySolver,
  RelativisticCalculator,
  StellarPhysics,
  Vector3,
  CelestialBody,
  CONSTANTS,
} from "@/services/advancedPhysicsSimulator";

interface Advanced3DUniverseProps {
  initialBodies?: CelestialBody[];
  timeScale?: number;
  showOrbits?: boolean;
  showInfo?: boolean;
  onSimulationUpdate?: (time: number, bodies: CelestialBody[]) => void;
}

export default function Advanced3DUniverse({
  initialBodies = [],
  timeScale = 1,
  showOrbits = true,
  showInfo = true,
  onSimulationUpdate,
}: Advanced3DUniverseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const solverRef = useRef<NBodyGravitySolver>(new NBodyGravitySolver());
  const meshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const orbitsRef = useRef<Map<string, THREE.Line>>(new Map());
  const trailsRef = useRef<Map<string, Vector3[]>>(new Map());
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const geometriesRef = useRef<THREE.BufferGeometry[]>([]);
  const materialsRef = useRef<THREE.Material[]>([]);

  const [isRunning, setIsRunning] = useState(false);
  const [simulationTime, setSimulationTime] = useState(0);
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);
  const [fps, setFps] = useState(60);
  const [error, setError] = useState<string | null>(null);
  const animationIdRef = useRef<number>();
  const fpsCounterRef = useRef({ frames: 0, lastTime: Date.now() });

  // Initialize Three.js scene with error handling
  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000011);
      scene.fog = new THREE.Fog(0x000011, 1e18, 1e20);

      // Camera setup with safe aspect ratio
      const width = containerRef.current.clientWidth || window.innerWidth;
      const height = containerRef.current.clientHeight || window.innerHeight;
      const camera = new THREE.PerspectiveCamera(75, width / height, 1e8, 1e20);
      camera.position.set(0, 5e11, 5e11);
      camera.lookAt(0, 0, 0);

      // Renderer setup with optimizations
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        precision: "highp",
        preserveDrawingBuffer: false,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      containerRef.current.appendChild(renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
      scene.add(ambientLight);

      const sunLight = new THREE.PointLight(0xffffff, 2, 1e20);
      sunLight.position.set(0, 0, 0);
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 2048;
      sunLight.shadow.mapSize.height = 2048;
      scene.add(sunLight);

      // Starfield background - optimized
      const starsGeometry = new THREE.BufferGeometry();
      const starCount = 5000;
      const starPositions = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount * 3; i += 3) {
        starPositions[i] = (Math.random() - 0.5) * 2e16;
        starPositions[i + 1] = (Math.random() - 0.5) * 2e16;
        starPositions[i + 2] = (Math.random() - 0.5) * 2e16;
      }
      starsGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
      const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1e10 });
      const stars = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(stars);

      geometriesRef.current.push(starsGeometry);
      materialsRef.current.push(starsMaterial);

      sceneRef.current = scene;
      cameraRef.current = camera;
      rendererRef.current = renderer;

      // Handle window resize with ResizeObserver
      const handleResize = () => {
        if (!containerRef.current || !camera || !renderer) return;
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      };

      resizeObserverRef.current = new ResizeObserver(handleResize);
      resizeObserverRef.current.observe(containerRef.current);

      return () => {
        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect();
        }
        // Cleanup resources
        geometriesRef.current.forEach((g) => g.dispose());
        materialsRef.current.forEach((m) => m.dispose());
        meshesRef.current.forEach((mesh) => {
          mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material.dispose();
          }
        });
        orbitsRef.current.forEach((line) => {
          line.geometry.dispose();
          if (Array.isArray(line.material)) {
            line.material.forEach((m) => m.dispose());
          } else {
            line.material.dispose();
          }
        });
        renderer.dispose();
        containerRef.current?.removeChild(renderer.domElement);
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initialize 3D scene");
    }
  }, []);

  // Initialize physics solver with bodies
  useEffect(() => {
    solverRef.current.clear();
    meshesRef.current.clear();
    orbitsRef.current.clear();
    trailsRef.current.clear();

    const defaultBodies: CelestialBody[] =
      initialBodies.length > 0
        ? initialBodies
        : [
            {
              id: "sun",
              name: "Sun",
              mass: CONSTANTS.SOLAR_MASS,
              radius: CONSTANTS.SOLAR_RADIUS,
              position: new Vector3(0, 0, 0),
              velocity: new Vector3(0, 0, 0),
              acceleration: new Vector3(),
              color: "#FDB813",
              type: "star",
              temperature: 5778,
              luminosity: CONSTANTS.SOLAR_LUMINOSITY,
            },
            {
              id: "earth",
              name: "Earth",
              mass: CONSTANTS.EARTH_MASS,
              radius: 6.371e6,
              position: new Vector3(CONSTANTS.AU, 0, 0),
              velocity: new Vector3(0, 29780, 0),
              acceleration: new Vector3(),
              color: "#4A90E2",
              type: "planet",
            },
            {
              id: "moon",
              name: "Moon",
              mass: CONSTANTS.MOON_MASS,
              radius: 1.737e6,
              position: new Vector3(CONSTANTS.AU + 3.844e8, 0, 0),
              velocity: new Vector3(0, 29780 + 1022, 0),
              acceleration: new Vector3(),
              color: "#CCCCCC",
              type: "moon",
            },
          ];

    for (const body of defaultBodies) {
      solverRef.current.addBody(body);
      trailsRef.current.set(body.id, []);
    }

    createBodyMeshes(defaultBodies);
  }, [initialBodies]);

  // Create 3D meshes for bodies
  const createBodyMeshes = useCallback(
    (bodies: CelestialBody[]) => {
      if (!sceneRef.current) return;

      for (const body of bodies) {
        // Optimize geometry segments based on body type
        const segments = body.type === "star" ? 16 : 24;
        const geometry = new THREE.SphereGeometry(Math.max(body.radius, 1e9), segments, segments);
        const material = new THREE.MeshStandardMaterial({
          color: body.color,
          emissive: body.type === "star" ? body.color : 0x000000,
          emissiveIntensity: body.type === "star" ? 1 : 0,
          metalness: 0.3,
          roughness: 0.7,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(body.position as any);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData = { bodyId: body.id };

        sceneRef.current.add(mesh);
        meshesRef.current.set(body.id, mesh);
        geometriesRef.current.push(geometry);
        materialsRef.current.push(material);

        // Create orbit line
        if (showOrbits) {
          const orbitGeometry = new THREE.BufferGeometry();
          const orbitMaterial = new THREE.LineBasicMaterial({
            color: 0x888888,
            transparent: true,
            opacity: 0.3,
          });
          const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
          sceneRef.current.add(orbitLine);
          orbitsRef.current.set(body.id, orbitLine);
          geometriesRef.current.push(orbitGeometry);
          materialsRef.current.push(orbitMaterial);
        }
      }
    },
    [showOrbits],
  );

  // Animation loop with proper dependency management
  useEffect(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      try {
        if (isRunning) {
          // Step physics simulation with error handling
          try {
            for (let i = 0; i < Math.max(1, Math.min(timeScale, 10)); i++) {
              solverRef.current.step();
            }
          } catch (err) {
            console.error("Physics simulation error:", err);
            setIsRunning(false);
          }

          setSimulationTime((t) => t + 1);

          // Update mesh positions and trails
          const bodies = solverRef.current.getBodies();
          for (const body of bodies) {
            const mesh = meshesRef.current.get(body.id);
            if (mesh) {
              mesh.position.copy(body.position as any);
            }

            // Update trail with memory management
            const trail = trailsRef.current.get(body.id);
            if (trail) {
              trail.push(body.position.clone());
              // Limit trail length to prevent memory issues
              if (trail.length > 300) trail.shift();

              const orbitLine = orbitsRef.current.get(body.id);
              if (orbitLine && trail.length > 1) {
                const positions = new Float32Array(trail.length * 3);
                for (let i = 0; i < trail.length; i++) {
                  positions[i * 3] = trail[i].x;
                  positions[i * 3 + 1] = trail[i].y;
                  positions[i * 3 + 2] = trail[i].z;
                }
                orbitLine.geometry.setAttribute(
                  "position",
                  new THREE.BufferAttribute(positions, 3),
                );
              }
            }
          }

          if (onSimulationUpdate) {
            onSimulationUpdate(simulationTime, bodies);
          }
        }

        // Update FPS counter
        fpsCounterRef.current.frames++;
        const now = Date.now();
        if (now - fpsCounterRef.current.lastTime >= 1000) {
          setFps(fpsCounterRef.current.frames);
          fpsCounterRef.current.frames = 0;
          fpsCounterRef.current.lastTime = now;
        }

        rendererRef.current!.render(sceneRef.current!, cameraRef.current!);
      } catch (err) {
        console.error("Animation loop error:", err);
        setError(err instanceof Error ? err.message : "Animation error");
      }
    };

    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isRunning, timeScale, onSimulationUpdate, simulationTime]);

  // Camera controls
  const handleZoom = (direction: number) => {
    if (!cameraRef.current) return;
    const distance = cameraRef.current.position.length();
    const newDistance = distance * (direction > 0 ? 1.2 : 0.8);
    const direction3 = cameraRef.current.position.normalize();
    cameraRef.current.position.copy(direction3.multiplyScalar(newDistance) as any);
  };

  const handleReset = () => {
    if (!cameraRef.current) return;
    cameraRef.current.position.set(0, 5e11, 5e11);
    cameraRef.current.lookAt(0, 0, 0);
    setSimulationTime(0);
    setIsRunning(false);
    solverRef.current.clear();
  };

  return (
    <div className="w-full h-full flex flex-col bg-aerospace-dark">
      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-aerospace-dark/90 z-50">
          <div className="text-center max-w-md">
            <p className="text-aerospace-danger font-bold mb-2">Simulation Error</p>
            <p className="text-foreground/70 text-sm mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                handleReset();
              }}
              className="px-4 py-2 bg-aerospace-blue/30 hover:bg-aerospace-blue/50 rounded text-foreground text-sm font-semibold transition-all"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      <div ref={containerRef} className="flex-1 relative" />

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-6 left-6 right-6 flex gap-4 items-center justify-between bg-black/50 backdrop-blur-md p-4 rounded-lg border border-aerospace-blue/30"
      >
        <div className="flex gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-2 bg-aerospace-blue hover:bg-aerospace-accent rounded-lg transition-colors"
            title={isRunning ? "Pause" : "Play"}
          >
            {isRunning ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-aerospace-blue hover:bg-aerospace-accent rounded-lg transition-colors"
            title="Reset"
          >
            <RotateCcw size={20} />
          </button>
          <button
            onClick={() => handleZoom(1)}
            className="p-2 bg-aerospace-blue hover:bg-aerospace-accent rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={() => handleZoom(-1)}
            className="p-2 bg-aerospace-blue hover:bg-aerospace-accent rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={20} />
          </button>
        </div>

        <div className="flex gap-4 text-aerospace-blue text-sm">
          <div>Time: {(simulationTime / 86400).toFixed(1)} days</div>
          <div>FPS: {fps}</div>
        </div>

        {selectedBody && showInfo && (
          <div className="text-xs text-aerospace-blue max-w-xs">
            <div className="font-bold">{selectedBody.name}</div>
            <div>Mass: {(selectedBody.mass / CONSTANTS.EARTH_MASS).toFixed(2)} M⊕</div>
          </div>
        )}
      </motion.div>

      {/* Info Panel */}
      {showInfo && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-6 left-6 bg-black/50 backdrop-blur-md p-4 rounded-lg border border-aerospace-blue/30 text-aerospace-blue text-sm max-w-xs"
        >
          <div className="flex items-center gap-2 mb-2">
            <Info size={16} />
            <span className="font-bold">N-Body Simulation</span>
          </div>
          <div className="text-xs space-y-1">
            <div>• Real gravitational physics</div>
            <div>• Leapfrog integration</div>
            <div>• Relativistic corrections</div>
            <div>• High-precision calculations</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
