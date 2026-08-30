import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Flame, ShieldAlert, Activity, Sliders, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAeroForgeStore } from "@/stores/aeroforgeStore";
import { computeReentryTrajectory, type ReentryCorridorResult } from "@/services/physicsEngine";

// Workstation Components
import EngineeringStateBadge from "@/components/ui/EngineeringStateBadge";
import SimulationMetadataPanel, {
  type SimulationMetadata,
} from "@/components/ui/SimulationMetadataPanel";
import ExperimentHistoryLogger from "@/components/ui/ExperimentHistoryLogger";

const VEHICLE_PRESETS = [
  { name: "SpaceX Starship", v0: 7800, gamma0: -5.5, ballisticCoeff: 350, ld: 1.2, radius: 4.5 },
  {
    name: "Apollo Command Module",
    v0: 11000,
    gamma0: -6.5,
    ballisticCoeff: 380,
    ld: 0.35,
    radius: 2.0,
  },
  {
    name: "Space Shuttle Orbiter",
    v0: 7850,
    gamma0: -1.2,
    ballisticCoeff: 220,
    ld: 1.5,
    radius: 1.2,
  },
  {
    name: "Hypersonic Glide Vehicle (HGV)",
    v0: 6500,
    gamma0: -2.0,
    ballisticCoeff: 180,
    ld: 3.0,
    radius: 0.5,
  },
];

const REENTRY_METADATA: SimulationMetadata = {
  title: "Hypersonic Re-entry & Aerothermodynamics Corridor",
  solverName: "Sutton-Graves Aerothermodynamic Integrator",
  version: "2.4.0",
  governingEquations: [
    "Stagnation Heat Flux (Sutton-Graves): q = 1.7415e-4 * √(ρ / Rn) * v³  [W/cm²]",
    "Ballistic Coefficient: B = m / (Cd * A)  [kg/m²]",
    "Deceleration Load: N_g = √(a_drag² + a_lift²) / g0  [G]",
    "Dynamic Pressure: q_dyn = 0.5 * ρ * v²  [Pa]",
  ],
  assumptions: [
    "Atmospheric model based on International Standard Atmosphere (ISA) exponential continuum",
    "Nose radius spherical blunt body stagnation flow model",
    "Fixed Lift-to-Drag (L/D) ratio trim angle",
    "Planetary surface modeling assume Earth radius R_e = 6,371 km",
  ],
  validityBounds: [
    "Hypersonic continuum flow regime (Mach number M > 5.0)",
    "Altitude window h: 0 km to 120 km",
    "Maximum Thermal Protection System (TPS) limit: 400 W/cm²",
    "Maximum Structural Load limit: 12.0 Gs",
  ],
  unitsTable: [
    {
      symbol: "q",
      name: "Stagnation Heat Flux",
      unit: "W/cm²",
      description: "Convective heat transfer rate at nose stagnation point",
    },
    {
      symbol: "B",
      name: "Ballistic Coefficient",
      unit: "kg/m²",
      description: "Vehicle mass divided by drag area factor",
    },
    {
      symbol: "γ",
      name: "Flight Path Angle",
      unit: "degrees",
      description: "Angle of velocity vector relative to local horizon",
    },
    {
      symbol: "N_g",
      name: "Deceleration G-Load",
      unit: "G",
      description: "Total non-gravitational acceleration divided by 9.80665 m/s²",
    },
  ],
  references: [
    "Sutton, K., & Graves, R. A. (1971). A general stagneation-point convective-heating equation for arbitrary gas mixtures. NASA TR R-376.",
    "Anderson, J. D. (2006). Hypersonic and High-Temperature Gas Dynamics. AIAA Education Series.",
    "CBAERO & SpaceX Aerothermodynamic Entry Telemetry Architecture.",
  ],
};

