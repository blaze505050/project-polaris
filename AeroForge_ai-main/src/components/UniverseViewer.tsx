import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import { ZoomIn, ZoomOut, RotateCcw, Info } from "lucide-react";

interface CelestialObject {
  name: string;
  type: "star" | "nebula" | "galaxy" | "cluster";
  ra: number; // Right Ascension in degrees
  dec: number; // Declination in degrees
  magnitude: number;
  distance: number; // in light-years
  color: string;
  size: number;
  description: string;
}

const CELESTIAL_OBJECTS: CelestialObject[] = [
  // Bright Stars
  {
    name: "Sirius",
    type: "star",
    ra: 101.29,
    dec: -16.71,
    magnitude: -1.46,
    distance: 8.6,
    color: "#FFFFFF",
    size: 2,
    description: "Brightest star in the night sky, Alpha Canis Majoris",
  },
  {
    name: "Canopus",
    type: "star",
    ra: 95.99,
    dec: -52.69,
    magnitude: -0.72,
    distance: 310,
    color: "#FFE4B5",
    size: 1.8,
    description: "Second brightest star, supergiant in Carina constellation",
  },
  {
    name: "Rigel",
    type: "star",
    ra: 78.63,
    dec: 8.2,
    magnitude: 0.12,
    distance: 860,
    color: "#87CEEB",
    size: 1.6,
    description: "Blue supergiant in Orion constellation",
  },
  {
    name: "Betelgeuse",
    type: "star",
    ra: 88.79,
    dec: 7.41,
    magnitude: 0.42,
    distance: 640,
    color: "#FF6347",
    size: 2.2,
    description: "Red supergiant, variable star in Orion",
  },
  {
    name: "Vega",
    type: "star",
    ra: 279.23,
    dec: 38.78,
    magnitude: 0.03,
    distance: 25.04,
    color: "#E6F3FF",
    size: 1.5,
    description: "Bright star in Lyra constellation",
  },
  // Nebulae
  {
    name: "Orion Nebula",
    type: "nebula",
    ra: 83.82,
    dec: -5.39,
    magnitude: 4.0,
    distance: 1344,
    color: "#00FF88",
    size: 3.5,
    description: "Emission nebula, stellar nursery with active star formation",
  },
  {
    name: "Crab Nebula",
    type: "nebula",
    ra: 83.63,
    dec: 22.01,
    magnitude: 8.4,
    distance: 6500,
    color: "#FF6B9D",
    size: 2.8,
    description: "Supernova remnant, pulsar wind nebula",
  },
  {
    name: "Helix Nebula",
    type: "nebula",
    ra: 326.11,
    dec: -2.8,
    magnitude: 7.3,
    distance: 700,
    color: "#00FFFF",
    size: 3.2,
    description: "Planetary nebula, dying star with expanding shells",
  },
  // Galaxies
  {
    name: "Andromeda Galaxy",
    type: "galaxy",
    ra: 10.68,
    dec: 41.27,
    magnitude: 3.4,
    distance: 2537000,
    color: "#FFD700",
    size: 4.5,
    description: "Nearest major galaxy, spiral structure similar to Milky Way",
  },
  {
    name: "Triangulum Galaxy",
    type: "galaxy",
    ra: 23.46,
    dec: 30.66,
    magnitude: 5.7,
    distance: 3000000,
    color: "#FFA500",
    size: 3.8,
    description: "Third largest galaxy in Local Group",
  },
  {
    name: "Whirlpool Galaxy",
    type: "galaxy",
    ra: 202.97,
    dec: 47.2,
    magnitude: 8.4,
    distance: 23000000,
    color: "#FFB6C1",
    size: 3.2,
    description: "Classic spiral galaxy with prominent arms",
  },
  // Star Clusters
  {
    name: "Pleiades",
    type: "cluster",
    ra: 56.87,
    dec: 24.11,
    magnitude: 1.6,
    distance: 444,
    color: "#E0FFFF",
    size: 3.0,
    description: "Open star cluster, Seven Sisters",
  },
  {
    name: "Hyades",
    type: "cluster",
    ra: 66.74,
    dec: 15.87,
    magnitude: 0.5,
    distance: 153,
    color: "#F0E68C",
    size: 2.5,
    description: "Nearest open cluster to Earth",
  },
  {
    name: "Omega Centauri",
    type: "cluster",
    ra: 201.7,
    dec: -47.48,
    magnitude: 3.7,
    distance: 15800,
    color: "#FFE4E1",
    size: 3.5,
    description: "Largest globular cluster in Milky Way",
  },
];

