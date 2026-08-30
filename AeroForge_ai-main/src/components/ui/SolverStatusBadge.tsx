import React from "react";
import { Cpu, FlaskConical, Calculator, Sparkles, CheckCircle2 } from "lucide-react";

export type SolverClassificationType =
  "analytical" | "reduced-order" | "numerical" | "experimental-ref" | "physics-ai";

interface SolverStatusBadgeProps {
  type: SolverClassificationType;
  className?: string;
}

export default function SolverStatusBadge({ type, className = "" }: SolverStatusBadgeProps) {
  switch (type) {
    case "analytical":
      return (
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 ${className}`}
        >
          <Calculator className="w-3 h-3" />
          ANALYTICAL MODEL
        </span>
      );

    case "reduced-order":
      return (
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 ${className}`}
        >
          <Cpu className="w-3 h-3" />
          REDUCED-ORDER SOLVER
        </span>
      );

    case "numerical":
      return (
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30 ${className}`}
        >
          <Cpu className="w-3 h-3" />
          NUMERICAL SIMULATOR
        </span>
      );

    case "experimental-ref":
      return (
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 ${className}`}
        >
          <FlaskConical className="w-3 h-3" />
          EXPERIMENTAL REF
        </span>
      );

    case "physics-ai":
      return (
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 ${className}`}
        >
          <Sparkles className="w-3 h-3" />
          PHYSICS AI — EXPERIMENTAL
        </span>
      );

    default:
      return null;
  }
}
