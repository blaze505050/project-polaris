import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Rocket, Activity, Zap, CheckCircle2, XCircle, Sliders } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAeroForgeStore } from "@/stores/aeroforgeStore";
import {
  computeRocketAscent,
  type LaunchAscentResult,
  type RocketStageConfig,
} from "@/services/physicsEngine";

// Workstation Components
import EngineeringStateBadge from "@/components/ui/EngineeringStateBadge";
import SimulationMetadataPanel, {
  type SimulationMetadata,
} from "@/components/ui/SimulationMetadataPanel";
import ExperimentHistoryLogger from "@/components/ui/ExperimentHistoryLogger";

const ROCKET_PRESETS: Array<{
  name: string;
  payload: number;
  targetAlt: number;
  stages: RocketStageConfig[];
}> = [
  {
    name: "SpaceX Falcon 9 (Full Thrust)",
    payload: 15600, // kg to LEO
    targetAlt: 400,
    stages: [
      {
        name: "Stage 1 (9x Merlin 1D)",
        dryMass: 22200,
        propellantMass: 418700,
        isp: 311,
        thrust: 7607000,
        burnTime: 162,
      },
      {
        name: "Stage 2 (1x Merlin Vacuum)",
        dryMass: 4000,
        propellantMass: 107500,
        isp: 348,
        thrust: 981000,
        burnTime: 397,
      },
    ],
  },
  {
    name: "NASA Saturn V",
    payload: 140000, // kg to LEO
    targetAlt: 185,
    stages: [
      {
        name: "S-IC (5x F-1)",
        dryMass: 130000,
        propellantMass: 2160000,
        isp: 263,
        thrust: 35100000,
        burnTime: 168,
      },
      {
        name: "S-II (5x J-2)",
        dryMass: 36000,
        propellantMass: 456000,
        isp: 421,
        thrust: 5000000,
        burnTime: 360,
      },
      {
        name: "S-IVB (1x J-2)",
        dryMass: 13500,
        propellantMass: 106000,
        isp: 421,
        thrust: 1000000,
        burnTime: 165,
      },
    ],
  },
  {
    name: "Rocket Lab Electron",
    payload: 300, // kg to LEO
    targetAlt: 500,
    stages: [
      {
        name: "Stage 1 (9x Rutherford)",
        dryMass: 950,
        propellantMass: 9250,
        isp: 311,
        thrust: 192000,
        burnTime: 150,
      },
      {
        name: "Stage 2 (1x Rutherford Vac)",
        dryMass: 250,
        propellantMass: 2100,
        isp: 343,
        thrust: 22000,
        burnTime: 300,
      },
    ],
  },
];

const ASCENT_METADATA: SimulationMetadata = {
  title: "Ascent Trajectory & Launch Vehicle Optimizer",
  solverName: "Tsiolkovsky & Gravity Turn Numerical Integrator",
  version: "2.4.0",
  governingEquations: [
    "Tsiolkovsky Rocket Equation: ΔV = Σ Isp_i * g0 * ln(m0_i / mf_i)  [m/s]",
    "Dynamic Pressure: q_dyn = 0.5 * ρ(h) * v²  [kPa]",
    "Equation of Motion: dv/dt = (F_thrust - D_drag)/m - g(h)*sin(θ)  [m/s²]",
    "Gravity Turn Pitching: dθ/dt = -g*cos(θ)/v  [rad/s]",
  ],
  assumptions: [
    "Standard atmospheric density modeling via ISA profile ρ(h)",
    "Gravity turn pitch program initiated at h > 5 km",
    "Spherical Earth gravitational acceleration g(h) = g0 * (R_e / (R_e + h))²",
    "Instantaneous staging jettison with zero thrust gap transition",
  ],
  validityBounds: [
    "Sub-orbital and LEO/GTO orbital insertion up to 1,000 km altitude",
    "Mass bounds: 50 kg to 200,000 kg payload capacity",
    "Maximum structural Dynamic Pressure Max-Q threshold: 45 kPa",
  ],
  unitsTable: [
    {
      symbol: "ΔV",
      name: "Total Velocity Increment",
      unit: "m/s",
      description: "Ideal delta-v capacity calculated via Tsiolkovsky equation",
    },
    {
      symbol: "q_dyn",
      name: "Dynamic Pressure",
      unit: "kPa",
      description: "Kinetic pressure exerted by atmospheric air stream",
    },
    {
      symbol: "Isp",
      name: "Specific Impulse",
      unit: "seconds",
      description: "Engine efficiency (thrust per weight flow rate of propellant)",
    },
    {
      symbol: "m_payload",
      name: "Payload Mass",
      unit: "kg",
      description: "Mass of orbital payload deliverable to target altitude",
    },
  ],
  references: [
    "Tsiolkovsky, K. E. (1903). The Exploration of Cosmic Space by Means of Reaction Devices.",
    "Sutton, G. P., & Biblarz, O. (2016). Rocket Propulsion Elements (9th ed.). Wiley.",
    "OpenRocket Technical Documentation & ULA RocketBuilder Specifications.",
  ],
};

