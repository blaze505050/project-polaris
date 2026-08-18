import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, Globe, TrendingUp, Radio, AlertCircle } from 'lucide-react';

export default function AstroLabComplete() {
  const [currentModule, setCurrentModule] = useState('spatial-globe');
  const [mode, setMode] = useState<'student' | 'professional'>('student');
  const [utcTime, setUtcTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setUtcTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const modules = [
    { id: 'spatial-globe', label: '3D Globe', icon: '🌍' },
    { id: 'deep-space', label: 'Deep Space', icon: '🔭' },
    { id: 'photometry', label: 'Photometry', icon: '📊' },
    { id: 'astrodynamics', label: 'Astrodynamics', icon: '⚛️' },
    { id: 'dual-mode', label: 'Dual Mode', icon: '🔄' },
    { id: 'constellation', label: 'Constellation', icon: '🛰️' },
    { id: 'celestial', label: 'Celestial', icon: '📐' },
    { id: 'orbital', label: 'Orbital', icon: '🔢' },
  ];

  const renderModule = () => {
    const props = { mode };

    switch (currentModule) {
      case 'spatial-globe':
        return <SpatialGlobeModule {...props} />;
      case 'deep-space':
        return <DeepSpaceModule {...props} />;
      case 'photometry':
        return <PhotometryModule {...props} />;
      case 'astrodynamics':
        return <AstrodynamicsModule {...props} />;
      case 'dual-mode':
        return <DualModeModule mode={mode} setMode={setMode} />;
      case 'constellation':
        return <ConstellationModule {...props} />;
      case 'celestial':
        return <CelestialModule {...props} />;
      case 'orbital':
        return <OrbitalModule {...props} />;
      default:
        return <SpatialGlobeModule {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-foreground overflow-hidden">
      {/* Sticky Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-[#0B0E14]/95 backdrop-blur-md border-b border-[#00F0FF33] px-6 py-4">
        <div className="max-w-[120rem] mx-auto flex items-center justify-between">
          {/* Brand Header */}
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold font-mono text-[#00F0FF]">
              AstroLab // AeroForge
            </div>
            <div className="text-xs text-secondary-foreground font-mono">Research Engine</div>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMode(mode === 'student' ? 'professional' : 'student')}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                mode === 'student'
                  ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]'
                  : 'bg-[#FF007A]/20 text-[#FF007A] border border-[#FF007A]'
              }`}
            >
              {mode === 'student' ? 'Student Mode' : 'Professional Mode'}
            </button>

            {/* Status Bar */}
            <div className="flex items-center gap-6 pl-6 border-l border-[#00F0FF33]">
              <div className="flex items-center gap-2 text-xs font-mono">
                <Clock size={14} className="text-[#00F0FF]" />
                <span>{utcTime.toUTCString().split(' ')[4]}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-[#10B981]">Orbit Feed: LIVE</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <Zap size={14} className="text-[#F59E0B]" />
                <span className="text-[#F59E0B]">WebGL Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Module Tabs */}
        <div className="max-w-[120rem] mx-auto mt-4 flex gap-2 overflow-x-auto pb-2">
          {modules.map((mod) => (
            <button
              key={mod.id}
              onClick={() => setCurrentModule(mod.id)}
              className={`px-4 py-2 rounded-lg font-mono text-sm whitespace-nowrap transition-all ${
                currentModule === mod.id
                  ? 'bg-[#00F0FF]/30 text-[#00F0FF] border border-[#00F0FF]'
                  : 'bg-[#131924]/60 text-secondary-foreground border border-[#00F0FF33] hover:border-[#00F0FF]'
              }`}
            >
              {mod.icon} {mod.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full">
        {renderModule()}
      </main>
    </div>
  );
}

// Module Components
const SpatialGlobeModule: React.FC<{ mode: string }> = ({ mode }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (!canvasRef.current) return;

    // Dynamically load Three.js
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = () => {
      const THREE = (window as any).THREE;
      if (!THREE) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 10000);
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.setClearColor(0x0b0e14);

      // Create Earth
      const geometry = new THREE.SphereGeometry(1, 64, 64);
      const canvas2d = document.createElement('canvas');
      canvas2d.width = 2048;
      canvas2d.height = 1024;
      const ctx = canvas2d.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#1a3a52';
        ctx.fillRect(0, 0, canvas2d.width, canvas2d.height);
        ctx.fillStyle = '#2d5a3d';
        ctx.fillRect(100, 100, 300, 200);
      }
      const texture = new THREE.CanvasTexture(canvas2d);
      const material = new THREE.MeshPhongMaterial({ map: texture });
      const earth = new THREE.Mesh(geometry, material);
      scene.add(earth);

      // Lighting
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(5, 3, 5);
      scene.add(light);
      scene.add(new THREE.AmbientLight(0x404040));

      // Starfield
      const starsGeometry = new THREE.BufferGeometry();
      const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
      const starsVertices: number[] = [];
      for (let i = 0; i < 1000; i++) {
        starsVertices.push((Math.random() - 0.5) * 200);
        starsVertices.push((Math.random() - 0.5) * 200);
        starsVertices.push((Math.random() - 0.5) * 200);
      }
      starsGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(starsVertices), 3));
      const stars = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(stars);

      camera.position.z = 2.5;

      const animate = () => {
        requestAnimationFrame(animate);
        earth.rotation.y += 0.001;
        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    };
    document.head.appendChild(script);
  }, []);

  return (
    <div className="w-full h-screen bg-[#0B0E14] flex flex-col">
      <canvas ref={canvasRef} className="w-full flex-1" />
      <div className="bg-[#131924]/60 backdrop-blur-md border-t border-[#00F0FF33] p-6">
        <div className="max-w-[120rem] mx-auto">
          <h2 className="text-xl font-bold text-[#00F0FF] font-mono mb-4">Spatial Intelligence & 3D Globe Engine</h2>
          {mode === 'student' ? (
            <p className="text-secondary-foreground">Click on satellites to view real-time telemetry data.</p>
          ) : (
            <div className="grid grid-cols-4 gap-4 text-xs font-mono">
              <div><span className="text-[#FF007A]">LAT:</span> <span className="text-[#00F0FF]">0.00°</span></div>
              <div><span className="text-[#FF007A]">LON:</span> <span className="text-[#00F0FF]">0.00°</span></div>
              <div><span className="text-[#FF007A]">ALT:</span> <span className="text-[#00F0FF]">408 km</span></div>
              <div><span className="text-[#FF007A]">VEL:</span> <span className="text-[#00F0FF]">7.66 km/s</span></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DeepSpaceModule: React.FC<{ mode: string }> = ({ mode }) => {
  const [selectedObject, setSelectedObject] = React.useState<string | null>(null);

  const deepSkyObjects = [
    { name: 'M31', label: 'Andromeda', ra: '00:42:44', dec: '+41:16:09', distance: 2.5, magnitude: 3.4 },
    { name: 'M42', label: 'Orion Nebula', ra: '05:35:24', dec: '-05:23:14', distance: 1.3, magnitude: 4.0 },
    { name: 'M1', label: 'Crab Nebula', ra: '05:34:31', dec: '+22:00:52', distance: 6.5, magnitude: 8.4 },
    { name: 'M16', label: 'Pillars of Creation', ra: '18:18:47', dec: '-13:47:00', distance: 7.0, magnitude: 6.0 },
    { name: 'M104', label: 'Sombrero Galaxy', ra: '12:39:59', dec: '-11:37:23', distance: 29.3, magnitude: 8.0 },
    { name: 'M51', label: 'Whirlpool Galaxy', ra: '13:29:52', dec: '+47:11:43', distance: 23.0, magnitude: 8.4 },
    { name: 'M57', label: 'Ring Nebula', ra: '18:53:35', dec: '+33:01:45', distance: 2.3, magnitude: 8.8 },
    { name: 'Cen A', label: 'Centaurus A', ra: '13:25:28', dec: '-43:01:09', distance: 13.7, magnitude: 6.84 },
  ];

  const selected = deepSkyObjects.find(obj => obj.name === selectedObject);

  return (
    <div className="w-full min-h-screen bg-[#0B0E14] p-6">
      <div className="max-w-[120rem] mx-auto">
        <h2 className="text-2xl font-bold text-[#00F0FF] font-mono mb-6">Deep-Space Observation & Mapping</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sky Map */}
          <div className="lg:col-span-2 bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
            <div className="aspect-square bg-gradient-to-br from-[#0B0E14] to-[#1a1f2e] rounded-lg border border-[#00F0FF33] flex items-center justify-center relative overflow-hidden">
              {/* RA/Dec Grid */}
              <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.3 }}>
                {Array.from({ length: 24 }).map((_, i) => (
                  <line key={`ra-${i}`} x1={`${(i / 24) * 100}%`} y1="0" x2={`${(i / 24) * 100}%`} y2="100%" stroke="#00F0FF" strokeWidth="1" />
                ))}
                {Array.from({ length: 18 }).map((_, i) => (
                  <line key={`dec-${i}`} x1="0" y1={`${(i / 18) * 100}%`} x2="100%" y2={`${(i / 18) * 100}%`} stroke="#00F0FF" strokeWidth="1" />
                ))}
              </svg>

              {/* Deep Sky Objects */}
              <div className="absolute inset-0">
                {deepSkyObjects.map((obj) => {
                  const raPercent = (parseInt(obj.ra.split(':')[0]) / 24) * 100;
                  const decPercent = ((parseFloat(obj.dec.split(':')[0]) + 90) / 180) * 100;
                  return (
                    <button
                      key={obj.name}
                      onClick={() => setSelectedObject(obj.name)}
                      className={`absolute w-3 h-3 rounded-full transition-all ${
                        selectedObject === obj.name
                          ? 'bg-[#FF007A] scale-150 shadow-lg shadow-[#FF007A]'
                          : 'bg-[#00F0FF] hover:scale-125'
                      }`}
                      style={{ left: `${raPercent}%`, top: `${decPercent}%`, transform: 'translate(-50%, -50%)' }}
                      title={obj.label}
                    />
                  );
                })}
              </div>

              <div className="absolute bottom-4 left-4 text-xs font-mono text-secondary-foreground">
                RA: 0h - 24h | Dec: -90° - +90°
              </div>
            </div>
          </div>

          {/* Inspector Card */}
          <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#00F0FF] font-mono mb-4">Object Inspector</h3>
            {selected ? (
              <div className="space-y-4 text-sm font-mono">
                <div>
                  <span className="text-[#FF007A]">Name:</span>
                  <div className="text-[#00F0FF]">{selected.label}</div>
                </div>
                <div>
                  <span className="text-[#FF007A]">RA:</span>
                  <div className="text-[#00F0FF]">{selected.ra}</div>
                </div>
                <div>
                  <span className="text-[#FF007A]">Dec:</span>
                  <div className="text-[#00F0FF]">{selected.dec}</div>
                </div>
                <div>
                  <span className="text-[#FF007A]">Distance:</span>
                  <div className="text-[#00F0FF]">{selected.distance} Mly</div>
                </div>
                <div>
                  <span className="text-[#FF007A]">Magnitude:</span>
                  <div className="text-[#00F0FF]">{selected.magnitude}</div>
                </div>
              </div>
            ) : (
              <p className="text-secondary-foreground text-sm">Select an object to view details</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PhotometryModule: React.FC<{ mode: string }> = ({ mode }) => {
  const [selectedStar, setSelectedStar] = React.useState('Sirius');

  const stars = [
    { name: 'Sirius', magnitude: -1.46, color: 'white', temp: 9940 },
    { name: 'Canopus', magnitude: -0.74, color: 'yellow', temp: 7350 },
    { name: 'Arcturus', magnitude: -0.04, color: 'orange', temp: 4286 },
    { name: 'Vega', magnitude: 0.03, color: 'blue', temp: 9602 },
  ];

  const selected = stars.find(s => s.name === selectedStar);

  return (
    <div className="w-full min-h-screen bg-[#0B0E14] p-6">
      <div className="max-w-[120rem] mx-auto">
        <h2 className="text-2xl font-bold text-[#00F0FF] font-mono mb-6">Photometry Suite & Light Analysis</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Light Curve */}
          <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#00F0FF] font-mono mb-4">Light Curve Analysis</h3>
            <div className="aspect-video bg-gradient-to-br from-[#0B0E14] to-[#1a1f2e] rounded-lg border border-[#00F0FF33] flex items-center justify-center">
              <div className="text-center">
                <div className="text-[#00F0FF] font-mono text-sm mb-2">Magnitude vs Time</div>
                <svg className="w-full h-full" viewBox="0 0 400 300">
                  <line x1="40" y1="250" x2="380" y2="250" stroke="#00F0FF" strokeWidth="2" />
                  <line x1="40" y1="50" x2="40" y2="250" stroke="#00F0FF" strokeWidth="2" />
                  <polyline points="60,200 100,150 140,120 180,100 220,110 260,140 300,180 340,220" stroke="#FF007A" strokeWidth="2" fill="none" />
                </svg>
              </div>
            </div>
          </div>

          {/* Star Selection */}
          <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#00F0FF] font-mono mb-4">Star Selection</h3>
            <div className="space-y-3">
              {stars.map((star) => (
                <button
                  key={star.name}
                  onClick={() => setSelectedStar(star.name)}
                  className={`w-full p-3 rounded-lg text-left font-mono text-sm transition-all ${
                    selectedStar === star.name
                      ? 'bg-[#00F0FF]/30 border border-[#00F0FF] text-[#00F0FF]'
                      : 'bg-[#131924]/40 border border-[#00F0FF33] text-secondary-foreground hover:border-[#00F0FF]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{star.name}</span>
                    <span className="text-[#FF007A]">Mag: {star.magnitude}</span>
                  </div>
                </button>
              ))}
            </div>

            {selected && (
              <div className="mt-6 p-4 bg-[#00F0FF]/10 border border-[#00F0FF33] rounded-lg">
                <div className="text-xs font-mono space-y-2">
                  <div><span className="text-[#FF007A]">Temperature:</span> <span className="text-[#00F0FF]">{selected.temp} K</span></div>
                  <div><span className="text-[#FF007A]">Color:</span> <span className="text-[#00F0FF]">{selected.color}</span></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AstrodynamicsModule: React.FC<{ mode: string }> = ({ mode }) => {
  const [orbitType, setOrbitType] = React.useState('circular');

  const orbitTypes = [
    { id: 'circular', label: 'Circular Orbit', eccentricity: 0 },
    { id: 'elliptical', label: 'Elliptical Orbit', eccentricity: 0.5 },
    { id: 'parabolic', label: 'Parabolic Trajectory', eccentricity: 1 },
    { id: 'hyperbolic', label: 'Hyperbolic Trajectory', eccentricity: 1.5 },
  ];

  const selected = orbitTypes.find(o => o.id === orbitType);

  return (
    <div className="w-full min-h-screen bg-[#0B0E14] p-6">
      <div className="max-w-[120rem] mx-auto">
        <h2 className="text-2xl font-bold text-[#00F0FF] font-mono mb-6">Astrodynamics Sandbox & Orbital Mechanics</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orbit Visualization */}
          <div className="lg:col-span-2 bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
            <div className="aspect-square bg-gradient-to-br from-[#0B0E14] to-[#1a1f2e] rounded-lg border border-[#00F0FF33] flex items-center justify-center relative">
              <svg className="w-full h-full" viewBox="0 0 400 400">
                {/* Central body */}
                <circle cx="200" cy="200" r="20" fill="#FF007A" />
                {/* Orbit path */}
                {orbitType === 'circular' && <circle cx="200" cy="200" r="120" fill="none" stroke="#00F0FF" strokeWidth="2" />}
                {orbitType === 'elliptical' && <ellipse cx="200" cy="200" rx="150" ry="100" fill="none" stroke="#00F0FF" strokeWidth="2" />}
                {orbitType === 'parabolic' && <path d="M 100 200 Q 200 50 300 200" fill="none" stroke="#00F0FF" strokeWidth="2" />}
                {orbitType === 'hyperbolic' && <path d="M 100 100 Q 200 200 100 300" fill="none" stroke="#00F0FF" strokeWidth="2" />}
                {/* Satellite */}
                <circle cx="320" cy="200" r="8" fill="#10B981" />
              </svg>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#00F0FF] font-mono mb-4">Orbit Type</h3>
            <div className="space-y-3">
              {orbitTypes.map((orbit) => (
                <button
                  key={orbit.id}
                  onClick={() => setOrbitType(orbit.id)}
                  className={`w-full p-3 rounded-lg text-left font-mono text-sm transition-all ${
                    orbitType === orbit.id
                      ? 'bg-[#00F0FF]/30 border border-[#00F0FF] text-[#00F0FF]'
                      : 'bg-[#131924]/40 border border-[#00F0FF33] text-secondary-foreground hover:border-[#00F0FF]'
                  }`}
                >
                  {orbit.label}
                </button>
              ))}
            </div>

            {selected && (
              <div className="mt-6 p-4 bg-[#00F0FF]/10 border border-[#00F0FF33] rounded-lg">
                <div className="text-xs font-mono space-y-2">
                  <div><span className="text-[#FF007A]">Eccentricity:</span> <span className="text-[#00F0FF]">{selected.eccentricity}</span></div>
                  <div><span className="text-[#FF007A]">Apogee:</span> <span className="text-[#00F0FF]">35,786 km</span></div>
                  <div><span className="text-[#FF007A]">Perigee:</span> <span className="text-[#00F0FF]">200 km</span></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DualModeModule: React.FC<{ mode: string; setMode: (m: 'student' | 'professional') => void }> = ({ mode, setMode }) => {
  return (
    <div className="w-full min-h-screen bg-[#0B0E14] p-6">
      <div className="max-w-[120rem] mx-auto">
        <h2 className="text-2xl font-bold text-[#00F0FF] font-mono mb-6">Dual-Mode Experience Switcher</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Mode */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setMode('student')}
            className={`p-8 rounded-lg border-2 cursor-pointer transition-all ${
              mode === 'student'
                ? 'bg-[#00F0FF]/20 border-[#00F0FF]'
                : 'bg-[#131924]/60 border-[#00F0FF33] hover:border-[#00F0FF]'
            }`}
          >
            <h3 className="text-xl font-bold text-[#00F0FF] font-mono mb-4">Student Mode</h3>
            <ul className="space-y-2 text-secondary-foreground text-sm font-mono">
              <li>✓ Simplified interface</li>
              <li>✓ Educational guides</li>
              <li>✓ Interactive tutorials</li>
              <li>✓ Beginner-friendly controls</li>
            </ul>
          </motion.div>

          {/* Professional Mode */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setMode('professional')}
            className={`p-8 rounded-lg border-2 cursor-pointer transition-all ${
              mode === 'professional'
                ? 'bg-[#FF007A]/20 border-[#FF007A]'
                : 'bg-[#131924]/60 border-[#00F0FF33] hover:border-[#FF007A]'
            }`}
          >
            <h3 className="text-xl font-bold text-[#FF007A] font-mono mb-4">Professional Mode</h3>
            <ul className="space-y-2 text-secondary-foreground text-sm font-mono">
              <li>✓ Advanced parameters</li>
              <li>✓ Real-time data feeds</li>
              <li>✓ Custom simulations</li>
              <li>✓ Export capabilities</li>
            </ul>
          </motion.div>
        </div>

        <div className="mt-8 bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
          <h3 className="text-lg font-bold text-[#00F0FF] font-mono mb-4">Current Mode: {mode.toUpperCase()}</h3>
          <p className="text-secondary-foreground text-sm">
            {mode === 'student'
              ? 'You are in Student Mode. Explore the modules with guided learning and simplified controls.'
              : 'You are in Professional Mode. Access advanced features and real-time data analysis tools.'}
          </p>
        </div>
      </div>
    </div>
  );
};

const ConstellationModule: React.FC<{ mode: string }> = ({ mode }) => {
  const [selectedConstellation, setSelectedConstellation] = React.useState('Orion');

  const constellations = [
    { name: 'Orion', stars: 7, magnitude: 2.5 },
    { name: 'Ursa Major', stars: 7, magnitude: 1.9 },
    { name: 'Cassiopeia', stars: 5, magnitude: 2.2 },
    { name: 'Cygnus', stars: 9, magnitude: 1.2 },
  ];

  const selected = constellations.find(c => c.name === selectedConstellation);

  return (
    <div className="w-full min-h-screen bg-[#0B0E14] p-6">
      <div className="max-w-[120rem] mx-auto">
        <h2 className="text-2xl font-bold text-[#00F0FF] font-mono mb-6">Satellite Constellation Mapper</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Constellation Map */}
          <div className="lg:col-span-2 bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
            <div className="aspect-square bg-gradient-to-br from-[#0B0E14] to-[#1a1f2e] rounded-lg border border-[#00F0FF33] flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 400 400">
                {/* Stars */}
                {Array.from({ length: 20 }).map((_, i) => (
                  <circle key={i} cx={Math.random() * 380 + 10} cy={Math.random() * 380 + 10} r="3" fill="#00F0FF" opacity="0.7" />
                ))}
                {/* Constellation lines */}
                <line x1="50" y1="100" x2="150" y2="150" stroke="#FF007A" strokeWidth="2" opacity="0.5" />
                <line x1="150" y1="150" x2="250" y2="100" stroke="#FF007A" strokeWidth="2" opacity="0.5" />
                <line x1="250" y1="100" x2="300" y2="200" stroke="#FF007A" strokeWidth="2" opacity="0.5" />
              </svg>
            </div>
          </div>

          {/* Constellation List */}
          <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#00F0FF] font-mono mb-4">Constellations</h3>
            <div className="space-y-3">
              {constellations.map((const_item) => (
                <button
                  key={const_item.name}
                  onClick={() => setSelectedConstellation(const_item.name)}
                  className={`w-full p-3 rounded-lg text-left font-mono text-sm transition-all ${
                    selectedConstellation === const_item.name
                      ? 'bg-[#00F0FF]/30 border border-[#00F0FF] text-[#00F0FF]'
                      : 'bg-[#131924]/40 border border-[#00F0FF33] text-secondary-foreground hover:border-[#00F0FF]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{const_item.name}</span>
                    <span className="text-[#FF007A]">{const_item.stars} stars</span>
                  </div>
                </button>
              ))}
            </div>

            {selected && (
              <div className="mt-6 p-4 bg-[#00F0FF]/10 border border-[#00F0FF33] rounded-lg">
                <div className="text-xs font-mono space-y-2">
                  <div><span className="text-[#FF007A]">Stars:</span> <span className="text-[#00F0FF]">{selected.stars}</span></div>
                  <div><span className="text-[#FF007A]">Magnitude:</span> <span className="text-[#00F0FF]">{selected.magnitude}</span></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CelestialModule: React.FC<{ mode: string }> = ({ mode }) => {
  const [selectedCoord, setSelectedCoord] = React.useState('RA');

  return (
    <div className="w-full min-h-screen bg-[#0B0E14] p-6">
      <div className="max-w-[120rem] mx-auto">
        <h2 className="text-2xl font-bold text-[#00F0FF] font-mono mb-6">Celestial Coordinate Ephemeris</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coordinate System */}
          <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#00F0FF] font-mono mb-4">Coordinate Systems</h3>
            <div className="space-y-4">
              {['RA/Dec', 'Alt/Az', 'Ecliptic', 'Galactic'].map((system) => (
                <button
                  key={system}
                  onClick={() => setSelectedCoord(system)}
                  className={`w-full p-3 rounded-lg text-left font-mono text-sm transition-all ${
                    selectedCoord === system
                      ? 'bg-[#00F0FF]/30 border border-[#00F0FF] text-[#00F0FF]'
                      : 'bg-[#131924]/40 border border-[#00F0FF33] text-secondary-foreground hover:border-[#00F0FF]'
                  }`}
                >
                  {system}
                </button>
              ))}
            </div>
          </div>

          {/* Ephemeris Data */}
          <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#00F0FF] font-mono mb-4">Ephemeris Data</h3>
            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 bg-[#00F0FF]/10 border border-[#00F0FF33] rounded">
                <div className="text-[#FF007A]">Right Ascension</div>
                <div className="text-[#00F0FF]">12h 34m 56.7s</div>
              </div>
              <div className="p-3 bg-[#00F0FF]/10 border border-[#00F0FF33] rounded">
                <div className="text-[#FF007A]">Declination</div>
                <div className="text-[#00F0FF]">+45° 23' 12"</div>
              </div>
              <div className="p-3 bg-[#00F0FF]/10 border border-[#00F0FF33] rounded">
                <div className="text-[#FF007A]">Distance</div>
                <div className="text-[#00F0FF]">1.5 AU</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrbitalModule: React.FC<{ mode: string }> = ({ mode }) => {
  const [selectedParameter, setSelectedParameter] = React.useState('period');

  const parameters = [
    { id: 'period', label: 'Orbital Period', value: '23h 56m 4s' },
    { id: 'velocity', label: 'Orbital Velocity', value: '7.66 km/s' },
    { id: 'altitude', label: 'Mean Altitude', value: '408 km' },
    { id: 'inclination', label: 'Inclination', value: '51.6°' },
  ];

  const selected = parameters.find(p => p.id === selectedParameter);

  return (
    <div className="w-full min-h-screen bg-[#0B0E14] p-6">
      <div className="max-w-[120rem] mx-auto">
        <h2 className="text-2xl font-bold text-[#00F0FF] font-mono mb-6">Orbital Mechanics Calculator</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Parameter Selection */}
          <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#00F0FF] font-mono mb-4">Orbital Parameters</h3>
            <div className="space-y-3">
              {parameters.map((param) => (
                <button
                  key={param.id}
                  onClick={() => setSelectedParameter(param.id)}
                  className={`w-full p-3 rounded-lg text-left font-mono text-sm transition-all ${
                    selectedParameter === param.id
                      ? 'bg-[#00F0FF]/30 border border-[#00F0FF] text-[#00F0FF]'
                      : 'bg-[#131924]/40 border border-[#00F0FF33] text-secondary-foreground hover:border-[#00F0FF]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{param.label}</span>
                    <span className="text-[#FF007A]">{param.value}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Calculation Results */}
          <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#00F0FF] font-mono mb-4">Calculation Results</h3>
            {selected && (
              <div className="space-y-4">
                <div className="p-4 bg-[#00F0FF]/10 border border-[#00F0FF33] rounded-lg">
                  <div className="text-[#FF007A] font-mono text-sm mb-2">{selected.label}</div>
                  <div className="text-[#00F0FF] font-mono text-2xl">{selected.value}</div>
                </div>
                <div className="p-4 bg-[#131924]/40 border border-[#00F0FF33] rounded-lg">
                  <div className="text-secondary-foreground text-xs font-mono space-y-2">
                    <div>Status: <span className="text-[#10B981]">CALCULATED</span></div>
                    <div>Precision: <span className="text-[#00F0FF]">±0.001%</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
