import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2, RotateCcw, Download, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import CADGeometryService, { CADGeometry, GeometryMetrics } from '@/services/cadGeometryService';

interface CADGeometryPreviewProps {
  file: File | null;
  onGeometryLoaded?: (geometry: CADGeometry) => void;
  isLoading?: boolean;
}

export default function CADGeometryPreview({
  file,
  onGeometryLoaded,
  isLoading = false,
}: CADGeometryPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const controlsRef = useRef<any>(null);

  const [geometry, setGeometry] = useState<CADGeometry | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWireframe, setShowWireframe] = useState(false);
  const [showMetrics, setShowMetrics] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Initialize Three.js scene
  useEffect(() => {
    const container = isFullscreen
      ? document.getElementById('cad-preview-fullscreen')
      : containerRef.current;

    if (!container || container.clientWidth === 0) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e27);
    scene.fog = new THREE.Fog(0x0a0e27, 1000, 2000);
    sceneRef.current = scene;

    // Camera setup
    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
    camera.position.set(0, 0, 100);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 100, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x0ea5e9, 0.5);
    pointLight.position.set(-100, 100, 100);
    scene.add(pointLight);

    // Grid
    const gridHelper = new THREE.GridHelper(200, 20, 0x444444, 0x222222);
    scene.add(gridHelper);

    // Axes
    const axesHelper = new THREE.AxesHelper(50);
    scene.add(axesHelper);

    // Add loaded geometry if available
    if (geometry && geometry.mesh) {
      const mesh = geometry.mesh.clone();
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      meshRef.current = mesh;

      // Fit camera to geometry
      const box = new THREE.Box3().setFromObject(mesh);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
      cameraZ *= 1.5;

      camera.position.z = cameraZ;
      camera.lookAt(box.getCenter(new THREE.Vector3()));
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (meshRef.current) {
        meshRef.current.rotation.x += 0.0005;
        meshRef.current.rotation.y += 0.001;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [geometry, isFullscreen]);

  // Load CAD file
  useEffect(() => {
    if (!file) return;

    const loadFile = async () => {
      try {
        setError(null);
        setLoadingProgress(0);

        // Simulate loading progress
        const progressInterval = setInterval(() => {
          setLoadingProgress(prev => Math.min(prev + Math.random() * 30, 90));
        }, 200);

        const loadedGeometry = await CADGeometryService.loadSTLFile(file);
        clearInterval(progressInterval);
        setLoadingProgress(100);

        setGeometry(loadedGeometry);
        onGeometryLoaded?.(loadedGeometry);

        // Reset progress after a delay
        setTimeout(() => setLoadingProgress(0), 1000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load CAD file');
        setLoadingProgress(0);
      }
    };

    loadFile();
  }, [file, onGeometryLoaded]);

  const toggleWireframe = () => {
    if (meshRef.current && meshRef.current.material instanceof THREE.Material) {
      const material = meshRef.current.material as THREE.MeshPhongMaterial;
      material.wireframe = !material.wireframe;
      setShowWireframe(!showWireframe);
    }
  };

  const resetView = () => {
    if (meshRef.current && cameraRef.current) {
      const box = new THREE.Box3().setFromObject(meshRef.current);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = cameraRef.current.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
      cameraZ *= 1.5;

      cameraRef.current.position.set(0, 0, cameraZ);
      cameraRef.current.lookAt(box.getCenter(new THREE.Vector3()));
    }
  };

  const downloadGeometry = () => {
    if (!geometry) return;

    const data = JSON.stringify(
      {
        metrics: geometry.metrics,
        isValid: geometry.isValid,
        warnings: geometry.warnings,
      },
      null,
      2
    );

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'geometry-metrics.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="w-full h-full bg-gradient-to-br from-aerospace-dark to-primary rounded-lg overflow-hidden">
        {/* Loading state */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-aerospace-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-foreground font-medium">Loading CAD geometry...</p>
                {loadingProgress > 0 && (
                  <div className="mt-4 w-48 h-2 bg-primary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-aerospace-blue"
                      initial={{ width: 0 }}
                      animate={{ width: `${loadingProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error state */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-4 right-4 bg-aerospace-danger/20 border border-aerospace-danger rounded-lg p-4 z-40 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-aerospace-danger flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-foreground font-medium">Error loading geometry</p>
                <p className="text-secondary-foreground text-sm">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Viewer container */}
        <div ref={containerRef} className="w-full h-full" />

        {/* Controls */}
        {geometry && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-primary/80 backdrop-blur-md rounded-lg p-4 border border-aerospace-blue/20"
          >
            <div className="flex items-center gap-2">
              {geometry.isValid ? (
                <div className="flex items-center gap-2 text-aerospace-success">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Geometry valid</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-aerospace-warning">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{geometry.warnings.length} warnings</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleWireframe}
                className="p-2 hover:bg-aerospace-blue/20 rounded-lg transition-colors"
                title="Toggle wireframe"
              >
                {showWireframe ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
              <button
                onClick={resetView}
                className="p-2 hover:bg-aerospace-blue/20 rounded-lg transition-colors"
                title="Reset view"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={downloadGeometry}
                className="p-2 hover:bg-aerospace-blue/20 rounded-lg transition-colors"
                title="Download metrics"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 hover:bg-aerospace-blue/20 rounded-lg transition-colors"
                title="Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
            </div>
          </motion.div>
        )}

        {/* Metrics panel */}
        {geometry && showMetrics && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-4 left-4 bg-primary/80 backdrop-blur-md rounded-lg p-4 border border-aerospace-blue/20 max-w-xs"
          >
            <h3 className="text-foreground font-semibold mb-3">Geometry Metrics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Volume:</span>
                <span className="text-foreground font-medium">
                  {geometry.metrics.volume.toFixed(2)} m³
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Surface Area:</span>
                <span className="text-foreground font-medium">
                  {geometry.metrics.surfaceArea.toFixed(2)} m²
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Triangles:</span>
                <span className="text-foreground font-medium">
                  {geometry.metrics.meshQuality.triangleCount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Aspect Ratio:</span>
                <span className="text-foreground font-medium">
                  {geometry.metrics.meshQuality.aspectRatio.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Avg Edge Length:</span>
                <span className="text-foreground font-medium">
                  {geometry.metrics.meshQuality.averageEdgeLength.toFixed(4)} m
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Fullscreen portal */}
      {isFullscreen && (
        <div
          id="cad-preview-fullscreen"
          className="fixed inset-0 z-50 bg-aerospace-dark"
        />
      )}
    </>
  );
}
