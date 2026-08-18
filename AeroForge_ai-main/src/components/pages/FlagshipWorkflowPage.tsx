import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Wind,
  Cloud,
  Sliders,
  BarChart3,
  Target,
  FileText,
  Share2,
  Sparkles,
  ChevronRight,
  RotateCcw,
  Zap,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeatureStatusBadge from '@/components/ui/FeatureStatusBadge';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useAeroForgeStore } from '@/stores/aeroforgeStore';
import { useToastStore } from '@/stores/toastStore';
import { publicArtifactService } from '@/services/publicArtifactService';
import {
  generateNACA4Digit,
  computeAirfoilCoefficients,
  computeISAAtmosphere,
  computeReynoldsNumber,
  computeMachNumberCalc,
} from '@/services/physicsEngine';

// ─── Workflow Steps ─────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, title: 'Requirements', desc: 'Define mission targets' },
  { id: 2, title: 'Airfoil Geometry', desc: 'NACA 4-digit generation' },
  { id: 3, title: 'Flight Envelope', desc: 'ISA altitude & velocity' },
  { id: 4, title: 'Aerodynamics', desc: 'Lift, drag & L/D analysis' },
  { id: 5, title: 'Experiment Matrix', desc: 'AoA parameter sweep' },
  { id: 6, title: 'Optimization', desc: 'Pareto efficiency search' },
  { id: 7, title: 'Notebook & Report', desc: 'Documentation & synthesis' },
];

