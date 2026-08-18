import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Play, Pause, RotateCcw, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AstronomicalConstants, getOrbitalPeriod, getOrbitalVelocity } from '@/services/astronomicalConstants';

interface OrbitalState {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  time: number;
}

export default function AstroLabOrbitalMechanicsEnhancedPage() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Orbital parameters
  const [semiMajorAxis, setSemiMajorAxis] = useState(6.6e6); // meters (LEO)
  const [eccentricity, setEccentricity] = useState(0.001);
  const [inclination, setInclination] = useState(51.6); // degrees
  const [centralBody, setCentralBody] = useState('earth');
  const [timeScale, setTimeScale] = useState(1000); // simulation time multiplier
  const [isRunning, setIsRunning] = useState(true);

  // Get gravitational parameter
  const getGM = () => {
    switch (centralBody) {
      case 'sun':
        return AstronomicalConstants.STANDARD_GRAVITATIONAL_PARAMETER_SUN;
      case 'moon':
        return AstronomicalConstants.STANDARD_GRAVITATIONAL_PARAMETER_MOON;
      case 'earth':
      default:
        return AstronomicalConstants.STANDARD_GRAVITATIONAL_PARAMETER_EARTH;
    }
  };

  const GM = getGM();

  // Get central body radius
  const getCentralBodyRadius = () => {
    switch (centralBody) {
      case 'sun':
        return AstronomicalConstants.SOLAR_RADIUS;
      case 'moon':
        return AstronomicalConstants.MOON_RADIUS;
      case 'earth':
      default:
        return AstronomicalConstants.EARTH_RADIUS;
    }
  };

  const centralBodyRadius = getCentralBodyRadius();

  // Calculate orbital elements
  const orbitalPeriod = getOrbitalPeriod(semiMajorAxis, GM / AstronomicalConstants.GRAVITATIONAL_CONSTANT);
  const orbitalVelocity = getOrbitalVelocity(semiMajorAxis, GM / AstronomicalConstants.GRAVITATIONAL_CONSTANT);
  const periapsis = semiMajorAxis * (1 - eccentricity);
  const apoapsis = semiMajorAxis * (1 + eccentricity);
  const periapsisAltitude = periapsis - centralBodyRadius;
  const apoapsisAltitude = apoapsis - centralBodyRadius;

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.2)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let i = 0; i < canvas.width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = Math.min(canvas.width, canvas.height) / (apoapsis * 2.5);

      // Draw central body
      const bodyRadius = Math.max(10, centralBodyRadius * scale);
      ctx.fillStyle = centralBody === 'sun' ? '#FDB813' : centralBody === 'moon' ? '#A9A9A9' : '#4B90E2';
      ctx.beginPath();
      ctx.arc(centerX, centerY, bodyRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw orbit
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 360; i += 1) {
        const angle = (i * Math.PI) / 180;
        const r = (semiMajorAxis * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos(angle));
        const x = centerX + r * Math.cos(angle) * scale;
        const y = centerY + r * Math.sin(angle) * scale;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Calculate satellite position
      if (isRunning) {
        time += timeScale;
      }

      const meanAnomaly = (time / orbitalPeriod) * Math.PI * 2;
      
      // Simplified: use mean anomaly directly (Newton-Raphson would be more accurate)
      const trueAnomaly = meanAnomaly;
      const r = (semiMajorAxis * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos(trueAnomaly));
      
      const satX = centerX + r * Math.cos(trueAnomaly) * scale;
      const satY = centerY + r * Math.sin(trueAnomaly) * scale;

      // Draw satellite
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(satX, satY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Draw velocity vector
      const vx = -Math.sin(trueAnomaly) * orbitalVelocity / 1000;
      const vy = Math.cos(trueAnomaly) * orbitalVelocity / 1000;
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(satX, satY);
      ctx.lineTo(satX + vx * scale * 0.1, satY + vy * scale * 0.1);
      ctx.stroke();

      // Draw periapsis and apoapsis markers
      ctx.fillStyle = 'rgba(255, 107, 107, 0.5)';
      ctx.beginPath();
      ctx.arc(centerX + periapsis * scale, centerY, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(107, 114, 255, 0.5)';
      ctx.beginPath();
      ctx.arc(centerX - apoapsis * scale, centerY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Draw info text
      ctx.fillStyle = '#E2E8F0';
      ctx.font = '12px monospace';
      ctx.fillText(`Time: ${(time / 3600).toFixed(1)}h`, 10, 20);
      ctx.fillText(`Altitude: ${((r - centralBodyRadius) / 1000).toFixed(0)}km`, 10, 35);
      ctx.fillText(`Speed: ${(orbitalVelocity / 1000).toFixed(2)}km/s`, 10, 50);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [semiMajorAxis, eccentricity, orbitalPeriod, orbitalVelocity, centralBody, timeScale, isRunning, centralBodyRadius]);

  const handleReset = () => {
    setSemiMajorAxis(6.6e6);
    setEccentricity(0.001);
    setInclination(51.6);
    setCentralBody('earth');
  };

  const handleExport = () => {
    const data = {
      timestamp: new Date().toISOString(),
      parameters: {
        semiMajorAxis,
        eccentricity,
        inclination,
        centralBody,
      },
      calculations: {
        orbitalPeriod: orbitalPeriod.toFixed(2),
        orbitalVelocity: orbitalVelocity.toFixed(2),
        periapsis: periapsis.toFixed(0),
        apoapsis: apoapsis.toFixed(0),
        periapsisAltitude: periapsisAltitude.toFixed(0),
        apoapsisAltitude: apoapsisAltitude.toFixed(0),
      },
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orbital-mechanics-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <button
            onClick={() => navigate('/astrolab/orbital-mechanics')}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to AstroLab
          </button>

          <h1 className="text-5xl font-bold text-white mb-4">Orbital Mechanics Simulator</h1>
          <p className="text-xl text-slate-300">
            Real-time visualization of orbital dynamics and Keplerian mechanics
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="bg-slate-800/50 border-slate-700 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Zap size={20} className="text-cyan-400" />
                Parameters
              </h2>

              <div className="space-y-6">
                {/* Central Body Selection */}
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Central Body</label>
                  <select
                    value={centralBody}
                    onChange={(e) => setCentralBody(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="earth">Earth</option>
                    <option value="sun">Sun</option>
                    <option value="moon">Moon</option>
                  </select>
                </div>

                {/* Semi-Major Axis */}
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">
                    Semi-Major Axis
                  </label>
                  <input
                    type="range"
                    min={centralBodyRadius * 1.1}
                    max={centralBodyRadius * 10}
                    step={centralBodyRadius * 0.1}
                    value={semiMajorAxis}
                    onChange={(e) => setSemiMajorAxis(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-right text-sm text-cyan-300 font-mono">
                    {(semiMajorAxis / 1000).toFixed(0)} km
                  </div>
                </div>

                {/* Eccentricity */}
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Eccentricity</label>
                  <input
                    type="range"
                    min="0"
                    max="0.9"
                    step="0.01"
                    value={eccentricity}
                    onChange={(e) => setEccentricity(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-right text-sm text-cyan-300 font-mono">{eccentricity.toFixed(3)}</div>
                </div>

                {/* Inclination */}
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Inclination</label>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    step="1"
                    value={inclination}
                    onChange={(e) => setInclination(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-right text-sm text-cyan-300 font-mono">{inclination.toFixed(1)}°</div>
                </div>

                {/* Time Scale */}
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Time Scale</label>
                  <input
                    type="range"
                    min="100"
                    max="10000"
                    step="100"
                    value={timeScale}
                    onChange={(e) => setTimeScale(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-right text-sm text-cyan-300 font-mono">{timeScale}x</div>
                </div>

                {/* Controls */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsRunning(!isRunning)}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white flex items-center justify-center gap-2"
                  >
                    {isRunning ? <Pause size={16} /> : <Play size={16} />}
                    {isRunning ? 'Pause' : 'Play'}
                  </Button>
                  <Button
                    onClick={handleReset}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={16} />
                    Reset
                  </Button>
                </div>

                <Button
                  onClick={handleExport}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Export
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Visualization & Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Canvas */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="w-full border border-slate-700 rounded bg-slate-900"
              />
            </Card>

            {/* Orbital Elements */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">Orbital Period</h4>
                <div className="text-2xl font-bold text-white">
                  {orbitalPeriod < 3600
                    ? `${(orbitalPeriod / 60).toFixed(1)} min`
                    : orbitalPeriod < 86400
                    ? `${(orbitalPeriod / 3600).toFixed(1)} h`
                    : `${(orbitalPeriod / 86400).toFixed(2)} days`}
                </div>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">Orbital Velocity</h4>
                <div className="text-2xl font-bold text-white">{(orbitalVelocity / 1000).toFixed(2)} km/s</div>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">Periapsis Altitude</h4>
                <div className="text-2xl font-bold text-white">{(periapsisAltitude / 1000).toFixed(0)} km</div>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">Apoapsis Altitude</h4>
                <div className="text-2xl font-bold text-white">{(apoapsisAltitude / 1000).toFixed(0)} km</div>
              </Card>
            </div>

            {/* Physics Equations */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-4">Key Equations</h4>
              <div className="space-y-3 text-sm text-slate-300 font-mono">
                <div>
                  <span className="text-cyan-400">Kepler's 3rd Law:</span> T² = (4π²/GM) × a³
                </div>
                <div>
                  <span className="text-cyan-400">Orbital Velocity:</span> v = √(GM/r)
                </div>
                <div>
                  <span className="text-cyan-400">Specific Energy:</span> ε = -GM/(2a)
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
