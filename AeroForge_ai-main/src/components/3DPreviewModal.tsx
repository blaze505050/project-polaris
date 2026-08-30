import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  RotateCcw,
  Maximize2,
  Minimize2,
  Lightbulb,
  Zap,
  Eye,
  Grid3x3,
  Layers,
  Upload,
  FileUp,
} from "lucide-react";

interface Preview3DModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  onDownloadSTL?: () => void;
  onDownloadSTEP?: () => void;
  geometryType?: "box" | "sphere" | "cylinder" | "cone" | "torus" | "complex";
  simulationData?: {
    meshDensity?: number;
    reynoldsNumber?: number;
    machNumber?: number;
    temperature?: number;
  };
}

export default function Preview3DModal({
  isOpen,
  onClose,
  title,
  description,
  onDownloadSTL,
  onDownloadSTEP,
  geometryType = "box",
  simulationData,
}: Preview3DModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const [lightingMode, setLightingMode] = useState<"studio" | "dramatic" | "soft">("studio");
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [fps, setFps] = useState(60);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  const fpsCounterRef = useRef({ frames: 0, lastTime: Date.now() });
  const autoRotateRef = useRef(true);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setUploadedFile(url);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadScreenshot = () => {
    if (rendererRef.current) {
      const link = document.createElement("a");
      link.href = rendererRef.current.domElement.toDataURL("image/png");
      link.download = `3d-preview-${Date.now()}.png`;
      link.click();
    }
  };

  useEffect(() => {
    const targetContainer = isFullscreen ? fullscreenContainerRef.current : containerRef.current;
    if (!isOpen || !targetContainer) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e27);
    scene.fog = new THREE.Fog(0x0a0e27, 1000, 2000);
    sceneRef.current = scene;

    // Camera setup - use correct container dimensions
    const width = targetContainer.clientWidth;
    const height = targetContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 5000);
    camera.position.set(150, 150, 150);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        precision: "highp",
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false,
      });
    } catch (e) {
      console.error("WebGL initialization failed:", e);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    // Clear container before appending
    while (targetContainer.firstChild) {
      targetContainer.removeChild(targetContainer.firstChild);
    }
    targetContainer.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting setup
    const setupLighting = (mode: "studio" | "dramatic" | "soft") => {
      scene.children.forEach((child) => {
        if (child instanceof THREE.Light) {
          scene.remove(child);
        }
      });

      if (mode === "studio") {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
        mainLight.position.set(200, 200, 150);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 4096;
        mainLight.shadow.mapSize.height = 4096;
        scene.add(mainLight);
        const fillLight = new THREE.DirectionalLight(0x87ceeb, 0.4);
        fillLight.position.set(-200, 100, 200);
        scene.add(fillLight);
      } else if (mode === "dramatic") {
        const ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.3);
        scene.add(ambientLight);
        const mainLight = new THREE.DirectionalLight(0xffffff, 2);
        mainLight.position.set(300, 300, 200);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 4096;
        mainLight.shadow.mapSize.height = 4096;
        scene.add(mainLight);
        const rimLight = new THREE.DirectionalLight(0xff00ff, 0.8);
        rimLight.position.set(-300, 100, -300);
        scene.add(rimLight);
      } else if (mode === "soft") {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
        mainLight.position.set(150, 150, 150);
        mainLight.castShadow = true;
        scene.add(mainLight);
      }
    };

    setupLighting("studio");

    // Grid
    const gridHelper = new THREE.GridHelper(400, 40, 0x444444, 0x222222);
    gridHelper.position.y = -50;
    scene.add(gridHelper);

    // Axes
    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    // Create geometry based on type
    let geometry: THREE.BufferGeometry;
    const colors = [0x00d9ff, 0xff006e, 0xffbe0b, 0x8338ec, 0x3a86ff];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    switch (geometryType) {
      case "sphere":
        geometry = new THREE.SphereGeometry(50, 64, 64);
        break;
      case "cylinder":
        geometry = new THREE.CylinderGeometry(40, 40, 100, 64);
        break;
      case "cone":
        geometry = new THREE.ConeGeometry(50, 100, 64);
        break;
      case "torus":
        geometry = new THREE.TorusGeometry(50, 20, 64, 100);
        break;
      case "complex":
        // Create a more complex shape
        geometry = new THREE.BoxGeometry(80, 80, 80, 32, 32, 32);
        break;
      default:
        geometry = new THREE.BoxGeometry(80, 80, 80, 32, 32, 32);
    }

    const material = new THREE.MeshStandardMaterial({
      color: randomColor,
      metalness: 0.5,
      roughness: 0.5,
      emissive: 0x000000,
      emissiveIntensity: 0,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    meshRef.current = mesh;

    // Mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    renderer.domElement.addEventListener("mousedown", (e) => {
      isDragging = true;
      autoRotateRef.current = false;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    renderer.domElement.addEventListener("mousemove", (e) => {
      if (isDragging && cameraRef.current) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        const radius = cameraRef.current.position.length();
        const theta = Math.atan2(cameraRef.current.position.x, cameraRef.current.position.z);
        const phi = Math.acos(cameraRef.current.position.y / radius);

        const newTheta = theta - deltaX * 0.01;
        const newPhi = Math.max(0.1, Math.min(Math.PI - 0.1, phi + deltaY * 0.01));

        cameraRef.current.position.x = radius * Math.sin(newPhi) * Math.sin(newTheta);
        cameraRef.current.position.y = radius * Math.cos(newPhi);
        cameraRef.current.position.z = radius * Math.sin(newPhi) * Math.cos(newTheta);
        cameraRef.current.lookAt(0, 0, 0);

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });

    renderer.domElement.addEventListener("mouseup", () => {
      isDragging = false;
    });

    renderer.domElement.addEventListener("wheel", (e) => {
      e.preventDefault();
      if (cameraRef.current) {
        const direction = cameraRef.current.position.clone().normalize();
        const distance = cameraRef.current.position.length();
        const newDistance = Math.max(50, Math.min(500, distance + e.deltaY * 0.5));
        cameraRef.current.position.copy(direction.multiplyScalar(newDistance));
        cameraRef.current.lookAt(0, 0, 0);
      }
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      fpsCounterRef.current.frames++;
      const now = Date.now();
      if (now - fpsCounterRef.current.lastTime >= 1000) {
        setFps(fpsCounterRef.current.frames);
        fpsCounterRef.current.frames = 0;
        fpsCounterRef.current.lastTime = now;
      }

      if (autoRotateRef.current && meshRef.current) {
        meshRef.current.rotation.x += 0.003;
        meshRef.current.rotation.y += 0.005;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      const resizeContainer = isFullscreen ? fullscreenContainerRef.current : containerRef.current;
      if (!resizeContainer) return;
      const newWidth = resizeContainer.clientWidth;
      const newHeight = resizeContainer.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      targetContainer?.removeChild(renderer.domElement);
    };
  }, [isOpen, geometryType, isFullscreen]);

  const handleResetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(150, 150, 150);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  const toggleAutoRotate = () => {
    autoRotateRef.current = !autoRotateRef.current;
    setIsAutoRotating(!isAutoRotating);
  };

  const changeLightingMode = (mode: "studio" | "dramatic" | "soft") => {
    setLightingMode(mode);
    if (sceneRef.current) {
      sceneRef.current.children.forEach((child) => {
        if (child instanceof THREE.Light) {
          sceneRef.current!.remove(child);
        }
      });

      if (mode === "studio") {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        sceneRef.current.add(ambientLight);
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
        mainLight.position.set(200, 200, 150);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 4096;
        mainLight.shadow.mapSize.height = 4096;
        sceneRef.current.add(mainLight);
        const fillLight = new THREE.DirectionalLight(0x87ceeb, 0.4);
        fillLight.position.set(-200, 100, 200);
        sceneRef.current.add(fillLight);
      } else if (mode === "dramatic") {
        const ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.3);
        sceneRef.current.add(ambientLight);
        const mainLight = new THREE.DirectionalLight(0xffffff, 2);
        mainLight.position.set(300, 300, 200);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 4096;
        mainLight.shadow.mapSize.height = 4096;
        sceneRef.current.add(mainLight);
        const rimLight = new THREE.DirectionalLight(0xff00ff, 0.8);
        rimLight.position.set(-300, 100, -300);
        sceneRef.current.add(rimLight);
      } else if (mode === "soft") {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        sceneRef.current.add(ambientLight);
        const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
        mainLight.position.set(150, 150, 150);
        mainLight.castShadow = true;
        sceneRef.current.add(mainLight);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Normal Modal */}
          {!isFullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={onClose}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-slate-700"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                  <div className="flex-1">
                    <h2 className="font-heading text-2xl font-bold text-white">{title}</h2>
                    {description && (
                      <p className="font-paragraph text-slate-400 text-sm mt-1">{description}</p>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>

                {/* 3D Viewer */}
                <div className="flex-1 relative overflow-hidden">
                  <div ref={containerRef} className="w-full h-full" />

                  {/* Controls */}
                  <div className="absolute top-4 right-4 flex gap-2 z-20 flex-wrap justify-end max-w-xs">
                    {/* Lighting Mode */}
                    <div className="flex gap-1 bg-slate-800/80 backdrop-blur p-1 rounded-lg">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => changeLightingMode("studio")}
                        className={`p-2 rounded transition-all ${
                          lightingMode === "studio"
                            ? "bg-cyan-500 text-white"
                            : "bg-slate-700 text-cyan-300 hover:bg-slate-600"
                        }`}
                        title="Studio lighting"
                      >
                        <Lightbulb className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => changeLightingMode("dramatic")}
                        className={`p-2 rounded transition-all ${
                          lightingMode === "dramatic"
                            ? "bg-pink-500 text-white"
                            : "bg-slate-700 text-cyan-300 hover:bg-slate-600"
                        }`}
                        title="Dramatic lighting"
                      >
                        <Zap className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => changeLightingMode("soft")}
                        className={`p-2 rounded transition-all ${
                          lightingMode === "soft"
                            ? "bg-yellow-500 text-white"
                            : "bg-slate-700 text-cyan-300 hover:bg-slate-600"
                        }`}
                        title="Soft lighting"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                    </div>

                    {/* Standard Controls */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleAutoRotate}
                      className={`p-2 rounded-lg shadow transition-all ${
                        isAutoRotating
                          ? "bg-cyan-500 text-white"
                          : "bg-slate-800 text-cyan-300 hover:bg-slate-700"
                      }`}
                      title="Toggle auto-rotate"
                    >
                      <motion.div
                        animate={{ rotate: isAutoRotating ? 360 : 0 }}
                        transition={{
                          duration: 4,
                          repeat: isAutoRotating ? Infinity : 0,
                          ease: "linear",
                        }}
                        className="w-5 h-5"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </motion.div>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResetView}
                      className="p-2 bg-slate-800 text-cyan-300 rounded-lg shadow hover:bg-slate-700 transition-all"
                      title="Reset view"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDownloadScreenshot}
                      className="p-2 bg-slate-800 text-cyan-300 rounded-lg shadow hover:bg-slate-700 transition-all"
                      title="Download screenshot"
                    >
                      <Download className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsFullscreen(true)}
                      className="p-2 bg-slate-800 text-cyan-300 rounded-lg shadow hover:bg-slate-700 transition-all"
                      title="Fullscreen"
                    >
                      <Maximize2 className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {/* Info Overlay */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur px-4 py-3 rounded-lg shadow border border-cyan-500/20 text-xs font-paragraph text-cyan-300 z-20"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-pink-500" />
                      <span>FPS: {fps}</span>
                    </div>
                    <div>🖱 Drag to rotate • Scroll to zoom</div>
                    {simulationData && (
                      <div className="mt-2 text-cyan-400/70 space-y-1">
                        {simulationData.meshDensity && (
                          <div>📊 Mesh Density: {simulationData.meshDensity}</div>
                        )}
                        {simulationData.reynoldsNumber && (
                          <div>Re: {simulationData.reynoldsNumber}</div>
                        )}
                        {simulationData.machNumber && <div>M: {simulationData.machNumber}</div>}
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Footer with Download Options */}
                <div className="border-t border-slate-700 p-6 bg-slate-800/50">
                  <div className="flex gap-3 justify-between items-center">
                    <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors font-paragraph font-semibold cursor-pointer">
                      <Upload className="w-4 h-4" />
                      Upload 3D Model
                      <input
                        type="file"
                        accept=".stl,.obj,.gltf,.glb"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <div className="flex gap-3">
                      <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors font-paragraph font-semibold"
                      >
                        Close
                      </button>
                      {onDownloadSTL && (
                        <button
                          onClick={onDownloadSTL}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-paragraph font-semibold"
                        >
                          <Download className="w-4 h-4" />
                          Download STL
                        </button>
                      )}
                      {onDownloadSTEP && (
                        <button
                          onClick={onDownloadSTEP}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition-colors font-paragraph font-semibold"
                        >
                          <Download className="w-4 h-4" />
                          Download STEP
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Fullscreen View */}
          {isFullscreen && (
            <motion.div
              ref={fullscreenContainerRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-900 flex flex-col"
            >
              {/* Fullscreen Controls */}
              <div className="absolute top-4 right-4 flex gap-2 z-20 flex-wrap justify-end">
                <div className="flex gap-1 bg-slate-800/80 backdrop-blur p-1 rounded-lg">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => changeLightingMode("studio")}
                    className={`p-2 rounded transition-all ${
                      lightingMode === "studio"
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-700 text-cyan-300 hover:bg-slate-600"
                    }`}
                  >
                    <Lightbulb className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => changeLightingMode("dramatic")}
                    className={`p-2 rounded transition-all ${
                      lightingMode === "dramatic"
                        ? "bg-pink-500 text-white"
                        : "bg-slate-700 text-cyan-300 hover:bg-slate-600"
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => changeLightingMode("soft")}
                    className={`p-2 rounded transition-all ${
                      lightingMode === "soft"
                        ? "bg-yellow-500 text-white"
                        : "bg-slate-700 text-cyan-300 hover:bg-slate-600"
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                  </motion.button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleAutoRotate}
                  className={`p-2 rounded-lg shadow transition-all ${
                    isAutoRotating
                      ? "bg-cyan-500 text-white"
                      : "bg-slate-800 text-cyan-300 hover:bg-slate-700"
                  }`}
                >
                  <motion.div
                    animate={{ rotate: isAutoRotating ? 360 : 0 }}
                    transition={{
                      duration: 4,
                      repeat: isAutoRotating ? Infinity : 0,
                      ease: "linear",
                    }}
                    className="w-5 h-5"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </motion.div>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleResetView}
                  className="p-2 bg-slate-800 text-cyan-300 rounded-lg shadow hover:bg-slate-700 transition-all"
                >
                  <RotateCcw className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownloadScreenshot}
                  className="p-2 bg-slate-800 text-cyan-300 rounded-lg shadow hover:bg-slate-700 transition-all"
                >
                  <Download className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFullscreen(false)}
                  className="p-2 bg-slate-800 text-cyan-300 rounded-lg shadow hover:bg-slate-700 transition-all"
                >
                  <Minimize2 className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Fullscreen Info */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur px-4 py-3 rounded-lg shadow border border-cyan-500/20 text-xs font-paragraph text-cyan-300 z-20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-pink-500" />
                  <span>FPS: {fps}</span>
                </div>
                <div>🖱 Drag to rotate • Scroll to zoom</div>
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
