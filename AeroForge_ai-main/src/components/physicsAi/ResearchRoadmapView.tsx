import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Rocket, ShieldCheck, Sparkles, CheckCircle2, Clock, Cpu, ArrowRight } from 'lucide-react';

export default function ResearchRoadmapView() {
  const phases = [
    {
      phase: 'PHASE 1',
      title: 'Airfoil Surrogate Prototype',
      desc: 'Instantaneous 2D NACA airfoil pressure distribution ($C_p$), lift ($C_l$), and drag ($C_d$) surrogate with analytical solver verification.',
      status: 'AVAILABLE (LIVE IN BETA)',
      statusColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    {
      phase: 'PHASE 2',
      title: 'Mesh-Based Aerodynamic Prediction',
      desc: 'Graph neural network (AeroGraphNet) inference on 3D unstructured surface meshes for whole-airframe pressure field mapping.',
      status: 'PROTOTYPE',
      statusColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    },
    {
      phase: 'PHASE 3',
      title: 'Physics-Informed Models',
      desc: 'PINO & physics loss operators penalizing Navier-Stokes PDE residuals directly during neural network training.',
      status: 'RESEARCH',
      statusColor: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    },
    {
      phase: 'PHASE 4',
      title: 'CFD Surrogate + Classical Solver Correction',
      desc: 'Hybrid simulation engine utilizing neural surrogate prediction for initial guess, followed by coarse CFD iterative residual correction.',
      status: 'PLANNED',
      statusColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    },
    {
      phase: 'PHASE 5',
      title: 'Multi-Physics Surrogate Models',
      desc: 'Coupled aerodynamic, aerothermal heat transfer, and structural FEA elasticity neural operators for multi-disciplinary optimization.',
      status: 'PLANNED',
      statusColor: 'bg-white/5 text-white/40 border-white/10',
    },
    {
      phase: 'PHASE 6',
      title: 'AeroForge Physics Foundation Model',
      desc: 'Large physics foundation model pre-trained on multi-terabyte CFD/FEA simulation datasets, unified geometry encodings, and physics tokens.',
      status: 'R&D CONCEPT ONLY',
      statusColor: 'bg-white/5 text-white/40 border-white/10',
    },
  ];

  return (
    <div className="space-y-8 font-sans text-white">
      {/* Intro Header */}
      <div className="bg-[#0A1020] border border-cyan-500/20 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 font-bold">
              SCIENTIFIC ROADMAP
            </span>
          </div>
          <h2 className="text-xl font-extrabold font-mono text-white">AeroForge Physics AI Development Roadmap</h2>
          <p className="text-xs text-white/60 mt-1 max-w-3xl leading-relaxed">
            Transparent 6-phase roadmap outlining the progression from lightweight surrogate prototypes to future multi-physics neural foundation operators.
          </p>
        </div>
      </div>

      {/* 6 Phase Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {phases.map((ph, idx) => (
          <motion.div
            key={ph.phase}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-[#0A1020] border border-white/10 rounded-xl p-5 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3 font-mono">
                <span className="text-xs font-bold text-cyan-400">{ph.phase}</span>
                <span className={`px-2 py-0.5 rounded border text-[9px] font-bold ${ph.statusColor}`}>
                  {ph.status}
                </span>
              </div>
              <h3 className="text-base font-bold font-mono text-white mb-2">{ph.title}</h3>
              <p className="text-xs text-white/60 leading-relaxed font-sans">{ph.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* LONG-TERM FOUNDATION MODEL CONCEPT ARCHITECTURE */}
      <div className="bg-[#0A1020] border border-purple-500/30 rounded-xl p-6 shadow-2xl space-y-6">
        <div className="border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-extrabold font-mono text-white">
              Long-Term AeroForge Physics Foundation Model (R&D Concept)
            </h3>
          </div>
          <p className="text-xs text-white/60 max-w-3xl leading-relaxed">
            Conceptual multi-modal architecture mapping raw CAD geometry tokens, unstructured mesh graphs, and physical boundary conditions into unified spatial-spectral neural representations.
          </p>
        </div>

        {/* Conceptual Pipeline Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 font-mono text-xs items-center text-center">
          <div className="bg-[#060B18] p-3 rounded-lg border border-white/10">
            <span className="text-[10px] text-cyan-400 block font-bold">CAD / GEOMETRY</span>
            <span className="text-white/60 text-[10px]">STEP / STL / SDF</span>
          </div>

          <ArrowRight className="w-4 h-4 text-white/30 hidden md:block justify-self-center" />

          <div className="bg-[#060B18] p-3 rounded-lg border border-white/10">
            <span className="text-[10px] text-cyan-400 block font-bold">MESH & GRAPH</span>
            <span className="text-white/60 text-[10px]">Graph Tokens</span>
          </div>

          <ArrowRight className="w-4 h-4 text-white/30 hidden md:block justify-self-center" />

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-500/40 col-span-1 md:col-span-1 shadow-lg">
            <span className="text-xs text-purple-300 font-bold block">AEROFORGE PHYSICS ENGINE</span>
            <span className="text-[9px] text-purple-400/80 block mt-0.5">Neural Operator Transformer</span>
          </div>

          <ArrowRight className="w-4 h-4 text-white/30 hidden md:block justify-self-center" />

          <div className="bg-[#060B18] p-3 rounded-lg border border-emerald-500/30">
            <span className="text-[10px] text-emerald-400 block font-bold">VERIFIED RESULT</span>
            <span className="text-white/60 text-[10px]">Numerical Solver Check</span>
          </div>
        </div>
      </div>
    </div>
  );
}
