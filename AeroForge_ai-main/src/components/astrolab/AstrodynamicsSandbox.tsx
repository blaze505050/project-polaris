import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Pause, RotateCcw, Zap, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAeroForgeStore } from "@/stores/aeroforgeStore";
import {
  rk4NBodyStep,
  computeNBodyEnergy,
  type NBodyState,
  PHYSICS_CONSTANTS,
} from "@/services/physicsEngine";

interface BodyConfig extends NBodyState {
  name: string;
  color: string;
  trail: Array<{ x: number; y: number; alpha: number }>;
}

const PRESETS: Record<string, { name: string; bodies: BodyConfig[] }> = {
  "sun-earth-moon": {
    name: "Sun — Earth — Mars",
    bodies: [
      { name: "Sun", x: 0, y: 0, vx: 0, vy: 0, mass: 1.989e30, color: "#F59E0B", trail: [] },
      {
        name: "Earth",
        x: 1.496e11,
        y: 0,
        vx: 0,
        vy: 29780,
        mass: 5.972e24,
        color: "#00F0FF",
        trail: [],
      },
      {
        name: "Mars",
        x: 2.279e11,
        y: 0,
        vx: 0,
        vy: 24070,
        mass: 6.417e23,
        color: "#FF007A",
        trail: [],
      },
    ],
  },
  "binary-star": {
    name: "Binary Star + Planet",
    bodies: [
      {
        name: "Star A",
        x: -5e10,
        y: 0,
        vx: 0,
        vy: -15000,
        mass: 1.5e30,
        color: "#F59E0B",
        trail: [],
      },
      {
        name: "Star B",
        x: 5e10,
        y: 0,
        vx: 0,
        vy: 15000,
        mass: 1.2e30,
        color: "#A78BFA",
        trail: [],
      },
      { name: "Planet", x: 3e11, y: 0, vx: 0, vy: 20000, mass: 1e25, color: "#00F0FF", trail: [] },
    ],
  },
  "figure-eight": {
    name: "Figure-8 Three-Body",
    bodies: [
      {
        name: "Body 1",
        x: -1e11,
        y: 0,
        vx: 0,
        vy: -20000,
        mass: 1e30,
        color: "#00F0FF",
        trail: [],
      },
      { name: "Body 2", x: 1e11, y: 0, vx: 0, vy: 20000, mass: 1e30, color: "#FF007A", trail: [] },
      {
        name: "Body 3",
        x: 0,
        y: 1.5e11,
        vx: 15000,
        vy: 0,
        mass: 1e30,
        color: "#10B981",
        trail: [],
      },
    ],
  },
};