interface ZoomLevel {
  scale: number;
  label: string;
  distance: number;
}

const ZOOM_LEVELS: ZoomLevel[] = [
  { scale: 0.001, label: "Galactic", distance: 1000000000 },
  { scale: 0.01, label: "Local Group", distance: 100000000 },
  { scale: 0.1, label: "Milky Way", distance: 10000000 },
  { scale: 1, label: "Stellar Neighborhood", distance: 1000000 },
  { scale: 10, label: "Local Stars", distance: 100000 },
  { scale: 100, label: "Nearby Stars", distance: 10000 },
];

export default function UniverseViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const objectsRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const controlsRef = useRef<any>(null);

  const [zoomLevel, setZoomLevel] = useState(3);
  const [selectedObject, setSelectedObject] = useState<CelestialObject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ fps: 0, objects: 0 });

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000814);
    scene.fog = new THREE.Fog(0x000814, 500000, 5000000);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      1,
      10000000,
    );
    camera.position.set(0, 0, 100000);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(100000, 100000, 100000);
    scene.add(pointLight);

    // Starfield background
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 500,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
    });

    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 10000000;
      const y = (Math.random() - 0.5) * 10000000;
      const z = (Math.random() - 0.5) * 10000000;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(starsVertices), 3),
    );
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Add celestial objects
    CELESTIAL_OBJECTS.forEach((obj) => {
      const raRad = (obj.ra * Math.PI) / 180;
      const decRad = (obj.dec * Math.PI) / 180;
      const distance = obj.distance * 63241; // Convert light-years to AU-like units

      const x = distance * Math.cos(decRad) * Math.cos(raRad);
      const y = distance * Math.sin(decRad);
      const z = distance * Math.cos(decRad) * Math.sin(raRad);

      let geometry: THREE.BufferGeometry;
      let material: THREE.Material;

      if (obj.type === "star") {
        geometry = new THREE.SphereGeometry(obj.size * 100, 16, 16);
        material = new THREE.MeshStandardMaterial({
          color: obj.color,
          emissive: obj.color,
          emissiveIntensity: 0.8,
        });
      } else if (obj.type === "nebula") {
        geometry = new THREE.SphereGeometry(obj.size * 500, 32, 32);
        material = new THREE.MeshStandardMaterial({
          color: obj.color,
          transparent: true,
          opacity: 0.6,
          emissive: obj.color,
          emissiveIntensity: 0.5,
        });
      } else if (obj.type === "galaxy") {
        geometry = new THREE.SphereGeometry(obj.size * 1000, 32, 32);
        material = new THREE.MeshStandardMaterial({
          color: obj.color,
          emissive: obj.color,
          emissiveIntensity: 0.4,
        });
      } else {
        geometry = new THREE.SphereGeometry(obj.size * 300, 24, 24);
        material = new THREE.MeshStandardMaterial({
          color: obj.color,
          emissive: obj.color,
          emissiveIntensity: 0.6,
        });
      }

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.userData = { celestialObject: obj };
      scene.add(mesh);
      objectsRef.current.set(obj.name, mesh);
    });

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
    let lastTime = Date.now();

    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate scene
      scene.rotation.y += 0.0001;

      // Update stats
      frameCount++;
      const currentTime = Date.now();
      if (currentTime - lastTime >= 1000) {
        setStats({ fps: frameCount, objects: objectsRef.current.size });
        frameCount = 0;
        lastTime = currentTime;
      }

      renderer.render(scene, camera);
    };

    animate();
    setIsLoading(false);

    // Raycaster for object selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);

      if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (obj.userData.celestialObject) {
          setSelectedObject(obj.userData.celestialObject);
        }
      }
    };

    containerRef.current.addEventListener("click", onMouseClick);

    return () => {
      window.removeEventListener("resize", handleResize);
      containerRef.current?.removeEventListener("click", onMouseClick);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  // Handle zoom
  const handleZoom = useCallback((direction: "in" | "out") => {
    setZoomLevel((prev) => {
      const newLevel =
        direction === "in" ? Math.min(prev + 1, ZOOM_LEVELS.length - 1) : Math.max(prev - 1, 0);
      if (cameraRef.current) {
        const targetDistance = ZOOM_LEVELS[newLevel].distance;
        cameraRef.current.position.z = targetDistance;
      }
      return newLevel;
    });
  }, []);

  const handleReset = useCallback(() => {
    setZoomLevel(3);
    setSelectedObject(null);
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, ZOOM_LEVELS[3].distance);
    }
  }, []);

  return (
    <div className="w-full h-screen bg-aerospace-dark flex flex-col">
      {/* Main Viewer */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden" />

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-6 left-6 right-6 flex justify-between items-end gap-4"
      >
        {/* Left Controls */}
        <div className="flex gap-3">
          <button
            onClick={() => handleZoom("out")}
            className="p-3 bg-aerospace-blue/20 hover:bg-aerospace-blue/40 border border-aerospace-blue rounded-lg transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5 text-aerospace-blue" />
          </button>
          <button
            onClick={() => handleZoom("in")}
            className="p-3 bg-aerospace-blue/20 hover:bg-aerospace-blue/40 border border-aerospace-blue rounded-lg transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5 text-aerospace-blue" />
          </button>
          <button
            onClick={handleReset}
            className="p-3 bg-aerospace-accent/20 hover:bg-aerospace-accent/40 border border-aerospace-accent rounded-lg transition-all"
            title="Reset View"
          >
            <RotateCcw className="w-5 h-5 text-aerospace-accent" />
          </button>
        </div>

        {/* Center Info */}
        <div className="flex-1 text-center">
          <div className="text-aerospace-blue text-sm font-mono">
            {ZOOM_LEVELS[zoomLevel].label}
          </div>
          <div className="text-foreground/60 text-xs font-mono">
            Scale: {ZOOM_LEVELS[zoomLevel].scale.toExponential(1)}
          </div>
        </div>

        {/* Right Stats */}
        <div className="text-right text-xs font-mono text-foreground/50">
          <div>{stats.fps} FPS</div>
          <div>{stats.objects} Objects</div>
        </div>
      </motion.div>

      {/* Selected Object Info */}
      {selectedObject && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="absolute top-6 left-6 bg-aerospace-dark/90 border border-aerospace-blue/50 rounded-lg p-4 max-w-sm backdrop-blur-sm"
        >
          <div className="flex items-start gap-3">
            <div
              className="w-4 h-4 rounded-full flex-shrink-0 mt-1"
              style={{ backgroundColor: selectedObject.color }}
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-aerospace-blue font-bold text-sm">{selectedObject.name}</h3>
              <p className="text-foreground/70 text-xs capitalize mb-2">{selectedObject.type}</p>
              <p className="text-foreground/60 text-xs leading-relaxed">
                {selectedObject.description}
              </p>
              <div className="mt-3 space-y-1 text-xs font-mono text-foreground/50">
                <div>Magnitude: {selectedObject.magnitude.toFixed(2)}</div>
                <div>Distance: {selectedObject.distance.toLocaleString()} ly</div>
                <div>
                  RA: {selectedObject.ra.toFixed(2)}° | Dec: {selectedObject.dec.toFixed(2)}°
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedObject(null)}
              className="text-foreground/40 hover:text-foreground/70 text-lg"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-aerospace-dark/80 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-aerospace-blue border-t-aerospace-accent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-aerospace-blue font-mono">Initializing Universe Viewer...</p>
          </div>
        </div>
      )}

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 right-6 bg-aerospace-dark/90 border border-aerospace-blue/30 rounded-lg p-4 backdrop-blur-sm max-w-xs"
      >
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-aerospace-blue" />
          <h4 className="text-aerospace-blue font-bold text-sm">Legend</h4>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white" />
            <span className="text-foreground/70">Stars</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-foreground/70">Nebulae</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-300" />
            <span className="text-foreground/70">Galaxies</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-300" />
            <span className="text-foreground/70">Clusters</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
