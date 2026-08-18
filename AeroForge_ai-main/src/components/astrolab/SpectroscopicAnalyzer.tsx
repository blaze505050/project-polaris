import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Activity, Search, Sparkles, Filter, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAeroForgeStore } from '@/stores/aeroforgeStore';
import {
  generateSyntheticSpectrum,
  computeDopplerShift,
  KNOWN_SPECTRAL_LINES,
  type SpectrumDataPoint,
} from '@/services/physicsEngine';

// Workstation Components
import EngineeringStateBadge from '@/components/ui/EngineeringStateBadge';
import SimulationMetadataPanel, { type SimulationMetadata } from '@/components/ui/SimulationMetadataPanel';
import ExperimentHistoryLogger from '@/components/ui/ExperimentHistoryLogger';

const TARGET_PRESETS: Array<'G-star (Sun)' | 'O-star' | 'M-dwarf' | 'Quasar' | 'Exoplanet Atmosphere'> = [
  'G-star (Sun)',
  'O-star',
  'M-dwarf',
  'Quasar',
  'Exoplanet Atmosphere',
];

const SPECTRO_METADATA: SimulationMetadata = {
  title: 'Spectroscopic Analyzer & Doppler Shift Engine',
  solverName: 'Planck Continuum & Relativistic Doppler Integrator',
  version: '2.4.0',
  governingEquations: [
    'Planck Blackbody Radiation: B(λ, T) = (2hc²) / (λ⁵ * (e^(hc / λkT) - 1))  [W/m³/sr]',
    'Cosmological Redshift: z = (λ_obs - λ_rest) / λ_rest  [unitless]',
    'Relativistic Radial Velocity: v_rad = c * ((1+z)² - 1) / ((1+z)² + 1)  [km/s]',
    'Doppler Shift: λ_obs = λ_rest * (1 + z)  [nm]',
  ],
  assumptions: [
    'Local Thermodynamic Equilibrium (LTE) for stellar continuum modeling',
    'Gaussian spectral absorption line profiles with natural and Doppler broadening',
    'Relativistic kinematic Doppler shift calculation (special & general relativity)',
    'Single-component velocity vector along line of sight',
  ],
  validityBounds: [
    'Wavelength spectrum band: 380 nm to 950 nm (Optical & Near-IR)',
    'Redshift range z: 0.0 to 1.5',
    'Signal-to-Noise Ratio (SNR): 5 to 200',
  ],
  unitsTable: [
    { symbol: 'λ', name: 'Wavelength', unit: 'nm', description: 'Light wavelength in nanometers (1 nm = 10 Å)' },
    { symbol: 'z', name: 'Redshift Parameter', unit: 'dimensionless', description: 'Fractional shift in wavelength' },
    { symbol: 'v_rad', name: 'Radial Velocity', unit: 'km/s', description: 'Velocity of astronomical target relative to observer along line of sight' },
    { symbol: 'SNR', name: 'Signal-to-Noise Ratio', unit: 'dimensionless', description: 'Ratio of signal power to background noise' },
  ],
  references: [
    'IRAF (Image Reduction and Analysis Facility) Data Pipeline Specification.',
    'JWST NIRSpec & Hubble STIS Spectroscopic Calibration Guidelines.',
    'Rybicki, G. B., & Lightman, A. P. (2004). Radiative Processes in Astrophysics. Wiley-VCH.',
  ],
};

