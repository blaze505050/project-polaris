import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Sun, AlertOctagon, Activity, Radio, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAeroForgeStore } from '@/stores/aeroforgeStore';
import { computeSpaceWeatherRisk, type SpaceWeatherStatus } from '@/services/physicsEngine';

// Workstation Components
import EngineeringStateBadge from '@/components/ui/EngineeringStateBadge';
import SimulationMetadataPanel, { type SimulationMetadata } from '@/components/ui/SimulationMetadataPanel';
import ExperimentHistoryLogger from '@/components/ui/ExperimentHistoryLogger';

const SPACE_WEATHER_METADATA: SimulationMetadata = {
  title: 'Space Weather & SAA Fault Management Model',
  solverName: 'Geomagnetic Dipole & Proton Trapping Integrator',
  version: '2.4.0',
  governingEquations: [
    'Geomagnetic Dipole Radius: R(θ) = R_MP * sin²(θ)  [Earth Radii]',
    'South Atlantic Anomaly Bounds: 15°S ≤ φ ≤ 45°S, 90°W ≤ λ ≤ 30°E, 200km ≤ h ≤ 1200km',
    'Single Event Upset (SEU) Rate: SEU_rate = 0.05 * (h / 400)^1.5 * SAA_factor * Kp_factor  [bit-flips/day]',
    'Radiation Absorbed Dose: D = SEU_rate * 12.5  [mrad/day]',
  ],
  assumptions: [
    'Geomagnetic dipole axis tilted by 11.5° relative to Earth geographic axis',
    'South Atlantic Anomaly modeled as an elliptical high-energy (>10 MeV) proton trapping region',
    'CME transit velocity modeled between 400 km/s and 1200 km/s',
    'Autonomous safe-mode trigger evaluates SAA intersection OR solar proton event (Kp ≥ 7)',
  ],
  validityBounds: [
    'Low Earth Orbit (LEO) and Medium Earth Orbit (MEO) altitude regime: 200 km to 2,000 km',
    'Geomagnetic Kp index range: 0 to 9',
    'Solar X-ray flux classes: A, B, C, M, X',
  ],
  unitsTable: [
    { symbol: 'Kp', name: 'Planetary K-Index', unit: 'dimensionless', description: 'Quasi-logarithmic 3-hour geomagnetic activity scale (0 to 9)' },
    { symbol: 'SEU', name: 'Single Event Upset Rate', unit: 'bit-flips/day', description: 'Predicted cosmic ray & proton induced memory bit flips' },
    { symbol: 'v_sw', name: 'Solar Wind Velocity', unit: 'km/s', description: 'Bulk speed of solar plasma stream at 1 AU' },
    { symbol: 'D', name: 'Ionizing Radiation Dose', unit: 'mrad/day', description: 'Cumulative absorbed radiation dose' },
  ],
  references: [
    'NOAA Space Weather Prediction Center (SWPC) Solar Protons Model Specification.',
    'AP8 / AE8 Trapped Particle Radiation Environment Models (NASA Goddard).',
    'ESA Space Weather Network & Spacecraft Fault Management Guidelines.',
  ],
};

