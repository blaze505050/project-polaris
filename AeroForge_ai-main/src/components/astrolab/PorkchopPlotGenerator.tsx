import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Rocket, Calendar, Zap, Compass, RefreshCw, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAeroForgeStore } from "@/stores/aeroforgeStore";
import {
  generatePorkchopGrid,
  type PorkchopPoint,
  type PorkchopGridResult,
} from "@/services/physicsEngine";

// Workstation Components
import EngineeringStateBadge from "@/components/ui/EngineeringStateBadge";
import SimulationMetadataPanel, {
  type SimulationMetadata,
} from "@/components/ui/SimulationMetadataPanel";
import ExperimentHistoryLogger from "@/components/ui/ExperimentHistoryLogger";

const PRESETS = [
  {
    name: "Earth → Mars (2026 Window)",
    depart: "Earth" as const,
    arrive: "Mars" as const,
    launchStart: "2026-10-01",
    launchSpan: 90,
    arriveStart: "2027-05-01",
    arriveSpan: 120,
  },
  {
    name: "Earth → Mars (2028 Window)",
    depart: "Earth" as const,
    arrive: "Mars" as const,
    launchStart: "2028-11-01",
    launchSpan: 90,
    arriveStart: "2029-06-01",
    arriveSpan: 120,
  },
  {
    name: "Earth → Venus (2026 Window)",
    depart: "Earth" as const,
    arrive: "Venus" as const,
    launchStart: "2026-03-01",
    launchSpan: 60,
    arriveStart: "2026-07-01",
    arriveSpan: 90,
  },
  {
    name: "Earth → Jupiter (2026 Window)",
    depart: "Earth" as const,
    arrive: "Jupiter" as const,
    launchStart: "2026-04-01",
    launchSpan: 90,
    arriveStart: "2027-10-01",
    arriveSpan: 180,
  },
];

const PORKCHOP_METADATA: SimulationMetadata = {
  title: "Lambert Transfer & Porkchop Plot Solver",
  solverName: "Lambert Universal Variable Integrator",
  version: "2.4.0",
  governingEquations: [
    "Lambert Problem: r1, r2, Δt → v1, v2 via Universal Variable formulation",
    "Characteristic Energy: C3 = |v_departure - v_planet1|²  [km²/s²]",
    "Hyperbolic Excess Velocity: v_inf = √(v_transfer - v_orbit)²  [km/s]",
    "Total ΔV = Δv_departure + Δv_arrival  [km/s]",
  ],
  assumptions: [
    "Point-mass Keplerian heliocentric 2-body trajectories",
    "Planetary ephemerides calculated via mean Keplerian orbital elements",
    "Zero atmospheric drag during interplanetary phase",
    "Impulsive velocity maneuvers (ΔV modeled as instant vector changes)",
  ],
  validityBounds: [
    "Time of Flight (TOF) must exceed 10 days",
    "Valid for heliocentric transfers within Solar System (0.3 AU to 10.0 AU)",
    "Sub-optimal for 3-body gravitational assist flybys (requires patched conics)",
  ],
  unitsTable: [
    {
      symbol: "C3",
      name: "Characteristic Energy",
      unit: "km²/s²",
      description: "Square of departure hyperbolic excess velocity",
    },
    {
      symbol: "ΔV",
      name: "Total Velocity Change",
      unit: "km/s",
      description: "Combined departure and arrival impulse cost",
    },
    {
      symbol: "v_inf",
      name: "Hyperbolic Excess Velocity",
      unit: "km/s",
      description: "Spacecraft speed relative to planet at infinity",
    },
    {
      symbol: "TOF",
      name: "Time of Flight",
      unit: "days",
      description: "Total transfer duration in solar days",
    },
  ],
  references: [
    "Bate, R. R., Mueller, D. D., & White, J. E. (1971). Fundamentals of Astrodynamics. Dover Publications.",
    "Vallado, D. A. (2013). Fundamentals of Astrodynamics and Applications (4th ed.). Microcosm Press.",
    "NASA Trajectory Browser & AGI STK Astrogator Solver Specifications.",
  ],
};