export default function AscentPayloadOptimizer() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const userMode = useAeroForgeStore((s) => s.userMode);

  const [presetIdx, setPresetIdx] = useState(0);
  const selectedPreset = ROCKET_PRESETS[presetIdx];

  const [payloadMass, setPayloadMass] = useState(selectedPreset.payload);
  const [targetAltKm, setTargetAltKm] = useState(selectedPreset.targetAlt);
  const [stages, setStages] = useState<RocketStageConfig[]>(selectedPreset.stages);

  const applyPreset = (idx: number) => {
    setPresetIdx(idx);
    const p = ROCKET_PRESETS[idx];
    setPayloadMass(p.payload);
    setTargetAltKm(p.targetAlt);
    setStages(p.stages);
  };

  // Run Ascent Trajectory Physics
  const result: LaunchAscentResult = useMemo(() => {
    return computeRocketAscent(stages, payloadMass, targetAltKm);
  }, [stages, payloadMass, targetAltKm]);

  // Render Trajectory Plot
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !result.trajectory.length) return;
    const ctx = canvas.getContext("2d");
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

    ctx.fillStyle = "#060B18";
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 0.5;
    for (let x = margin.left; x <= margin.left + plotW; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, margin.top);
      ctx.lineTo(x, margin.top + plotH);
      ctx.stroke();
    }
    for (let y = margin.top; y <= margin.top + plotH; y += 40) {
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(margin.left + plotW, y);
      ctx.stroke();
    }

    const maxT = Math.max(...result.trajectory.map((p) => p.time));
    const maxAlt = Math.max(targetAltKm * 1.2, ...result.trajectory.map((p) => p.altitude));

    const targetY = margin.top + plotH - (targetAltKm / maxAlt) * plotH;
    ctx.strokeStyle = "rgba(16,185,129,0.4)";
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(margin.left, targetY);
    ctx.lineTo(margin.left + plotW, targetY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#10B981";
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText(`Target Orbit (${targetAltKm} km)`, margin.left + 10, targetY - 4);

    ctx.strokeStyle = "#00F0FF";
    ctx.lineWidth = 2;
    ctx.beginPath();
    result.trajectory.forEach((p, i) => {
      const x = margin.left + (p.time / maxT) * plotW;
      const y = margin.top + plotH - (p.altitude / maxAlt) * plotH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    const maxQVal = Math.max(10, ...result.trajectory.map((p) => p.dynamicPressure));
    ctx.strokeStyle = "#F59E0B";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    result.trajectory.forEach((p, i) => {
      const x = margin.left + (p.time / maxT) * plotW;
      const y = margin.top + plotH - (p.dynamicPressure / maxQVal) * plotH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    const maxQPt = result.trajectory.find((p) => p.time === result.maxQTime);
    if (maxQPt) {
      const qx = margin.left + (maxQPt.time / maxT) * plotW;
      const qy = margin.top + plotH - (maxQPt.dynamicPressure / maxQVal) * plotH;

      ctx.fillStyle = "#F59E0B";
      ctx.beginPath();
      ctx.arc(qx, qy, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(`Max-Q (${result.maxQ.toFixed(1)} kPa)`, qx + 8, qy - 4);
    }

    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    ctx.strokeRect(margin.left, margin.top, plotW, plotH);

    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = "center";
    ctx.fillText("Time (seconds)", margin.left + plotW / 2, h - 10);

    ctx.textAlign = "left";
    ctx.fillStyle = "#00F0FF";
    ctx.fillText("― Altitude (km)", margin.left + 10, margin.top - 10);
    ctx.fillStyle = "#F59E0B";
    ctx.fillText("-- Dynamic Pressure Q (kPa)", margin.left + 140, margin.top - 10);
  }, [result, targetAltKm]);

  return (
    <div className="min-h-screen bg-[#060B18] text-white">
      <Header />
      <div className="max-w-[120rem] mx-auto px-4 md:px-[4%] py-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/astrolab")}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                Ascent & Payload Deliverability — Launch Optimizer
              </h1>
              <p className="text-sm text-white/50 font-mono">
                Tsiolkovsky Rocket Equation · Gravity turn trajectory · Max-Q dynamic pressure
              </p>
            </div>
          </div>

          <EngineeringStateBadge
            status={result.orbitReached ? "CONVERGED" : "WARNING"}
            solverName="Gravity Turn Numerical Trajectory"
            timeStep="Δt=1.0s"
            tolerance="1e-3"
          />
        </div>

        {/* Presets */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {ROCKET_PRESETS.map((p, idx) => (
            <button
              key={p.name}
              onClick={() => applyPreset(idx)}
              className={`px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 whitespace-nowrap ${
                presetIdx === idx
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-white/[0.03] text-white/50 border border-white/5 hover:bg-white/5"
              }`}
            >
              <Rocket className="w-3.5 h-3.5 text-amber-400" />
              {p.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2">
            <div
              className="rounded-xl overflow-hidden border border-white/10 bg-[#080d1a]"
              style={{ boxShadow: "0 0 50px rgba(245,158,11,0.05)" }}
            >
              <canvas ref={canvasRef} className="w-full" style={{ height: "480px" }} />
            </div>
          </div>

          {/* Controls & Performance */}
          <div className="space-y-4">
            <div
              className="rounded-xl bg-white/[0.03] border border-white/10 p-4"
              style={{ backdropFilter: "blur(20px)" }}
            >
              <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" /> Payload & Orbit Controls
              </h3>

              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/40">Payload Mass [m_payload]</span>
                  <span className="font-mono text-amber-400">
                    {payloadMass.toLocaleString()} kg
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={150000}
                  step={100}
                  value={payloadMass}
                  onChange={(e) => setPayloadMass(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/40">Target Orbit Altitude [h_target]</span>
                  <span className="font-mono text-amber-400">{targetAltKm} km</span>
                </div>
                <input
                  type="range"
                  min={150}
                  max={1000}
                  step={10}
                  value={targetAltKm}
                  onChange={(e) => setTargetAltKm(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400"
                />
              </div>
            </div>

            {/* Launch Status Card */}
            <div
              className="rounded-xl bg-white/[0.03] border border-white/10 p-4"
              style={{ backdropFilter: "blur(20px)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Orbit Deliverability Status
                </h3>
                {result.orbitReached ? (
                  <span className="flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> SUCCESS
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                    <XCircle className="w-3.5 h-3.5" /> UNDERPOWERED
                  </span>
                )}
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between border-b border-white/5 py-1">
                  <span className="text-white/40">Tsiolkovsky Total ΔV</span>
                  <span className="text-cyan-400 font-bold">
                    {(result.totalDeltaV / 1000).toFixed(2)} km/s
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 py-1">
                  <span className="text-white/40">Max Dynamic Pressure [Max-Q]</span>
                  <span className="text-amber-400">{result.maxQ.toFixed(1)} kPa</span>
                </div>
                <div className="flex justify-between border-b border-white/5 py-1">
                  <span className="text-white/40">Final Altitude</span>
                  <span className="text-white">{result.finalAltitude.toFixed(1)} km</span>
                </div>
                <div className="flex justify-between border-b border-white/5 py-1">
                  <span className="text-white/40">Final Velocity</span>
                  <span className="text-white">
                    {(result.finalVelocity / 1000).toFixed(2)} km/s
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Experiment Logger */}
        <ExperimentHistoryLogger
          moduleName="Ascent & Payload Optimizer"
          currentInputs={{ rocket: selectedPreset.name, payloadMass, targetAltKm }}
          currentOutputs={{
            totalDeltaV_km_s: result.totalDeltaV / 1000,
            maxQ_kPa: result.maxQ,
            orbitReached: result.orbitReached ? "SUCCESS" : "UNDERPOWERED",
          }}
        />

        {/* Physics Documentation */}
        <SimulationMetadataPanel metadata={ASCENT_METADATA} />
      </div>
      <Footer />
    </div>
  );
}
