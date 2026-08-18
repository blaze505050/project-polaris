import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw, Search, Filter, Info, Navigation, Compass } from 'lucide-react';
import celestialDatabaseService, { CelestialObject, SearchFilters } from '@/services/celestialDatabaseService';

interface NavigationState {
  centerRA: number;
  centerDec: number;
  zoomLevel: number;
  viewRadius: number;
}

export default function UniverseExplorer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const objectsRef = useRef<Map<string, THREE.Object3D>>(new Map());

  const [selectedObject, setSelectedObject] = useState<CelestialObject | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [searchResults, setSearchResults] = useState<CelestialObject[]>([]);
  const [navigation, setNavigation] = useState<NavigationState>({
    centerRA: 0,
    centerDec: 0,
    zoomLevel: 3,
    viewRadius: 100
  });
  const [stats, setStats] = useState({ fps: 0, objects: 0, distance: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [constellations, setConstellations] = useState<string[]>([]);

  // Initialize scene
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
      10000000
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
      opacity: 0.8
    });

    const starsVertices = [];
    for (let i = 0; i < 20000; i++) {
      const x = (Math.random() - 0.5) * 10000000;
      const y = (Math.random() - 0.5) * 10000000;
      const z = (Math.random() - 0.5) * 10000000;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(starsVertices), 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Load initial objects
    const initialObjects = celestialDatabaseService.getAllObjects();
    loadObjectsToScene(scene, initialObjects);

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    let frameCount = 0;
    let lastTime = Date.now();

    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate scene slowly
      scene.rotation.y += 0.00005;

      // Update stats
      frameCount++;
      const currentTime = Date.now();
      if (currentTime - lastTime >= 1000) {
        setStats(prev => ({ ...prev, fps: frameCount, objects: objectsRef.current.size }));
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

    containerRef.current.addEventListener('click', onMouseClick);

    // Load constellations
    setConstellations(celestialDatabaseService.getConstellations());
    setIsLoading(false);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeEventListener('click', onMouseClick);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  // Load objects to scene
  const loadObjectsToScene = (scene: THREE.Scene, objects: CelestialObject[]) => {
    // Clear existing objects
    objectsRef.current.forEach((mesh, key) => {
      scene.remove(mesh);
    });
    objectsRef.current.clear();

    // Add new objects
    objects.forEach((obj) => {
      const raRad = (obj.ra * Math.PI) / 180;
      const decRad = (obj.dec * Math.PI) / 180;
      const distance = obj.distance * 63241;

      const x = distance * Math.cos(decRad) * Math.cos(raRad);
      const y = distance * Math.sin(decRad);
      const z = distance * Math.cos(decRad) * Math.sin(raRad);

      let geometry: THREE.BufferGeometry;
      let material: THREE.Material;

      const sizeMultiplier = {
        star: 100,
        nebula: 500,
        galaxy: 1000,
        cluster: 300,
        planet: 200,
        exoplanet: 150,
        blackhole: 400,
        pulsar: 250,
        quasar: 600
      };

      const multiplier = sizeMultiplier[obj.type] || 300;
      geometry = new THREE.SphereGeometry(obj.size * multiplier, 32, 32);

      material = new THREE.MeshStandardMaterial({
        color: obj.color,
        emissive: obj.color,
        emissiveIntensity: obj.type === 'star' ? 0.8 : 0.5,
        transparent: obj.type === 'nebula',
        opacity: obj.type === 'nebula' ? 0.6 : 1
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.userData = { celestialObject: obj };
      scene.add(mesh);
      objectsRef.current.set(obj.id, mesh);
    });
  };

  // Handle search
  const handleSearch = useCallback(() => {
    if (!sceneRef.current) return;

    const results = celestialDatabaseService.search({
      searchTerm,
      ...filters
    });

    setSearchResults(results);
    loadObjectsToScene(sceneRef.current, results);
  }, [searchTerm, filters]);

  // Handle zoom
  const handleZoom = useCallback((direction: 'in' | 'out') => {
    setNavigation(prev => {
      const newZoom = direction === 'in' ? Math.min(prev.zoomLevel + 1, 10) : Math.max(prev.zoomLevel - 1, 0);
      const newRadius = 100 / Math.pow(2, newZoom);

      if (cameraRef.current) {
        cameraRef.current.position.z = 100000 / Math.pow(2, newZoom);
      }

      return { ...prev, zoomLevel: newZoom, viewRadius: newRadius };
    });
  }, []);

  // Handle navigation
  const navigateToObject = useCallback((obj: CelestialObject) => {
    setNavigation(prev => ({
      ...prev,
      centerRA: obj.ra,
      centerDec: obj.dec
    }));
    setSelectedObject(obj);
  }, []);

  // Handle reset
  const handleReset = useCallback(() => {
    setNavigation({
      centerRA: 0,
      centerDec: 0,
      zoomLevel: 3,
      viewRadius: 100
    });
    setSelectedObject(null);
    setSearchTerm('');
    setFilters({});
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 100000);
    }
    if (sceneRef.current) {
      loadObjectsToScene(sceneRef.current, celestialDatabaseService.getAllObjects());
    }
  }, []);

  return (
    <div className="w-full h-screen bg-aerospace-dark flex flex-col overflow-hidden">
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
            placeholder="Search stars, galaxies, nebulae..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-2 bg-aerospace-dark/80 border border-aerospace-blue/50 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-aerospace-blue"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-aerospace-blue/20 hover:bg-aerospace-blue/40 border border-aerospace-blue rounded-lg transition-all flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-aerospace-accent/20 hover:bg-aerospace-accent/40 border border-aerospace-accent rounded-lg transition-all flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-6 bg-aerospace-dark/95 border border-aerospace-blue/50 rounded-lg p-4 backdrop-blur-sm z-20 max-w-md"
          >
            <h3 className="text-aerospace-blue font-bold mb-3">Filters</h3>
            <div className="space-y-3">
              <div>
                <label className="text-foreground/70 text-sm">Type</label>
                <select
                  multiple
                  value={filters.type || []}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    type: Array.from(e.target.selectedOptions, option => option.value)
                  }))}
                  className="w-full px-2 py-1 bg-aerospace-dark border border-aerospace-blue/30 rounded text-foreground text-sm"
                >
                  <option value="star">Star</option>
                  <option value="nebula">Nebula</option>
                  <option value="galaxy">Galaxy</option>
                  <option value="cluster">Cluster</option>
                  <option value="exoplanet">Exoplanet</option>
                  <option value="blackhole">Black Hole</option>
                </select>
              </div>

              <div>
                <label className="text-foreground/70 text-sm">Constellation</label>
                <select
                  value={filters.constellation || ''}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    constellation: e.target.value || undefined
                  }))}
                  className="w-full px-2 py-1 bg-aerospace-dark border border-aerospace-blue/30 rounded text-foreground text-sm"
                >
                  <option value="">All</option>
                  {constellations.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-foreground/70 text-sm">Max Magnitude</label>
                <input
                  type="number"
                  value={filters.maxMagnitude || ''}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    maxMagnitude: e.target.value ? parseFloat(e.target.value) : undefined
                  }))}
                  className="w-full px-2 py-1 bg-aerospace-dark border border-aerospace-blue/30 rounded text-foreground text-sm"
                />
              </div>

              <button
                onClick={handleSearch}
                className="w-full px-3 py-2 bg-aerospace-blue/30 hover:bg-aerospace-blue/50 rounded text-foreground text-sm transition-all"
              >
                Apply Filters
              </button>
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
            onClick={() => handleZoom('out')}
            className="p-3 bg-aerospace-blue/20 hover:bg-aerospace-blue/40 border border-aerospace-blue rounded-lg transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5 text-aerospace-blue" />
          </button>
          <button
            onClick={() => handleZoom('in')}
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
            RA: {navigation.centerRA.toFixed(1)}° | Dec: {navigation.centerDec.toFixed(1)}°
          </div>
          <div className="text-foreground/60 text-xs font-mono">
            View Radius: {navigation.viewRadius.toFixed(1)}°
          </div>
        </div>

        {/* Right Stats */}
        <div className="text-right text-xs font-mono text-foreground/50">
          <div>{stats.fps} FPS</div>
          <div>{stats.objects} Objects</div>
        </div>
      </motion.div>

      {/* Selected Object Info */}
      <AnimatePresence>
        {selectedObject && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute top-20 left-6 bg-aerospace-dark/95 border border-aerospace-blue/50 rounded-lg p-4 max-w-sm backdrop-blur-sm z-20"
          >
            <div className="flex items-start gap-3">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0 mt-1"
                style={{ backgroundColor: selectedObject.color }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-aerospace-blue font-bold text-sm">{selectedObject.name}</h3>
                <p className="text-foreground/70 text-xs capitalize mb-2">{selectedObject.type}</p>
                <p className="text-foreground/60 text-xs leading-relaxed">{selectedObject.description}</p>
                <div className="mt-3 space-y-1 text-xs font-mono text-foreground/50">
                  <div>Magnitude: {selectedObject.magnitude.toFixed(2)}</div>
                  <div>Distance: {selectedObject.distance.toLocaleString()} ly</div>
                  <div>RA: {selectedObject.ra.toFixed(2)}° | Dec: {selectedObject.dec.toFixed(2)}°</div>
                  {selectedObject.constellation && <div>Constellation: {selectedObject.constellation}</div>}
                  {selectedObject.temperature && <div>Temperature: {selectedObject.temperature.toLocaleString()} K</div>}
                  {selectedObject.luminosity && <div>Luminosity: {selectedObject.luminosity.toFixed(2)} L☉</div>}
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
      </AnimatePresence>

      {/* Search Results Panel */}
      <AnimatePresence>
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute bottom-24 right-6 bg-aerospace-dark/95 border border-aerospace-blue/50 rounded-lg p-4 max-w-xs max-h-96 overflow-y-auto backdrop-blur-sm z-20"
          >
            <h3 className="text-aerospace-blue font-bold mb-3 text-sm">Results ({searchResults.length})</h3>
            <div className="space-y-2">
              {searchResults.slice(0, 20).map(obj => (
                <button
                  key={obj.id}
                  onClick={() => navigateToObject(obj)}
                  className="w-full text-left px-3 py-2 bg-aerospace-dark/50 hover:bg-aerospace-blue/20 border border-aerospace-blue/30 rounded transition-all text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: obj.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-foreground truncate">{obj.name}</div>
                      <div className="text-foreground/50 text-xs">{obj.type} • {obj.distance.toLocaleString()} ly</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-aerospace-dark/80 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-aerospace-blue border-t-aerospace-accent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-aerospace-blue font-mono">Initializing Universe Explorer...</p>
          </div>
        </div>
      )}

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 right-6 bg-aerospace-dark/90 border border-aerospace-blue/30 rounded-lg p-4 backdrop-blur-sm max-w-xs z-10"
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
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-foreground/70">Black Holes</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
