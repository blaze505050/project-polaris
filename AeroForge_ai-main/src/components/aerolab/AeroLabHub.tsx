import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Wind,
  Rocket,
  Cloud,
  Sliders,
  Gauge,
  Target,
  Crosshair,
  Zap,
  Globe,
  Ruler,
  BarChart3,
  Flame,
  Atom,
  Navigation,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeatureStatusBadge, { FeatureStatus } from "@/components/ui/FeatureStatusBadge";
import ToolShell, { type ToolInput, type ToolResult } from "@/components/ui/ToolShell";
import { useAeroForgeStore } from "@/stores/aeroforgeStore";
import {
  generateNACA4Digit,
  computeAirfoilCoefficients,
  computeISAAtmosphere,
  computeRocketThrust,
  computeReynoldsNumber,
  computeMachNumberCalc,
  computeLift,
  computeDrag,
  computeDynamicPressureCalc,
  computeLiftToDragRatio,
  computeStallSpeed,
  computeAircraftRange,
  computeAircraftEndurance,
  computeWingLoading,
  computeAspectRatio,
  computePropellerPerformance,
  computeJetEngineThrust,
  computeRocketDeltaVCalc,
  computeProjectileTrajectory,
  calculateOrbitalVelocity,
  calculateEscapeVelocity,
  PHYSICS_CONSTANTS,
} from "@/services/physicsEngine";

// ─── Tool Registry ──────────────────────────────────────────────────────────

type ToolId =
  | "airfoil"
  | "reynolds"
  | "mach"
  | "lift"
  | "drag"
  | "dynamic-pressure"
  | "ld-ratio"
  | "stall-speed"
  | "range"
  | "endurance"
  | "atmosphere"
  | "wing-loading"
  | "aspect-ratio"
  | "propeller"
  | "jet-thrust"
  | "delta-v"
  | "rocket-thrust"
  | "orbital-velocity"
  | "escape-velocity"
  | "projectile";

const TOOLS: {
  id: ToolId;
  icon: React.ElementType;
  label: string;
  status: FeatureStatus;
  group: string;
}[] = [
  // Aerodynamics
  {
    id: "airfoil",
    icon: Wind,
    label: "NACA Airfoil Generator",
    status: "available",
    group: "Aerodynamics",
  },
  {
    id: "reynolds",
    icon: Gauge,
    label: "Reynolds Number",
    status: "available",
    group: "Aerodynamics",
  },
  { id: "mach", icon: Zap, label: "Mach Number", status: "available", group: "Aerodynamics" },
  {
    id: "lift",
    icon: ArrowLeft,
    label: "Lift Calculator",
    status: "available",
    group: "Aerodynamics",
  },
  {
    id: "drag",
    icon: Sliders,
    label: "Drag Calculator",
    status: "available",
    group: "Aerodynamics",
  },
  {
    id: "dynamic-pressure",
    icon: Gauge,
    label: "Dynamic Pressure",
    status: "available",
    group: "Aerodynamics",
  },
  {
    id: "ld-ratio",
    icon: BarChart3,
    label: "Lift-to-Drag Analyzer",
    status: "available",
    group: "Aerodynamics",
  },
  // Performance
  {
    id: "stall-speed",
    icon: Target,
    label: "Stall Speed",
    status: "available",
    group: "Performance",
  },
  {
    id: "range",
    icon: Navigation,
    label: "Aircraft Range",
    status: "available",
    group: "Performance",
  },
  {
    id: "endurance",
    icon: Crosshair,
    label: "Aircraft Endurance",
    status: "available",
    group: "Performance",
  },
  {
    id: "atmosphere",
    icon: Cloud,
    label: "ISA Atmosphere",
    status: "available",
    group: "Performance",
  },
  {
    id: "wing-loading",
    icon: Ruler,
    label: "Wing Loading",
    status: "available",
    group: "Performance",
  },
  {
    id: "aspect-ratio",
    icon: Ruler,
    label: "Aspect Ratio",
    status: "available",
    group: "Performance",
  },
  // Propulsion & Rocketry
  {
    id: "propeller",
    icon: Wind,
    label: "Propeller Performance",
    status: "available",
    group: "Propulsion",
  },
  {
    id: "jet-thrust",
    icon: Flame,
    label: "Jet Engine Thrust",
    status: "available",
    group: "Propulsion",
  },
  {
    id: "delta-v",
    icon: Rocket,
    label: "Rocket Delta-V",
    status: "available",
    group: "Propulsion",
  },
  {
    id: "rocket-thrust",
    icon: Rocket,
    label: "Rocket Thrust",
    status: "available",
    group: "Propulsion",
  },
  // Orbital & Trajectory
  {
    id: "orbital-velocity",
    icon: Globe,
    label: "Orbital Velocity",
    status: "available",
    group: "Orbital",
  },
  {
    id: "escape-velocity",
    icon: Atom,
    label: "Escape Velocity",
    status: "available",
    group: "Orbital",
  },
  {
    id: "projectile",
    icon: Target,
    label: "Projectile Trajectory",
    status: "available",
    group: "Orbital",
  },
];

// ─── Main Component ─────────────────────────────────────────────────────────

