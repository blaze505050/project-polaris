import React from 'react';
import { Activity, CheckCircle2, AlertTriangle, XCircle, Info, RefreshCw } from 'lucide-react';

export type SolverStatus = 'RUNNING' | 'CONVERGED' | 'COMPLETED' | 'WARNING' | 'FAILED' | 'OUT_OF_RANGE' | 'APPROXIMATION';

interface EngineeringStateBadgeProps {
  status: SolverStatus;
  solverName?: string;
  timeStep?: string;
  tolerance?: string;
  className?: string;
}

export default function EngineeringStateBadge({
  status,
  solverName = 'RK4 Numerical Integration',
  timeStep,
  tolerance,
  className = '',
}: EngineeringStateBadgeProps) {
  const statusConfig = {
    RUNNING: { label: 'SOLVER RUNNING', color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10', icon: RefreshCw, animate: true },
    CONVERGED: { label: 'SOLVER CONVERGED', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10', icon: CheckCircle2, animate: false },
    COMPLETED: { label: 'SIMULATION COMPLETE', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10', icon: CheckCircle2, animate: false },
    WARNING: { label: 'MODEL BOUNDARY WARNING', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10', icon: AlertTriangle, animate: false },
    FAILED: { label: 'SOLVER CONVERGENCE FAIL', color: 'text-red-400 border-red-500/30 bg-red-500/10', icon: XCircle, animate: false },
    OUT_OF_RANGE: { label: 'OUT OF MODEL BOUNDS', color: 'text-red-400 border-red-500/30 bg-red-500/10', icon: AlertTriangle, animate: false },
    APPROXIMATION: { label: 'PHYSICAL APPROXIMATION', color: 'text-purple-400 border-purple-500/30 bg-purple-500/10', icon: Info, animate: false },
  }[status];

  const IconComponent = statusConfig.icon;

  return (
    <div className={`flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 rounded-lg border font-mono text-xs ${statusConfig.color} ${className}`}>
      <div className="flex items-center gap-2">
        <IconComponent className={`w-3.5 h-3.5 ${statusConfig.animate ? 'animate-spin' : ''}`} />
        <span className="font-bold tracking-wider uppercase text-[10px]">{statusConfig.label}</span>
      </div>

      <div className="flex items-center gap-3 text-[10px] opacity-80">
        <span>METHOD: <strong className="text-white">{solverName}</strong></span>
        {timeStep && <span>Δt: <strong className="text-white">{timeStep}</strong></span>}
        {tolerance && <span>TOL: <strong className="text-white">{tolerance}</strong></span>}
      </div>
    </div>
  );
}
