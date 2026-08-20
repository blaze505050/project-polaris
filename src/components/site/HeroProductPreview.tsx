import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Activity, Cpu, ArrowRight, Play, RefreshCw, Gauge, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroProductPreview() {
  const [mach, setMach] = useState(0.42);
  const [alpha, setAlpha] = useState(3.5);
  const [airfoil, setAirfoil] = useState<"2412" | "0012" | "4415">("2412");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Compute live aerodynamic physics parameters
  const aero = useMemo(() => {
    const cl0 = airfoil === "0012" ? 0.0 : airfoil === "2412" ? 0.24 : 0.44;
    const cl = Number((cl0 + 0.11 * alpha * (1 / Math.sqrt(Math.max(0.1, 1 - mach * mach)))).toFixed(3));
    const cd0 = airfoil === "0012" ? 0.008 : 0.009;
    const cd = Number((cd0 + 0.045 * cl * cl + (mach > 0.75 ? Math.pow(mach - 0.75, 3) * 0.5 : 0)).toFixed(4));
    const reynolds = Number((mach * 5.2).toFixed(2));
    const ld = Number((cl / Math.max(0.001, cd)).toFixed(1));
    return { cl, cd, reynolds, ld };
  }, [mach, alpha, airfoil]);

  // Draw real-time airfoil streamlines on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let offset = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2 + 10;

      // Draw background flow streamlines
      ctx.strokeStyle = "rgba(197, 157, 255, 0.18)";
      ctx.lineWidth = 1;
      const lines = 7;
      for (let i = 0; i < lines; i++) {
        const yBase = (h / (lines + 1)) * (i + 1);
        ctx.beginPath();
        for (let x = 0; x <= w; x += 10) {
          // streamline deflection around airfoil
          const dx = x - cx;
          const dist = Math.sqrt(dx * dx + (yBase - cy) * (yBase - cy));
          const deflection = (1 / Math.max(30, dist)) * 40 * Math.sin(alpha * 0.05);
          const y = yBase - deflection;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Draw Airfoil profile
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((-alpha * Math.PI) / 180);

      ctx.beginPath();
      const chord = w * 0.52;
      ctx.moveTo(-chord / 2, 0);

      // Upper surface
      const t = airfoil === "4415" ? 0.15 : 0.12;
      const m = airfoil === "2412" ? 0.02 : airfoil === "4415" ? 0.04 : 0.0;
      for (let x = -chord / 2; x <= chord / 2; x += 5) {
        const xc = (x + chord / 2) / chord;
        const yt = 5 * t * (0.2969 * Math.sqrt(xc) - 0.126 * xc - 0.3516 * xc * xc + 0.2843 * Math.pow(xc, 3) - 0.1015 * Math.pow(xc, 4));
        const yc = m * (2 * xc - xc * xc);
        ctx.lineTo(x, -(yc + yt) * chord * 0.7);
      }
      // Lower surface
      for (let x = chord / 2; x >= -chord / 2; x -= 5) {
        const xc = (x + chord / 2) / chord;
        const yt = 5 * t * (0.2969 * Math.sqrt(xc) - 0.126 * xc - 0.3516 * xc * xc + 0.2843 * Math.pow(xc, 3) - 0.1015 * Math.pow(xc, 4));
        const yc = m * (2 * xc - xc * xc);
        ctx.lineTo(x, -(yc - yt) * chord * 0.7);
      }
      ctx.closePath();

      // Airfoil gradient fill
      const grad = ctx.createLinearGradient(-chord / 2, -20, chord / 2, 20);
      grad.addColorStop(0, "#C59DFF");
      grad.addColorStop(1, "#7c3aed");
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();

      offset += 1;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [mach, alpha, airfoil]);

  return (
    <div className="w-full rounded-2xl border border-white/12 bg-surface/85 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12)] overflow-hidden">
      {/* Cockpit Window Header */}
      <div className="flex items-center justify-between border-b border-white/8 bg-white/[0.02] px-4 py-2.5 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-destructive/70 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
          <span className="size-2.5 rounded-full bg-gold/70 shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
          <span className="size-2.5 rounded-full bg-emerald-400/70 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
          <span className="ml-2 font-semibold text-primary text-[11px]">
            AeroForge://transonic-cfd
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-emerald-400 font-bold uppercase">SOLVER ACTIVE</span>
        </div>
      </div>

      {/* Interactive Simulation Display Canvas */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="relative rounded-xl border border-white/8 bg-slate-950/90 overflow-hidden h-44 sm:h-52 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={480}
            height={220}
            className="w-full h-full object-contain"
          />

          {/* Live Telemetry Overlay Tag */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono">
            <span className="text-muted-foreground">NACA {airfoil}</span>
            <span className="text-white/20">|</span>
            <span className="text-primary font-bold">α = {alpha}°</span>
          </div>

          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono">
            <span className="text-muted-foreground">L/D Ratio:</span>
            <span className="text-gold font-bold">{aero.ld}</span>
          </div>
        </div>

        {/* Live Controls: Airfoil, Mach, Alpha */}
        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">
              Airfoil Profile
            </label>
            <div className="flex gap-1">
              {(["2412", "0012", "4415"] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setAirfoil(code)}
                  className={`flex-1 py-1 rounded text-[11px] font-bold transition-colors ${
                    airfoil === code
                      ? "bg-primary text-background"
                      : "bg-surface-2 text-muted-foreground hover:text-foreground border border-white/8"
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
              <span>Mach Speed</span>
              <span className="text-primary font-bold font-mono">M {mach.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0.15}
              max={0.95}
              step={0.01}
              value={mach}
              onChange={(e) => setMach(parseFloat(e.target.value))}
              className="w-full accent-primary h-1.5 bg-surface-3 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
              <span>Angle (α)</span>
              <span className="text-gold font-bold font-mono">{alpha.toFixed(1)}°</span>
            </div>
            <input
              type="range"
              min={-2}
              max={12}
              step={0.5}
              value={alpha}
              onChange={(e) => setAlpha(parseFloat(e.target.value))}
              className="w-full accent-gold h-1.5 bg-surface-3 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Computed Solver Values Bar */}
        <div className="grid grid-cols-4 gap-2 pt-1 font-mono text-center">
          <div className="p-2 rounded-lg bg-surface-2/60 border border-white/6">
            <span className="text-[9px] text-muted-foreground uppercase block">Lift (CL)</span>
            <span className="text-xs sm:text-sm font-bold text-foreground mt-0.5 block">{aero.cl}</span>
          </div>
          <div className="p-2 rounded-lg bg-surface-2/60 border border-white/6">
            <span className="text-[9px] text-muted-foreground uppercase block">Drag (CD)</span>
            <span className="text-xs sm:text-sm font-bold text-primary mt-0.5 block">{aero.cd}</span>
          </div>
          <div className="p-2 rounded-lg bg-surface-2/60 border border-white/6">
            <span className="text-[9px] text-muted-foreground uppercase block">Reynolds</span>
            <span className="text-xs sm:text-sm font-bold text-foreground mt-0.5 block">{aero.reynolds}M</span>
          </div>
          <div className="p-2 rounded-lg bg-surface-2/60 border border-white/6">
            <span className="text-[9px] text-muted-foreground uppercase block">Solvers</span>
            <span className="text-xs sm:text-sm font-bold text-emerald-400 mt-0.5 block">40+ In Lab</span>
          </div>
        </div>

        {/* Quick Launch CTA */}
        <div className="pt-2 flex items-center justify-between border-t border-white/8 text-xs font-mono">
          <span className="text-muted-foreground text-[11px]">
            Spalart-Allmaras & Prandtl-Glauert CFD
          </span>
          <Button asChild size="sm" className="h-8 px-4 text-xs font-mono font-bold bg-foreground text-background hover:bg-foreground/90 rounded-lg">
            <Link to="/projects" className="flex items-center gap-1.5">
              <span>Open AeroForge Lab</span>
              <ArrowRight className="size-3 text-primary" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
