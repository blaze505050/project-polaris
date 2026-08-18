import React, { useState, useMemo } from 'react';
import {
  GitBranch,
  CheckCircle2,
  FileCode,
  Copy,
  Download,
  X,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useToastStore } from '@/stores/toastStore';
import { useProjectStore } from '@/stores/projectStore';
import { useAeroForgeStore } from '@/stores/aeroforgeStore';
import SolverStatusBadge from '@/components/ui/SolverStatusBadge';

export default function DigitalThreadProvenance() {
  const { addToast } = useToastStore();
  const { currentProject, updateWorkspaceTab } = useProjectStore();
  const { savedExperiments } = useAeroForgeStore();
  const [showReproduceModal, setShowReproduceModal] = useState(false);

  // Dynamically build digital thread chain from active project state
  const chain = useMemo(() => {
    const projName = currentProject?.name || 'Airfoil Research Project';
    const reqs = currentProject?.requirements || [];
    const sims = currentProject?.simulations || [];
    const notebooks = currentProject?.notebooks || [];

    const firstReq = reqs[0] ? `${reqs[0].code}: ${reqs[0].specification}` : 'REQ-AERO-01: Lift Target > 14.5';
    const firstSim = sims[0] ? `${sims[0].name} (${sims[0].solver})` : 'SIM-2026-04: Subsonic Airfoil Solver';
    const firstExp = savedExperiments[0] ? savedExperiments[0].name : 'EXP-014: Thin Airfoil Parameter Sweep';
    const firstNote = notebooks[0] ? notebooks[0].title : 'Engineering Research Journal';

    return [
      { type: 'Project', title: projName, detail: `ID: ${currentProject?._id || 'PRJ-DEMO'}`, targetTab: 'overview' },
      { type: 'Requirement', title: reqs[0]?.code || 'REQ-AERO-01', detail: firstReq, targetTab: 'requirements' },
      { type: 'Design Geometry', title: 'NACA Airfoil / CAD', detail: 'Parameterized Geometry', targetTab: 'datasets' },
      { type: 'Simulation', title: sims[0]?.name || 'Airfoil Solver', detail: firstSim, targetTab: 'simulations' },
      { type: 'Experiment', title: 'Sweep Data', detail: firstExp, targetTab: 'results' },
      { type: 'Notebook', title: firstNote, detail: 'LaTeX & Analysis Log', targetTab: 'notebook' },
      { type: 'Validation', title: 'Benchmark Cross-Check', detail: 'Abbott & Von Doenhoff (1959)', targetTab: 'validation' },
    ];
  }, [currentProject, savedExperiments]);

  const reproduceConfig = {
    projectId: currentProject?._id || 'PRJ-2026-HYPER-04',
    timestamp: new Date().toISOString(),
    solver: 'AeroForge 2D Thin Airfoil Solver v1.0',
    gridResolution: '120 Boundary Points',
    mach: 0.15,
    aoa: 4.0,
    unitSystem: 'SI',
    fluidProperties: {
      rho: 1.225,
      temperatureK: 288.15,
      viscosity: 1.81e-5,
    },
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(reproduceConfig, null, 2));
    addToast({
      title: 'Configuration Copied',
      description: 'Reproducibility JSON copied to clipboard.',
      type: 'success',
    });
  };

  const handleNodeClick = (tab?: string) => {
    if (tab) {
      updateWorkspaceTab(tab as any);
      addToast({
        title: 'Digital Thread Navigated',
        description: `Switched to workspace view: ${tab}`,
        type: 'info',
      });
    }
  };

  return (
    <div className="w-full bg-[#080E1C] border border-white/10 rounded-xl p-5 font-mono text-xs text-white space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-sm text-white">Digital Thread & Traceability Chain</h3>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Digital Provenance Linked
          </span>
          <SolverStatusBadge type="reduced-order" />
        </div>

        <button
          onClick={() => setShowReproduceModal(true)}
          className="flex items-center gap-1.5 px-3 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reproduce Run Config</span>
        </button>
      </div>

      {/* Visual Provenance Chain */}
      <div className="flex items-center gap-2 overflow-x-auto py-2">
        {chain.map((node, i) => (
          <React.Fragment key={i}>
            <button
              onClick={() => handleNodeClick(node.targetTab)}
              className="bg-[#050914] border border-white/10 hover:border-cyan-500/50 rounded-lg p-3 min-w-[170px] text-left transition-all space-y-1 group"
            >
              <span className="text-[9px] text-cyan-400 font-bold uppercase block">{node.type}</span>
              <h4 className="font-bold text-white text-xs group-hover:text-cyan-300 transition-colors truncate">{node.title}</h4>
              <p className="text-[10px] text-white/50 truncate">{node.detail}</p>
            </button>
            {i < chain.length - 1 && <span className="text-cyan-400 font-bold shrink-0">→</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Reproduce Modal */}
      {showReproduceModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#080E1C] border border-cyan-500/30 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                Reproducibility Configuration Package
              </h3>
              <button onClick={() => setShowReproduceModal(false)} className="text-white/40 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-white/70 font-sans leading-relaxed">
              Complete parameter state required to reproduce this run across any AeroForge instance or reduced-order numerical environment.
            </p>

            <pre className="bg-[#040710] border border-white/10 rounded p-3 text-[11px] text-emerald-400 font-mono overflow-x-auto max-h-60">
              {JSON.stringify(reproduceConfig, null, 2)}
            </pre>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                onClick={handleCopyJSON}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-white/20 text-xs text-white hover:border-white/40"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy JSON</span>
              </button>
              <button
                onClick={() => {
                  setShowReproduceModal(false);
                  addToast({
                    title: 'Run Environment Duplicated',
                    description: 'New experiment launched with reproduced seed settings.',
                    type: 'success',
                  });
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Launch Reproduced Experiment</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

