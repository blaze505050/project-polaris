import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, Eye, Activity, Sliders, Sparkles, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAeroForgeStore } from '@/stores/aeroforgeStore';
import {
  computeExoplanetTransitLightCurve,
  computeRadialVelocityCurve,
  type TransitLightCurveResult,
  type RadialVelocityCurveResult,
} from '@/services/physicsEngine';

// Workstation Components
import EngineeringStateBadge from '@/components/ui/EngineeringStateBadge';
import SimulationMetadataPanel, { type SimulationMetadata } from '@/components/ui/SimulationMetadataPanel';
import ExperimentHistoryLogger from '@/components/ui/ExperimentHistoryLogger';

const EXOPLANET_PRESETS = [
  { name: 'TRAPPIST-1e (Earth-like)', rp: 0.92, mp: 0.69, a: 0.029, period: 6.1, e: 0.007, inc: 89.7, starR: 0.12, starM: 0.09 },
  { name: 'Kepler-186f (Habitable Zone)', rp: 1.17, mp: 1.4, a: 0.432, period: 129.9, e: 0.04, inc: 89.9, starR: 0.52, starM: 0.54 },
  { name: 'HD 209458 b (Osiris Hot Jupiter)', rp: 15.1, mp: 219.0, a: 0.047, period: 3.52, e: 0.01, inc: 86.6, starR: 1.15, starM: 1.11 },
  { name: 'Super-Earth (High Eccentricity)', rp: 2.4, mp: 6.5, a: 0.12, period: 14.2, e: 0.45, inc: 88.5, starR: 0.8, starM: 0.75 },
];

const EXOPLANET_METADATA: SimulationMetadata = {
  title: 'Exoplanet Discovery Engine (Transit & Radial Velocity)',
  solverName: 'Mandel-Agol Transit & Keplerian Doppler Wobble Model',
  version: '2.4.0',
  governingEquations: [
    'Transit Flux Depth: ΔF = (R_p / R_s)²  [dimensionless]',
    'Quadratic Limb Darkening: I(μ) = 1 - u1*(1-μ) - u2*(1-μ)²  [normalized intensity]',
    'Radial Velocity Semi-Amplitude: K = (2πG / P)^(1/3) * (M_p sin(i) / (M_s + M_p)^(2/3)) / √(1 - e²)  [m/s]',
    'Equilibrium Temperature: T_eq = T_s * √(R_s / 2a) * (1 - A_B)^(1/4)  [K]',
  ],
  assumptions: [
    'Planetary companion models assume point-mass Keplerian orbital dynamics',
    'Stellar limb darkening parameterized via quadratic law (u1=0.3, u2=0.2)',
    'Photometric light curve noise modeled as 100 ppm Gaussian white noise (Kepler/TESS baseline)',
    'Keplerian radial velocity curves incorporate orbital eccentricity distortion',
  ],
  validityBounds: [
    'Planet Radius: 0.1 R_Earth to 30.0 R_Earth',
    'Planet Mass: 0.01 M_Earth to 1000 M_Earth',
    'Orbital Period P: 0.1 days to 1000 days',
  ],
  unitsTable: [
    { symbol: 'ΔF', name: 'Transit Dip Depth', unit: 'ppm', description: 'Flux drop in parts per million (1% = 10,000 ppm)' },
    { symbol: 'K', name: 'RV Wobble Semi-Amplitude', unit: 'm/s', description: 'Stellar Doppler velocity variation amplitude' },
    { symbol: 'R_p', name: 'Planet Radius', unit: 'R_Earth', description: 'Planet radius relative to Earth (6,371 km)' },
    { symbol: 'M_p', name: 'Planet Mass', unit: 'M_Earth', description: 'Planet mass relative to Earth (5.972e24 kg)' },
  ],
  references: [
    'Mandel, K., & Agol, E. (2002). Analytic light curves for planetary transit searches. Astrophysical Journal, 580(2), L171.',
    'NASA Exoplanet Archive & MAST Lightkurve Science Pipelines.',
    'Perryman, M. (2018). The Exoplanet Handbook (2nd ed.). Cambridge University Press.',
  ],
};

