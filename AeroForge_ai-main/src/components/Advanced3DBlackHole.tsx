import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Info } from 'lucide-react';
import { RelativisticCalculator, CONSTANTS } from '@/services/advancedPhysicsSimulator';

interface Advanced3DBlackHoleProps {
  mass?: number; // in solar masses
  spinParameter?: number; // 0 to 1
  showAccretionDisk?: boolean;
  showEventHorizon?: boolean;
}

export default function Advanced3DBlackHole({
  mass = 10,
  spinParameter = 0.9,
  showAccretionDisk = true,
  showEventHorizon = true,
}: Advanced3DBlackHoleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [fps, setFps] = useState(60);
  const animationIdRef = useRef<number>();
  const fpsCounterRef = useRef({ frames: 0, lastTime: Date.now() });

  const blackHoleMass = mass * CONSTANTS.SOLAR_MASS;
  const schwarzschildRadius = RelativisticCalculator.schwarzschildRadius(blackHoleMass);
  const ergosphereRadius = schwarzschildRadius * (1 + Math.sqrt(1 - spinParameter * spinParameter));

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011);
    scene.fog = new THREE.Fog(0x000011, schwarzschildRadius * 100, schwarzschildRadius * 1000);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      schwarzschildRadius * 0.1,
      schwarzschildRadius * 1000
    );
    camera.position.set(schwarzschildRadius * 15, schwarzschildRadius * 10, schwarzschildRadius * 15);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, precision: 'highp' });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    // Accretion disk light
    const diskLight = new THREE.PointLight(0xff6600, 3, schwarzschildRadius * 100);
    diskLight.position.set(0, 0, 0);
    scene.add(diskLight);

    // Starfield
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 5000;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * schwarzschildRadius * 500;
      starPositions[i + 1] = (Math.random() - 0.5) * schwarzschildRadius * 500;
      starPositions[i + 2] = (Math.random() - 0.5) * schwarzschildRadius * 500;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: schwarzschildRadius });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Event Horizon
    if (showEventHorizon) {
      const horizonGeometry = new THREE.SphereGeometry(schwarzschildRadius, 64, 64);
      const horizonMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      });
      const horizon = new THREE.Mesh(horizonGeometry, horizonMaterial);
      scene.add(horizon);
    }

    // Ergosphere
    const ergosphereGeometry = new THREE.SphereGeometry(ergosphereRadius, 64, 64);
    const ergosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });
    const ergosphere = new THREE.Mesh(ergosphereGeometry, ergosphereMaterial);
    scene.add(ergosphere);

    // Accretion Disk
    if (showAccretionDisk) {
      const diskGeometry = new THREE.BufferGeometry();
      const diskVertices = [];
      const diskColors = [];

      const diskInnerRadius = schwarzschildRadius * 3;
      const diskOuterRadius = schwarzschildRadius * 20;
      const diskSegments = 128;
      const diskRings = 64;

      for (let ring = 0; ring < diskRings; ring++) {
        const r = diskInnerRadius + (diskOuterRadius - diskInnerRadius) * (ring / diskRings);
        const temperature = 1 - ring / diskRings; // Temperature gradient

        for (let seg = 0; seg < diskSegments; seg++) {
          const angle = (seg / diskSegments) * Math.PI * 2;
          const x = Math.cos(angle) * r;
          const z = Math.sin(angle) * r;
          const y = (Math.random() - 0.5) * schwarzschildRadius * 0.5;

          diskVertices.push(x, y, z);

          // Color based on temperature
          const hue = temperature * 0.1; // Red to yellow
          const saturation = 1;
          const lightness = 0.3 + temperature * 0.4;

          const c = new THREE.Color();
          c.setHSL(hue, saturation, lightness);
          diskColors.push(c.r, c.g, c.b);
        }
      }

      diskGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(diskVertices), 3));
      diskGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(diskColors), 3));

      const diskMaterial = new THREE.PointsMaterial({
        size: schwarzschildRadius * 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
      });

      const disk = new THREE.Points(diskGeometry, diskMaterial);
      scene.add(disk);
    }

    // Gravitational lensing effect (simple approximation)
    const lensGeometry = new THREE.SphereGeometry(schwarzschildRadius * 2.5, 32, 32);
    const lensMaterial = new THREE.MeshBasicMaterial({
      color: 0x0088ff,
      transparent: true,
      opacity: 0.05,
      wireframe: false,
    });
    const lens = new THREE.Mesh(lensGeometry, lensMaterial);
    scene.add(lens);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

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

    // Animation loop
    let rotationAngle = 0;
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (isRunning) {
        rotationAngle += 0.0001;
        
        // Rotate accretion disk
        scene.children.forEach((child) => {
          if (child.userData.isAccretionDisk) {
            child.rotation.z += 0.0005;
          }
        });

        // Subtle camera orbit
        const radius = schwarzschildRadius * 15;
        camera.position.x = Math.cos(rotationAngle * 0.1) * radius;
        camera.position.z = Math.sin(rotationAngle * 0.1) * radius;
        camera.lookAt(0, 0, 0);
      }

      // FPS counter
      fpsCounterRef.current.frames++;
      const now = Date.now();
      if (now - fpsCounterRef.current.lastTime >= 1000) {
        setFps(fpsCounterRef.current.frames);
        fpsCounterRef.current.frames = 0;
        fpsCounterRef.current.lastTime = now;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [showAccretionDisk, showEventHorizon, schwarzschildRadius, ergosphereRadius, isRunning]);

  return (
    <div className="w-full h-full flex flex-col bg-aerospace-dark relative">
      <div ref={containerRef} className="flex-1 relative" />

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-6 left-6 flex gap-2 bg-black/50 backdrop-blur-md p-3 rounded-lg border border-aerospace-blue/30"
      >
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="p-2 bg-aerospace-blue hover:bg-aerospace-accent rounded-lg transition-colors"
        >
          {isRunning ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button
          onClick={() => window.location.reload()}
          className="p-2 bg-aerospace-blue hover:bg-aerospace-accent rounded-lg transition-colors"
        >
          <RotateCcw size={18} />
        </button>
      </motion.div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6 bg-black/50 backdrop-blur-md p-4 rounded-lg border border-aerospace-blue/30 text-aerospace-blue text-sm max-w-xs"
      >
        <div className="flex items-center gap-2 mb-2">
          <Info size={16} />
          <span className="font-bold">Black Hole Physics</span>
        </div>
        <div className="text-xs space-y-1">
          <div>Mass: {mass} M☉</div>
          <div>Schwarzschild Radius: {(schwarzschildRadius / 1000).toFixed(0)} km</div>
          <div>Spin Parameter: {spinParameter.toFixed(2)}</div>
          <div>FPS: {fps}</div>
        </div>
      </motion.div>
    </div>
  );
}
