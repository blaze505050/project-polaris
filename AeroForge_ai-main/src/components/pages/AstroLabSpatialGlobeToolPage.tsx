import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw, Zap, Eye, Map, Download, Settings, Info, Maximize2, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Satellite {
  id: string;
  name: string;
  lat: number;
  lon: number;
  altitude: number;
  velocity: number;
  inclination: number;
  period: number;
  color: string;
  type: 'LEO' | 'MEO' | 'GEO' | 'HEO';
  trail: Array<{ lat: number; lon: number }>;
}

export default function AstroLabSpatialGlobeToolPage() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [time, setTime] = useState(0);
  const [selectedSatellite, setSelectedSatellite] = useState<Satellite | null>(null);
  const [showTrails, setShowTrails] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [timeScale, setTimeScale] = useState(1);
  const [viewMode, setViewMode] = useState<'globe' | 'coverage' | 'orbital'>('globe');
  const [satellites, setSatellites] = useState<Satellite[]>([
    { id: 'iss', name: 'ISS', lat: 0, lon: 0, altitude: 408, velocity: 7.66, inclination: 51.6, period: 92.68, color: '#00F0FF', type: 'LEO', trail: [] },
    { id: 'hubble', name: 'Hubble', lat: 10, lon: 45, altitude: 547, velocity: 7.54, inclination: 28.47, period: 96.97, color: '#FF007A', type: 'LEO', trail: [] },
    { id: 'goes16', name: 'GOES-16', lat: 0, lon: -75, altitude: 35786, velocity: 3.07, inclination: 0.03, period: 1436, color: '#F59E0B', type: 'GEO', trail: [] },
    { id: 'jwst', name: 'JWST', lat: 5, lon: 120, altitude: 1500000, velocity: 0.5, inclination: 0, period: 180, color: '#A78BFA', type: 'HEO', trail: [] },
    { id: 'gps01', name: 'GPS-01', lat: 30, lon: 60, altitude: 20200, velocity: 3.87, inclination: 55, period: 718, color: '#10B981', type: 'MEO', trail: [] },
    { id: 'gps02', name: 'GPS-02', lat: -30, lon: -120, altitude: 20200, velocity: 3.87, inclination: 55, period: 718, color: '#10B981', type: 'MEO', trail: [] },
  ]);

  const propagateSatellite = (sat: Satellite, timeStep: number): Satellite => {
    const meanMotion = (2 * Math.PI) / (sat.period * 60);
    const newLon = (sat.lon + (360 * timeStep * timeScale) / (sat.period * 60)) % 360;
    const latVariation = Math.sin((meanMotion * timeStep * timeScale) % (2 * Math.PI)) * sat.inclination;
    
    const newTrail = [...sat.trail, { lat: sat.lat, lon: sat.lon }];
    if (newTrail.length > 200) newTrail.shift();
    
    return {
      ...sat,
      lon: newLon > 180 ? newLon - 360 : newLon,
      lat: latVariation,
      trail: newTrail,
    };
  };

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTime(t => t + 1);
      setSatellites(sats => sats.map(sat => propagateSatellite(sat, 1)));
    }, 50);
    return () => clearInterval(interval);
  }, [isRunning, timeScale]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2.5 * zoomLevel;

    // Clear canvas with gradient background
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#0B0E14');
    bgGradient.addColorStop(1, '#131924');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw stars
    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = 0.6;
    for (let i = 0; i < 300; i++) {
      const x = Math.sin(i * 12.9898) * 43758.5453 % width;
      const y = Math.cos(i * 78.233) * 43758.5453 % height;
      const size = Math.random() * 1.5;
      ctx.fillRect(x, y, size, size);
    }
    ctx.globalAlpha = 1;

    // Draw Earth with enhanced gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, '#2a5a7a');
    gradient.addColorStop(0.5, '#0d5a3d');
    gradient.addColorStop(1, '#051f2e');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw atmosphere glow
    ctx.strokeStyle = '#00F0FF';
    ctx.globalAlpha = 0.1;
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#00F0FF';
      ctx.globalAlpha = 0.15;
      ctx.lineWidth = 1;
      
      // Latitude lines
      for (let lat = -90; lat <= 90; lat += 30) {
        const y = centerY - (lat / 90) * radius;
        ctx.beginPath();
        ctx.moveTo(centerX - radius, y);
        ctx.lineTo(centerX + radius, y);
        ctx.stroke();
      }
      
      // Longitude lines
      for (let lon = -180; lon <= 180; lon += 30) {
        const x = centerX + (lon / 180) * radius;
        ctx.beginPath();
        ctx.moveTo(x, centerY - radius);
        ctx.lineTo(x, centerY + radius);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // Draw satellite trails
    if (showTrails) {
      satellites.forEach(sat => {
        ctx.strokeStyle = sat.color;
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        sat.trail.forEach((point, idx) => {
          const x = centerX + (point.lon / 180) * radius;
          const y = centerY - (point.lat / 90) * radius;
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.globalAlpha = 1;
      });
    }

    // Draw satellites
    satellites.forEach(sat => {
      const x = centerX + (sat.lon / 180) * radius;
      const y = centerY - (sat.lat / 90) * radius;

      // Glow effect
      ctx.fillStyle = sat.color;
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fill();

      // Main satellite
      ctx.fillStyle = sat.color;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();

      // Selection highlight
      if (selectedSatellite?.id === sat.id) {
        ctx.strokeStyle = sat.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Label
      if (showLabels) {
        ctx.fillStyle = sat.color;
        ctx.font = 'bold 11px monospace';
        ctx.globalAlpha = 0.9;
        ctx.fillText(sat.name, x + 10, y - 10);
      }
    });

    ctx.globalAlpha = 1;
  }, [satellites, selectedSatellite, showTrails, zoomLevel, showGrid, showLabels, viewMode]);

  const stats = useMemo(() => {
    if (!selectedSatellite) return null;
    return {
      altitude: selectedSatellite.altitude.toFixed(0),
      velocity: selectedSatellite.velocity.toFixed(2),
      period: selectedSatellite.period.toFixed(2),
      inclination: selectedSatellite.inclination.toFixed(2),
    };
  }, [selectedSatellite]);

  const handleExport = () => {
    const data = satellites.map(sat => ({
      name: sat.name,
      latitude: sat.lat.toFixed(4),
      longitude: sat.lon.toFixed(4),
      altitude: sat.altitude,
      velocity: sat.velocity,
      inclination: sat.inclination,
      period: sat.period,
    }));
    
    const csv = [
      ['Name', 'Latitude', 'Longitude', 'Altitude (km)', 'Velocity (km/s)', 'Inclination (°)', 'Period (min)'],
      ...data.map(d => [d.name, d.latitude, d.longitude, d.altitude, d.velocity, d.inclination, d.period])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `satellites-${new Date().toISOString().split('T')[0]}.csv`;
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
                <h1 className="text-4xl font-bold text-[#00F0FF] font-mono">Spatial Globe Engine</h1>
                <p className="text-secondary-foreground text-sm">Real-time satellite tracking & orbital visualization</p>
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

          {/* Main Canvas */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  onClick={(e) => {
                    const rect = canvasRef.current?.getBoundingClientRect();
                    if (!rect) return;
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = 400;
                    const centerY = 300;
                    
                    satellites.forEach(sat => {
                      const satX = centerX + (sat.lon / 180) * (Math.min(800, 600) / 2.5 * zoomLevel);
                      const satY = centerY - (sat.lat / 90) * (Math.min(800, 600) / 2.5 * zoomLevel);
                      if (Math.hypot(x - satX, y - satY) < 15) {
                        setSelectedSatellite(sat);
                      }
                    });
                  }}
                  className="w-full cursor-crosshair"
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
                  onClick={() => {
                    setTime(0);
                    setSatellites(sats => sats.map(sat => ({ ...sat, trail: [] })));
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-[#FF007A]/20 text-[#FF007A] border border-[#FF007A] rounded-lg hover:bg-[#FF007A]/30 transition font-mono text-sm"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
                <button
                  onClick={() => setShowTrails(!showTrails)}
                  className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition font-mono text-sm ${
                    showTrails
                      ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]'
                      : 'bg-[#475569]/20 text-secondary-foreground border-[#475569]'
                  }`}
                >
                  <Eye size={16} />
                  Trails
                </button>
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition font-mono text-sm ${
                    showGrid
                      ? 'bg-[#A78BFA]/20 text-[#A78BFA] border-[#A78BFA]'
                      : 'bg-[#475569]/20 text-secondary-foreground border-[#475569]'
                  }`}
                >
                  <Map size={16} />
                  Grid
                </button>
              </div>

              {/* Time Scale Control */}
              <div className="mt-4 bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-mono text-secondary-foreground">Time Scale</label>
                  <span className="text-[#00F0FF] font-mono font-bold">{timeScale}x</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={timeScale}
                  onChange={(e) => setTimeScale(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Right Panel - Details */}
            <div className="space-y-4">
              {/* Satellite List */}
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
                <h3 className="text-sm font-mono font-bold text-[#00F0FF] mb-3">Tracked Satellites</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {satellites.map(sat => (
                    <button
                      key={sat.id}
                      onClick={() => setSelectedSatellite(sat)}
                      className={`w-full text-left px-3 py-2 rounded text-xs font-mono transition ${
                        selectedSatellite?.id === sat.id
                          ? 'bg-[#00F0FF]/30 border border-[#00F0FF] text-[#00F0FF]'
                          : 'bg-[#0B0E14]/50 border border-[#475569] text-secondary-foreground hover:border-[#00F0FF]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: sat.color }} />
                        <span>{sat.name}</span>
                        <span className="text-[10px] opacity-60">({sat.type})</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Satellite Details */}
              {selectedSatellite && stats && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4"
                >
                  <h3 className="text-sm font-mono font-bold text-[#00F0FF] mb-3 flex items-center gap-2">
                    <Info size={14} />
                    {selectedSatellite.name}
                  </h3>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-secondary-foreground">Latitude:</span>
                      <span className="text-[#00F0FF]">{selectedSatellite.lat.toFixed(2)}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-foreground">Longitude:</span>
                      <span className="text-[#00F0FF]">{selectedSatellite.lon.toFixed(2)}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-foreground">Altitude:</span>
                      <span className="text-[#FF007A]">{stats.altitude} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-foreground">Velocity:</span>
                      <span className="text-[#F59E0B]">{stats.velocity} km/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-foreground">Period:</span>
                      <span className="text-[#A78BFA]">{stats.period} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-foreground">Inclination:</span>
                      <span className="text-[#10B981]">{stats.inclination}°</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Statistics */}
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
                <h3 className="text-sm font-mono font-bold text-[#00F0FF] mb-3 flex items-center gap-2">
                  <BarChart3 size={14} />
                  Statistics
                </h3>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Satellites:</span>
                    <span className="text-[#00F0FF]">{satellites.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Simulation Time:</span>
                    <span className="text-[#00F0FF]">{(time * 50 / 1000).toFixed(1)}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Avg Altitude:</span>
                    <span className="text-[#00F0FF]">{(satellites.reduce((a, b) => a + b.altitude, 0) / satellites.length).toFixed(0)} km</span>
                  </div>
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