export default function SpaceEnvironmentHeliophysics() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const userMode = useAeroForgeStore((s) => s.userMode);

  const [satLat, setSatLat] = useState(-30);
  const [satLon, setSatLon] = useState(-50);
  const [satAltKm, setSatAltKm] = useState(420);
  const [kpIndex, setKpIndex] = useState(5);
  const [cmeActive, setCmeActive] = useState(false);

  // Compute Space Weather Risk
  const weatherStatus: SpaceWeatherStatus = useMemo(() => {
    return computeSpaceWeatherRisk(satLat, satLon, satAltKm, kpIndex, cmeActive);
  }, [satLat, satLon, satAltKm, kpIndex, cmeActive]);

  // Render Earth SAA Map & Radiation Belts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.fillStyle = '#060B18';
    ctx.fillRect(0, 0, w, h);

    const lonToX = (lon: number) => cx + (lon / 180) * (w * 0.45);
    const latToY = (lat: number) => cy - (lat / 90) * (h * 0.4);

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(cx - w * 0.45, cy - h * 0.4, w * 0.9, h * 0.8);

    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.45, cy); ctx.lineTo(cx + w * 0.45, cy);
    ctx.moveTo(cx, cy - h * 0.4); ctx.lineTo(cx, cy + h * 0.4);
    ctx.stroke();

    const saaX1 = lonToX(-90);
    const saaX2 = lonToX(30);
    const saaY1 = latToY(-15);
    const saaY2 = latToY(-45);

    const saaGrad = ctx.createRadialGradient((saaX1 + saaX2) / 2, (saaY1 + saaY2) / 2, 10, (saaX1 + saaX2) / 2, (saaY1 + saaY2) / 2, 80);
    saaGrad.addColorStop(0, 'rgba(239, 68, 68, 0.4)');
    saaGrad.addColorStop(1, 'rgba(239, 68, 68, 0.05)');

    ctx.fillStyle = saaGrad;
    ctx.beginPath();
    ctx.fillRect(saaX1, saaY1, saaX2 - saaX1, saaY2 - saaY1);

    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(saaX1, saaY1, saaX2 - saaX1, saaY2 - saaY1);
    ctx.setLineDash([]);

    ctx.fillStyle = '#EF4444';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText('SAA High Radiation Zone', saaX1 + 10, saaY1 + 20);

    const satX = lonToX(satLon);
    const satY = latToY(satLat);

    ctx.fillStyle = weatherStatus.saaIntersection ? '#EF4444' : '#00F0FF';
    ctx.beginPath();
    ctx.arc(satX, satY, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = weatherStatus.saaIntersection ? '#EF4444' : '#00F0FF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(satX, satY, 12, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText(`Spacecraft (${satLat}°, ${satLon}°)`, satX + 15, satY + 3);
  }, [satLat, satLon, weatherStatus]);

  const solverStatus = weatherStatus.saaIntersection ? 'WARNING' : 'CONVERGED';

  return (
    <div className="min-h-screen bg-[#060B18] text-white">
      <Header />
      <div className="max-w-[120rem] mx-auto px-4 md:px-[4%] py-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/astrolab')} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Space Environment & Space Weather (Heliophysics)
              </h1>
              <p className="text-sm text-white/50 font-mono">SAA radiation belt mapping · SEU prediction · Autonomous safe-mode fault manager</p>
            </div>
          </div>

          <EngineeringStateBadge
            status={solverStatus}
            solverName="AP8/AE8 Geomagnetic Proton Trapping"
            timeStep="Real-time"
            tolerance="1e-3"
          />
        </div>

        {/* Hazard Indicator */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            weatherStatus.saaIntersection ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-white/[0.03] border-white/10 text-white/60'
          }`}>
            <div>
              <span className="text-xs block font-mono">SAA INTERSECTION</span>
              <span className="text-sm font-bold font-mono">{weatherStatus.saaIntersection ? 'INSIDE HAZARD ZONE' : 'Nominal Orbit'}</span>
            </div>
            <AlertOctagon className="w-6 h-6" />
          </div>

          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            weatherStatus.safeModeTriggered ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-white/[0.03] border-white/10 text-white/60'
          }`}>
            <div>
              <span className="text-xs block font-mono">SPACECRAFT FAULT MODE</span>
              <span className="text-sm font-bold font-mono">{weatherStatus.safeModeTriggered ? 'AUTONOMOUS SAFE MODE' : 'Normal Operation'}</span>
            </div>
            <Shield className="w-6 h-6" />
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-white/60">
            <div>
              <span className="text-xs block font-mono">SOLAR X-RAY FLUX</span>
              <span className="text-sm font-bold font-mono text-amber-400">Class {weatherStatus.xrayFluxClass} Flare</span>
            </div>
            <Sun className="w-6 h-6 text-amber-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Map Canvas */}
          <div className="lg:col-span-2">
            <div className="rounded-xl overflow-hidden border border-white/10 bg-[#080d1a]"
              style={{ boxShadow: '0 0 50px rgba(245,158,11,0.05)' }}>
              <canvas ref={canvasRef} className="w-full" style={{ height: '480px' }} />
            </div>
          </div>

          {/* Controls & Space Weather Telemetry */}
          <div className="space-y-4">
            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4" style={{ backdropFilter: 'blur(20px)' }}>
              <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" /> Space Weather Controls
              </h3>

              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/40">Geomagnetic Kp-Index [0-9]</span>
                  <span className="font-mono text-amber-400">{kpIndex}</span>
                </div>
                <input type="range" min={0} max={9} step={1} value={kpIndex}
                  onChange={(e) => setKpIndex(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400" />
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/40">Satellite Latitude φ [°]</span>
                  <span className="font-mono text-amber-400">{satLat}°</span>
                </div>
                <input type="range" min={-90} max={90} step={1} value={satLat}
                  onChange={(e) => setSatLat(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400" />
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/40">Satellite Longitude λ [°]</span>
                  <span className="font-mono text-amber-400">{satLon}°</span>
                </div>
                <input type="range" min={-180} max={180} step={1} value={satLon}
                  onChange={(e) => setSatLon(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400" />
              </div>

              <label className="flex items-center justify-between text-xs text-white/60 cursor-pointer pt-2 border-t border-white/5">
                <span>Active Coronal Mass Ejection (CME) Storm</span>
                <input type="checkbox" checked={cmeActive} onChange={(e) => setCmeActive(e.target.checked)} className="rounded border-white/20 text-amber-500" />
              </label>
            </div>

            {/* Radiation Telemetry */}
            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4" style={{ backdropFilter: 'blur(20px)' }}>
              <h3 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Radiation & SEU Telemetry
              </h3>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between border-b border-white/5 py-1">
                  <span className="text-white/40">Solar Wind Velocity [v_sw]</span>
                  <span className="text-amber-400 font-bold">{weatherStatus.solarWindSpeed} km/s</span>
                </div>
                <div className="flex justify-between border-b border-white/5 py-1">
                  <span className="text-white/40">SEU Bit Flip Rate</span>
                  <span className={`font-bold ${weatherStatus.seuRatePerDay > 1 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {weatherStatus.seuRatePerDay} / day
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 py-1">
                  <span className="text-white/40">Radiation Dose Rate</span>
                  <span className="text-white">{weatherStatus.radiationDoseMrad} mrad/day</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Experiment Logger */}
        <ExperimentHistoryLogger
          moduleName="Space Environment & Heliophysics"
          currentInputs={{ satLat, satLon, satAltKm, kpIndex, cmeActive }}
          currentOutputs={{ saaIntersection: weatherStatus.saaIntersection ? 'INSIDE_SAA' : 'NOMINAL', seuRatePerDay: weatherStatus.seuRatePerDay, safeModeTriggered: weatherStatus.safeModeTriggered ? 'SAFE_MODE_ACTIVE' : 'NOMINAL' }}
        />

        {/* Physics Documentation */}
        <SimulationMetadataPanel metadata={SPACE_WEATHER_METADATA} />
      </div>
      <Footer />
    </div>
  );
}
