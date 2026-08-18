import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Settings, Satellite, Eye, BarChart3, Zap, Play, Pause } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ConstellationData {
  id: string;
  name: string;
  altitude: number;
  shell: string;
  count: number;
  color: string;
  coverage: number;
  planes: number;
  satsPerPlane: number;
  inclination: number;
}

interface SatellitePoint {
  x: number;
  y: number;
  z: number;
  plane: number;
  slot: number;
}

export default function AstroLabSatelliteConstellationPage() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedShell, setSelectedShell] = useState<string>('LEO');
  const [rotation, setRotation] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [showCoverage, setShowCoverage] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  const constellations: ConstellationData[] = [
    {
      id: 'leo',
      name: 'LEO Constellation',
      altitude: 550,
      shell: 'LEO',
      count: 12000,
      color: '#00F0FF',
      coverage: 99,
      planes: 72,
      satsPerPlane: 22,
      inclination: 53,
    },
    {
      id: 'meo',
      name: 'MEO Constellation',
      altitude: 20200,
      shell: 'MEO',
      count: 600,
      color: '#F59E0B',
      coverage: 95,
      planes: 6,
      satsPerPlane: 100,
      inclination: 55,
    },
    {
      id: 'geo',
      name: 'GEO Ring',
      altitude: 35786,
      shell: 'GEO',
      count: 500,
      color: '#A78BFA',
      coverage: 100,
      planes: 1,
      satsPerPlane: 500,
      inclination: 0,
    },
  ];

  const currentConstellation = constellations.find(c => c.shell === selectedShell) || constellations[0];

  // Generate satellite positions
  const satellites = useMemo(() => {
    const sats: SatellitePoint[] = [];
    const earthRadius = 6371;
    const orbitRadius = earthRadius + currentConstellation.altitude;
    const inclination = (currentConstellation.inclination * Math.PI) / 180;

    for (let plane = 0; plane < currentConstellation.planes; plane++) {
      const planeAngle = (plane / currentConstellation.planes) * Math.PI * 2;

      for (let slot = 0; slot < currentConstellation.satsPerPlane; slot++) {
        const slotAngle = (slot / currentConstellation.satsPerPlane) * Math.PI * 2;
        
        // Position in orbital plane
        const x_orb = orbitRadius * Math.cos(slotAngle);
        const y_orb = orbitRadius * Math.sin(slotAngle);
        const z_orb = 0;

        // Rotate by inclination
        const x_inc = x_orb;
        const y_inc = y_orb * Math.cos(inclination) - z_orb * Math.sin(inclination);
        const z_inc = y_orb * Math.sin(inclination) + z_orb * Math.cos(inclination);

        // Rotate by plane angle
        const x = x_inc * Math.cos(planeAngle) - y_inc * Math.sin(planeAngle);
        const y = x_inc * Math.sin(planeAngle) + y_inc * Math.cos(planeAngle);
        const z = z_inc;

        sats.push({ x, y, z, plane, slot });
      }
    }
    return sats;
  }, [currentConstellation]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => setRotation(r => (r + 0.5) % 360), 50);
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = Math.min(width, height) / (currentConstellation.altitude * 4) * zoomLevel;

    // Background
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#0B0E14');
    bgGradient.addColorStop(1, '#131924');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Stars
    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = 0.6;
    for (let i = 0; i < 300; i++) {
      const x = Math.sin(i * 12.9898) * 43758.5453 % width;
      const y = Math.cos(i * 78.233) * 43758.5453 % height;
      ctx.fillRect(x, y, 1.5, 1.5);
    }
    ctx.globalAlpha = 1;

    // Earth
    ctx.fillStyle = '#1a5a7a';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6371 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Coverage zones
    if (showCoverage) {
      ctx.strokeStyle = currentConstellation.color;
      ctx.globalAlpha = 0.1;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, (6371 + currentConstellation.altitude) * scale, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Draw satellites
    ctx.fillStyle = currentConstellation.color;
    ctx.globalAlpha = 0.8;

    satellites.forEach(sat => {
      // Apply rotation
      const rot_rad = (rotation * Math.PI) / 180;
      const x_rot = sat.x * Math.cos(rot_rad) - sat.y * Math.sin(rot_rad);
      const y_rot = sat.x * Math.sin(rot_rad) + sat.y * Math.cos(rot_rad);

      const x = centerX + x_rot * scale;
      const y = centerY - y_rot * scale;

      // Only draw if visible
      if (x > -10 && x < width + 10 && y > -10 && y < height + 10) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Glow effect for constellation
    ctx.strokeStyle = currentConstellation.color;
    ctx.globalAlpha = 0.15;
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.arc(centerX, centerY, (6371 + currentConstellation.altitude) * scale, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = 1;
  }, [satellites, rotation, currentConstellation, showCoverage, zoomLevel]);

  const handleExport = () => {
    const data = {
      timestamp: new Date().toISOString(),
      constellation: currentConstellation,
      satellites: satellites.length,
      coverage: currentConstellation.coverage,
    };
    
    const csv = [
      ['Constellation Data'],
      ['Name', currentConstellation.name],
      ['Altitude', `${currentConstellation.altitude} km`],
      ['Total Satellites', currentConstellation.count],
      ['Coverage', `${currentConstellation.coverage}%`],
      ['Orbital Planes', currentConstellation.planes],
      ['Sats per Plane', currentConstellation.satsPerPlane],
      ['Inclination', `${currentConstellation.inclination}°`],
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `constellation-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-foreground flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-[120rem] mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/astrolab')} className="p-2 hover:bg-[#131924] rounded-lg transition">
                <ArrowLeft size={20} className="text-[#00F0FF]" />
              </button>
              <div>
                <h1 className="text-4xl font-bold text-[#00F0FF] font-mono">Satellite Constellation Mapper</h1>
                <p className="text-secondary-foreground text-sm">Real-time orbital shell visualization</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleExport} className="p-2 hover:bg-[#131924] rounded-lg transition" title="Export data">
                <Download size={20} className="text-[#00F0FF]" />
              </button>
              <button className="p-2 hover:bg-[#131924] rounded-lg transition" title="Settings">
                <Settings size={20} className="text-[#00F0FF]" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="w-full"
                />
              </div>

              {/* Controls */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF] rounded-lg hover:bg-[#00F0FF]/30 transition font-mono text-sm"
                >
                  {isRunning ? <Pause size={16} /> : <Play size={16} />}
                  {isRunning ? 'Pause' : 'Play'}
                </button>
                <button
                  onClick={() => setShowCoverage(!showCoverage)}
                  className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition font-mono text-sm ${
                    showCoverage
                      ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]'
                      : 'bg-[#475569]/20 text-secondary-foreground border-[#475569]'
                  }`}
                >
                  <Eye size={16} />
                  Coverage
                </button>
                <button
                  onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.5))}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-[#A78BFA]/20 text-[#A78BFA] border border-[#A78BFA] rounded-lg hover:bg-[#A78BFA]/30 transition font-mono text-sm"
                >
                  Zoom: {zoomLevel.toFixed(1)}x
                </button>
                <button
                  onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.5))}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B] rounded-lg hover:bg-[#F59E0B]/30 transition font-mono text-sm"
                >
                  Reset View
                </button>
              </div>
            </div>

            {/* Right Panel */}
            <div className="space-y-4">
              {/* Constellation Selector */}
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
                <h3 className="text-sm font-mono font-bold text-[#00F0FF] mb-3">Constellations</h3>
                <div className="space-y-2">
                  {constellations.map(const_data => (
                    <button
                      key={const_data.id}
                      onClick={() => setSelectedShell(const_data.shell)}
                      className={`w-full text-left px-3 py-2 rounded text-xs font-mono transition ${
                        selectedShell === const_data.shell
                          ? 'bg-[#00F0FF]/30 border border-[#00F0FF] text-[#00F0FF]'
                          : 'bg-[#0B0E14]/50 border border-[#475569] text-secondary-foreground hover:border-[#00F0FF]'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: const_data.color }} />
                        <span>{const_data.name}</span>
                      </div>
                      <div className="text-[10px] opacity-60">{const_data.count.toLocaleString()} satellites</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Constellation Details */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4"
              >
                <h3 className="text-sm font-mono font-bold text-[#00F0FF] mb-3 flex items-center gap-2">
                  <Satellite size={14} />
                  {currentConstellation.name}
                </h3>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Altitude:</span>
                    <span className="text-[#00F0FF]">{currentConstellation.altitude.toLocaleString()} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Total Sats:</span>
                    <span className="text-[#FF007A]">{currentConstellation.count.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Coverage:</span>
                    <span className="text-[#F59E0B]">{currentConstellation.coverage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Planes:</span>
                    <span className="text-[#A78BFA]">{currentConstellation.planes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Per Plane:</span>
                    <span className="text-[#10B981]">{currentConstellation.satsPerPlane}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Inclination:</span>
                    <span className="text-[#00F0FF]">{currentConstellation.inclination}°</span>
                  </div>
                </div>
              </motion.div>

              {/* Statistics */}
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
                <h3 className="text-sm font-mono font-bold text-[#00F0FF] mb-3 flex items-center gap-2">
                  <BarChart3 size={14} />
                  Statistics
                </h3>
                <div className="space-y-2 text-xs font-mono text-secondary-foreground">
                  <div className="flex justify-between">
                    <span>Visible:</span>
                    <span className="text-[#00F0FF]">{satellites.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rotation:</span>
                    <span className="text-[#00F0FF]">{rotation.toFixed(1)}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-[#10B981]">{isRunning ? 'Active' : 'Paused'}</span>
                  </div>
                </div>
              </div>

              {/* Coverage Info */}
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
                <h3 className="text-sm font-mono font-bold text-[#00F0FF] mb-3">Coverage</h3>
                <div className="w-full bg-[#0B0E14] rounded-full h-2 overflow-hidden border border-[#00F0FF33]">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${currentConstellation.coverage}%`,
                      backgroundColor: currentConstellation.color,
                    }}
                  />
                </div>
                <div className="text-xs text-secondary-foreground mt-2 text-center">
                  {currentConstellation.coverage}% Global Coverage
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