export default function ExoplanetDiscoveryEngine() {
  const navigate = useNavigate();
  const transitCanvasRef = useRef<HTMLCanvasElement>(null);
  const rvCanvasRef = useRef<HTMLCanvasElement>(null);
  const userMode = useAeroForgeStore((s) => s.userMode);

  const [presetIdx, setPresetIdx] = useState(0);
  const selectedPreset = EXOPLANET_PRESETS[presetIdx];

  const [planetRadius, setPlanetRadius] = useState(selectedPreset.rp); // Earth radii
  const [planetMass, setPlanetMass] = useState(selectedPreset.mp);     // Earth masses
  const [semiMajorAxis, setSemiMajorAxis] = useState(selectedPreset.a); // AU
  const [periodDays, setPeriodDays] = useState(selectedPreset.period);  // Days
  const [eccentricity, setEccentricity] = useState(selectedPreset.e);
  const [inclination, setInclination] = useState(selectedPreset.inc);
  const [starRadius, setStarRadius] = useState(selectedPreset.starR);   // Solar radii
  const [starMass, setStarMass] = useState(selectedPreset.starM);     // Solar masses

  const applyPreset = (idx: number) => {
    setPresetIdx(idx);
    const p = EXOPLANET_PRESETS[idx];
    setPlanetRadius(p.rp);
    setPlanetMass(p.mp);
    setSemiMajorAxis(p.a);
    setPeriodDays(p.period);
    setEccentricity(p.e);
    setInclination(p.inc);
    setStarRadius(p.starR);
    setStarMass(p.starM);
  };

  // Computations
  const transitResult: TransitLightCurveResult = useMemo(() => {
    return computeExoplanetTransitLightCurve(planetRadius, starRadius, semiMajorAxis, inclination, periodDays);
  }, [planetRadius, starRadius, semiMajorAxis, inclination, periodDays]);

  const rvResult: RadialVelocityCurveResult = useMemo(() => {
    return computeRadialVelocityCurve(planetMass, starMass, periodDays, eccentricity, inclination);
  }, [planetMass, starMass, periodDays, eccentricity, inclination]);

  // Render Transit Light Curve Canvas
  useEffect(() => {
    const canvas = transitCanvasRef.current;
    if (!canvas || !transitResult.normalizedFlux.length) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const margin = { top: 30, right: 30, bottom: 40, left: 60 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    ctx.fillStyle = '#060B18';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 0.5;
    for (let x = margin.left; x <= margin.left + plotW; x += 50) {
      ctx.beginPath(); ctx.moveTo(x, margin.top); ctx.lineTo(x, margin.top + plotH); ctx.stroke();
    }

    const timeSpan = transitResult.timeDays[transitResult.timeDays.length - 1] - transitResult.timeDays[0];
    const minF = Math.min(...transitResult.normalizedFlux) - 0.0005;
    const maxF = 1.001;

    ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
    transitResult.timeDays.forEach((t, i) => {
      const flux = transitResult.normalizedFlux[i];
      const x = margin.left + ((t - transitResult.timeDays[0]) / timeSpan) * plotW;
      const y = margin.top + plotH - ((flux - minF) / (maxF - minF)) * plotH;
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(margin.left, margin.top, plotW, plotH);

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Time from Mid-Transit (days)', margin.left + plotW / 2, h - 10);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#00F0FF';
    ctx.fillText('― Photometric Light Curve (Mandel-Agol Model)', margin.left + 10, margin.top - 10);
  }, [transitResult]);

  // Render Radial Velocity Curve Canvas
  useEffect(() => {
    const canvas = rvCanvasRef.current;
    if (!canvas || !rvResult.stellarVelocityMS.length) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const margin = { top: 30, right: 30, bottom: 40, left: 60 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    ctx.fillStyle = '#060B18';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 0.5;
    for (let x = margin.left; x <= margin.left + plotW; x += 50) {
      ctx.beginPath(); ctx.moveTo(x, margin.top); ctx.lineTo(x, margin.top + plotH); ctx.stroke();
    }

    const timeSpan = rvResult.timeDays[rvResult.timeDays.length - 1] - rvResult.timeDays[0];
    const maxV = Math.max(1, Math.abs(rvResult.semiAmplitudeMS) * 1.3);

    const zeroY = margin.top + plotH / 2;
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, zeroY);
    ctx.lineTo(margin.left + plotW, zeroY);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 0, 122, 0.6)';
    rvResult.timeDays.forEach((t, i) => {
      const vVal = rvResult.stellarVelocityMS[i];
      const x = margin.left + ((t - rvResult.timeDays[0]) / timeSpan) * plotW;
      const y = zeroY - (vVal / maxV) * (plotH / 2);
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(margin.left, margin.top, plotW, plotH);

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Orbital Phase Time (days)', margin.left + plotW / 2, h - 10);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#FF007A';
    ctx.fillText('― Stellar Doppler Wobble Radial Velocity (m/s)', margin.left + 10, margin.top - 10);
  }, [rvResult]);

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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Exoplanet Discovery Engine — Transit & Radial Velocity
              </h1>
              <p className="text-sm text-white/50 font-mono">Mandel-Agol light curve model · Stellar Doppler wobble semi-amplitude K</p>
            </div>
          </div>

          <EngineeringStateBadge
            status="CONVERGED"
            solverName="Mandel-Agol & Keplerian RV Solver"
            timeStep="Δt=0.01d"
            tolerance="1e-5"
          />
        </div>

        {/* Presets */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {EXOPLANET_PRESETS.map((p, idx) => (
            <button key={p.name} onClick={() => applyPreset(idx)}
              className={`px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 whitespace-nowrap ${
                presetIdx === idx
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-white/[0.03] text-white/50 border border-white/5 hover:bg-white/5'
              }`}>
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              {p.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dual Canvases */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl overflow-hidden border border-white/10 bg-[#080d1a]"
              style={{ boxShadow: '0 0 50px rgba(0,240,255,0.05)' }}>
              <canvas ref={transitCanvasRef} className="w-full" style={{ height: '240px' }} />
            </div>

            <div className="rounded-xl overflow-hidden border border-white/10 bg-[#080d1a]"
              style={{ boxShadow: '0 0 50px rgba(255,0,122,0.05)' }}>
              <canvas ref={rvCanvasRef} className="w-full" style={{ height: '240px' }} />
            </div>
          </div>

          {/* Controls & Planetary Metrics */}
          <div className="space-y-4">
            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4" style={{ backdropFilter: 'blur(20px)' }}>
              <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" /> Planetary Controls
              </h3>

              <div className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/40">Planet Radius R_p [R_Earth]</span>
                  <span className="font-mono text-cyan-400">{planetRadius} R⊕</span>
                </div>
                <input type="range" min={0.5} max={25.0} step={0.1} value={planetRadius}
                  onChange={(e) => setPlanetRadius(Number(e.target.value))}
                  className="w-full h-1 rounded-full appearance-none bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400" />
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/40">Planet Mass M_p [M_Earth]</span>
                  <span className="font-mono text-pink-400">{planetMass} M⊕</span>
                </div>
                <input type="range" min={0.1} max={500.0} step={0.5} value={planetMass}
                  onChange={(e) => setPlanetMass(Number(e.target.value))}
                  className="w-full h-1 rounded-full appearance-none bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-400" />
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/40">Semi-Major Axis a [AU]</span>
                  <span className="font-mono text-amber-400">{semiMajorAxis} AU</span>
                </div>
                <input type="range" min={0.01} max={2.0} step={0.005} value={semiMajorAxis}
                  onChange={(e) => setSemiMajorAxis(Number(e.target.value))}
                  className="w-full h-1 rounded-full appearance-none bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400" />
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/40">Orbital Eccentricity e [dimensionless]</span>
                  <span className="font-mono text-purple-400">{eccentricity}</span>
                </div>
                <input type="range" min={0} max={0.8} step={0.01} value={eccentricity}
                  onChange={(e) => setEccentricity(Number(e.target.value))}
                  className="w-full h-1 rounded-full appearance-none bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-400" />
              </div>
            </div>

            {/* Observed Metrics */}
            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4" style={{ backdropFilter: 'blur(20px)' }}>
              <h3 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Detected Signal Telemetry
              </h3>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between border-b border-white/5 py-1">
                  <span className="text-white/40">Transit Dip Depth [ΔF]</span>
                  <span className="text-cyan-400 font-bold">{transitResult.transitDepthPpm.toFixed(0)} ppm</span>
                </div>
                <div className="flex justify-between border-b border-white/5 py-1">
                  <span className="text-white/40">Transit Duration</span>
                  <span className="text-white">{transitResult.durationHours.toFixed(2)} hours</span>
                </div>
                <div className="flex justify-between border-b border-white/5 py-1">
                  <span className="text-white/40">RV Wobble Amplitude [K]</span>
                  <span className="text-pink-400 font-bold">{rvResult.semiAmplitudeMS.toFixed(2)} m/s</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Experiment Logger */}
        <ExperimentHistoryLogger
          moduleName="Exoplanet Discovery Engine"
          currentInputs={{ planetRadius, planetMass, semiMajorAxis, periodDays, eccentricity, inclination }}
          currentOutputs={{ transitDepthPpm: transitResult.transitDepthPpm, durationHours: transitResult.durationHours, semiAmplitudeK_m_s: rvResult.semiAmplitudeMS }}
        />

        {/* Physics Documentation */}
        <SimulationMetadataPanel metadata={EXOPLANET_METADATA} />
      </div>
      <Footer />
    </div>
  );
}
