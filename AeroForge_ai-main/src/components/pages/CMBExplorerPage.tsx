import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw, Layers, Gauge, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';

interface CMBData {
  temperature: number;
  anisotropy: number;
  polarization: number;
  wavelength: number;
}

export default function CMBExplorerPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);
  const [zoom, setZoom] = useState(1);
  const [selectedBand, setSelectedBand] = useState<'temperature' | 'polarization' | 'dust'>('temperature');
  const [cmbData, setCmbData] = useState<CMBData>({
    temperature: 2.725,
    anisotropy: 0.00001,
    polarization: 0.05,
    wavelength: 1.9,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0f172a);

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      10000
    );
    camera.position.z = 2.5 / zoom;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Create CMB sphere with texture
    const geometry = new THREE.SphereGeometry(1, 256, 256);

    // Generate CMB-like texture
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Create Perlin-like noise pattern
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const value = Math.random() * 255;
      const temp = 2.725 + (value - 127.5) * 0.00001 * 1000;
      
      // Color based on temperature
      let r, g, b;
      if (selectedBand === 'temperature') {
        const normalized = (temp - 2.72) / 0.00001;
        r = Math.max(0, Math.min(255, 128 + normalized * 50));
        g = 128;
        b = Math.max(0, Math.min(255, 128 - normalized * 50));
      } else if (selectedBand === 'polarization') {
        r = Math.floor(Math.random() * 100 + 100);
        g = Math.floor(Math.random() * 100 + 100);
        b = 200;
      } else {
        r = Math.floor(Math.random() * 150 + 50);
        g = Math.floor(Math.random() * 100 + 50);
        b = Math.floor(Math.random() * 50);
      }

      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearFilter;

    const material = new THREE.MeshPhongMaterial({
      map: texture,
      emissive: 0x404040,
      emissiveIntensity: 0.5,
    });

    const sphere = new THREE.Mesh(geometry, material);
    sphereRef.current = sphere;
    scene.add(sphere);

    // Add grid lines
    const gridGeometry = new THREE.SphereGeometry(1.01, 36, 18);
    const gridMaterial = new THREE.LineBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.2,
    });
    const gridLines = new THREE.LineSegments(
      new THREE.EdgesGeometry(gridGeometry),
      gridMaterial
    );
    scene.add(gridLines);

    // Lighting
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x606060);
    scene.add(ambientLight);

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (sphere) {
        sphere.rotation.x += 0.0002;
        sphere.rotation.y += 0.0005;
      }

      camera.position.z = 2.5 / zoom;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [zoom, selectedBand]);

  return (
    <div className="min-h-screen bg-aerospace-dark text-foreground font-paragraph flex flex-col">
      <Header />

      <main className="flex-1 w-full flex flex-col">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 md:p-12 max-w-[120rem] mx-auto w-full">
          {/* 3D Visualization */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lg:col-span-3 rounded-lg overflow-hidden border border-aerospace-blue/20 bg-aerospace-dark/50"
          >
            <div ref={containerRef} className="w-full h-[600px] md:h-[700px]" />
          </motion.div>

          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-4"
          >
            <Card className="bg-primary/40 border-aerospace-blue/20 p-6">
              <h2 className="font-heading text-2xl font-bold mb-6">
                <span className="text-aerospace-blue">CMB</span> Explorer
              </h2>

              {/* Zoom Controls */}
              <div className="mb-6">
                <label className="block text-xs font-mono text-aerospace-blue uppercase tracking-wider mb-3">
                  Zoom Level
                </label>
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setZoom(Math.max(0.5, zoom - 0.5))}
                    className="flex-1 p-2 bg-primary/40 border border-aerospace-blue/20 rounded-lg hover:border-aerospace-blue/50 transition-colors"
                  >
                    <ZoomOut className="w-4 h-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => setZoom(Math.min(5, zoom + 0.5))}
                    className="flex-1 p-2 bg-primary/40 border border-aerospace-blue/20 rounded-lg hover:border-aerospace-blue/50 transition-colors"
                  >
                    <ZoomIn className="w-4 h-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => setZoom(1)}
                    className="flex-1 p-2 bg-primary/40 border border-aerospace-blue/20 rounded-lg hover:border-aerospace-blue/50 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 mx-auto" />
                  </button>
                </div>
                <p className="text-sm text-foreground/70 text-center">{zoom.toFixed(1)}x</p>
              </div>

              {/* Band Selection */}
              <div className="mb-6">
                <label className="block text-xs font-mono text-aerospace-blue uppercase tracking-wider mb-3">
                  Observation Band
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'temperature', label: 'Temperature', icon: Gauge },
                    { id: 'polarization', label: 'Polarization', icon: Layers },
                    { id: 'dust', label: 'Dust Emission', icon: Zap },
                  ].map((band) => {
                    const Icon = band.icon;
                    return (
                      <button
                        key={band.id}
                        onClick={() => setSelectedBand(band.id as any)}
                        className={`w-full p-3 rounded-lg border transition-all flex items-center gap-2 ${
                          selectedBand === band.id
                            ? 'bg-aerospace-blue/20 border-aerospace-blue/50'
                            : 'bg-primary/20 border-aerospace-blue/10 hover:border-aerospace-blue/30'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-mono">{band.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CMB Parameters */}
              <div className="space-y-3 mb-6">
                <div className="p-3 bg-aerospace-dark/50 rounded-lg border border-aerospace-blue/20">
                  <p className="text-xs font-mono text-aerospace-blue uppercase tracking-wider mb-1">
                    Temperature
                  </p>
                  <p className="text-lg font-bold">{cmbData.temperature.toFixed(3)} K</p>
                </div>

                <div className="p-3 bg-aerospace-dark/50 rounded-lg border border-aerospace-blue/20">
                  <p className="text-xs font-mono text-aerospace-blue uppercase tracking-wider mb-1">
                    Anisotropy
                  </p>
                  <p className="text-lg font-bold">{(cmbData.anisotropy * 1e6).toFixed(2)} μK</p>
                </div>

                <div className="p-3 bg-aerospace-dark/50 rounded-lg border border-aerospace-blue/20">
                  <p className="text-xs font-mono text-aerospace-blue uppercase tracking-wider mb-1">
                    Polarization
                  </p>
                  <p className="text-lg font-bold">{(cmbData.polarization * 100).toFixed(2)}%</p>
                </div>

                <div className="p-3 bg-aerospace-dark/50 rounded-lg border border-aerospace-blue/20">
                  <p className="text-xs font-mono text-aerospace-blue uppercase tracking-wider mb-1">
                    Wavelength
                  </p>
                  <p className="text-lg font-bold">{cmbData.wavelength.toFixed(2)} mm</p>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 bg-aerospace-dark/50 rounded-lg border border-aerospace-blue/20 text-xs text-foreground/70">
                <p className="mb-2 font-semibold text-aerospace-blue">Cosmic Microwave Background</p>
                <p>
                  Explore the oldest light in the universe. The CMB is the thermal radiation left over from the Big Bang, providing insights into the early universe's structure and composition.
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
