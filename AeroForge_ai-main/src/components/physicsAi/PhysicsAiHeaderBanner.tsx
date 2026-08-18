import React from 'react';
import { AlertTriangle, Cpu, ShieldCheck, Zap } from 'lucide-react';

interface Props {
  computeTarget?: string;
}

export default function PhysicsAiHeaderBanner({ computeTarget = 'Browser Client (Surrogate Hybrid)' }: Props) {
  return (
    <div className="w-full bg-[#080E22] border-b border-cyan-500/20 px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        {/* Left: Experimental Badges & Disclaimer */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="px-2.5 py-1 rounded bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 text-cyan-300 font-mono font-extrabold tracking-wider uppercase text-[10px] flex items-center gap-1.5 shadow-sm">
            <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
            EXPERIMENTAL PHYSICS AI LAB
          </span>

          <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-[10px] flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            PREDICTION — NOT VERIFIED
          </span>

          <span className="text-white/60 font-sans text-[11px] hidden lg:inline max-w-xl">
            Physics-informed surrogate research tool. Predictions must be validated against analytical or numerical solvers.
          </span>
        </div>

        {/* Right: Compute Status */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-lg font-mono text-[11px]">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-white/40 uppercase">Compute:</span>
          <span className="text-cyan-300 font-semibold">{computeTarget}</span>
        </div>
      </div>
    </div>
  );
}