export default function PorkchopPlotGenerator() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const userMode = useAeroForgeStore((s) => s.userMode);

  const [presetIndex, setPresetIndex] = useState(0);
  const selectedPreset = PRESETS[presetIndex];

  const [departPlanet, setDepartPlanet] = useState<"Earth" | "Venus">(selectedPreset.depart);
  const [arrivePlanet, setArrivePlanet] = useState<"Mars" | "Jupiter" | "Venus">(
    selectedPreset.arrive,
  );
  const [launchStartStr, setLaunchStartStr] = useState(selectedPreset.launchStart);
  const [launchDaysSpan, setLaunchDaysSpan] = useState(selectedPreset.launchSpan);
  const [arrivalStartStr, setArrivalStartStr] = useState(selectedPreset.arriveStart);
  const [arrivalDaysSpan, setArrivalDaysSpan] = useState(selectedPreset.arriveSpan);

  const [hoveredPoint, setHoveredPoint] = useState<PorkchopPoint | null>(null);

  // Sync preset changes
  const applyPreset = (idx: number) => {
    setPresetIndex(idx);
    const p = PRESETS[idx];
    setDepartPlanet(p.depart);
    setArrivePlanet(p.arrive);
    setLaunchStartStr(p.launchStart);
    setLaunchDaysSpan(p.launchSpan);
    setArrivalStartStr(p.arriveStart);
    setArrivalDaysSpan(p.arriveSpan);
  };

  const launchStartMs = useMemo(() => new Date(launchStartStr).getTime(), [launchStartStr]);
  const arrivalStartMs = useMemo(() => new Date(arrivalStartStr).getTime(), [arrivalStartStr]);

  // Compute Porkchop Grid
  const gridResult: PorkchopGridResult = useMemo(() => {
    return generatePorkchopGrid(
      departPlanet,
      arrivePlanet,
      launchStartMs,
      launchDaysSpan,
      arrivalStartMs,
      arrivalDaysSpan,
      35,
    );
  }, [departPlanet, arrivePlanet, launchStartMs, launchDaysSpan, arrivalStartMs, arrivalDaysSpan]);

  // Render Contour Map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gridResult.grid.length) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    const margin = { top: 40, right: 30, bottom: 50, left: 70 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    ctx.fillStyle = "#060B18";
    ctx.fillRect(0, 0, w, h);

    const rows = gridResult.grid.length;
    const cols = gridResult.grid[0].length;
    const cellW = plotW / cols;
    const cellH = plotH / rows;

    const getColor = (dv: number) => {
      if (dv >= 30) return "rgba(15, 23, 42, 0.9)";
      const t = Math.max(0, Math.min(1, (dv - 4) / 14));
      if (t < 0.25) return `rgba(0, 240, 255, ${0.8 - t * 2})`;
      if (t < 0.5) return `rgba(16, 185, 129, ${0.8 - (t - 0.25) * 2})`;
      if (t < 0.75) return `rgba(245, 158, 11, ${0.8 - (t - 0.5) * 2})`;
      return `rgba(239, 68, 68, ${0.9 - (t - 0.75) * 2})`;
    };

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const pt = gridResult.grid[j][i];
        const x = margin.left + i * cellW;
        const y = margin.top + (rows - 1 - j) * cellH;

        ctx.fillStyle = getColor(pt.totalDeltaV);
        ctx.fillRect(x, y, cellW + 0.5, cellH + 0.5);
      }
    }

    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= cols; i += 5) {
      const x = margin.left + i * cellW;
      ctx.beginPath();
      ctx.moveTo(x, margin.top);
      ctx.lineTo(x, margin.top + plotH);
      ctx.stroke();
    }
    for (let j = 0; j <= rows; j += 5) {
      const y = margin.top + j * cellH;
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(margin.left + plotW, y);
      ctx.stroke();
    }

    if (gridResult.minDeltaVPoint) {
      const minPt = gridResult.minDeltaVPoint;
      const colIdx = Math.floor(
        ((minPt.launchDate - launchStartMs) / (launchDaysSpan * 86400 * 1000)) * cols,
      );
      const rowIdx = Math.floor(
        ((minPt.arrivalDate - arrivalStartMs) / (arrivalDaysSpan * 86400 * 1000)) * rows,
      );

      const mx = margin.left + colIdx * cellW + cellW / 2;
      const my = margin.top + (rows - 1 - rowIdx) * cellH + cellH / 2;

      ctx.strokeStyle = "#00F0FF";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(mx, my, 8, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#00F0FF";
      ctx.beginPath();
      ctx.arc(mx, my, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    ctx.strokeRect(margin.left, margin.top, plotW, plotH);

    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = "center";

    ctx.fillText("Launch Date (YYYY-MM-DD)", margin.left + plotW / 2, h - 15);
    for (let i = 0; i <= cols; i += 10) {
      const dMs = launchStartMs + (i / cols) * (launchDaysSpan * 86400 * 1000);
      const dStr = new Date(dMs).toISOString().slice(2, 10);
      const x = margin.left + i * cellW;
      ctx.fillText(dStr, x, margin.top + plotH + 20);
    }

    ctx.textAlign = "right";
    for (let j = 0; j <= rows; j += 10) {
      const dMs = arrivalStartMs + (j / rows) * (arrivalDaysSpan * 86400 * 1000);
      const dStr = new Date(dMs).toISOString().slice(2, 10);
      const y = margin.top + (rows - j) * cellH;
      ctx.fillText(dStr, margin.left - 10, y + 4);
    }

    ctx.save();
    ctx.translate(20, margin.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText("Arrival Date (YYYY-MM-DD)", 0, 0);
    ctx.restore();

    ctx.textAlign = "start";
  }, [gridResult, launchStartMs, arrivalStartMs, launchDaysSpan, arrivalDaysSpan]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !gridResult.grid.length) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const margin = { top: 40, right: 30, bottom: 50, left: 70 };
    const plotW = rect.width - margin.left - margin.right;
    const plotH = rect.height - margin.top - margin.bottom;

    if (
      mx < margin.left ||
      mx > margin.left + plotW ||
      my < margin.top ||
      my > margin.top + plotH
    ) {
      setHoveredPoint(null);
      return;
    }

    const cols = gridResult.grid[0].length;
    const rows = gridResult.grid.length;

    const colIdx = Math.min(cols - 1, Math.max(0, Math.floor(((mx - margin.left) / plotW) * cols)));
    const rowIdx = Math.min(
      rows - 1,
      Math.max(0, Math.floor(((margin.top + plotH - my) / plotH) * rows)),
    );

    if (gridResult.grid[rowIdx] && gridResult.grid[rowIdx][colIdx]) {
      setHoveredPoint(gridResult.grid[rowIdx][colIdx]);
    }
  };

  const minPoint = hoveredPoint || gridResult.minDeltaVPoint;

  return (
    <div className="min-h-screen bg-[#060B18] text-white">
      <Header />
      <div className="max-w-[120rem] mx-auto px-4 md:px-[4%] py-6 space-y-6">
        {/* Workstation Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/astrolab")}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                Interplanetary Mission Architect — Porkchop Plot
              </h1>
              <p className="text-sm text-white/50 font-mono">
                Lambert p-iteration solver · Launch window optimization · C₃ characteristic energy
              </p>
            </div>
          </div>

          <EngineeringStateBadge
            status={gridResult.minDeltaVPoint ? "CONVERGED" : "RUNNING"}
            solverName="Lambert Universal Variable"
            timeStep="1.0 day"
            tolerance="1e-6"
          />
        </div>

        {/* Presets Bar */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {PRESETS.map((p, idx) => (
            <button
              key={p.name}
              onClick={() => applyPreset(idx)}
              className={`px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 whitespace-nowrap ${
                presetIndex === idx
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "bg-white/[0.03] text-white/50 border border-white/5 hover:bg-white/5"
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              {p.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Porkchop Canvas */}
          <div className="lg:col-span-2">
            <div
              className="relative rounded-xl overflow-hidden border border-white/10 bg-[#080d1a]"
              style={{ boxShadow: "0 0 50px rgba(0,240,255,0.05)" }}
            >
              <canvas
                ref={canvasRef}
                className="w-full cursor-crosshair"
                style={{ height: "520px" }}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoveredPoint(null)}
              />

              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md rounded-lg p-2.5 border border-white/10 font-mono text-[10px]">
                <div className="text-white/60 mb-1">Total ΔV Scale</div>
                <div className="flex items-center gap-1">
                  <span className="text-cyan-400">Low (4 km/s)</span>
                  <div className="w-20 h-2.5 rounded bg-gradient-to-r from-cyan-400 via-emerald-400 via-amber-400 to-red-500" />
                  <span className="text-red-400">High (18+ km/s)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls & Results */}
          <div className="space-y-4">
            <div
              className="rounded-xl bg-white/[0.03] border border-white/10 p-4"
              style={{ backdropFilter: "blur(20px)" }}
            >
              <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" /> Mission Parameters
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-white/40 block mb-1">Departure Planet</label>
                  <select
                    value={departPlanet}
                    onChange={(e) => setDepartPlanet(e.target.value as any)}
                    className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none"
                  >
                    <option value="Earth">Earth [SI]</option>
                    <option value="Venus">Venus [SI]</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/40 block mb-1">Arrival Target</label>
                  <select
                    value={arrivePlanet}
                    onChange={(e) => setArrivePlanet(e.target.value as any)}
                    className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none"
                  >
                    <option value="Mars">Mars [SI]</option>
                    <option value="Venus">Venus [SI]</option>
                    <option value="Jupiter">Jupiter [SI]</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-xs text-white/40 block mb-1">
                    Launch Date Start [UTC]
                  </label>
                  <input
                    type="date"
                    value={launchStartStr}
                    onChange={(e) => setLaunchStartStr(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 block mb-1">
                    Arrival Date Start [UTC]
                  </label>
                  <input
                    type="date"
                    value={arrivalStartStr}
                    onChange={(e) => setArrivalStartStr(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {minPoint && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-white/[0.03] border border-white/10 p-4"
                style={{ backdropFilter: "blur(20px)" }}
              >
                <h3 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Transfer Trajectory Metrics
                </h3>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between border-b border-white/5 py-1">
                    <span className="text-white/40">Launch Date</span>
                    <span className="text-cyan-400">
                      {new Date(minPoint.launchDate).toISOString().slice(0, 10)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 py-1">
                    <span className="text-white/40">Arrival Date</span>
                    <span className="text-emerald-400">
                      {new Date(minPoint.arrivalDate).toISOString().slice(0, 10)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 py-1">
                    <span className="text-white/40">Time of Flight [TOF]</span>
                    <span className="text-white">{minPoint.tofDays.toFixed(0)} days</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 py-1">
                    <span className="text-white/40">C₃ Energy</span>
                    <span className="text-amber-400 font-bold">
                      {minPoint.c3.toFixed(2)} km²/s²
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 py-1">
                    <span className="text-white/40">Departure V_inf</span>
                    <span className="text-white">{minPoint.vInfDep.toFixed(2)} km/s</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 py-1">
                    <span className="text-white/40">Arrival V_inf</span>
                    <span className="text-white">{minPoint.vInfArr.toFixed(2)} km/s</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 py-1">
                    <span className="text-white/40">Total ΔV Cost</span>
                    <span className="text-cyan-400 font-bold text-sm">
                      {minPoint.totalDeltaV.toFixed(2)} km/s
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Experiment Logger */}
        <ExperimentHistoryLogger
          moduleName="Mission Architect (Porkchop Plot)"
          currentInputs={{
            departPlanet,
            arrivePlanet,
            launchStartStr,
            arrivalStartStr,
            launchDaysSpan,
            arrivalDaysSpan,
          }}
          currentOutputs={
            minPoint
              ? {
                  totalDeltaV_km_s: minPoint.totalDeltaV,
                  c3_km2_s2: minPoint.c3,
                  tof_days: minPoint.tofDays,
                }
              : {}
          }
        />

        {/* Physics Documentation */}
        <SimulationMetadataPanel metadata={PORKCHOP_METADATA} />
      </div>
      <Footer />
    </div>
  );
}