export default function AeroLabHub() {
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState<ToolId>("airfoil");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = useMemo(() => {
    if (!searchQuery) return TOOLS;
    const q = searchQuery.toLowerCase();
    return TOOLS.filter(
      (t) => t.label.toLowerCase().includes(q) || t.group.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const groupedTools = useMemo(() => {
    const groups = new Map<string, typeof TOOLS>();
    for (const t of filteredTools) {
      if (!groups.has(t.group)) groups.set(t.group, []);
      groups.get(t.group)!.push(t);
    }
    return groups;
  }, [filteredTools]);

  return (
    <div className="min-h-screen bg-[#060B18] text-white">
      <Header />
      <div className="max-w-[120rem] mx-auto px-4 md:px-[4%] py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white flex items-center gap-3">
              AeroLab — Aerospace Engineering
              <FeatureStatusBadge status="available" size="md" />
            </h1>
            <p className="text-xs text-white/40 font-mono">
              20 Working Tools · Aerodynamics · Performance · Propulsion · Orbital Mechanics
            </p>
          </div>
        </div>

        <div className="flex gap-4 flex-col lg:flex-row">
          {/* ── Sidebar: Tool List ─────────────────────────────────────── */}
          <div className="lg:w-64 shrink-0 space-y-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools..."
              className="w-full bg-[#0A1020] border border-white/10 rounded-lg px-3 py-2 text-xs text-white/80 outline-none focus:border-cyan-500/40 placeholder:text-white/20"
            />
            <div
              className="space-y-3 max-h-[70vh] overflow-y-auto pr-1"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#ffffff15 transparent" }}
            >
              {Array.from(groupedTools.entries()).map(([group, tools]) => (
                <div key={group}>
                  <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-1.5 px-1">
                    {group}
                  </h3>
                  {tools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all mb-0.5 text-left ${
                        activeTool === tool.id
                          ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                          : "text-white/40 hover:text-white/70 hover:bg-white/[0.03] border border-transparent"
                      }`}
                    >
                      <tool.icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{tool.label}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ── Main: Active Tool ──────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <ToolRenderer toolId={activeTool} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// ─── Tool Renderer (Maps tool ID to ToolShell config) ────────────────────────

function ToolRenderer({ toolId }: { toolId: ToolId }) {
  switch (toolId) {
    case "airfoil":
      return <AirfoilTool />;
    case "reynolds":
      return <ReynoldsTool />;
    case "mach":
      return <MachTool />;
    case "lift":
      return <LiftTool />;
    case "drag":
      return <DragTool />;
    case "dynamic-pressure":
      return <DynamicPressureTool />;
    case "ld-ratio":
      return <LDRatioTool />;
    case "stall-speed":
      return <StallSpeedTool />;
    case "range":
      return <RangeTool />;
    case "endurance":
      return <EnduranceTool />;
    case "atmosphere":
      return <AtmosphereTool />;
    case "wing-loading":
      return <WingLoadingTool />;
    case "aspect-ratio":
      return <AspectRatioTool />;
    case "propeller":
      return <PropellerTool />;
    case "jet-thrust":
      return <JetThrustTool />;
    case "delta-v":
      return <DeltaVTool />;
    case "rocket-thrust":
      return <RocketThrustTool />;
    case "orbital-velocity":
      return <OrbitalVelocityTool />;
    case "escape-velocity":
      return <EscapeVelocityTool />;
    case "projectile":
      return <ProjectileTool />;
    default:
      return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOOL IMPLEMENTATIONS (each uses ToolShell)
// ═══════════════════════════════════════════════════════════════════════════════

// 1. NACA Airfoil Generator — Canvas-based, kept custom for visualization
function AirfoilTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [naca, setNaca] = useState("2412");
  const [chord, setChord] = useState(1);
  const [resolution, setResolution] = useState(100);
  const airfoil = useMemo(() => generateNACA4Digit(naca, resolution), [naca, resolution]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !airfoil) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width,
      h = rect.height;
    const padX = 40,
      padY = 30;
    const drawW = w - 2 * padX,
      drawH = h - 2 * padY;

    ctx.fillStyle = "#060B18";
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 10; i++) {
      const x = padX + (i / 10) * drawW;
      ctx.beginPath();
      ctx.moveTo(x, padY);
      ctx.lineTo(x, padY + drawH);
      ctx.stroke();
    }
    for (let i = 0; i <= 4; i++) {
      const y = padY + (i / 4) * drawH;
      ctx.beginPath();
      ctx.moveTo(padX, y);
      ctx.lineTo(padX + drawW, y);
      ctx.stroke();
    }

    const toX = (xv: number) => padX + xv * drawW;
    const toY = (yv: number) => padY + drawH / 2 - yv * drawH * 3;

    // Chord line
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(0));
    ctx.lineTo(toX(1), toY(0));
    ctx.stroke();
    ctx.setLineDash([]);

    // Camber line
    ctx.strokeStyle = "rgba(14,165,233,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    airfoil.camberLine.forEach((p, i) =>
      i === 0 ? ctx.moveTo(toX(p.x), toY(p.y)) : ctx.lineTo(toX(p.x), toY(p.y)),
    );
    ctx.stroke();

    // Upper surface
    ctx.strokeStyle = "#0EA5E9";
    ctx.lineWidth = 2;
    ctx.beginPath();
    airfoil.upper.forEach((p, i) =>
      i === 0 ? ctx.moveTo(toX(p.x), toY(p.y)) : ctx.lineTo(toX(p.x), toY(p.y)),
    );
    ctx.stroke();

    // Lower surface
    ctx.strokeStyle = "#06B6D4";
    ctx.beginPath();
    airfoil.lower.forEach((p, i) =>
      i === 0 ? ctx.moveTo(toX(p.x), toY(p.y)) : ctx.lineTo(toX(p.x), toY(p.y)),
    );
    ctx.stroke();

    // Labels
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "10px monospace";
    ctx.fillText(`NACA ${naca}`, padX + 4, padY + 14);
    ctx.fillText(`Chord: ${chord} m`, padX + 4, padY + 26);
    ctx.fillText(
      `Max camber: ${(airfoil.maxCamber * 100).toFixed(1)}%`,
      padX + drawW - 120,
      padY + 14,
    );
    ctx.fillText(
      `Max thickness: ${(airfoil.maxThickness * 100).toFixed(1)}%`,
      padX + drawW - 120,
      padY + 26,
    );
  }, [airfoil, naca, chord]);

  const handleExportCSV = () => {
    if (!airfoil) return;
    const rows = ["x,y_upper,y_lower"];
    for (let i = 0; i < airfoil.upper.length; i++) {
      rows.push(
        `${(airfoil.upper[i].x * chord).toFixed(6)},${(airfoil.upper[i].y * chord).toFixed(6)},${(airfoil.lower[i].y * chord).toFixed(6)}`,
      );
    }
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `NACA${naca}_chord${chord}m.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-white">NACA Airfoil Generator</h2>
        <p className="text-xs text-white/50">
          Generate NACA 4-digit airfoil geometry with coordinate export
        </p>
        <p className="text-[10px] text-white/30 font-mono">Aerodynamics · Geometry Generation</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="bg-[#0A1020] border border-white/8 rounded-lg p-4 space-y-3">
            <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider">Parameters</h3>
            <div>
              <label className="text-xs text-white/70 mb-1 block">
                NACA Designation (4 digits)
              </label>
              <input
                type="text"
                value={naca}
                onChange={(e) => setNaca(e.target.value.replace(/\D/g, "").slice(0, 4))}
                className="w-full bg-[#060B18] border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono outline-none focus:border-cyan-500/50"
                maxLength={4}
              />
            </div>
            <div>
              <label className="text-xs text-white/70 mb-1 block">
                Chord Length <span className="text-white/30">m</span>
              </label>
              <input
                type="number"
                value={chord}
                onChange={(e) => setChord(Math.max(0.01, parseFloat(e.target.value) || 1))}
                step={0.1}
                className="w-full bg-[#060B18] border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono outline-none focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label className="text-xs text-white/70 mb-1 block">
                Resolution (points per surface)
              </label>
              <input
                type="number"
                value={resolution}
                onChange={(e) =>
                  setResolution(Math.max(20, Math.min(500, parseInt(e.target.value) || 100)))
                }
                className="w-full bg-[#060B18] border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>
          {airfoil && (
            <div className="bg-[#0A1020] border border-white/8 rounded-lg p-4 space-y-2">
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider">
                Properties
              </h3>
              {[
                {
                  label: "Max Camber",
                  value: `${(airfoil.maxCamber * 100).toFixed(1)}%`,
                  unit: "chord",
                },
                {
                  label: "Camber Position",
                  value: `${(airfoil.maxCamberPos * 100).toFixed(0)}%`,
                  unit: "chord",
                },
                {
                  label: "Max Thickness",
                  value: `${(airfoil.maxThickness * 100).toFixed(1)}%`,
                  unit: "chord",
                },
                {
                  label: "α₀ (zero-lift)",
                  value: `${airfoil.alphaZeroLift.toFixed(2)}°`,
                  unit: "",
                },
                {
                  label: "Cl_α (lift slope)",
                  value: `${airfoil.clAlpha.toFixed(3)}`,
                  unit: "/rad",
                },
              ].map((r, i) => (
                <div key={i} className="flex justify-between py-1.5 px-2 rounded bg-white/[0.02]">
                  <span className="text-xs text-white/50">{r.label}</span>
                  <span className="text-xs font-mono text-white/90">
                    {r.value} <span className="text-white/30">{r.unit}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={handleExportCSV}
            disabled={!airfoil}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-medium hover:bg-cyan-500/20 transition-all disabled:opacity-30"
          >
            Export Coordinates CSV
          </button>
        </div>
        <div className="bg-[#0A1020] border border-white/8 rounded-lg overflow-hidden">
          <canvas ref={canvasRef} className="w-full" style={{ height: 320 }} />
          {!airfoil && (
            <p className="text-center text-xs text-red-400 py-4">
              Invalid NACA designation. Enter exactly 4 digits.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// 2. Reynolds Number
function ReynoldsTool() {
  return (
    <ToolShell
      name="Reynolds Number Calculator"
      description="Calculate Reynolds number and classify flow regime for external aerodynamic flows"
      domain="Aerodynamics · Fluid Mechanics · Boundary Layer Theory"
      inputs={[
        { key: "velocity", label: "Velocity", unit: "m/s", defaultValue: 60, min: 0, max: 10000 },
        {
          key: "chord",
          label: "Characteristic Length",
          unit: "m",
          defaultValue: 1.5,
          min: 0.001,
          max: 100,
          helpText: "Chord, diameter, or length",
        },
        {
          key: "density",
          label: "Air Density",
          unit: "kg/m³",
          defaultValue: 1.225,
          min: 0.001,
          max: 100,
        },
        {
          key: "viscosity",
          label: "Dynamic Viscosity",
          unit: "Pa·s",
          defaultValue: 1.789e-5,
          min: 1e-7,
          max: 1,
          step: 1e-6,
        },
      ]}
      equations={["Re = ρVL / μ"]}
      assumptions={[
        "Newtonian fluid",
        "Incompressible flow at low Mach numbers",
        "External flow thresholds: Laminar < 5×10⁵ < Transitional < 10⁶ < Turbulent",
      ]}
      references={["Anderson, J.D., Fundamentals of Aerodynamics, 6th Ed."]}
      onCalculate={(v) => {
        const r = computeReynoldsNumber(v.velocity, v.chord, v.density, v.viscosity);
        if (!r) return null;
        return {
          results: [
            { label: "Reynolds Number", value: r.reynoldsNumber, unit: "—", highlight: true },
            { label: "Flow Regime", value: r.regime, unit: "" },
          ],
          interpretation: r.description,
        };
      }}
    />
  );
}

// 3. Mach Number
function MachTool() {
  return (
    <ToolShell
      name="Mach Number Calculator"
      description="Calculate Mach number and classify compressibility regime"
      domain="Aerodynamics · Compressible Flow · Gas Dynamics"
      inputs={[
        {
          key: "velocity",
          label: "Flight Velocity",
          unit: "m/s",
          defaultValue: 250,
          min: 0,
          max: 100000,
        },
        {
          key: "speedOfSound",
          label: "Speed of Sound",
          unit: "m/s",
          defaultValue: 340.3,
          min: 1,
          max: 2000,
          helpText: "At sea level: ~340.3 m/s",
        },
      ]}
      equations={["M = V / a"]}
      assumptions={["Calorically perfect gas", "Speed of sound constant at given conditions"]}
      onCalculate={(v) => {
        const r = computeMachNumberCalc(v.velocity, v.speedOfSound);
        if (!r) return null;
        return {
          results: [
            { label: "Mach Number", value: r.machNumber, unit: "—", highlight: true },
            { label: "Flow Regime", value: r.regime, unit: "" },
          ],
          interpretation: r.description,
        };
      }}
    />
  );
}

// 4. Lift Calculator
function LiftTool() {
  return (
    <ToolShell
      name="Lift Calculator"
      description="Calculate aerodynamic lift force using the lift equation"
      domain="Aerodynamics · Aircraft Performance"
      inputs={[
        {
          key: "density",
          label: "Air Density",
          unit: "kg/m³",
          defaultValue: 1.225,
          min: 0.001,
          max: 100,
        },
        { key: "velocity", label: "Velocity", unit: "m/s", defaultValue: 70, min: 0, max: 10000 },
        { key: "wingArea", label: "Wing Area", unit: "m²", defaultValue: 16, min: 0.01, max: 1000 },
        {
          key: "cl",
          label: "Lift Coefficient (CL)",
          unit: "—",
          defaultValue: 0.5,
          min: -3,
          max: 5,
          step: 0.01,
        },
      ]}
      equations={["L = ½ρV²SCL"]}
      assumptions={[
        "Steady, level flight",
        "Uniform flow conditions",
        "CL assumed constant across span",
      ]}
      onCalculate={(v) => {
        const r = computeLift(v.density, v.velocity, v.wingArea, v.cl);
        if (!r) return null;
        return {
          results: [
            { label: "Lift Force", value: r.lift, unit: "N", highlight: true },
            { label: "Lift Force", value: r.lift / 1000, unit: "kN" },
            { label: "Dynamic Pressure", value: r.dynamicPressure, unit: "Pa" },
          ],
          interpretation: `Lift force of ${(r.lift / 1000).toFixed(2)} kN at dynamic pressure q = ${r.dynamicPressure.toFixed(1)} Pa.`,
        };
      }}
    />
  );
}

// 5. Drag Calculator
function DragTool() {
  return (
    <ToolShell
      name="Drag Calculator"
      description="Calculate aerodynamic drag force"
      domain="Aerodynamics · Aircraft Performance"
      inputs={[
        {
          key: "density",
          label: "Air Density",
          unit: "kg/m³",
          defaultValue: 1.225,
          min: 0.001,
          max: 100,
        },
        { key: "velocity", label: "Velocity", unit: "m/s", defaultValue: 70, min: 0, max: 10000 },
        {
          key: "area",
          label: "Reference Area",
          unit: "m²",
          defaultValue: 16,
          min: 0.01,
          max: 1000,
        },
        {
          key: "cd",
          label: "Drag Coefficient (CD)",
          unit: "—",
          defaultValue: 0.03,
          min: 0,
          max: 5,
          step: 0.001,
        },
      ]}
      equations={["D = ½ρV²SCD"]}
      assumptions={[
        "Total drag coefficient includes parasite + induced drag",
        "Constant CD assumed",
      ]}
      onCalculate={(v) => {
        const r = computeDrag(v.density, v.velocity, v.area, v.cd);
        if (!r) return null;
        return {
          results: [
            { label: "Drag Force", value: r.drag, unit: "N", highlight: true },
            { label: "Drag Force", value: r.drag / 1000, unit: "kN" },
            { label: "Dynamic Pressure", value: r.dynamicPressure, unit: "Pa" },
          ],
        };
      }}
    />
  );
}

// 6. Dynamic Pressure
function DynamicPressureTool() {
  return (
    <ToolShell
      name="Dynamic Pressure Calculator"
      description="Calculate dynamic pressure — the kinetic energy per unit volume of a fluid"
      domain="Aerodynamics · Fluid Mechanics"
      inputs={[
        {
          key: "density",
          label: "Fluid Density",
          unit: "kg/m³",
          defaultValue: 1.225,
          min: 0.001,
          max: 1000,
        },
        { key: "velocity", label: "Velocity", unit: "m/s", defaultValue: 100, min: 0, max: 100000 },
      ]}
      equations={["q = ½ρV²"]}
      assumptions={["Incompressible flow (valid for M < 0.3)", "Uniform velocity field"]}
      onCalculate={(v) => {
        const r = computeDynamicPressureCalc(v.density, v.velocity);
        if (!r) return null;
        return {
          results: [
            { label: "Dynamic Pressure", value: r.dynamicPressure, unit: "Pa", highlight: true },
            { label: "Dynamic Pressure", value: r.dynamicPressureKPa, unit: "kPa" },
            { label: "Dynamic Pressure", value: r.dynamicPressurePSF, unit: "lb/ft²" },
          ],
        };
      }}
    />
  );
}

// 7. Lift-to-Drag Analyzer
function LDRatioTool() {
  return (
    <ToolShell
      name="Lift-to-Drag Analyzer"
      description="Evaluate aerodynamic efficiency from lift and drag coefficients"
      domain="Aerodynamics · Aircraft Performance · Efficiency Analysis"
      inputs={[
        {
          key: "cl",
          label: "Lift Coefficient (CL)",
          unit: "—",
          defaultValue: 0.5,
          min: -3,
          max: 5,
          step: 0.01,
        },
        {
          key: "cd",
          label: "Drag Coefficient (CD)",
          unit: "—",
          defaultValue: 0.03,
          min: 0.0001,
          max: 5,
          step: 0.001,
        },
      ]}
      equations={["L/D = CL / CD"]}
      assumptions={[
        "Coefficients at a single operating point",
        "Does not account for CL/CD variation with angle of attack",
      ]}
      onCalculate={(v) => {
        const r = computeLiftToDragRatio(v.cl, v.cd);
        if (!r) return null;
        return {
          results: [
            { label: "L/D Ratio", value: r.ldRatio, unit: "—", highlight: true },
            { label: "CL/CD", value: r.clCd, unit: "" },
            { label: "Performance Class", value: r.performance, unit: "" },
          ],
          interpretation: r.description,
        };
      }}
    />
  );
}

// 8. Stall Speed
function StallSpeedTool() {
  return (
    <ToolShell
      name="Aircraft Stall Speed Calculator"
      description="Calculate minimum flight speed at which wings can support aircraft weight"
      domain="Aerodynamics · Aircraft Performance · Flight Safety"
      inputs={[
        {
          key: "mass",
          label: "Aircraft Mass",
          unit: "kg",
          defaultValue: 1500,
          min: 0.1,
          max: 1000000,
        },
        { key: "wingArea", label: "Wing Area", unit: "m²", defaultValue: 16, min: 0.1, max: 1000 },
        {
          key: "clMax",
          label: "Max Lift Coefficient (CL_max)",
          unit: "—",
          defaultValue: 1.6,
          min: 0.1,
          max: 5,
          step: 0.1,
          helpText: "Typically 1.2-2.5 depending on high-lift devices",
        },
        {
          key: "density",
          label: "Air Density",
          unit: "kg/m³",
          defaultValue: 1.225,
          min: 0.001,
          max: 100,
        },
      ]}
      equations={["Vs = √(2W / (ρ · S · CL_max))", "W = m · g"]}
      assumptions={["Level flight (L = W)", "1g stall speed", "No ground effect"]}
      onCalculate={(v) => {
        const r = computeStallSpeed(v.mass, v.wingArea, v.clMax, v.density);
        if (!r) return null;
        return {
          results: [
            { label: "Stall Speed", value: r.stallSpeed, unit: "m/s", highlight: true },
            { label: "Stall Speed", value: r.stallSpeedKnots, unit: "knots" },
            { label: "Stall Speed", value: r.stallSpeedKmh, unit: "km/h" },
          ],
          interpretation: `Stall speed is ${r.stallSpeed.toFixed(1)} m/s (${r.stallSpeedKnots.toFixed(1)} knots). Below this speed, the wing cannot generate enough lift to sustain level flight.`,
        };
      }}
    />
  );
}

// 9. Aircraft Range
function RangeTool() {
  return (
    <ToolShell
      name="Aircraft Range Estimator"
      description="Estimate cruise range using the Breguet range equation for jet aircraft"
      domain="Aircraft Performance · Mission Planning"
      inputs={[
        {
          key: "liftToDrag",
          label: "Lift-to-Drag Ratio (L/D)",
          unit: "—",
          defaultValue: 15,
          min: 1,
          max: 80,
          step: 0.5,
        },
        {
          key: "initialWeight",
          label: "Initial Weight",
          unit: "N",
          defaultValue: 200000,
          min: 1,
          max: 1e8,
          helpText: "Takeoff weight including fuel",
        },
        {
          key: "finalWeight",
          label: "Final Weight",
          unit: "N",
          defaultValue: 140000,
          min: 1,
          max: 1e8,
          helpText: "Landing weight (initial minus fuel burned)",
        },
        {
          key: "velocity",
          label: "Cruise Velocity",
          unit: "m/s",
          defaultValue: 230,
          min: 1,
          max: 10000,
        },
        {
          key: "sfc",
          label: "Specific Fuel Consumption",
          unit: "kg/(N·s)",
          defaultValue: 1.7e-5,
          min: 1e-7,
          max: 1,
          step: 1e-6,
          helpText: "Typical jet SFC: 1.5-2.0 × 10⁻⁵ kg/(N·s)",
        },
      ]}
      equations={["R = (V / SFC) · (L/D) · ln(W₀/W₁)"]}
      assumptions={[
        "Breguet range equation for jet propulsion",
        "Constant velocity, L/D, and SFC throughout cruise",
        "No wind effects",
        "Steady, level flight",
      ]}
      onCalculate={(v) => {
        const r = computeAircraftRange(
          "jet",
          v.liftToDrag,
          v.initialWeight,
          v.finalWeight,
          v.velocity,
          v.sfc,
        );
        if (!r) return null;
        return {
          results: [
            { label: "Range", value: r.rangeKm, unit: "km", highlight: true },
            { label: "Range", value: r.rangeNm, unit: "nmi" },
            { label: "Range", value: r.range, unit: "m" },
          ],
          interpretation: `Estimated range of ${r.rangeKm.toFixed(0)} km (${r.rangeNm.toFixed(0)} nmi) under ideal cruise conditions.`,
        };
      }}
    />
  );
}

// 10. Aircraft Endurance
function EnduranceTool() {
  return (
    <ToolShell
      name="Aircraft Endurance Estimator"
      description="Estimate maximum loiter/endurance time using the Breguet endurance equation"
      domain="Aircraft Performance · Mission Planning"
      inputs={[
        {
          key: "liftToDrag",
          label: "Lift-to-Drag Ratio (L/D)",
          unit: "—",
          defaultValue: 18,
          min: 1,
          max: 80,
        },
        {
          key: "initialWeight",
          label: "Initial Weight",
          unit: "N",
          defaultValue: 200000,
          min: 1,
          max: 1e8,
        },
        {
          key: "finalWeight",
          label: "Final Weight",
          unit: "N",
          defaultValue: 150000,
          min: 1,
          max: 1e8,
        },
        {
          key: "sfc",
          label: "Specific Fuel Consumption",
          unit: "kg/(N·s)",
          defaultValue: 1.7e-5,
          min: 1e-7,
          max: 1,
          step: 1e-6,
        },
      ]}
      equations={["E = (1/SFC) · (L/D) · ln(W₀/W₁)"]}
      assumptions={[
        "Breguet endurance equation for jet propulsion",
        "Constant L/D and SFC",
        "Minimum drag speed for max endurance",
      ]}
      onCalculate={(v) => {
        const r = computeAircraftEndurance(
          "jet",
          v.liftToDrag,
          v.initialWeight,
          v.finalWeight,
          v.sfc,
        );
        if (!r) return null;
        return {
          results: [
            { label: "Endurance", value: r.enduranceHours, unit: "hours", highlight: true },
            { label: "Endurance", value: r.enduranceMinutes, unit: "minutes" },
            { label: "Endurance", value: r.endurance, unit: "seconds" },
          ],
          interpretation: `Maximum endurance of ${r.enduranceHours.toFixed(1)} hours under constant L/D and SFC assumptions.`,
        };
      }}
    />
  );
}

// 11. ISA Atmosphere
function AtmosphereTool() {
  return (
    <ToolShell
      name="ISA Atmosphere Calculator"
      description="Compute atmospheric properties using the 7-layer US Standard Atmosphere 1976 / ISO 2533 model"
      domain="Aerodynamics · Atmospheric Science · Flight Performance"
      inputs={[
        {
          key: "altitude",
          label: "Altitude",
          unit: "m",
          defaultValue: 10000,
          min: 0,
          max: 84852,
          helpText: "Valid: 0 – 84,852 m",
        },
      ]}
      equations={[
        "Gradient layer: T = T_base + L·Δh",
        "Gradient layer: P = P_base · (T/T_base)^(-g₀/(L·R))",
        "Isothermal: P = P_base · exp(-g₀·Δh / (R·T))",
        "ρ = P / (R·T)",
        "a = √(γRT)",
      ]}
      assumptions={[
        "US Standard Atmosphere 1976 / ISO 2533",
        "Hydrostatic equilibrium",
        "Ideal gas law",
        "No winds or weather",
      ]}
      references={["NOAA/NASA/USAF, U.S. Standard Atmosphere, 1976"]}
      onCalculate={(v) => {
        const r = computeISAAtmosphere(v.altitude);
        return {
          results: [
            { label: "Temperature", value: r.temperature, unit: "K", highlight: true },
            { label: "Temperature", value: r.temperature - 273.15, unit: "°C" },
            { label: "Pressure", value: r.pressure, unit: "Pa" },
            { label: "Pressure", value: r.pressure / 1000, unit: "kPa" },
            { label: "Density", value: r.density, unit: "kg/m³" },
            { label: "Speed of Sound", value: r.speedOfSound, unit: "m/s" },
            { label: "Dynamic Viscosity", value: r.dynamicViscosity, unit: "Pa·s" },
            { label: "Atmospheric Layer", value: r.layer, unit: "" },
          ],
          interpretation: `At ${v.altitude.toFixed(0)} m altitude in the ${r.layer}: T = ${(r.temperature - 273.15).toFixed(1)}°C, P = ${(r.pressure / 1000).toFixed(2)} kPa, ρ = ${r.density.toFixed(4)} kg/m³.`,
        };
      }}
    />
  );
}

// 12. Wing Loading
function WingLoadingTool() {
  return (
    <ToolShell
      name="Wing Loading Calculator"
      description="Calculate wing loading (W/S) and interpret for aircraft category"
      domain="Aircraft Design · Performance · Sizing"
      inputs={[
        {
          key: "weight",
          label: "Aircraft Weight",
          unit: "N",
          defaultValue: 50000,
          min: 1,
          max: 1e8,
          helpText: "W = m × g₀",
        },
        { key: "wingArea", label: "Wing Area", unit: "m²", defaultValue: 25, min: 0.1, max: 10000 },
      ]}
      equations={["W/S = W / S"]}
      assumptions={["Level flight weight used", "No fuel burn variation"]}
      onCalculate={(v) => {
        const r = computeWingLoading(v.weight, v.wingArea);
        if (!r) return null;
        return {
          results: [
            { label: "Wing Loading", value: r.wingLoading, unit: "N/m² (Pa)", highlight: true },
            { label: "Wing Loading", value: r.wingLoadingImperial, unit: "lb/ft²" },
            { label: "Category", value: r.category, unit: "" },
          ],
          interpretation: r.description,
        };
      }}
    />
  );
}

// 13. Aspect Ratio
function AspectRatioTool() {
  return (
    <ToolShell
      name="Aspect Ratio Calculator"
      description="Calculate wing aspect ratio from span and area"
      domain="Aircraft Design · Aerodynamics"
      inputs={[
        { key: "span", label: "Wingspan", unit: "m", defaultValue: 12, min: 0.01, max: 200 },
        {
          key: "wingArea",
          label: "Wing Area",
          unit: "m²",
          defaultValue: 16,
          min: 0.01,
          max: 10000,
        },
      ]}
      equations={["AR = b² / S"]}
      assumptions={["Planform area used", "Effective for straight/tapered wings"]}
      onCalculate={(v) => {
        const r = computeAspectRatio(v.span, v.wingArea);
        if (!r) return null;
        return {
          results: [
            { label: "Aspect Ratio", value: r.aspectRatio, unit: "—", highlight: true },
            { label: "Mean Chord", value: v.wingArea / v.span, unit: "m" },
            { label: "Classification", value: r.classification, unit: "" },
          ],
          interpretation: r.description,
        };
      }}
    />
  );
}

// 14. Propeller Performance
function PropellerTool() {
  return (
    <ToolShell
      name="Propeller Performance Estimator"
      description="Estimate propeller thrust, power, and efficiency using simplified blade-element theory"
      domain="Propulsion · Aircraft Performance"
      status="beta"
      inputs={[
        {
          key: "diameter",
          label: "Propeller Diameter",
          unit: "m",
          defaultValue: 1.8,
          min: 0.1,
          max: 10,
        },
        {
          key: "rpm",
          label: "Rotational Speed",
          unit: "RPM",
          defaultValue: 2400,
          min: 1,
          max: 50000,
        },
        {
          key: "airspeed",
          label: "Freestream Airspeed",
          unit: "m/s",
          defaultValue: 50,
          min: 0,
          max: 300,
        },
        {
          key: "density",
          label: "Air Density",
          unit: "kg/m³",
          defaultValue: 1.225,
          min: 0.001,
          max: 10,
        },
        {
          key: "ct",
          label: "Thrust Coefficient (CT)",
          unit: "—",
          defaultValue: 0.05,
          min: 0,
          max: 0.5,
          step: 0.005,
        },
        {
          key: "cp",
          label: "Power Coefficient (CP)",
          unit: "—",
          defaultValue: 0.04,
          min: 0.001,
          max: 0.5,
          step: 0.005,
        },
      ]}
      equations={[
        "T = CT · ρ · n² · D⁴",
        "P = CP · ρ · n³ · D⁵",
        "η = J · CT / CP",
        "J = V / (nD)",
      ]}
      assumptions={[
        "CT and CP assumed constant (simplified)",
        "No compressibility correction",
        "Momentum/blade-element model approximation",
      ]}
      onCalculate={(v) => {
        const r = computePropellerPerformance(v.diameter, v.rpm, v.airspeed, v.density, v.ct, v.cp);
        if (!r) return null;
        return {
          results: [
            { label: "Thrust", value: r.thrust, unit: "N", highlight: true },
            { label: "Power", value: r.power / 1000, unit: "kW" },
            { label: "Efficiency", value: r.efficiency * 100, unit: "%" },
            { label: "Advance Ratio (J)", value: r.advanceRatio, unit: "—" },
            { label: "Tip Speed", value: r.tipSpeed, unit: "m/s" },
            { label: "Tip Mach", value: r.tipMach, unit: "—" },
          ],
          interpretation: r.assumptions.join(" "),
        };
      }}
    />
  );
}

// 15. Jet Engine Thrust
function JetThrustTool() {
  return (
    <ToolShell
      name="Jet Engine Thrust Estimator"
      description="Simplified analytical jet engine thrust calculation"
      domain="Propulsion · Gas Turbine Engines"
      inputs={[
        {
          key: "massFlowRate",
          label: "Mass Flow Rate",
          unit: "kg/s",
          defaultValue: 100,
          min: 0.1,
          max: 1000,
        },
        {
          key: "exitVelocity",
          label: "Exit (Exhaust) Velocity",
          unit: "m/s",
          defaultValue: 500,
          min: 1,
          max: 5000,
        },
        {
          key: "flightVelocity",
          label: "Flight Velocity",
          unit: "m/s",
          defaultValue: 230,
          min: 0,
          max: 5000,
        },
        {
          key: "exitPressure",
          label: "Nozzle Exit Pressure",
          unit: "Pa",
          defaultValue: 101325,
          min: 0,
          max: 1e7,
        },
        {
          key: "ambientPressure",
          label: "Ambient Pressure",
          unit: "Pa",
          defaultValue: 101325,
          min: 0,
          max: 200000,
        },
        {
          key: "exitArea",
          label: "Nozzle Exit Area",
          unit: "m²",
          defaultValue: 0.5,
          min: 0.01,
          max: 10,
        },
      ]}
      equations={["F = ṁ(Ve - V₀) + (Pe - Pa)Ae"]}
      assumptions={[
        "Steady-state, 1D flow",
        "No installation losses",
        "Uniform exit conditions",
        "No bleed or power extraction",
      ]}
      onCalculate={(v) => {
        const r = computeJetEngineThrust(
          v.massFlowRate,
          v.exitVelocity,
          v.flightVelocity,
          v.exitPressure,
          v.ambientPressure,
          v.exitArea,
        );
        if (!r) return null;
        return {
          results: [
            { label: "Net Thrust", value: r.thrust, unit: "N", highlight: true },
            { label: "Net Thrust", value: r.thrust / 1000, unit: "kN" },
            { label: "Specific Thrust", value: r.specificThrust, unit: "N·s/kg" },
            { label: "TSFC", value: r.tsfc * 3600, unit: "kg/(N·h)" },
          ],
        };
      }}
    />
  );
}

// 16. Rocket Delta-V
function DeltaVTool() {
  return (
    <ToolShell
      name="Rocket Delta-V Calculator"
      description="Tsiolkovsky rocket equation — ideal velocity change for a single-stage rocket"
      domain="Propulsion · Orbital Mechanics · Rocketry"
      inputs={[
        {
          key: "initialMass",
          label: "Initial (Wet) Mass",
          unit: "kg",
          defaultValue: 100000,
          min: 0.1,
          max: 1e9,
        },
        {
          key: "finalMass",
          label: "Final (Dry) Mass",
          unit: "kg",
          defaultValue: 10000,
          min: 0.1,
          max: 1e9,
          helpText: "Must be less than initial mass",
        },
        {
          key: "isp",
          label: "Specific Impulse (Isp)",
          unit: "s",
          defaultValue: 311,
          min: 1,
          max: 10000,
          helpText: "LOX/RP-1: ~311s, LOX/LH2: ~450s",
        },
      ]}
      equations={["ΔV = Isp · g₀ · ln(m₀/mf)", "Ve = Isp · g₀"]}
      assumptions={[
        "Ideal, no gravity losses",
        "No atmospheric drag",
        "Constant Isp throughout burn",
        "Single stage",
      ]}
      references={["Tsiolkovsky, K.E., 1903"]}
      onCalculate={(v) => {
        const r = computeRocketDeltaVCalc(v.initialMass, v.finalMass, v.isp);
        if (!r) return null;
        return {
          results: [
            { label: "Delta-V", value: r.deltaV, unit: "m/s", highlight: true },
            { label: "Delta-V", value: r.deltaVKmS, unit: "km/s" },
            { label: "Mass Ratio", value: r.massRatio, unit: "—" },
            { label: "Exhaust Velocity", value: r.exhaustVelocity, unit: "m/s" },
            { label: "Propellant Fraction", value: r.propellantFraction * 100, unit: "%" },
          ],
          interpretation: `ΔV of ${r.deltaVKmS.toFixed(2)} km/s with mass ratio ${r.massRatio.toFixed(2)}. ${r.deltaVKmS > 9.4 ? "Sufficient for LEO insertion (≈9.4 km/s with losses)." : "Below LEO insertion requirement (≈9.4 km/s with losses)."}`,
        };
      }}
    />
  );
}

// 17. Rocket Thrust
function RocketThrustTool() {
  return (
    <ToolShell
      name="Rocket Thrust Calculator"
      description="Calculate rocket engine thrust from mass flow rate and exhaust properties"
      domain="Propulsion · Rocketry"
      inputs={[
        {
          key: "massFlowRate",
          label: "Mass Flow Rate",
          unit: "kg/s",
          defaultValue: 250,
          min: 0.01,
          max: 10000,
        },
        {
          key: "exhaustVelocity",
          label: "Exhaust Velocity",
          unit: "m/s",
          defaultValue: 3000,
          min: 1,
          max: 50000,
        },
        {
          key: "exitPressure",
          label: "Exit Pressure",
          unit: "Pa",
          defaultValue: 101325,
          min: 0,
          max: 1e8,
        },
        {
          key: "ambientPressure",
          label: "Ambient Pressure",
          unit: "Pa",
          defaultValue: 101325,
          min: 0,
          max: 200000,
        },
        {
          key: "exitArea",
          label: "Nozzle Exit Area",
          unit: "m²",
          defaultValue: 1.0,
          min: 0.001,
          max: 100,
        },
      ]}
      equations={["F = ṁ·Ve + (Pe - Pa)·Ae", "Isp = Ve / g₀"]}
      assumptions={["Steady-state operation", "Quasi-1D nozzle flow", "Uniform exit conditions"]}
      onCalculate={(v) => {
        const r = computeRocketThrust(
          v.massFlowRate,
          v.exhaustVelocity,
          v.exitPressure,
          v.ambientPressure,
          v.exitArea,
        );
        if (!r) return null;
        return {
          results: [
            { label: "Thrust", value: r.thrust, unit: "N", highlight: true },
            { label: "Thrust", value: r.thrust / 1000, unit: "kN" },
            { label: "Specific Impulse", value: r.specificImpulse, unit: "s" },
            { label: "Thrust Coefficient", value: r.thrustCoeff, unit: "—" },
          ],
        };
      }}
    />
  );
}

// 18. Orbital Velocity
function OrbitalVelocityTool() {
  return (
    <ToolShell
      name="Orbital Velocity Calculator"
      description="Calculate circular orbital velocity around a central body"
      domain="Orbital Mechanics · Astrodynamics"
      inputs={[
        {
          key: "altitude",
          label: "Orbital Altitude",
          unit: "km",
          defaultValue: 400,
          min: 0,
          max: 1e9,
          helpText: "Above surface (e.g., ISS ≈ 408 km)",
        },
        {
          key: "bodyRadius",
          label: "Central Body Radius",
          unit: "km",
          defaultValue: 6371,
          min: 1,
          max: 1e9,
          helpText: "Earth = 6371 km",
        },
        {
          key: "bodyMass",
          label: "Central Body Mass",
          unit: "kg",
          defaultValue: 5.972e24,
          min: 1,
          max: 1e31,
          helpText: "Earth = 5.972×10²⁴ kg",
        },
      ]}
      equations={["v = √(μ/r)", "μ = G·M", "r = R_body + altitude"]}
      assumptions={[
        "Circular orbit",
        "Point mass central body",
        "No perturbations (J2, drag, etc.)",
      ]}
      onCalculate={(v) => {
        const G = PHYSICS_CONSTANTS.G;
        const mu = G * v.bodyMass;
        const r = (v.bodyRadius + v.altitude) * 1000; // m
        const vel = Math.sqrt(mu / r);
        const period = (2 * Math.PI * r) / vel;
        return {
          results: [
            { label: "Orbital Velocity", value: vel, unit: "m/s", highlight: true },
            { label: "Orbital Velocity", value: vel / 1000, unit: "km/s" },
            { label: "Orbital Period", value: period / 60, unit: "min" },
            { label: "Orbital Radius", value: r / 1000, unit: "km" },
          ],
          interpretation: `Circular orbital velocity at ${v.altitude} km altitude: ${(vel / 1000).toFixed(3)} km/s. Period: ${(period / 60).toFixed(1)} minutes.`,
        };
      }}
    />
  );
}

// 19. Escape Velocity
function EscapeVelocityTool() {
  return (
    <ToolShell
      name="Escape Velocity Calculator"
      description="Calculate the minimum velocity to escape a gravitational field"
      domain="Orbital Mechanics · Astrodynamics"
      inputs={[
        {
          key: "altitude",
          label: "Launch Altitude",
          unit: "km",
          defaultValue: 0,
          min: 0,
          max: 1e9,
          helpText: "Above surface",
        },
        {
          key: "bodyRadius",
          label: "Body Radius",
          unit: "km",
          defaultValue: 6371,
          min: 1,
          max: 1e9,
        },
        {
          key: "bodyMass",
          label: "Body Mass",
          unit: "kg",
          defaultValue: 5.972e24,
          min: 1,
          max: 1e31,
        },
      ]}
      equations={["v_esc = √(2μ/r)", "μ = GM"]}
      assumptions={[
        "Point mass central body",
        "No atmospheric drag",
        "No third-body perturbations",
      ]}
      onCalculate={(v) => {
        const G = PHYSICS_CONSTANTS.G;
        const mu = G * v.bodyMass;
        const r = (v.bodyRadius + v.altitude) * 1000;
        const vEsc = Math.sqrt((2 * mu) / r);
        const vCirc = Math.sqrt(mu / r);
        return {
          results: [
            { label: "Escape Velocity", value: vEsc, unit: "m/s", highlight: true },
            { label: "Escape Velocity", value: vEsc / 1000, unit: "km/s" },
            { label: "Circular Velocity", value: vCirc / 1000, unit: "km/s" },
            { label: "Ratio (v_esc/v_circ)", value: vEsc / vCirc, unit: "—" },
          ],
          interpretation: `Escape velocity: ${(vEsc / 1000).toFixed(3)} km/s (= √2 × circular velocity of ${(vCirc / 1000).toFixed(3)} km/s).`,
        };
      }}
    />
  );
}

// 20. Projectile Trajectory
function ProjectileTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [trajData, setTrajData] = useState<any>(null);

  useEffect(() => {
    if (!trajData || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width,
      h = rect.height;
    const pad = 40;
    const drawW = w - 2 * pad,
      drawH = h - 2 * pad;
    ctx.fillStyle = "#060B18";
    ctx.fillRect(0, 0, w, h);

    const { trajectory, range, maxAltitude } = trajData;
    const xMax = range * 1.1;
    const yMax = maxAltitude * 1.3;

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    for (let i = 0; i <= 5; i++) {
      const x = pad + (i / 5) * drawW;
      ctx.beginPath();
      ctx.moveTo(x, pad);
      ctx.lineTo(x, pad + drawH);
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.font = "9px monospace";
      ctx.fillText(`${((i / 5) * xMax).toFixed(0)}m`, x - 10, pad + drawH + 14);
    }

    // Trajectory
    ctx.strokeStyle = "#0EA5E9";
    ctx.lineWidth = 2;
    ctx.beginPath();
    trajectory.forEach((p: any, i: number) => {
      const x = pad + (p.x / xMax) * drawW;
      const y = pad + drawH - (p.y / yMax) * drawH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Labels
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "10px monospace";
    ctx.fillText(`Range: ${range.toFixed(1)} m`, pad + 4, pad + 14);
    ctx.fillText(`Max Alt: ${maxAltitude.toFixed(1)} m`, pad + 4, pad + 26);
  }, [trajData]);

  return (
    <ToolShell
      name="Projectile Trajectory Analysis"
      description="Compute ballistic trajectory, range, max altitude, and time of flight"
      domain="Ballistics · Classical Mechanics"
      inputs={[
        {
          key: "velocity",
          label: "Launch Velocity",
          unit: "m/s",
          defaultValue: 100,
          min: 0.1,
          max: 100000,
        },
        {
          key: "angle",
          label: "Launch Angle",
          unit: "°",
          defaultValue: 45,
          min: 0,
          max: 90,
          step: 1,
        },
        { key: "height", label: "Initial Height", unit: "m", defaultValue: 0, min: 0, max: 100000 },
      ]}
      equations={["x(t) = V₀·cos(θ)·t", "y(t) = h₀ + V₀·sin(θ)·t - ½gt²"]}
      assumptions={[
        "No air resistance (vacuum trajectory)",
        "Flat Earth approximation",
        "Constant g = 9.80665 m/s²",
        "Point mass",
      ]}
      onCalculate={(v) => {
        const r = computeProjectileTrajectory(v.velocity, v.angle, v.height);
        if (!r) return null;
        setTrajData(r);
        return {
          results: [
            { label: "Range", value: r.range, unit: "m", highlight: true },
            { label: "Max Altitude", value: r.maxAltitude, unit: "m" },
            { label: "Time of Flight", value: r.timeOfFlight, unit: "s" },
            { label: "Impact Velocity", value: r.impactVelocity, unit: "m/s" },
            { label: "Impact Angle", value: r.impactAngle, unit: "°" },
          ],
          interpretation: r.assumptions.join(". ") + ".",
          chartData: r,
        };
      }}
      renderVisualization={() => (
        <canvas ref={canvasRef} className="w-full rounded" style={{ height: 220 }} />
      )}
    />
  );
}