export default function FlagshipWorkflowPage() {
  usePageMeta('Flagship Workflow — Aerodynamic Research', 'Guided end-to-end aerodynamic design, analysis, optimization, and documentation workflow.');

  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const { saveExperiment } = useAeroForgeStore();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Workflow State
  const [targetLd, setTargetLd] = useState<number>(16.0);
  const [naca, setNaca] = useState<string>('2412');
  const [altitude, setAltitude] = useState<number>(3000); // m
  const [velocity, setVelocity] = useState<number>(75); // m/s
  const [chord, setChord] = useState<number>(1.2); // m
  const [aoa, setAoa] = useState<number>(4.0); // degrees

  // Physics Solvers
  const atmosphere = useMemo(() => computeISAAtmosphere(altitude), [altitude]);
  const machRes = useMemo(() => computeMachNumberCalc(velocity, atmosphere.speedOfSound), [velocity, atmosphere]);
  const reynoldsRes = useMemo(() => computeReynoldsNumber(velocity, chord, atmosphere.density, atmosphere.dynamicViscosity), [velocity, chord, atmosphere]);
  const airfoilData = useMemo(() => generateNACA4Digit(naca), [naca]);
  const aeroCoeffs = useMemo(() => computeAirfoilCoefficients(aoa, airfoilData?.alphaZeroLift || 0, 0.008, 8, 0.85, machRes?.machNumber || 0.1), [aoa, airfoilData, machRes]);

  // Step 5 Sweep Data
  const sweepData = useMemo(() => {
    const data = [];
    for (let angle = -4; angle <= 16; angle += 2) {
      const res = computeAirfoilCoefficients(angle, airfoilData?.alphaZeroLift || 0, 0.008, 8, 0.85, machRes?.machNumber || 0.1);
      data.push({ angle, cl: res.cl, cd: res.cd, ld: res.ldRatio, isStalled: res.isStalled });
    }
    return data;
  }, [airfoilData, machRes]);

  // Step 6 Optimization Peak
  const optimalPoint = useMemo(() => {
    return sweepData.reduce((max, pt) => (pt.ld > max.ld ? pt : max), sweepData[0]);
  }, [sweepData]);

  // Handlers
  const handleSaveWorkflow = async () => {
    const expId = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const artifactPayload = {
      id: expId,
      name: `Flagship Aero Analysis — NACA ${naca}`,
      pillar: 'aerolab' as const,
      module: 'Flagship Aerodynamic Workflow',
      parameters: { naca, altitude: `${altitude}m`, velocity: `${velocity} m/s`, chord: `${chord}m`, aoa: `${aoa}°`, targetLd },
      results: {
        'Lift Coefficient (CL)': aeroCoeffs.cl.toFixed(4),
        'Drag Coefficient (CD)': aeroCoeffs.cd.toFixed(4),
        'L/D Ratio': aeroCoeffs.ldRatio.toFixed(2),
        'Target Met': aeroCoeffs.ldRatio >= targetLd ? 'YES' : 'NO',
      },
      notes: `Executed via Flagship Aerodynamic Research Workflow. Optimal AoA: ${optimalPoint.angle}° with max L/D = ${optimalPoint.ld.toFixed(2)}.`,
      timestamp: Date.now(),
    };

    saveExperiment({
      name: artifactPayload.name,
      pillar: artifactPayload.pillar,
      module: artifactPayload.module,
      parameters: artifactPayload.parameters,
      results: artifactPayload.results,
      userMode: 'professional',
      notes: artifactPayload.notes,
    });

    await publicArtifactService.publishArtifact(artifactPayload);

    addToast({ type: 'success', title: `Workflow saved! Public link: /share/${expId}` });
  };

  return (
    <div className="min-h-screen bg-[#060B18] text-white flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-8 w-full">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                FLAGSHIP ENGINEERING WEDGE
              </span>
              <FeatureStatusBadge status="available" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Aerodynamic Research Workflow</h1>
            <p className="text-xs text-white/50 mt-0.5">
              End-to-end digital engineering thread connecting requirements, geometry, atmospheric conditions, solver execution, optimization, and reporting.
            </p>
          </div>

          <button
            onClick={handleSaveWorkflow}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold transition-all shadow-lg shadow-cyan-500/10"
          >
            <Sparkles className="w-4 h-4" />
            Save & Publish Workflow
          </button>
        </div>

        {/* Stepper Bar */}
        <div className="bg-[#0A1020] border border-white/10 rounded-xl p-3 mb-8 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[700px]">
            {STEPS.map((step, idx) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-left ${
                      isActive
                        ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300'
                        : isCompleted
                        ? 'text-white/80 hover:bg-white/5'
                        : 'text-white/30 hover:text-white/50'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                        isActive
                          ? 'bg-cyan-500 text-black'
                          : isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-white/5 text-white/40'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.id}
                    </div>
                    <div>
                      <p className="text-xs font-bold font-mono">{step.title}</p>
                      <p className="text-[9px] text-white/40">{step.desc}</p>
                    </div>
                  </button>

                  {idx < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-white/10 shrink-0" />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Dynamic Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-[#0A1020] border border-white/10 rounded-xl p-6 md:p-8"
          >
            {/* STEP 1: REQUIREMENTS */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Step 1: Define Engineering Requirements</h3>
                  <p className="text-xs text-white/50">Establish mission targets for aerodynamic efficiency and speed envelope.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-white/70 font-medium block mb-1">Target Lift-to-Drag Ratio (L/D)</label>
                      <input
                        type="number"
                        value={targetLd}
                        onChange={(e) => setTargetLd(parseFloat(e.target.value) || 15)}
                        className="w-full bg-[#060B18] border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono outline-none focus:border-cyan-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/70 font-medium block mb-1">Operating Speed (m/s)</label>
                      <input
                        type="number"
                        value={velocity}
                        onChange={(e) => setVelocity(parseFloat(e.target.value) || 75)}
                        className="w-full bg-[#060B18] border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono outline-none focus:border-cyan-500/50"
                      />
                    </div>
                  </div>

                  <div className="bg-[#060B18] p-5 rounded-lg border border-white/5 space-y-2">
                    <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Requirement Summary</h4>
                    <p className="text-xs text-white/60">• Minimum Cruise L/D Target: <strong className="text-white">{targetLd}</strong></p>
                    <p className="text-xs text-white/60">• Cruise Speed Envelope: <strong className="text-white">{velocity} m/s</strong> ({(velocity * 1.94384).toFixed(1)} knots)</p>
                    <p className="text-xs text-white/60">• Traceability ID: <strong className="font-mono text-cyan-300">REQ-AERO-2026-01</strong></p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: AIRFOIL GEOMETRY */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Step 2: Generate Airfoil Geometry</h3>
                  <p className="text-xs text-white/50">Configure NACA 4-Digit geometry parameters.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-white/70 font-medium block mb-1">NACA Designation (4 Digits)</label>
                      <input
                        type="text"
                        maxLength={4}
                        value={naca}
                        onChange={(e) => setNaca(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className="w-full bg-[#060B18] border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono outline-none focus:border-cyan-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/70 font-medium block mb-1">Chord Length (m)</label>
                      <input
                        type="number"
                        step={0.1}
                        value={chord}
                        onChange={(e) => setChord(parseFloat(e.target.value) || 1.0)}
                        className="w-full bg-[#060B18] border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono outline-none focus:border-cyan-500/50"
                      />
                    </div>
                  </div>

                  {airfoilData && (
                    <div className="bg-[#060B18] p-4 rounded-lg border border-white/5 space-y-2 text-xs">
                      <h4 className="font-mono font-bold text-cyan-400 uppercase tracking-wider">Geometry Metrics</h4>
                      <p className="text-white/60">Max Camber: <span className="font-mono text-white font-bold">{(airfoilData.maxCamber * 100).toFixed(1)}%</span></p>
                      <p className="text-white/60">Max Thickness: <span className="font-mono text-white font-bold">{(airfoilData.maxThickness * 100).toFixed(1)}%</span></p>
                      <p className="text-white/60">Zero-Lift Angle (α₀): <span className="font-mono text-white font-bold">{airfoilData.alphaZeroLift.toFixed(2)}°</span></p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: FLIGHT ENVELOPE */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Step 3: Atmospheric & Flow Regime</h3>
                  <p className="text-xs text-white/50">7-Layer ISO 2533 atmosphere calculation.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-white/70 font-medium block mb-1">Altitude (m)</label>
                    <input
                      type="number"
                      value={altitude}
                      onChange={(e) => setAltitude(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#060B18] border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono outline-none focus:border-cyan-500/50 mb-4"
                    />
                  </div>

                  <div className="bg-[#060B18] p-4 rounded-lg border border-white/5 space-y-2 text-xs">
                    <h4 className="font-mono font-bold text-cyan-400 uppercase tracking-wider">Flow Regime Results</h4>
                    <p className="text-white/60">Air Density: <span className="font-mono text-white font-bold">{atmosphere.density.toFixed(4)} kg/m³</span></p>
                    <p className="text-white/60">Mach Number: <span className="font-mono text-white font-bold">{machRes?.machNumber.toFixed(3)} ({machRes?.regime})</span></p>
                    <p className="text-white/60">Reynolds Number: <span className="font-mono text-white font-bold">{reynoldsRes?.reynoldsNumber.toExponential(3)} ({reynoldsRes?.regime})</span></p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: AERODYNAMICS */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Step 4: Lift & Drag Analysis</h3>
                  <p className="text-xs text-white/50">Thin airfoil theory with Prandtl-Glauert compressibility correction.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-white/70 font-medium block mb-1">Angle of Attack (α in degrees)</label>
                    <input
                      type="number"
                      value={aoa}
                      onChange={(e) => setAoa(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#060B18] border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono outline-none focus:border-cyan-500/50 mb-4"
                    />
                  </div>

                  <div className="bg-[#060B18] p-4 rounded-lg border border-white/5 space-y-2 text-xs">
                    <h4 className="font-mono font-bold text-cyan-400 uppercase tracking-wider">Aerodynamic Performance</h4>
                    <p className="text-white/60">Lift Coefficient (CL): <span className="font-mono text-cyan-300 font-bold">{aeroCoeffs.cl.toFixed(4)}</span></p>
                    <p className="text-white/60">Drag Coefficient (CD): <span className="font-mono text-white font-bold">{aeroCoeffs.cd.toFixed(4)}</span></p>
                    <p className="text-white/60">L/D Ratio: <span className="font-mono text-emerald-400 font-bold">{aeroCoeffs.ldRatio.toFixed(2)}</span></p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: EXPERIMENT MATRIX */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Step 5: Angle of Attack Parameter Sweep</h3>
                  <p className="text-xs text-white/50">Multi-point polar generation across operating envelope.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-white/40">
                        <th className="text-left py-2 px-3">AoA (α)</th>
                        <th className="text-right py-2 px-3">CL</th>
                        <th className="text-right py-2 px-3">CD</th>
                        <th className="text-right py-2 px-3">L/D</th>
                        <th className="text-left py-2 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sweepData.map((pt) => (
                        <tr key={pt.angle} className={`border-b border-white/5 ${pt.angle === aoa ? 'bg-cyan-500/10' : ''}`}>
                          <td className="py-2 px-3 font-bold text-white">{pt.angle}°</td>
                          <td className="py-2 px-3 text-right text-cyan-300">{pt.cl.toFixed(4)}</td>
                          <td className="py-2 px-3 text-right text-white/70">{pt.cd.toFixed(4)}</td>
                          <td className="py-2 px-3 text-right text-emerald-400 font-bold">{pt.ld.toFixed(2)}</td>
                          <td className="py-2 px-3">
                            {pt.isStalled ? (
                              <span className="text-red-400 font-bold">STALLED</span>
                            ) : (
                              <span className="text-emerald-400">Attached</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* STEP 6: OPTIMIZATION */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Step 6: Pareto Optimization Results</h3>
                  <p className="text-xs text-white/50">Optimal AoA identified for maximum aerodynamic efficiency.</p>
                </div>

                <div className="bg-[#060B18] p-6 rounded-xl border border-cyan-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Target className="w-5 h-5" />
                    <h4 className="font-mono font-bold text-sm uppercase">Optimal Operating Point</h4>
                  </div>
                  <p className="text-xs text-white/70">
                    Optimal Angle of Attack: <strong className="text-cyan-300 font-mono">{optimalPoint.angle}°</strong> with Max L/D = <strong className="text-emerald-400 font-mono">{optimalPoint.ld.toFixed(2)}</strong>.
                  </p>
                  <p className="text-xs text-white/50">
                    Requirement Target ({targetLd}): {optimalPoint.ld >= targetLd ? <span className="text-emerald-400 font-bold">✔ TARGET MET</span> : <span className="text-amber-400 font-bold">⚠ BELOW TARGET</span>}
                  </p>
                </div>
              </div>
            )}

            {/* STEP 7: NOTEBOOK & REPORT */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Step 7: Synthesis & Export</h3>
                  <p className="text-xs text-white/50">Complete engineering digital thread documentation ready for publication.</p>
                </div>

                <div className="bg-[#060B18] p-6 rounded-xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-mono font-bold text-sm text-white">Technical Summary Report</h4>
                    <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">READY</span>
                  </div>

                  <p className="text-xs text-white/60 leading-relaxed font-mono">
                    Airfoil NACA {naca} evaluated at {altitude}m altitude and {velocity} m/s (Mach {machRes?.machNumber.toFixed(3)}). Max L/D ratio of {optimalPoint.ld.toFixed(2)} achieved at AoA = {optimalPoint.angle}°.
                  </p>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button onClick={handleSaveWorkflow} className="px-4 py-2 rounded-lg bg-cyan-500 text-black text-xs font-mono font-bold hover:bg-cyan-400 transition-all">
                      Save to Experiments
                    </button>
                    <Link to="/projects">
                      <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono hover:bg-white/10 transition-all">
                        View in Project Workspace
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Footer Controls */}
            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                disabled={currentStep === 1}
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-xs font-mono text-white transition-all"
              >
                Previous Step
              </button>

              <button
                disabled={currentStep === STEPS.length}
                onClick={() => setCurrentStep((prev) => Math.min(STEPS.length, prev + 1))}
                className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold transition-all flex items-center gap-1.5"
              >
                Next Step
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
