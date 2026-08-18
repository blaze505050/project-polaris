import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { AeroForgeDSL } from '@/services/dslSchema';
import { Maximize2, RotateCcw, Download, Minimize2, Eye, EyeOff, Zap, Grid3x3, Layers, Lightbulb, Palette, Maximize, Minimize } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Viewer3DProps {
  dsl: AeroForgeDSL | null;
  isLoading?: boolean;
}

interface MeasurementData {
  distance: number;
  points: THREE.Vector3[];
}

interface FeatureNode {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  mesh?: THREE.Mesh;
}

export default function Viewer3D({ dsl, isLoading = false }: Viewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshesRef = useRef<THREE.Mesh[]>([]);
  const featureNodesRef = useRef<Map<string, FeatureNode>>(new Map());
  const controlsRef = useRef<any>(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const selectedObjectRef = useRef<THREE.Mesh | null>(null);
  const measurementLineRef = useRef<THREE.Line | null>(null);
  const measurementPointsRef = useRef<THREE.Points | null>(null);
  const lightsRef = useRef<{ main: THREE.Light; fill: THREE.Light; rim: THREE.Light; point: THREE.Light }>({
    main: null as any,
    fill: null as any,
    rim: null as any,
    point: null as any,
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [stats, setStats] = useState({ vertices: 0, faces: 0, triangles: 0 });
  const [showWireframe, setShowWireframe] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [showLayers, setShowLayers] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<MeasurementData[]>([]);
  const [fps, setFps] = useState(60);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.001);
  const [lightingMode, setLightingMode] = useState<'studio' | 'dramatic' | 'soft'>('studio');
  const [renderMode, setRenderMode] = useState<'solid' | 'wireframe' | 'hybrid'>('solid');
  const [featureTree, setFeatureTree] = useState<FeatureNode[]>([]);
  const fpsCounterRef = useRef({ frames: 0, lastTime: Date.now() });
  const autoRotateRef = useRef(true);

  // Initialize Three.js scene
  useEffect(() => {
    const targetContainer = isFullscreen ? fullscreenContainerRef.current : containerRef.current;
    if (!targetContainer) return;

    // Ensure container has dimensions
    if (targetContainer.clientWidth === 0 || targetContainer.clientHeight === 0) {
      return;
    }

    // Scene setup with fog for depth perception
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e27);
    scene.fog = new THREE.Fog(0x0a0e27, 1000, 2000);
    sceneRef.current = scene;

    // Camera setup
    const width = targetContainer.clientWidth;
    const height = targetContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 5000);
    camera.position.set(200, 200, 200);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup with advanced settings
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        precision: 'highp',
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false
      });
    } catch (e) {
      console.error('WebGL initialization failed:', e);
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

    // Advanced Lighting Setup with Dynamic Modes
    const setupLighting = (mode: 'studio' | 'dramatic' | 'soft') => {
      // Clear existing lights
      scene.children.forEach((child) => {
        if (child instanceof THREE.Light) {
          scene.remove(child);
        }
      });

      if (mode === 'studio') {
        // Studio lighting - balanced, professional
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
        mainLight.position.set(200, 200, 150);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 4096;
        mainLight.shadow.mapSize.height = 4096;
        mainLight.shadow.camera.far = 1000;
        mainLight.shadow.camera.left = -500;
        mainLight.shadow.camera.right = 500;
        mainLight.shadow.camera.top = 500;
        mainLight.shadow.camera.bottom = -500;
        mainLight.shadow.bias = -0.0001;
        scene.add(mainLight);

        const fillLight = new THREE.DirectionalLight(0x87ceeb, 0.4);
        fillLight.position.set(-200, 100, 200);
        scene.add(fillLight);

        const rimLight = new THREE.DirectionalLight(0xff6b9d, 0.3);
        rimLight.position.set(0, 50, -300);
        scene.add(rimLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.5);
        pointLight.position.set(100, 200, 100);
        pointLight.castShadow = true;
        scene.add(pointLight);

        lightsRef.current = { main: mainLight, fill: fillLight, rim: rimLight, point: pointLight };
      } else if (mode === 'dramatic') {
        // Dramatic lighting - high contrast, cinematic
        const ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.3);
        scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 2);
        mainLight.position.set(300, 300, 200);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 4096;
        mainLight.shadow.mapSize.height = 4096;
        mainLight.shadow.camera.far = 1500;
        mainLight.shadow.camera.left = -600;
        mainLight.shadow.camera.right = 600;
        mainLight.shadow.camera.top = 600;
        mainLight.shadow.camera.bottom = -600;
        mainLight.shadow.bias = -0.0001;
        scene.add(mainLight);

        const rimLight = new THREE.DirectionalLight(0xff00ff, 0.8);
        rimLight.position.set(-300, 100, -300);
        scene.add(rimLight);

        const pointLight = new THREE.PointLight(0x00ffff, 1);
        pointLight.position.set(200, 300, 200);
        pointLight.castShadow = true;
        scene.add(pointLight);

        lightsRef.current = { main: mainLight, fill: new THREE.DirectionalLight(0x000000, 0), rim: rimLight, point: pointLight };
      } else if (mode === 'soft') {
        // Soft lighting - diffuse, gentle
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
        mainLight.position.set(150, 150, 150);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.camera.far = 800;
        mainLight.shadow.camera.left = -400;
        mainLight.shadow.camera.right = 400;
        mainLight.shadow.camera.top = 400;
        mainLight.shadow.camera.bottom = -400;
        mainLight.shadow.bias = -0.0001;
        scene.add(mainLight);

        const fillLight = new THREE.DirectionalLight(0xccccff, 0.5);
        fillLight.position.set(-150, 100, 150);
        scene.add(fillLight);

        const rimLight = new THREE.DirectionalLight(0xffcccc, 0.3);
        rimLight.position.set(0, 50, -200);
        scene.add(rimLight);

        lightsRef.current = { main: mainLight, fill: fillLight, rim: rimLight, point: new THREE.DirectionalLight(0x000000, 0) };
      }
    };

    setupLighting('studio');

    // Grid helper
    const gridHelper = new THREE.GridHelper(800, 80, 0x444444, 0x222222);
    gridHelper.position.y = -50;
    scene.add(gridHelper);

    // Axes helper
    const axesHelper = new THREE.AxesHelper(150);
    scene.add(axesHelper);

    // Simple orbit controls with momentum
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let velocity = { x: 0, y: 0 };
    let isMouseDown = false;

    renderer.domElement.addEventListener('mousedown', (e) => {
      isDragging = true;
      isMouseDown = true;
      autoRotateRef.current = false;
      previousMousePosition = { x: e.clientX, y: e.clientY };
      velocity = { x: 0, y: 0 };
    });

    renderer.domElement.addEventListener('mousemove', (e) => {
      mouseRef.current.x = (e.clientX / width) * 2 - 1;
      mouseRef.current.y = -(e.clientY / height) * 2 + 1;

      if (isDragging && cameraRef.current) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        velocity.x = deltaX * 0.01;
        velocity.y = deltaY * 0.01;

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

    renderer.domElement.addEventListener('mouseup', () => {
      isDragging = false;
      isMouseDown = false;
    });

    renderer.domElement.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (cameraRef.current) {
        const direction = cameraRef.current.position.clone().normalize();
        const distance = cameraRef.current.position.length();
        const newDistance = Math.max(50, Math.min(1000, distance + e.deltaY * 0.5));
        cameraRef.current.position.copy(direction.multiplyScalar(newDistance));
        cameraRef.current.lookAt(0, 0, 0);
      }
    });

    // Double-click to select/deselect
    renderer.domElement.addEventListener('dblclick', (e) => {
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(meshesRef.current);
      
      if (intersects.length > 0) {
        const mesh = intersects[0].object as THREE.Mesh;
        if (selectedObjectRef.current === mesh) {
          selectedObjectRef.current = null;
          setSelectedFeature(null);
        } else {
          selectedObjectRef.current = mesh;
          const featureId = mesh.userData.featureId;
          setSelectedFeature(featureId);
        }
      }
    });

    // Animation loop with FPS counter
    const animate = () => {
      requestAnimationFrame(animate);
      
      // FPS counter
      fpsCounterRef.current.frames++;
      const now = Date.now();
      if (now - fpsCounterRef.current.lastTime >= 1000) {
        setFps(fpsCounterRef.current.frames);
        fpsCounterRef.current.frames = 0;
        fpsCounterRef.current.lastTime = now;
      }

      // Auto-rotate when not dragging
      if (autoRotateRef.current && !isMouseDown && cameraRef.current) {
        const radius = cameraRef.current.position.length();
        const theta = Math.atan2(cameraRef.current.position.x, cameraRef.current.position.z);
        const phi = Math.acos(cameraRef.current.position.y / radius);

        const newTheta = theta + rotationSpeed;

        cameraRef.current.position.x = radius * Math.sin(phi) * Math.sin(newTheta);
        cameraRef.current.position.y = radius * Math.cos(phi);
        cameraRef.current.position.z = radius * Math.sin(phi) * Math.cos(newTheta);
        cameraRef.current.lookAt(0, 0, 0);
      }

      // Apply momentum to camera
      if (!isMouseDown && (Math.abs(velocity.x) > 0.001 || Math.abs(velocity.y) > 0.001)) {
        if (cameraRef.current) {
          const radius = cameraRef.current.position.length();
          const theta = Math.atan2(cameraRef.current.position.x, cameraRef.current.position.z);
          const phi = Math.acos(cameraRef.current.position.y / radius);

          const newTheta = theta - velocity.x;
          const newPhi = Math.max(0.1, Math.min(Math.PI - 0.1, phi + velocity.y));

          cameraRef.current.position.x = radius * Math.sin(newPhi) * Math.sin(newTheta);
          cameraRef.current.position.y = radius * Math.cos(newPhi);
          cameraRef.current.position.z = radius * Math.sin(newPhi) * Math.cos(newTheta);
          cameraRef.current.lookAt(0, 0, 0);
        }
        velocity.x *= 0.95;
        velocity.y *= 0.95;
      }

      // Highlight selected object
      meshesRef.current.forEach((mesh) => {
        if (mesh === selectedObjectRef.current) {
          if (mesh.material instanceof THREE.MeshStandardMaterial) {
            mesh.material.emissive = new THREE.Color(0x00ff00);
            mesh.material.emissiveIntensity = 0.3;
          }
        } else {
          if (mesh.material instanceof THREE.MeshStandardMaterial) {
            mesh.material.emissive = new THREE.Color(0x000000);
            mesh.material.emissiveIntensity = 0;
          }
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      const resizeContainer = isFullscreen ? fullscreenContainerRef.current : containerRef.current;
      if (!resizeContainer) return;
      const newWidth = resizeContainer.clientWidth;
      const newHeight = resizeContainer.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', () => {});
      renderer.domElement.removeEventListener('mousemove', () => {});
      renderer.domElement.removeEventListener('mouseup', () => {});
      renderer.domElement.removeEventListener('wheel', () => {});
      renderer.domElement.removeEventListener('dblclick', () => {});
      targetContainer?.removeChild(renderer.domElement);
    };
  }, [isFullscreen]);

  // Update 3D model based on DSL
  useEffect(() => {
    if (!sceneRef.current || !dsl) return;

    // Clear previous meshes
    meshesRef.current.forEach((mesh) => {
      sceneRef.current!.remove(mesh);
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    });
    meshesRef.current = [];
    featureNodesRef.current.clear();
    selectedObjectRef.current = null;
    setSelectedFeature(null);

    let totalVertices = 0;
    let totalFaces = 0;
    let totalTriangles = 0;
    const newFeatureTree: FeatureNode[] = [];

    // Enhanced color palette with better contrast
    const colors = [
      0x00d9ff, // cyan
      0xff006e, // pink
      0x00f5ff, // bright cyan
      0xffbe0b, // yellow
      0x8338ec, // purple
      0x3a86ff, // blue
      0xfb5607, // orange
      0x06ffa5, // green
      0xff1744, // red
      0x00e676, // bright green
    ];

    // Create geometries from DSL features with enhanced rendering
    dsl.features?.forEach((feature, index) => {
      let geometry: THREE.BufferGeometry | null = null;
      let position = { x: 0, y: 0, z: 0 };
      const color = colors[index % colors.length];
      let segmentDetail = 32; // Default segment detail

      // Adjust segment detail based on feature type for better quality
      if (feature.type === 'HOLE' || feature.type === 'FILLET') {
        segmentDetail = 64;
      }

      if (feature.type === 'PAD') {
        if (feature.padProfile === 'RECTANGULAR') {
          const width = (feature.padWidth?.value || 100);
          const length = (feature.padLength?.value || 100);
          const height = (feature.padHeight?.value || 10);
          geometry = new THREE.BoxGeometry(width, height, length, 32, 32, 32);
          position.y = height / 2;
        } else if (feature.padProfile === 'CIRCULAR') {
          const radius = (feature.padWidth?.value || 50) / 2;
          const height = (feature.padHeight?.value || 50);
          geometry = new THREE.CylinderGeometry(radius, radius, height, segmentDetail, 32);
          position.y = height / 2;
        }
      } else if (feature.type === 'HOLE') {
        const diameter = (feature.holeDiameter?.value || 6) / 2;
        geometry = new THREE.CylinderGeometry(diameter, diameter, 100, segmentDetail, 32);
        if (feature.coordinate) {
          position.x = feature.coordinate.x?.value || 0;
          position.z = feature.coordinate.z?.value || 0;
        }
      } else if (feature.type === 'FILLET') {
        const radius = (feature.radius?.value || 2);
        geometry = new THREE.SphereGeometry(radius, segmentDetail, segmentDetail);
      } else if (feature.type === 'POCKET') {
        const width = (feature.padWidth?.value || 50);
        const length = (feature.padLength?.value || 50);
        const height = (feature.padHeight?.value || 5);
        geometry = new THREE.BoxGeometry(width, height, length, 32, 32, 32);
      } else if (feature.type === 'CHAMFER') {
        const size = (feature.chamferDistance?.value || 2);
        geometry = new THREE.ConeGeometry(size, size * 2, 32);
      } else if (feature.type === 'AIRFOIL') {
        // Create a simplified airfoil shape
        const length = (feature.padLength?.value || 100);
        const height = (feature.padHeight?.value || 20);
        geometry = new THREE.ConeGeometry(height / 2, length, 32);
      }

      if (geometry) {
        // Count vertices and faces
        if (geometry.attributes.position) {
          totalVertices += geometry.attributes.position.count;
        }
        if (geometry.index) {
          totalFaces += geometry.index.count / 3;
          totalTriangles += geometry.index.count / 3;
        }

        // Create material with enhanced properties
        const material = new THREE.MeshStandardMaterial({
          color,
          metalness: 0.5,
          roughness: 0.5,
          emissive: 0x000000,
          emissiveIntensity: 0,
          wireframe: renderMode === 'wireframe',
          side: THREE.DoubleSide,
        });

        const mesh = new THREE.Mesh(geometry, material);
        
        // Apply coordinate-based positioning if available
        if (feature.coordinate) {
          position.x = feature.coordinate.x?.value || position.x;
          position.y = feature.coordinate.y?.value || position.y;
          position.z = feature.coordinate.z?.value || position.z;
        }
        
        mesh.position.set(position.x, position.y, position.z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData = { featureId: feature.id, featureName: feature.name };
        sceneRef.current!.add(mesh);
        meshesRef.current.push(mesh);

        // Add to feature tree
        const featureNode: FeatureNode = {
          id: feature.id,
          name: feature.name,
          type: feature.type,
          visible: true,
          mesh,
        };
        featureNodesRef.current.set(feature.id, featureNode);
        newFeatureTree.push(featureNode);
      }
    });

    setFeatureTree(newFeatureTree);
    setStats({ vertices: totalVertices, faces: totalFaces, triangles: totalTriangles });

    // Auto-fit camera to view all objects with better framing
    if (meshesRef.current.length > 0) {
      const box = new THREE.Box3();
      meshesRef.current.forEach((mesh) => box.expandByObject(mesh));
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = cameraRef.current!.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
      cameraZ *= 1.8; // Increased from 1.5 for better framing

      const center = box.getCenter(new THREE.Vector3());
      cameraRef.current!.position.set(center.x + cameraZ * 0.8, center.y + cameraZ * 0.8, center.z + cameraZ);
      cameraRef.current!.lookAt(center);
    }
  }, [dsl, renderMode]);

  const handleResetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(200, 200, 200);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  const handleDownloadScreenshot = () => {
    if (rendererRef.current) {
      const link = document.createElement('a');
      link.href = rendererRef.current.domElement.toDataURL('image/png');
      link.download = `aeroforge-3d-${Date.now()}.png`;
      link.click();
    }
  };

  const toggleWireframe = () => {
    setShowWireframe(!showWireframe);
    meshesRef.current.forEach((mesh) => {
      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        mesh.material.wireframe = !showWireframe;
      }
    });
  };

  const changeLightingMode = (mode: 'studio' | 'dramatic' | 'soft') => {
    setLightingMode(mode);
    if (sceneRef.current) {
      // Re-setup lighting with new mode
      sceneRef.current.children.forEach((child) => {
        if (child instanceof THREE.Light) {
          sceneRef.current!.remove(child);
        }
      });

      if (mode === 'studio') {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        sceneRef.current.add(ambientLight);
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
        mainLight.position.set(200, 200, 150);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 4096;
        mainLight.shadow.mapSize.height = 4096;
        mainLight.shadow.camera.far = 1000;
        mainLight.shadow.camera.left = -500;
        mainLight.shadow.camera.right = 500;
        mainLight.shadow.camera.top = 500;
        mainLight.shadow.camera.bottom = -500;
        mainLight.shadow.bias = -0.0001;
        sceneRef.current.add(mainLight);
        const fillLight = new THREE.DirectionalLight(0x87ceeb, 0.4);
        fillLight.position.set(-200, 100, 200);
        sceneRef.current.add(fillLight);
        const rimLight = new THREE.DirectionalLight(0xff6b9d, 0.3);
        rimLight.position.set(0, 50, -300);
        sceneRef.current.add(rimLight);
        const pointLight = new THREE.PointLight(0xffffff, 0.5);
        pointLight.position.set(100, 200, 100);
        pointLight.castShadow = true;
        sceneRef.current.add(pointLight);
      } else if (mode === 'dramatic') {
        const ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.3);
        sceneRef.current.add(ambientLight);
        const mainLight = new THREE.DirectionalLight(0xffffff, 2);
        mainLight.position.set(300, 300, 200);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 4096;
        mainLight.shadow.mapSize.height = 4096;
        mainLight.shadow.camera.far = 1500;
        mainLight.shadow.camera.left = -600;
        mainLight.shadow.camera.right = 600;
        mainLight.shadow.camera.top = 600;
        mainLight.shadow.camera.bottom = -600;
        mainLight.shadow.bias = -0.0001;
        sceneRef.current.add(mainLight);
        const rimLight = new THREE.DirectionalLight(0xff00ff, 0.8);
        rimLight.position.set(-300, 100, -300);
        sceneRef.current.add(rimLight);
        const pointLight = new THREE.PointLight(0x00ffff, 1);
        pointLight.position.set(200, 300, 200);
        pointLight.castShadow = true;
        sceneRef.current.add(pointLight);
      } else if (mode === 'soft') {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        sceneRef.current.add(ambientLight);
        const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
        mainLight.position.set(150, 150, 150);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.camera.far = 800;
        mainLight.shadow.camera.left = -400;
        mainLight.shadow.camera.right = 400;
        mainLight.shadow.camera.top = 400;
        mainLight.shadow.camera.bottom = -400;
        mainLight.shadow.bias = -0.0001;
        sceneRef.current.add(mainLight);
        const fillLight = new THREE.DirectionalLight(0xccccff, 0.5);
        fillLight.position.set(-150, 100, 150);
        sceneRef.current.add(fillLight);
        const rimLight = new THREE.DirectionalLight(0xffcccc, 0.3);
        rimLight.position.set(0, 50, -200);
        sceneRef.current.add(rimLight);
      }
    }
  };

  const toggleFeatureVisibility = (featureId: string) => {
    const node = featureNodesRef.current.get(featureId);
    if (node && node.mesh) {
      node.mesh.visible = !node.mesh.visible;
      node.visible = !node.visible;
      setFeatureTree([...featureTree]);
    }
  };

  const toggleGrid = () => {
    setShowGrid(!showGrid);
    if (sceneRef.current) {
      const gridHelper = sceneRef.current.getObjectByName('grid');
      if (gridHelper) gridHelper.visible = !showGrid;
    }
  };

  const toggleAxes = () => {
    setShowAxes(!showAxes);
    if (sceneRef.current) {
      const axesHelper = sceneRef.current.getObjectByName('axes');
      if (axesHelper) axesHelper.visible = !showAxes;
    }
  };

  const toggleAutoRotate = () => {
    autoRotateRef.current = !autoRotateRef.current;
    setIsAutoRotating(!isAutoRotating);
  };

  return (
    <>
      {/* Normal View */}
      <div
        ref={containerRef}
        className={`relative bg-gray-900 overflow-hidden ${
          isFullscreen ? 'hidden' : 'w-full h-96 lg:h-[600px] rounded-lg border border-secondary/20'
        }`}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 p-8 rounded-lg shadow-2xl border border-cyan-500/30"
            >
              <div className="animate-spin rounded-full h-16 w-16 border-2 border-cyan-500 border-t-pink-500 mx-auto mb-4"></div>
              <p className="font-paragraph text-sm text-cyan-300">Generating 3D model...</p>
            </motion.div>
          </div>
        )}

        {!dsl && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="text-6xl mb-4">🚀</div>
              <p className="font-paragraph text-base text-cyan-300">
                Write a prompt to see your 3D model here
              </p>
            </motion.div>
          </div>
        )}

        {/* Advanced Controls */}
        <div className="absolute top-4 right-4 flex gap-2 z-20 flex-wrap justify-end max-w-xs">
          {/* Lighting Mode */}
          <div className="flex gap-1 bg-gray-800/80 backdrop-blur p-1 rounded-lg">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => changeLightingMode('studio')}
              className={`p-2 rounded transition-all ${
                lightingMode === 'studio'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-700 text-cyan-300 hover:bg-gray-600'
              }`}
              title="Studio lighting"
            >
              <Lightbulb className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => changeLightingMode('dramatic')}
              className={`p-2 rounded transition-all ${
                lightingMode === 'dramatic'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-700 text-cyan-300 hover:bg-gray-600'
              }`}
              title="Dramatic lighting"
            >
              <Zap className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => changeLightingMode('soft')}
              className={`p-2 rounded transition-all ${
                lightingMode === 'soft'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-700 text-cyan-300 hover:bg-gray-600'
              }`}
              title="Soft lighting"
            >
              <Eye className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Render Mode */}
          <div className="flex gap-1 bg-gray-800/80 backdrop-blur p-1 rounded-lg">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setRenderMode('solid')}
              className={`p-2 rounded transition-all ${
                renderMode === 'solid'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-700 text-cyan-300 hover:bg-gray-600'
              }`}
              title="Solid rendering"
            >
              <Palette className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setRenderMode('wireframe')}
              className={`p-2 rounded transition-all ${
                renderMode === 'wireframe'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-700 text-cyan-300 hover:bg-gray-600'
              }`}
              title="Wireframe rendering"
            >
              <Grid3x3 className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Standard Controls */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleAutoRotate}
            className={`p-2 rounded-lg shadow transition-all ${
              isAutoRotating
                ? 'bg-cyan-500 text-white'
                : 'bg-gray-800 text-cyan-300 hover:bg-gray-700'
            }`}
            title="Toggle auto-rotate"
          >
            <motion.div
              animate={{ rotate: isAutoRotating ? 360 : 0 }}
              transition={{ duration: 4, repeat: isAutoRotating ? Infinity : 0, ease: "linear" }}
              className="w-5 h-5"
            >
              <RotateCcw className="w-5 h-5" />
            </motion.div>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleGrid}
            className={`p-2 rounded-lg shadow transition-all ${
              showGrid
                ? 'bg-cyan-500 text-white'
                : 'bg-gray-800 text-cyan-300 hover:bg-gray-700'
            }`}
            title="Toggle grid"
          >
            <Layers className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleResetView}
            className="p-2 bg-gray-800 text-cyan-300 rounded-lg shadow hover:bg-gray-700 transition-all"
            title="Reset view"
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadScreenshot}
            className="p-2 bg-gray-800 text-cyan-300 rounded-lg shadow hover:bg-gray-700 transition-all"
            title="Download screenshot"
          >
            <Download className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFullscreen(true)}
            className="p-2 bg-gray-800 text-cyan-300 rounded-lg shadow hover:bg-gray-700 transition-all"
            title="Toggle fullscreen"
          >
            <Maximize2 className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Info overlay */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 bg-gray-800/90 backdrop-blur px-4 py-3 rounded-lg shadow border border-cyan-500/20 text-xs font-paragraph text-cyan-300 z-20"
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-pink-500" />
            <span>FPS: {fps}</span>
          </div>
          <div>🖱 Drag to rotate • Scroll to zoom • Double-click to select</div>
          {dsl && (
            <div className="mt-2 text-cyan-400/70 space-y-1">
              <div>📦 {dsl.features?.length || 0} features</div>
              <div>📊 {stats.vertices} vertices • {stats.triangles} triangles</div>
              {selectedFeature && (
                <div className="text-pink-400">✓ Selected: {selectedFeature}</div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Fullscreen View */}
      {isFullscreen && (
        <motion.div
          ref={fullscreenContainerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-gray-900 flex flex-col"
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-800 p-8 rounded-lg shadow-2xl border border-cyan-500/30"
              >
                <div className="animate-spin rounded-full h-16 w-16 border-2 border-cyan-500 border-t-pink-500 mx-auto mb-4"></div>
                <p className="font-paragraph text-sm text-cyan-300">Generating 3D model...</p>
              </motion.div>
            </div>
          )}

          {/* Fullscreen Controls */}
          <div className="absolute top-4 right-4 flex gap-2 z-20 flex-wrap justify-end max-w-xs">
            {/* Lighting Mode */}
            <div className="flex gap-1 bg-gray-800/80 backdrop-blur p-1 rounded-lg">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => changeLightingMode('studio')}
                className={`p-2 rounded transition-all ${
                  lightingMode === 'studio'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-700 text-cyan-300 hover:bg-gray-600'
                }`}
                title="Studio lighting"
              >
                <Lightbulb className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => changeLightingMode('dramatic')}
                className={`p-2 rounded transition-all ${
                  lightingMode === 'dramatic'
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-700 text-cyan-300 hover:bg-gray-600'
                }`}
                title="Dramatic lighting"
              >
                <Zap className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => changeLightingMode('soft')}
                className={`p-2 rounded transition-all ${
                  lightingMode === 'soft'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-700 text-cyan-300 hover:bg-gray-600'
                }`}
                title="Soft lighting"
              >
                <Eye className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Render Mode */}
            <div className="flex gap-1 bg-gray-800/80 backdrop-blur p-1 rounded-lg">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setRenderMode('solid')}
                className={`p-2 rounded transition-all ${
                  renderMode === 'solid'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-700 text-cyan-300 hover:bg-gray-600'
                }`}
                title="Solid rendering"
              >
                <Palette className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setRenderMode('wireframe')}
                className={`p-2 rounded transition-all ${
                  renderMode === 'wireframe'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-700 text-cyan-300 hover:bg-gray-600'
                }`}
                title="Wireframe rendering"
              >
                <Grid3x3 className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Standard Controls */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleAutoRotate}
              className={`p-2 rounded-lg shadow transition-all ${
                isAutoRotating
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-800 text-cyan-300 hover:bg-gray-700'
              }`}
              title="Toggle auto-rotate"
            >
              <motion.div
                animate={{ rotate: isAutoRotating ? 360 : 0 }}
                transition={{ duration: 4, repeat: isAutoRotating ? Infinity : 0, ease: "linear" }}
                className="w-5 h-5"
              >
                <RotateCcw className="w-5 h-5" />
              </motion.div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleGrid}
              className={`p-2 rounded-lg shadow transition-all ${
                showGrid
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-800 text-cyan-300 hover:bg-gray-700'
              }`}
              title="Toggle grid"
            >
              <Layers className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleResetView}
              className="p-2 bg-gray-800 text-cyan-300 rounded-lg shadow hover:bg-gray-700 transition-all"
              title="Reset view"
            >
              <RotateCcw className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadScreenshot}
              className="p-2 bg-gray-800 text-cyan-300 rounded-lg shadow hover:bg-gray-700 transition-all"
              title="Download screenshot"
            >
              <Download className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFullscreen(false)}
              className="p-2 bg-gray-800 text-cyan-300 rounded-lg shadow hover:bg-gray-700 transition-all"
              title="Exit fullscreen"
            >
              <Minimize2 className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Fullscreen Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 bg-gray-800/90 backdrop-blur px-4 py-3 rounded-lg shadow border border-cyan-500/20 text-xs font-paragraph text-cyan-300 z-20"
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-pink-500" />
              <span>FPS: {fps}</span>
            </div>
            <div>🖱 Drag to rotate • Scroll to zoom • Double-click to select</div>
            {dsl && (
              <div className="mt-2 text-cyan-400/70 space-y-1">
                <div>📦 {dsl.features?.length || 0} features</div>
                <div>📊 {stats.vertices} vertices • {stats.triangles} triangles</div>
                {selectedFeature && (
                  <div className="text-pink-400">✓ Selected: {selectedFeature}</div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