export default function HypersonicReentryCorridor() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const userMode = useAeroForgeStore((s) => s.userMode);

  const [presetIdx, setPresetIdx] = useState(0);
  const selectedVehicle = VEHICLE_PRESETS[presetIdx];

  const [entryVelocity, setEntryVelocity] = useState(selectedVehicle.v0);
  const [entryAngle, setEntryAngle] = useState(selectedVehicle.gamma0);
  const [ballisticCoeff, setBallisticCoeff] = useState(selectedVehicle.ballisticCoeff);
  const [liftToDrag, setLiftToDrag] = useState(selectedVehicle.ld);
  const [noseRadius, setNoseRadius] = useState(selectedVehicle.radius);

  // Sync preset
  const applyPreset = (idx: number) => {
    setPresetIdx(idx);
    const v = VEHICLE_PRESETS[idx];
    setEntryVelocity(v.v0);
    setEntryAngle(v.gamma0);
    setBallisticCoeff(v.ballisticCoeff);
    setLiftToDrag(v.ld);
    setNoseRadius(v.radius);
  };

  // Trajectory simulation
  const result: ReentryCorridorResult = useMemo(() => {
    return computeReentryTrajectory(
      entryVelocity,
      entryAngle,
      ballisticCoeff,
      liftToDrag,
      noseRadius,
    );
  }, [entryVelocity, entryAngle, ballisticCoeff, liftToDrag, noseRadius]);

  // Render Trajectory Charts
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
    const maxAlt = 120; // 120 km

    ctx.strokeStyle = "#00F0FF";
    ctx.lineWidth = 2;
    ctx.beginPath();
    result.trajectory.forEach((p, i) => {
      const x = margin.left + (p.time / maxT) * plotW;
      const y = margin.top + plotH - (p.altitude / 1000 / maxAlt) * plotH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    const maxHeat = Math.max(50, ...result.trajectory.map((p) => p.heatFlux));
    ctx.strokeStyle = "#EF4444";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    result.trajectory.forEach((p, i) => {
      const x = margin.left + (p.time / maxT) * plotW;
      const y = margin.top + plotH - (p.heatFlux / maxHeat) * plotH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    const maxG = Math.max(5, ...result.trajectory.map((p) => p.gLoad));
    ctx.strokeStyle = "#F59E0B";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    result.trajectory.forEach((p, i) => {
      const x = margin.left + (p.time / maxT) * plotW;
      const y = margin.top + plotH - (p.gLoad / maxG) * plotH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

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
    ctx.fillStyle = "#EF4444";
    ctx.fillText("― Heat Flux q (W/cm²)", margin.left + 140, margin.top - 10);
    ctx.fillStyle = "#F59E0B";
    ctx.fillText("-- Deceleration (G)", margin.left + 300, margin.top - 10);
  }, [result]);

  const solverState =
    result.thermalFailure || result.structuralFailure || result.skippedOut
      ? "WARNING"
      : "CONVERGED";

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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                Hypersonic Re-entry & Aerothermodynamics Corridor
              </h1>
              <p className="text-sm text-white/50 font-mono">
                Sutton-Graves stagnation heat flux · Flight path angle bounds · Deceleration G-loads
              </p>
            </div>
          </div>

          <EngineeringStateBadge
            status={solverState}
            solverName="Sutton-Graves Numerical Integrator"
            timeStep="Δt=0.5s"
            tolerance="1e-4"
          />
        </div>

        {/* Vehicle Presets */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {VEHICLE_PRESETS.map((v, idx) => (
            <button
              key={v.name}
              onClick={() => applyPreset(idx)}
              className={`px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 whitespace-nowrap ${
                presetIdx === idx
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : "bg-white/[0.03] text-white/50 border border-white/5 hover:bg-white/5"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-red-400" />
              {v.name}
            </button>
          ))}
        </div>

        {/* Status Alerts */}
        {(result.skippedOut || result.thermalFailure || result.structuralFailure) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {result.skippedOut && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-amber-400 text-xs font-mono">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Atmospheric Skip-out! Entry angle too shallow.</span>
              </div>
            )}
            {result.thermalFailure && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-red-400 text-xs font-mono">
                <Flame className="w-4 h-4 shrink-0" />
                <span>TPS Failure! Peak heat flux exceeded 400 W/cm².</span>
              </div>
            )}
            {result.structuralFailure && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-red-400 text-xs font-mono">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Structural Failure! G-Load exceeded 12 G limit.</span>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2">
            <div
              className="rounded-xl overflow-hidden border border-white/10 bg-[#080d1a]"
              style={{ boxShadow: "0 0 50px rgba(239,68,68,0.05)" }}
            >
              <canvas ref={canvasRef} className="w-full" style={{ height: "480px" }} />
            </div>
          </div>

          {/* Controls & Peak Metrics */}
          <div className="space-y-4">
            <div
              className="rounded-xl bg-white/[0.03] border border-white/10 p-4"
              style={{ backdropFilter: "blur(20px)" }}
            >
              <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-red-400" /> Aerodynamic Controls
              </h3>
              {[
                {
                  label: "Entry Velocity V₀ [m/s]",
                  value: entryVelocity,
                  set: setEntryVelocity,
                  min: 5000,
                  max: 12000,
                  step: 100,
                },
                {
                  label: "Flight Path Angle γ₀ [°]",
                  value: entryAngle,
                  set: setEntryAngle,
                  min: -12,
                  max: -0.5,
                  step: 0.1,
                },
                {
                  label: "Ballistic Coeff B [kg/m²]",
                  value: ballisticCoeff,
                  set: setBallisticCoeff,
                  min: 50,
                  max: 800,
                  step: 10,
                },
                {
                  label: "Lift-to-Drag Ratio [L/D]",
                  value: liftToDrag,
                  set: setLiftToDrag,
                  min: 0,
                  max: 4.0,
                  step: 0.1,
                },
                {
                  label: "Nose Radius R_n [m]",
                  value: noseRadius,
                  set: setNoseRadius,
                  min: 0.2,
                  max: 5.0,
                  step: 0.1,
                },
              ].map((p) => (
                <div key={p.label} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/40">{p.label}</span>
                    <span className="font-mono text-red-400">{p.value}</span>
                  </div>
                  <input
                    type="range"
                    min={p.min}
                    max={p.max}
                    step={p.step}
                    value={p.value}
                    onChange={(e) => p.set(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-400"
                  />
                </div>
              ))}
            </div>

            {/* Peak Metrics */}
            <div
              className="rounded-xl bg-white/[0.03] border border-white/10 p-4"
              style={{ backdropFilter: "blur(20px)" }}
            >
              <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Peak Telemetry Metrics
              </h3>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between border-b border-white/5 py-1.5">
                  <span className="text-white/40">Peak Heat Flux [q]</span>
                  <span
                    className={`font-bold ${result.peakHeatFlux > 400 ? "text-red-400" : "text-amber-400"}`}
                  >
                    {result.peakHeatFlux.toFixed(1)} W/cm²
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 py-1.5">
                  <span className="text-white/40">Peak Deceleration [N_g]</span>
                  <span
                    className={`font-bold ${result.peakGLoad > 12 ? "text-red-400" : "text-cyan-400"}`}
                  >
                    {result.peakGLoad.toFixed(1)} Gs
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 py-1.5">
                  <span className="text-white/40">Max Dynamic Pressure [q_dyn]</span>
                  <span className="text-white">
                    {(result.maxDynamicPressure / 1000).toFixed(1)} kPa
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Experiment Logger */}
        <ExperimentHistoryLogger
          moduleName="Hypersonic Re-entry Corridor"
          currentInputs={{ entryVelocity, entryAngle, ballisticCoeff, liftToDrag, noseRadius }}
          currentOutputs={{
            peakHeatFlux_W_cm2: result.peakHeatFlux,
            peakGLoad_G: result.peakGLoad,
            maxDynamicPressure_kPa: result.maxDynamicPressure / 1000,
          }}
        />

        {/* Physics Documentation */}
        <SimulationMetadataPanel metadata={REENTRY_METADATA} />
      </div>
      <Footer />
    </div>
  );
}