export default function AstrodynamicsSandbox() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const userMode = useAeroForgeStore((s) => s.userMode);

  const [preset, setPreset] = useState("sun-earth-moon");
  const [bodies, setBodies] = useState<BodyConfig[]>(
    PRESETS["sun-earth-moon"].bodies.map((b) => ({ ...b, trail: [] })),
  );
  const [isRunning, setIsRunning] = useState(true);
  const [timeStep, setTimeStep] = useState(86400); // 1 day in seconds
  const [stepsPerFrame, setStepsPerFrame] = useState(5);
  const [trailLength, setTrailLength] = useState(300);
  const [showTrails, setShowTrails] = useState(true);
  const [simTime, setSimTime] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [initialEnergy, setInitialEnergy] = useState<number | null>(null);
  const [currentEnergy, setCurrentEnergy] = useState(0);
  const [selectedBody, setSelectedBody] = useState<number | null>(null);

  const bodiesRef = useRef(bodies);
  bodiesRef.current = bodies;

  // Load preset
  const loadPreset = useCallback((key: string) => {
    setPreset(key);
    const newBodies = PRESETS[key].bodies.map((b) => ({ ...b, trail: [] }));
    setBodies(newBodies);
    setSimTime(0);
    setInitialEnergy(null);
  }, []);

  // Animation loop with RK4 integration
  useEffect(() => {
    if (!isRunning) return;

    const animate = () => {
      setBodies((prev) => {
        // Extract NBodyState for physics engine
        let states: NBodyState[] = prev.map((b) => ({
          x: b.x,
          y: b.y,
          vx: b.vx,
          vy: b.vy,
          mass: b.mass,
        }));

        // Multiple RK4 steps per frame for speed
        for (let s = 0; s < stepsPerFrame; s++) {
          states = rk4NBodyStep(states, timeStep);
        }

        // Energy monitoring
        const energy = computeNBodyEnergy(states);
        setCurrentEnergy(energy);
        setInitialEnergy((prev) => (prev === null ? energy : prev));

        // Update body configs with trails
        return prev.map((b, i) => {
          const newTrail = [...b.trail, { x: states[i].x, y: states[i].y, alpha: 1 }];
          const trimmed = newTrail.length > trailLength ? newTrail.slice(-trailLength) : newTrail;
          return {
            ...b,
            x: states[i].x,
            y: states[i].y,
            vx: states[i].vx,
            vy: states[i].vy,
            trail: trimmed.map((p, j) => ({ ...p, alpha: (j + 1) / trimmed.length })),
          };
        });
      });

      setSimTime((t) => t + timeStep * stepsPerFrame);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [isRunning, timeStep, stepsPerFrame, trailLength]);

  // Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
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

    // Clear
    ctx.fillStyle = "#060B18";
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 0.5;
    const gridSize = 60;
    for (let x = cx % gridSize; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = cy % gridSize; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Auto-scale: find max extent
    let maxExtent = 1e11;
    for (const b of bodies) {
      maxExtent = Math.max(maxExtent, Math.abs(b.x), Math.abs(b.y));
    }
    const scale = (Math.min(w, h) * 0.4 * zoom) / maxExtent;

    const toScreen = (x: number, y: number) => ({
      sx: cx + x * scale,
      sy: cy - y * scale,
    });

    // Draw trails
    if (showTrails) {
      bodies.forEach((body) => {
        if (body.trail.length < 2) return;
        for (let i = 1; i < body.trail.length; i++) {
          const p0 = toScreen(body.trail[i - 1].x, body.trail[i - 1].y);
          const p1 = toScreen(body.trail[i].x, body.trail[i].y);

          const r = parseInt(body.color.slice(1, 3), 16);
          const g = parseInt(body.color.slice(3, 5), 16);
          const b2 = parseInt(body.color.slice(5, 7), 16);
          ctx.strokeStyle = `rgba(${r},${g},${b2},${body.trail[i].alpha * 0.5})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(p0.sx, p0.sy);
          ctx.lineTo(p1.sx, p1.sy);
          ctx.stroke();
        }
      });
    }

    // Draw bodies
    bodies.forEach((body, i) => {
      const { sx, sy } = toScreen(body.x, body.y);

      // Glow
      const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 20);
      glow.addColorStop(0, body.color + "60");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(sx, sy, 20, 0, Math.PI * 2);
      ctx.fill();

      // Body
      const bodySize = Math.max(4, Math.log10(body.mass) - 20);
      ctx.fillStyle = body.color;
      ctx.beginPath();
      ctx.arc(sx, sy, bodySize, 0, Math.PI * 2);
      ctx.fill();

      // Selected indicator
      if (selectedBody === i) {
        ctx.strokeStyle = body.color;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(sx, sy, bodySize + 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Label
      ctx.fillStyle = body.color;
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText(body.name, sx + bodySize + 6, sy - 6);
    });

    // HUD: Energy conservation
    if (initialEnergy !== null) {
      const dE =
        initialEnergy !== 0 ? Math.abs((currentEnergy - initialEnergy) / initialEnergy) : 0;
      ctx.fillStyle = dE < 0.001 ? "#10B981" : dE < 0.01 ? "#F59E0B" : "#EF4444";
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`ΔE/E₀ = ${(dE * 100).toFixed(6)}%`, 10, h - 10);
    }

    // Time display
    const days = simTime / 86400;
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText(`T = ${days.toFixed(1)} days`, 10, 20);
  }, [bodies, zoom, showTrails, selectedBody, initialEnergy, currentEnergy, simTime]);

  const energyDrift =
    initialEnergy && initialEnergy !== 0
      ? ((currentEnergy - initialEnergy) / Math.abs(initialEnergy)) * 100
      : 0;

  return (
    <div className="min-h-screen bg-[#060B18] text-white">
      <Header />
      <div className="max-w-[120rem] mx-auto px-4 md:px-[4%] py-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/astrolab")}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent">
              Astrodynamics Sandbox — N-Body RK4 Simulator
            </h1>
            <p className="text-sm text-white/50 font-mono">
              4th-order Runge-Kutta gravitational N-body integrator
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Simulation Canvas */}
          <div className="lg:col-span-3">
            <div
              className="relative rounded-xl overflow-hidden border border-white/10"
              style={{ boxShadow: "0 0 60px rgba(16,185,129,0.05)" }}
            >
              <canvas
                ref={canvasRef}
                className="w-full"
                style={{ height: "600px" }}
                onWheel={(e) => {
                  e.preventDefault();
                  setZoom((z) => Math.max(0.1, Math.min(20, z * (e.deltaY > 0 ? 0.9 : 1.1))));
                }}
              />

              {/* Controls */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="p-2.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 hover:border-green-500/50 transition-all"
                >
                  {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => loadPreset(preset)}
                  className="p-2.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 hover:border-green-500/50 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Energy conservation badge */}
              <div
                className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm border font-mono text-xs ${
                  Math.abs(energyDrift) < 0.001
                    ? "border-green-500/30 text-green-400"
                    : Math.abs(energyDrift) < 0.1
                      ? "border-amber-500/30 text-amber-400"
                      : "border-red-500/30 text-red-400"
                }`}
              >
                <BarChart3 className="w-3 h-3 inline mr-1" />
                ΔE/E₀ = {energyDrift.toFixed(6)}%
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-4">
            {/* Presets */}
            <div
              className="rounded-xl bg-white/[0.03] border border-white/10 p-4"
              style={{ backdropFilter: "blur(20px)" }}
            >
              <h3 className="text-sm font-semibold text-white/70 mb-3">Presets</h3>
              <div className="space-y-1.5">
                {Object.entries(PRESETS).map(([key, p]) => (
                  <button
                    key={key}
                    onClick={() => loadPreset(key)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      preset === key
                        ? "bg-green-500/10 border border-green-500/30 text-green-400"
                        : "border border-white/5 hover:bg-white/[0.05] text-white/60"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Controls */}
            <div
              className="rounded-xl bg-white/[0.03] border border-white/10 p-4"
              style={{ backdropFilter: "blur(20px)" }}
            >
              <h3 className="text-sm font-semibold text-white/70 mb-3">Integration</h3>
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/50">Time Step</span>
                  <span className="font-mono text-green-400">
                    {(timeStep / 3600).toFixed(1)} hrs
                  </span>
                </div>
                <input
                  type="range"
                  min={3600}
                  max={604800}
                  step={3600}
                  value={timeStep}
                  onChange={(e) => setTimeStep(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-400 [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/50">Steps/Frame</span>
                  <span className="font-mono text-green-400">{stepsPerFrame}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={stepsPerFrame}
                  onChange={(e) => setStepsPerFrame(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-400 [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/50">Trail Length</span>
                  <span className="font-mono text-green-400">{trailLength}</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={1000}
                  step={50}
                  value={trailLength}
                  onChange={(e) => setTrailLength(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-400 [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
            </div>

            {/* Body Data */}
            <div
              className="rounded-xl bg-white/[0.03] border border-white/10 p-4"
              style={{ backdropFilter: "blur(20px)" }}
            >
              <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-400" /> Body States
              </h3>
              <div className="space-y-3">
                {bodies.map((b, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: b.color }}
                      />
                      <span className="text-xs font-semibold">{b.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs font-mono text-white/40">
                      <span>m: {b.mass.toExponential(2)}</span>
                      <span>v: {Math.sqrt(b.vx ** 2 + b.vy ** 2).toExponential(2)} m/s</span>
                      {userMode === "professional" && (
                        <>
                          <span>x: {b.x.toExponential(3)}</span>
                          <span>y: {b.y.toExponential(3)}</span>
                          <span>vx: {b.vx.toExponential(3)}</span>
                          <span>vy: {b.vy.toExponential(3)}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {userMode === "student" && (
              <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                <p className="text-xs text-green-400/80">
                  💡 <strong>RK4 Integration</strong> uses 4 force evaluations per step for high
                  accuracy. Watch the ΔE/E₀ indicator — values near 0% mean energy is conserved
                  (physically correct simulation).
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
