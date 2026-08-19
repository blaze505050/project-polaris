import { useState, useEffect } from "react";
import { Radio, Activity, Cpu, Compass, Orbit, Sparkles } from "lucide-react";

export function HeroHUD() {
  const [telemetry, setTelemetry] = useState({
    altitude: 12450,
    mach: 2.14,
    temp: -48.2,
    packetCount: 1420,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => ({
        altitude: prev.altitude + Math.floor(Math.random() * 12) - 5,
        mach: Number((2.14 + (Math.random() * 0.04 - 0.02)).toFixed(2)),
        temp: Number((-48.2 + (Math.random() * 0.4 - 0.2)).toFixed(1)),
        packetCount: prev.packetCount + 1,
      }));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
      {/* Central Visual Hologram Core */}
      <div className="relative mx-auto size-72 sm:size-80 md:size-96 rounded-full border border-primary/20 bg-gradient-to-b from-primary/10 via-slate-900/50 to-transparent p-4 backdrop-blur-2xl shadow-[0_0_80px_-20px_rgba(197,157,255,0.3)] flex items-center justify-center">
        {/* Orbit Rings */}
        <div className="absolute inset-0 rounded-full border border-dashed border-primary/30 animate-[spin_60s_linear_infinite]" />
        <div className="absolute inset-6 rounded-full border border-accent/20 animate-[spin_40s_linear_infinite_reverse]" />
        <div className="absolute inset-16 rounded-full border border-white/10" />

        {/* Center Pulsing Sphere */}
        <div className="relative flex flex-col items-center justify-center text-center p-6 rounded-full size-40 sm:size-48 bg-slate-950/80 border border-primary/40 shadow-inner">
          <Orbit className="size-8 text-primary animate-pulse" />
          <span className="mt-2 font-display text-sm sm:text-base font-bold text-foreground">POLARIS 1.0</span>
          <span className="text-[10px] font-mono text-primary/80 uppercase tracking-widest mt-0.5">Core Active</span>
          <span className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-mono text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
            RESEARCH ACTIVE
          </span>
        </div>

        {/* Floating Metric 1: Top Left - Sky Atlas Catalog */}
        <div className="absolute -top-4 -left-4 sm:-left-8 card-glow p-3.5 flex items-center gap-3 backdrop-blur-xl border border-white/15 animate-[float-slow_6s_ease-in-out_infinite] shadow-lg">
          <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Compass className="size-4 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-ui text-muted-foreground uppercase tracking-wider">Sky Atlas Catalog</div>
            <div className="font-mono text-xs font-bold text-foreground">110 Deep-Sky Messier Objects</div>
          </div>
        </div>

        {/* Floating Metric 2: Bottom Right - AeroForge CFD */}
        <div className="absolute -bottom-4 -right-4 sm:-right-6 card-glow p-3.5 flex items-center gap-3 backdrop-blur-xl border border-white/15 animate-[float-slow_7s_ease-in-out_infinite_reverse] shadow-lg">
          <div className="size-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
            <Activity className="size-4" />
          </div>
          <div>
            <div className="text-[10px] font-ui text-muted-foreground uppercase tracking-wider">AeroForge Physics</div>
            <div className="font-mono text-xs font-bold text-foreground">Mach {telemetry.mach} · 40+ Solvers</div>
          </div>
        </div>

        {/* Floating Metric 3: Top Right - Expert Masterclasses */}
        <div className="hidden sm:flex absolute -top-3 -right-6 card-glow p-3 items-center gap-2.5 backdrop-blur-xl border border-white/15 animate-[float-slow_8s_ease-in-out_infinite] shadow-lg">
          <div className="size-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Sparkles className="size-3.5" />
          </div>
          <div className="text-left">
            <div className="text-[9px] font-ui text-muted-foreground uppercase tracking-wider">Expert Network</div>
            <div className="font-mono text-xs font-bold text-foreground">ISRO · Aerospace Labs</div>
          </div>
        </div>
      </div>
    </div>
  );
}
