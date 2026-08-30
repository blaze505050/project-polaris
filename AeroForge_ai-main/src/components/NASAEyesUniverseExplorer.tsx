import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Info, Navigation, Compass, Zap, Eye, Map } from "lucide-react";
import celestialDatabaseService, {
  CelestialObject,
  SearchFilters,
} from "@/services/celestialDatabaseService";

interface CelestialBody {
  id: string;
  name: string;
  type: "planet" | "star" | "galaxy" | "nebula" | "moon" | "asteroid";
  position: THREE.Vector3;
  size: number;
  color: string;
  texture?: string;
  description: string;
  distance: number;
  speed: number;
  orbitRadius?: number;
  temperature?: number;
  mass?: number;
  luminosity?: number;
  atmosphere?: boolean;
}

interface NavigationTarget {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  distance: number;
}

const CELESTIAL_BODIES: CelestialBody[] = [
  {
    id: "sun",
    name: "Sun",
    type: "star",
    position: new THREE.Vector3(0, 0, 0),
    size: 696000,
    color: "#FDB813",
    description: "Our star, a massive ball of plasma at the center of our solar system.",
    distance: 0,
    speed: 0,
    temperature: 5778,
    luminosity: 1,
  },
  {
    id: "mercury",
    name: "Mercury",
    type: "planet",
    position: new THREE.Vector3(57.9e6, 0, 0),
    size: 3839.7,
    color: "#8C7853",
    description: "The smallest planet and closest to the Sun. Extreme temperature variations.",
    distance: 57.9e6,
    speed: 47.87,
    orbitRadius: 57.9e6,
    temperature: 430,
  },
  {
    id: "venus",
    name: "Venus",
    type: "planet",
    position: new THREE.Vector3(108.2e6, 0, 0),
    size: 6051.8,
    color: "#FFC649",
    description: "The hottest planet with a thick, toxic atmosphere. Morning/Evening Star.",
    distance: 108.2e6,
    speed: 35.02,
    orbitRadius: 108.2e6,
    temperature: 735,
    atmosphere: true,
  },
  {
    id: "earth",
    name: "Earth",
    type: "planet",
    position: new THREE.Vector3(149.6e6, 0, 0),
    size: 6371,
    color: "#4A90E2",
    description: "Our home. The only known planet with life and liquid water on its surface.",
    distance: 149.6e6,
    speed: 29.78,
    orbitRadius: 149.6e6,
    temperature: 288,
    atmosphere: true,
  },
  {
    id: "mars",
    name: "Mars",
    type: "planet",
    position: new THREE.Vector3(227.9e6, 0, 0),
    size: 3389.5,
    color: "#E27B58",
    description:
      "The Red Planet. A cold desert world with the largest volcano in the solar system.",
    distance: 227.9e6,
    speed: 24.07,
    orbitRadius: 227.9e6,
    temperature: 210,
  },
  {
    id: "jupiter",
    name: "Jupiter",
    type: "planet",
    position: new THREE.Vector3(778.5e6, 0, 0),
    size: 69911,
    color: "#C88B3A",
    description: "The gas giant. Largest planet with a Great Red Spot storm and 95+ moons.",
    distance: 778.5e6,
    speed: 13.07,
    orbitRadius: 778.5e6,
    temperature: 165,
  },
  {
    id: "saturn",
    name: "Saturn",
    type: "planet",
    position: new THREE.Vector3(1.434e9, 0, 0),
    size: 58232,
    color: "#FAD5A5",
    description: "The ringed giant. Famous for its spectacular ring system and 146+ moons.",
    distance: 1.434e9,
    speed: 9.68,
    orbitRadius: 1.434e9,
    temperature: 134,
  },
  {
    id: "uranus",
    name: "Uranus",
    type: "planet",
    position: new THREE.Vector3(2.873e9, 0, 0),
    size: 25362,
    color: "#4FD0E7",
    description: "An ice giant that rotates on its side. Faint rings and 27+ moons.",
    distance: 2.873e9,
    speed: 6.81,
    orbitRadius: 2.873e9,
    temperature: 76,
  },
  {
    id: "neptune",
    name: "Neptune",
    type: "planet",
    position: new THREE.Vector3(4.495e9, 0, 0),
    size: 24622,
    color: "#4166F5",
    description: "The windiest planet. An ice giant with supersonic winds and 14+ moons.",
    distance: 4.495e9,
    speed: 5.43,
    orbitRadius: 4.495e9,
    temperature: 72,
  },
  {
    id: "sirius",
    name: "Sirius",
    type: "star",
    position: new THREE.Vector3(8.6e16, 0, 0),
    size: 1.711e6,
    color: "#FFFFFF",
    description: "The brightest star in the night sky. A binary star system 8.6 light-years away.",
    distance: 8.6e16,
    speed: 0,
    temperature: 10000,
    luminosity: 25.4,
  },
  {
    id: "betelgeuse",
    name: "Betelgeuse",
    type: "star",
    position: new THREE.Vector3(6.43e17, 0, 0),
    size: 7.17e8,
    color: "#FF6B35",
    description: "A red supergiant star. One of the largest known stars, 640 light-years away.",
    distance: 6.43e17,
    speed: 0,
    temperature: 3500,
    luminosity: 140000,
  },
  {
    id: "andromeda",
    name: "Andromeda Galaxy",
    type: "galaxy",
    position: new THREE.Vector3(2.5e22, 0, 0),
    size: 1e20,
    color: "#E8B4F1",
    description: "The nearest large galaxy to the Milky Way. 2.5 million light-years away.",
    distance: 2.5e22,
    speed: 0,
  },
];

