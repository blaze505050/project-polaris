import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Eye,
  Settings,
  Info,
  Navigation,
  Maximize2,
  Minimize2,
  Search,
  Filter,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  BarnesHutTree,
  GeneralRelativityEngine,
  TerrainGenerator,
  VolumetricRenderer,
  OrbitalMechanics,
  PhysicsBody,
  CONSTANTS,
} from "@/services/physicsCore";

interface SimulationState {
  isRunning: boolean;
  timeScale: number;
  showGravitationalLensing: boolean;
  showTimeDilation: boolean;
  showVolumetric: boolean;
  selectedBody: PhysicsBody | null;
  cameraMode: "free" | "follow" | "orbit";
}

interface PerformanceMetrics {
  fps: number;
  bodies: number;
  computeTime: number;
}

export default function UltimateUniverseEngine() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const bodiesRef = useRef<PhysicsBody[]>([]);
  const meshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const barnesHutRef = useRef<BarnesHutTree>(new BarnesHutTree());

  const [state, setState] = useState<SimulationState>({
    isRunning: true,
    timeScale: 1,
    showGravitationalLensing: true,
    showTimeDilation: false,
    showVolumetric: true,
    selectedBody: null,
    cameraMode: "free",
  });

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    bodies: 0,
    computeTime: 0,
  });

  const [showUI, setShowUI] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000814);
    scene.fog = new THREE.FogExp2(0x000814, 0.00001);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1e20,
    );
    camera.position.set(0, 1e12, 1e12);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, precision: "highp" });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 0, 0);
    pointLight.castShadow = true;
    scene.add(pointLight);

    // Starfield background
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 10000;
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 2e13;
      positions[i + 1] = (Math.random() - 0.5) * 2e13;
      positions[i + 2] = (Math.random() - 0.5) * 2e13;
    }

    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1e10,
      sizeAttenuation: true,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Initialize solar system
    initializeSolarSystem(scene);

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Animation loop
    let frameCount = 0;
    let lastTime = performance.now();
    let lastFpsUpdate = lastTime;

    const animate = () => {
      requestAnimationFrame(animate);

      const now = performance.now();
      const deltaTime = (now - lastTime) / 1000;
      lastTime = now;

      if (state.isRunning) {
        updatePhysics(deltaTime * state.timeScale);
      }

      renderer.render(scene, camera);

      frameCount++;
      if (now - lastFpsUpdate >= 1000) {
        setMetrics((prev) => ({
          ...prev,
          fps: frameCount,
          bodies: bodiesRef.current.length,
        }));
        frameCount = 0;
        lastFpsUpdate = now;
      }
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  const initializeSolarSystem = (scene: THREE.Scene) => {
    const bodies: PhysicsBody[] = [
      {
        id: "sun",
        name: "Sun",
        mass: CONSTANTS.SOLAR_MASS,
        position: new THREE.Vector3(0, 0, 0),
        velocity: new THREE.Vector3(0, 0, 0),
        radius: CONSTANTS.SOLAR_RADIUS,
        type: "star",
        temperature: 5778,
        luminosity: 1,
      },
      {
        id: "earth",
        name: "Earth",
        mass: CONSTANTS.EARTH_MASS,
        position: new THREE.Vector3(CONSTANTS.AU, 0, 0),
        velocity: new THREE.Vector3(
          0,
          OrbitalMechanics.orbitalVelocity(CONSTANTS.SOLAR_MASS, CONSTANTS.AU),
          0,
        ),
        radius: CONSTANTS.EARTH_RADIUS,
        type: "planet",
        temperature: 288,
        atmosphere: {
          composition: { N2: 78, O2: 21, Ar: 0.93 },
          density: 1.225,
          pressure: 101325,
          temperature: 288,
        },
      },
      {
        id: "jupiter",
        name: "Jupiter",
        mass: 1.898e27,
        position: new THREE.Vector3(5.2 * CONSTANTS.AU, 0, 0),
        velocity: new THREE.Vector3(
          0,
          OrbitalMechanics.orbitalVelocity(CONSTANTS.SOLAR_MASS, 5.2 * CONSTANTS.AU),
          0,
        ),
        radius: 6.9911e7,
        type: "planet",
        temperature: 165,
      },
      {
        id: "black_hole",
        name: "Sagittarius A*",
        mass: 4.1e6 * CONSTANTS.SOLAR_MASS,
        position: new THREE.Vector3(2.6e20, 0, 0),
        velocity: new THREE.Vector3(0, 0, 0),
        radius: GeneralRelativityEngine.schwarzschildRadius(4.1e6 * CONSTANTS.SOLAR_MASS),
        type: "black_hole",
      },
    ];

    bodiesRef.current = bodies;

    // Create meshes for each body
    bodies.forEach((body) => {
      const geometry = new THREE.SphereGeometry(Math.max(body.radius, 1e10), 32, 32);
      let material: THREE.Material;

      if (body.type === "star") {
        material = new THREE.MeshStandardMaterial({
          color: 0xfdb813,
          emissive: 0xfdb813,
        });
      } else if (body.type === "black_hole") {
        material = new THREE.MeshBasicMaterial({
          color: 0x000000,
        });
      } else if (body.type === "planet") {
        material = new THREE.MeshStandardMaterial({
          color: body.id === "earth" ? 0x4488ff : 0xffaa44,
          roughness: 0.7,
          metalness: 0.2,
        });
      } else {
        material = new THREE.MeshStandardMaterial({
          color: 0x888888,
          roughness: 0.8,
        });
      }

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(body.position);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      meshesRef.current.set(body.id, mesh);
    });
  };

  const updatePhysics = (deltaTime: number) => {
    const startTime = performance.now();

    // Build Barnes-Hut tree
    barnesHutRef.current.clear();
    bodiesRef.current.forEach((body) => {
      barnesHutRef.current.insert(body);
    });

    // Update velocities and positions
    bodiesRef.current.forEach((body) => {
      if (body.type === "star") return; // Sun doesn't move

      const force = barnesHutRef.current.calculateForce(body);
      const acceleration = force.divideScalar(body.mass);

      body.velocity.add(acceleration.multiplyScalar(deltaTime));
      body.position.add(new THREE.Vector3().copy(body.velocity).multiplyScalar(deltaTime));

      // Update mesh position
      const mesh = meshesRef.current.get(body.id);
      if (mesh) {
        mesh.position.copy(body.position);
      }
    });

    const computeTime = performance.now() - startTime;
    setMetrics((prev) => ({ ...prev, computeTime: Math.round(computeTime) }));
  };

  const handlePlayPause = () => {
    setState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const handleReset = () => {
    // Reset to initial state
    bodiesRef.current.forEach((body) => {
      const mesh = meshesRef.current.get(body.id);
      if (mesh) {
        mesh.position.copy(body.position);
      }
    });
  };

  const handleTimeScaleChange = (scale: number) => {
    setState((prev) => ({ ...prev, timeScale: scale }));
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden"
      onMouseMove={() => setShowUI(true)}
      onMouseLeave={() => setShowUI(false)}
    >
      {/* Controls */}
      <AnimatePresence>
        {showUI && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 z-10 p-6 bg-gradient-to-b from-black/80 to-transparent"
          >
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl font-bold text-white mb-4">Ultimate Universe Engine</h1>
              <p className="text-cyan-400 text-sm mb-6">
                Physics-accurate N-body simulation with General Relativity effects
              </p>

              {/* Control buttons */}
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={handlePlayPause}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition"
                >
                  {state.isRunning ? <Pause size={18} /> : <Play size={18} />}
                  {state.isRunning ? "Pause" : "Play"}
                </button>

                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
                >
                  <RotateCcw size={18} />
                  Reset
                </button>

                <button
                  onClick={handleFullscreen}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
                >
                  {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>

                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg">
                  <span className="text-white text-sm">Time Scale:</span>
                  <select
                    value={state.timeScale}
                    onChange={(e) => handleTimeScaleChange(parseFloat(e.target.value))}
                    className="bg-slate-700 text-white rounded px-2 py-1 text-sm"
                  >
                    <option value={0.1}>0.1x</option>
                    <option value={1}>1x</option>
                    <option value={10}>10x</option>
                    <option value={100}>100x</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition">
                  <input
                    type="checkbox"
                    checked={state.showGravitationalLensing}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        showGravitationalLensing: e.target.checked,
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-white text-sm">Gravitational Lensing</span>
                </label>

                <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition">
                  <input
                    type="checkbox"
                    checked={state.showVolumetric}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        showVolumetric: e.target.checked,
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-white text-sm">Volumetric Rendering</span>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Performance metrics */}
      <AnimatePresence>
        {showUI && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-6 right-6 z-10 bg-black/80 backdrop-blur border border-cyan-500/30 rounded-lg p-4 text-cyan-400 text-sm font-mono space-y-2"
          >
            <div>FPS: {metrics.fps}</div>
            <div>Bodies: {metrics.bodies}</div>
            <div>Compute: {metrics.computeTime}ms</div>
            <div>Time Scale: {state.timeScale}x</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info panel */}
      <AnimatePresence>
        {showUI && state.selectedBody && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-6 left-6 z-10 bg-black/80 backdrop-blur border border-cyan-500/30 rounded-lg p-6 max-w-sm"
          >
            <h3 className="text-cyan-400 text-lg font-bold mb-3">{state.selectedBody.name}</h3>
            <div className="text-slate-300 text-sm space-y-2">
              <div>
                <span className="text-cyan-400">Type:</span> {state.selectedBody.type}
              </div>
              <div>
                <span className="text-cyan-400">Mass:</span>{" "}
                {(state.selectedBody.mass / CONSTANTS.SOLAR_MASS).toFixed(2)} M☉
              </div>
              <div>
                <span className="text-cyan-400">Radius:</span>{" "}
                {(state.selectedBody.radius / 1e6).toFixed(0)} Mm
              </div>
              {state.selectedBody.temperature && (
                <div>
                  <span className="text-cyan-400">Temperature:</span>{" "}
                  {state.selectedBody.temperature.toFixed(0)} K
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
