import React from "react";
import { motion } from "framer-motion";
import {
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Database,
  Cpu,
  AlertTriangle,
  Play,
  Sparkles,
} from "lucide-react";

export default function ActiveLearningRoadmapView() {
  const steps = [
    {
      num: "01",
      title: "AI Prediction",
      desc: "Neural operator (AeroGraphNet/FNO) evaluates design candidate in milliseconds.",
      status: "AVAILABLE",
      icon: Sparkles,
      color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    },
    {
      num: "02",
      title: "Uncertainty & Residual Check",
      desc: "Evaluates epistemic variance, physical residual constraints, and out-of-distribution bounds.",
      status: "AVAILABLE",
      icon: ShieldCheck,
      color: "text-purple-400 border-purple-500/30 bg-purple-500/10",
    },
    {
      num: "03",
      title: "Identify High-Error Edge Cases",
      desc: "Flags boundary layer separation or shock boundary interactions with high epistemic error.",
      status: "PLANNED",
      icon: AlertTriangle,
      color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    },
    {
      num: "04",
      title: "Trigger High-Fidelity CFD Solver",
      desc: "Launches targeted OpenFOAM / RANS high-fidelity numerical simulation on HPC worker.",
      status: "PLANNED",
      icon: Cpu,
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    },
    {
      num: "05",
      title: "Append Ground Truth to Dataset",
      desc: "Stores validated CFD result into AeroForge Canonical Dataset Registry with full provenance.",
      status: "PLANNED",
      icon: Database,
      color: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    },
    {
      num: "06",
      title: "Continuous Surrogate Retraining",
      desc: "Fine-tunes neural operator weights to close accuracy gaps in difficult flight envelopes.",
      status: "PLANNED",
      icon: RefreshCw,
      color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    },
  ];

  return (
    <div className="space-y-6 font-sans text-white">
      {/* Intro Header */}
      <div className="bg-[#0A1020] border border-cyan-500/20 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 font-bold">
              AUTONOMOUS ACTIVE LEARNING
            </span>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
              [PLANNED ROADMAP]
            </span>
          </div>
          <h2 className="text-xl font-extrabold font-mono text-white">
            Active Learning Simulation Loop
          </h2>
          <p className="text-xs text-white/60 mt-1 max-w-3xl leading-relaxed">
            A self-correcting computational loop that uses uncertainty quantification to selectively
            trigger expensive classical CFD solvers only when neural surrogate predictions are
            uncertain.
          </p>
        </div>
      </div>

      {/* Visual Workflow Pipeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-[#0A1020] border border-white/10 rounded-xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-2xl font-black text-white/20">{step.num}</span>
                  <span
                    className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${
                      step.status === "AVAILABLE"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {step.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg border ${step.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold font-mono text-white">{step.title}</h3>
                </div>

                <p className="text-xs text-white/60 leading-relaxed font-sans mt-2">{step.desc}</p>
              </div>

              {idx < steps.length - 1 && (
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-end text-white/30">
                  <ArrowRight className="w-4 h-4 text-cyan-400/50" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