export default function NASAEyesUniverseExplorer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const bodiesRef = useRef<Map<string, THREE.Object3D>>(null as any);
  const orbitLinesRef = useRef<Map<string, THREE.Line>>(null as any);
  const animationFrameRef = useRef<number>();
  const navigationTimeRef = useRef<number>(0);
  const navigationDurationRef = useRef<number>(0);
  const navigationStartRef = useRef<THREE.Vector3 | null>(null);
  const navigationTargetRef = useRef<NavigationTarget | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const glowsRef = useRef<THREE.Mesh[]>([]);

  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [searchResults, setSearchResults] = useState<CelestialBody[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);
  const [stats, setStats] = useState({ fps: 0, distance: 0, speed: 0 });
  const [showLegend, setShowLegend] = useState(true);
  const [cameraMode, setCameraMode] = useState<"orbit" | "follow">("orbit");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize scene with advanced rendering and memory management
  useEffect(() => {
    if (!containerRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000814);
      scene.fog = new THREE.Fog(0x000814, 1e18, 1e20);
      sceneRef.current = scene;

      // Camera setup with safe aspect ratio
      const width = containerRef.current.clientWidth || window.innerWidth;
      const height = containerRef.current.clientHeight || window.innerHeight;
      const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1e25);
      camera.position.set(0, 3e8, 5e8);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      // Renderer setup with advanced features and error handling
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: false,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      containerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Advanced lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
      scene.add(ambientLight);

      const sunLight = new THREE.PointLight(0xffffff, 2);
      sunLight.position.set(0, 0, 0);
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 2048;
      sunLight.shadow.mapSize.height = 2048;
      scene.add(sunLight);

      // Atmospheric scattering effect
      const atmosphereGeometry = new THREE.SphereGeometry(1e10, 32, 32);
      const atmosphereMaterial = new THREE.MeshPhongMaterial({
        color: 0x87ceeb,
        emissive: 0x4a90e2,
        emissiveIntensity: 0.1,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide,
      });
      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      scene.add(atmosphere);

      // Enhanced starfield with depth - optimized for performance
      const starsGeometry = new THREE.BufferGeometry();
      const starsPositions = [];
      const starsColors = [];
      const starsSizes = [];

      // Reduced star count for better performance
      for (let i = 0; i < 25000; i++) {
        const x = (Math.random() - 0.5) * 1e21;
        const y = (Math.random() - 0.5) * 1e21;
        const z = (Math.random() - 0.5) * 1e21;
        starsPositions.push(x, y, z);

        const brightness = Math.random();
        starsColors.push(brightness, brightness, brightness);
        starsSizes.push(Math.random() * 1000 + 200);
      }

      starsGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(starsPositions), 3),
      );
      starsGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(new Float32Array(starsColors), 3),
      );
      starsGeometry.setAttribute(
        "size",
        new THREE.BufferAttribute(new Float32Array(starsSizes), 1),
      );

      const starsMaterial = new THREE.PointsMaterial({
        size: 500,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8,
        vertexColors: true,
      });

      const stars = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(stars);

      // Load celestial bodies
      loadCelestialBodies(scene);
      setIsLoading(false);

      // Handle window resize with ResizeObserver for better performance
      const handleResize = () => {
        if (!containerRef.current || !camera || !renderer) return;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        if (width > 0 && height > 0) {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      };

      resizeObserverRef.current = new ResizeObserver(handleResize);
      resizeObserverRef.current.observe(containerRef.current);

      // Animation loop with optimized performance
      let frameCount = 0;
      let lastTime = Date.now();
      let time = 0;

      const animate = () => {
        animationFrameRef.current = requestAnimationFrame(animate);
        time += 0.016;

        // Update celestial body positions (orbital mechanics)
        CELESTIAL_BODIES.forEach((body) => {
          const mesh = bodiesRef.current.get(body.id);
          if (mesh && body.orbitRadius) {
            const angle = (time * body.speed) / body.orbitRadius;
            mesh.position.x = Math.cos(angle) * body.orbitRadius;
            mesh.position.z = Math.sin(angle) * body.orbitRadius;

            // Rotate body
            mesh.rotation.y += 0.001;
          }
        });

        // Handle smooth camera navigation
        if (navigationTargetRef.current && navigationStartRef.current) {
          navigationTimeRef.current += 0.016;
          const progress = Math.min(navigationTimeRef.current / navigationDurationRef.current, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

          const currentPos = new THREE.Vector3().lerpVectors(
            navigationStartRef.current,
            navigationTargetRef.current.position,
            easeProgress,
          );
          camera.position.copy(currentPos);
          camera.lookAt(navigationTargetRef.current.lookAt);

          if (progress >= 1) {
            navigationTargetRef.current = null;
            navigationStartRef.current = null;
            setIsNavigating(false);
          }
        }

        // Update stats
        frameCount++;
        const currentTime = Date.now();
        if (currentTime - lastTime >= 1000) {
          const cameraDistance = camera.position.length();
          setStats({
            fps: frameCount,
            distance: cameraDistance,
            speed: 0,
          });
          frameCount = 0;
          lastTime = currentTime;
        }

        renderer.render(scene, camera);
      };

      animate();

      // Raycaster for object selection
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      const onMouseClick = (event: MouseEvent) => {
        if (!containerRef.current || isNavigating) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(Array.from(bodiesRef.current.values()));

        if (intersects.length > 0) {
          const obj = intersects[0].object;
          const body = CELESTIAL_BODIES.find((b) => bodiesRef.current.get(b.id) === obj);
          if (body) {
            setSelectedBody(body);
          }
        }
      };

      containerRef.current.addEventListener("click", onMouseClick);

      return () => {
        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect();
        }
        containerRef.current?.removeEventListener("click", onMouseClick);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        // Proper cleanup of Three.js resources
        bodiesRef.current.forEach((mesh) => {
          if (mesh instanceof THREE.Mesh) {
            mesh.geometry.dispose();
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((m) => m.dispose());
            } else {
              mesh.material.dispose();
            }
          }
        });
        orbitLinesRef.current.forEach((line) => {
          line.geometry.dispose();
          if (Array.isArray(line.material)) {
            line.material.forEach((m) => m.dispose());
          } else {
            line.material.dispose();
          }
        });
        glowsRef.current.forEach((glow) => {
          glow.geometry.dispose();
          if (Array.isArray(glow.material)) {
            glow.material.forEach((m) => m.dispose());
          } else {
            glow.material.dispose();
          }
        });
        starsGeometry.dispose();
        starsMaterial.dispose();
        atmosphereGeometry.dispose();
        atmosphereMaterial.dispose();
        renderer.dispose();
        containerRef.current?.removeChild(renderer.domElement);
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initialize 3D scene");
      setIsLoading(false);
    }
  }, []);

  const loadCelestialBodies = (scene: THREE.Scene) => {
    CELESTIAL_BODIES.forEach((body) => {
      let geometry: THREE.BufferGeometry;
      let material: THREE.Material;

      if (body.type === "galaxy") {
        // Galaxy as a flat disk with glow
        geometry = new THREE.PlaneGeometry(body.size * 2, body.size * 2);
        material = new THREE.MeshStandardMaterial({
          color: body.color,
          emissive: body.color,
          emissiveIntensity: 0.6,
          transparent: true,
          opacity: 0.7,
        });
      } else if (body.type === "nebula") {
        geometry = new THREE.SphereGeometry(body.size, 16, 16);
        material = new THREE.MeshStandardMaterial({
          color: body.color,
          emissive: body.color,
          emissiveIntensity: 0.4,
          transparent: true,
          opacity: 0.5,
        });
      } else {
        // Planets and stars as spheres - optimized geometry
        const segments = body.type === "star" ? 32 : 48;
        geometry = new THREE.SphereGeometry(body.size, segments, segments);
        material = new THREE.MeshPhongMaterial({
          color: body.color,
          emissive: body.type === "star" ? body.color : "#000000",
          emissiveIntensity: body.type === "star" ? 0.8 : 0.1,
          shininess: body.type === "planet" ? 30 : 100,
        });
      }

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(body.position);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      bodiesRef.current.set(body.id, mesh);

      // Add orbit line for planets
      if (body.orbitRadius && body.type === "planet") {
        const orbitGeometry = new THREE.BufferGeometry();
        const orbitPoints = [];
        for (let i = 0; i <= 360; i += 2) {
          const angle = (i * Math.PI) / 180;
          orbitPoints.push(
            Math.cos(angle) * body.orbitRadius,
            0,
            Math.sin(angle) * body.orbitRadius,
          );
        }
        orbitGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(new Float32Array(orbitPoints), 3),
        );
        const orbitMaterial = new THREE.LineBasicMaterial({
          color: 0x4a90e2,
          transparent: true,
          opacity: 0.3,
        });
        const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
        scene.add(orbitLine);
        orbitLinesRef.current.set(body.id, orbitLine);
      }

      // Add glow effect for stars
      if (body.type === "star") {
        const glowGeometry = new THREE.SphereGeometry(body.size * 1.5, 16, 16);
        const glowMaterial = new THREE.MeshStandardMaterial({
          color: body.color,
          emissive: body.color,
          emissiveIntensity: 0.3,
          transparent: true,
          opacity: 0.2,
          side: THREE.BackSide,
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.copy(body.position);
        scene.add(glow);
        glowsRef.current.push(glow);
      }
    });
  };

  const navigateToBody = useCallback(
    (body: CelestialBody) => {
      if (isNavigating || !cameraRef.current) return;

      setIsNavigating(true);
      setSelectedBody(body);

      const distance = body.size * 5;
      const direction = new THREE.Vector3(1, 0.5, 1).normalize();
      const targetPosition = new THREE.Vector3()
        .copy(body.position)
        .add(direction.multiplyScalar(distance));

      navigationStartRef.current = cameraRef.current.position.clone();
      navigationTargetRef.current = {
        position: targetPosition,
        lookAt: body.position,
        distance,
      };
      navigationTimeRef.current = 0;
      navigationDurationRef.current = 3; // 3 second flight
    },
    [isNavigating],
  );

  const handleSearch = useCallback(() => {
    const results = CELESTIAL_BODIES.filter((body) =>
      body.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setSearchResults(results);
  }, [searchTerm]);

  const handleReset = useCallback(() => {
    if (!cameraRef.current) return;
    setIsNavigating(true);
    navigationStartRef.current = cameraRef.current.position.clone();
    navigationTargetRef.current = {
      position: new THREE.Vector3(0, 3e8, 5e8),
      lookAt: new THREE.Vector3(0, 0, 0),
      distance: 0,
    };
    navigationTimeRef.current = 0;
    navigationDurationRef.current = 3;
    setSelectedBody(null);
    setSearchTerm("");
    setSearchResults([]);
  }, []);

  return (
    <div className="w-full h-screen bg-aerospace-dark flex flex-col overflow-hidden">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-aerospace-dark/90 z-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-aerospace-blue/30 border-t-aerospace-blue rounded-full animate-spin mx-auto mb-4" />
            <p className="text-foreground/70 font-mono">Initializing Universe Explorer...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-aerospace-dark/90 z-50">
          <div className="text-center max-w-md">
            <p className="text-aerospace-danger font-bold mb-2">Error Loading Scene</p>
            <p className="text-foreground/70 text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-aerospace-blue/30 hover:bg-aerospace-blue/50 rounded text-foreground text-sm font-semibold transition-all"
            >
              Reload
            </button>
          </div>
        </div>
      )}

      {/* Main Viewer */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden" />

      {/* Top Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 left-6 right-6 flex gap-3 z-20"
      >
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Search planets, stars, galaxies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 px-4 py-3 bg-aerospace-dark/80 border border-aerospace-blue/50 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-aerospace-blue focus:ring-2 focus:ring-aerospace-blue/30 transition-all"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-3 bg-aerospace-blue/20 hover:bg-aerospace-blue/40 border border-aerospace-blue rounded-lg transition-all flex items-center gap-2 font-semibold"
          >
            <Search className="w-4 h-4" />
            Find
          </button>
        </div>
      </motion.div>

      {/* Mission Control Panel */}
      <AnimatePresence>
        {selectedBody && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute top-24 left-6 bg-aerospace-dark/95 border-2 border-aerospace-blue/50 rounded-lg p-6 max-w-md backdrop-blur-sm z-20 shadow-2xl"
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-full flex-shrink-0 border-2 border-aerospace-blue/50"
                style={{ backgroundColor: selectedBody.color }}
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-aerospace-blue font-bold text-lg">{selectedBody.name}</h2>
                <p className="text-aerospace-accent text-sm capitalize mb-3">{selectedBody.type}</p>
                <p className="text-foreground/70 text-sm leading-relaxed mb-4">
                  {selectedBody.description}
                </p>

                {/* Telemetry Data */}
                <div className="bg-aerospace-dark/50 rounded p-3 space-y-2 text-xs font-mono text-foreground/60 mb-4">
                  <div className="flex justify-between">
                    <span>Diameter:</span>
                    <span className="text-aerospace-blue">
                      {(selectedBody.size * 2).toLocaleString()} km
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distance:</span>
                    <span className="text-aerospace-blue">
                      {(selectedBody.distance / 1e6).toLocaleString()} Mkm
                    </span>
                  </div>
                  {selectedBody.temperature && (
                    <div className="flex justify-between">
                      <span>Temperature:</span>
                      <span className="text-aerospace-blue">
                        {selectedBody.temperature.toLocaleString()} K
                      </span>
                    </div>
                  )}
                  {selectedBody.luminosity && (
                    <div className="flex justify-between">
                      <span>Luminosity:</span>
                      <span className="text-aerospace-blue">
                        {selectedBody.luminosity.toFixed(1)} L☉
                      </span>
                    </div>
                  )}
                  {selectedBody.speed && (
                    <div className="flex justify-between">
                      <span>Orbital Speed:</span>
                      <span className="text-aerospace-blue">
                        {selectedBody.speed.toFixed(2)} km/s
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigateToBody(selectedBody)}
                  disabled={isNavigating}
                  className="w-full px-3 py-2 bg-aerospace-blue/30 hover:bg-aerospace-blue/50 disabled:opacity-50 rounded text-foreground text-sm font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  {isNavigating ? "Flying..." : "Fly To"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Results */}
      <AnimatePresence>
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute bottom-24 right-6 bg-aerospace-dark/95 border-2 border-aerospace-blue/50 rounded-lg p-4 max-w-xs max-h-96 overflow-y-auto backdrop-blur-sm z-20 shadow-2xl"
          >
            <h3 className="text-aerospace-blue font-bold mb-3 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Results ({searchResults.length})
            </h3>
            <div className="space-y-2">
              {searchResults.map((body) => (
                <button
                  key={body.id}
                  onClick={() => navigateToBody(body)}
                  disabled={isNavigating}
                  className="w-full text-left px-3 py-2 bg-aerospace-dark/50 hover:bg-aerospace-blue/20 disabled:opacity-50 border border-aerospace-blue/30 rounded transition-all text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: body.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-foreground truncate">{body.name}</div>
                      <div className="text-foreground/50 text-xs">{body.type}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-6 left-6 right-6 flex justify-between items-end gap-4 z-20"
      >
        {/* Left Controls */}
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            disabled={isNavigating}
            className="p-3 bg-aerospace-accent/20 hover:bg-aerospace-accent/40 disabled:opacity-50 border border-aerospace-accent rounded-lg transition-all"
            title="Reset View"
          >
            <Compass className="w-5 h-5 text-aerospace-accent" />
          </button>
          <button
            onClick={() => setCameraMode(cameraMode === "orbit" ? "follow" : "orbit")}
            className="p-3 bg-aerospace-blue/20 hover:bg-aerospace-blue/40 border border-aerospace-blue rounded-lg transition-all"
            title="Toggle Camera Mode"
          >
            <Eye className="w-5 h-5 text-aerospace-blue" />
          </button>
        </div>

        {/* Center Info */}
        <div className="flex-1 text-center">
          <div className="text-aerospace-blue text-sm font-mono">
            Distance: {(stats.distance / 1e6).toLocaleString("en-US", { maximumFractionDigits: 2 })}{" "}
            Mkm
          </div>
          <div className="text-foreground/60 text-xs font-mono">
            {isNavigating ? "Navigating..." : "Ready"}
          </div>
        </div>

        {/* Right Stats */}
        <div className="text-right text-xs font-mono text-foreground/50">
          <div>{stats.fps} FPS</div>
          <div>{cameraMode === "orbit" ? "Orbit Mode" : "Follow Mode"}</div>
        </div>
      </motion.div>

      {/* Legend */}
      <AnimatePresence>
        {showLegend && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-6 right-6 bg-aerospace-dark/90 border border-aerospace-blue/30 rounded-lg p-4 backdrop-blur-sm max-w-xs z-10"
          >
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-aerospace-blue" />
              <h4 className="text-aerospace-blue font-bold text-sm">Celestial Guide</h4>
              <button
                onClick={() => setShowLegend(false)}
                className="ml-auto text-foreground/40 hover:text-foreground/70"
              >
                ×
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-300" />
                <span className="text-foreground/70">Stars</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400" />
                <span className="text-foreground/70">Planets</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-400" />
                <span className="text-foreground/70">Galaxies</span>
              </div>
              <div className="text-foreground/60 text-xs mt-3 leading-relaxed">
                Click on any celestial body to view details. Use the search to find specific
                objects.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