export default function SpectroscopicAnalyzer() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const userMode = useAeroForgeStore((s) => s.userMode);

  const [targetType, setTargetType] = useState<'G-star (Sun)' | 'O-star' | 'M-dwarf' | 'Quasar' | 'Exoplanet Atmosphere'>('G-star (Sun)');
  const [redshift, setRedshift] = useState<number>(0);
  const [snr, setSnr] = useState<number>(50);
  const [showLineOverlays, setShowLineOverlays] = useState<boolean>(true);

  // Manual Doppler Calculator State
  const [obsWavelength, setObsWavelength] = useState<number>(658.5); // nm
  const [restWavelength, setRestWavelength] = useState<number>(656.28); // nm (H-alpha)

  // Generate Spectrum
  const spectrum: SpectrumDataPoint[] = useMemo(() => {
    return generateSyntheticSpectrum(targetType, redshift, snr);
  }, [targetType, redshift, snr]);

  // Doppler Calculation
  const dopplerResult = useMemo(() => {
    return computeDopplerShift(obsWavelength, restWavelength);
  }, [obsWavelength, restWavelength]);

  // Render 1D Spectrum
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !spectrum.length) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const margin = { top: 40, right: 30, bottom: 50, left: 60 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    ctx.fillStyle = '#060B18';
    ctx.fillRect(0, 0, w, h);

    const minW = spectrum[0].wavelength;
    const maxW = spectrum[spectrum.length - 1].wavelength;
    const maxFlux = Math.max(...spectrum.map((p) => p.flux));

    const rainbowGrad = ctx.createLinearGradient(margin.left, 0, margin.left + plotW, 0);
    rainbowGrad.addColorStop(0, 'rgba(147, 51, 234, 0.2)');
    rainbowGrad.addColorStop(0.2, 'rgba(59, 130, 246, 0.2)');
    rainbowGrad.addColorStop(0.4, 'rgba(16, 185, 129, 0.2)');
    rainbowGrad.addColorStop(0.6, 'rgba(245, 158, 11, 0.2)');
    rainbowGrad.addColorStop(0.8, 'rgba(239, 68, 68, 0.2)');
    rainbowGrad.addColorStop(1, 'rgba(180, 83, 9, 0.2)');

    ctx.fillStyle = rainbowGrad;
    ctx.fillRect(margin.left, margin.top, plotW, plotH);

    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 0.5;
    for (let x = margin.left; x <= margin.left + plotW; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, margin.top); ctx.lineTo(x, margin.top + plotH); ctx.stroke();
    }
    for (let y = margin.top; y <= margin.top + plotH; y += 40) {
      ctx.beginPath(); ctx.moveTo(margin.left, y); ctx.lineTo(margin.left + plotW, y); ctx.stroke();
    }

    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    spectrum.forEach((p, i) => {
      const x = margin.left + ((p.wavelength - minW) / (maxW - minW)) * plotW;
      const y = margin.top + plotH - (p.flux / maxFlux) * plotH * 0.85;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    if (showLineOverlays) {
      KNOWN_SPECTRAL_LINES.forEach((line) => {
        const shiftedW = line.restWavelength * (1 + redshift);
        if (shiftedW >= minW && shiftedW <= maxW) {
          const lx = margin.left + ((shiftedW - minW) / (maxW - minW)) * plotW;

          ctx.strokeStyle = line.element === 'Hydrogen' ? '#FF007A' : '#F59E0B';
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(lx, margin.top);
          ctx.lineTo(lx, margin.top + plotH);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = line.element === 'Hydrogen' ? '#FF007A' : '#F59E0B';
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(line.name, lx, margin.top - 8);
        }
      });
    }

    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(margin.left, margin.top, plotW, plotH);

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Wavelength λ (nm)', margin.left + plotW / 2, h - 12);

    for (let w = 400; w <= 900; w += 100) {
      const x = margin.left + ((w - minW) / (maxW - minW)) * plotW;
      ctx.fillText(`${w}nm`, x, margin.top + plotH + 20);
    }
  }, [spectrum, redshift, showLineOverlays]);

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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Spectroscopic Analyzer — Chemical Fingerprinting
              </h1>
              <p className="text-sm text-white/50 font-mono">1D spectrum analysis · Relativistic Doppler shift · Balmer & Fraunhofer line matching</p>
            </div>
          </div>

          <EngineeringStateBadge
            status="CONVERGED"
            solverName="Planck Continuum & Relativistic Doppler"
            timeStep="Δλ=0.5nm"
            tolerance="1e-5"
          />
        </div>

        {/* Target Presets */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TARGET_PRESETS.map((t) => (
            <button key={t} onClick={() => setTargetType(t)}
              className={`px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 whitespace-nowrap ${
                targetType === t
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-white/[0.03] text-white/50 border border-white/5 hover:bg-white/5'
              }`}>
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Spectrum Canvas */}
          <div className="lg:col-span-2">
            <div className="rounded-xl overflow-hidden border border-white/10 bg-[#080d1a]"
              style={{ boxShadow: '0 0 50px rgba(168,85,247,0.05)' }}>
              <canvas ref={canvasRef} className="w-full" style={{ height: '480px' }} />
            </div>
          </div>

          {/* Controls & Doppler Tool */}
          <div className="space-y-4">
            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4" style={{ backdropFilter: 'blur(20px)' }}>
              <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4 text-purple-400" /> Spectrum Controls
              </h3>

              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/40">Redshift z [dimensionless]</span>
                  <span className="font-mono text-purple-400">{redshift.toFixed(3)}</span>
                </div>
                <input type="range" min={0} max={1.5} step={0.01} value={redshift}
                  onChange={(e) => setRedshift(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-400" />
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/40">Signal-to-Noise Ratio [SNR]</span>
                  <span className="font-mono text-purple-400">{snr}</span>
                </div>
                <input type="range" min={5} max={200} step={5} value={snr}
                  onChange={(e) => setSnr(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-400" />
              </div>

              <label className="flex items-center justify-between text-xs text-white/60 cursor-pointer pt-2 border-t border-white/5">
                <span>Overlay Spectral Line Guides</span>
                <input type="checkbox" checked={showLineOverlays} onChange={(e) => setShowLineOverlays(e.target.checked)} className="rounded border-white/20 text-purple-500" />
              </label>
            </div>

            {/* Doppler Calculator */}
            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4" style={{ backdropFilter: 'blur(20px)' }}>
              <h3 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" /> Relativistic Doppler Calculator
              </h3>
              <div className="space-y-2 mb-3">
                <div>
                  <label className="text-xs text-white/40 block mb-1">Observed Wavelength λ_obs [nm]</label>
                  <input type="number" step="0.01" value={obsWavelength} onChange={(e) => setObsWavelength(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-white/40 block mb-1">Rest Wavelength λ₀ [nm]</label>
                  <input type="number" step="0.01" value={restWavelength} onChange={(e) => setRestWavelength(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none" />
                </div>
              </div>

              <div className="space-y-1.5 font-mono text-xs border-t border-white/5 pt-2">
                <div className="flex justify-between">
                  <span className="text-white/40">Redshift z</span>
                  <span className="text-purple-400 font-bold">{dopplerResult.redshift.toFixed(5)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Radial Velocity [v_rad]</span>
                  <span className="text-cyan-400 font-bold">{dopplerResult.radialVelocityKmS.toFixed(2)} km/s</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Experiment Logger */}
        <ExperimentHistoryLogger
          moduleName="Spectroscopic Analyzer"
          currentInputs={{ targetType, redshift, snr, obsWavelength, restWavelength }}
          currentOutputs={{ z: dopplerResult.redshift, v_rad_km_s: dopplerResult.radialVelocityKmS }}
        />

        {/* Physics Documentation */}
        <SimulationMetadataPanel metadata={SPECTRO_METADATA} />
      </div>
      <Footer />
    </div>
  );
}
