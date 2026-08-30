import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Wind,
  Rocket,
  Wrench,
  FlaskConical,
  Compass,
  Cpu,
  Target,
  BarChart3,
  BookOpen,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X,
} from "lucide-react";
import { useAeroForgeStore } from "@/stores/aeroforgeStore";
import { useProjectStore } from "@/stores/projectStore";

const WHAT_BUILDING = [
  {
    id: "uav",
    label: "Aircraft / UAV",
    desc: "Airfoils, wings, flight dynamics & performance",
    icon: Wind,
  },
  {
    id: "spacecraft",
    label: "Rocket / Spacecraft",
    desc: "Orbital trajectories, propulsion, delta-v & reentry",
    icon: Rocket,
  },
  {
    id: "mechanical",
    label: "Mechanical System",
    desc: "Stress, shaft torsion, pumps, heat transfer & gears",
    icon: Wrench,
  },
  {
    id: "research",
    label: "Research Project",
    desc: "Literature, experiment matrices & technical reports",
    icon: FlaskConical,
  },
  {
    id: "explore",
    label: "Explore AeroForge",
    desc: "Guided walkthrough of all 40 engineering tools",
    icon: Compass,
  },
];

const WHAT_ACCOMPLISH = [
  { id: "design", label: "Design", desc: "Generate airfoils, sizing & CAD geometry", icon: Wind },
  {
    id: "analyze",
    label: "Analyze",
    desc: "Run CFD, FEA, thermal & stress calculations",
    icon: Cpu,
  },
  {
    id: "simulate",
    label: "Simulate",
    desc: "Trajectory, orbit & dynamic flow simulations",
    icon: Target,
  },
  {
    id: "research",
    label: "Research",
    desc: "Literature search, notebooks & knowledge graph",
    icon: BookOpen,
  },
  {
    id: "optimize",
    label: "Optimize",
    desc: "Multi-objective Pareto frontier sweeps",
    icon: BarChart3,
  },
  {
    id: "learn",
    label: "Learn",
    desc: "Explore validated physics benchmarks & labs",
    icon: Sparkles,
  },
];

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const navigate = useNavigate();
  const { setMode } = useAeroForgeStore();
  const { setCurrentProject, setWorkspace } = useProjectStore();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedBuilding, setSelectedBuilding] = useState<string>("uav");
  const [selectedAccomplish, setSelectedAccomplish] = useState<string>("analyze");

  const handleComplete = () => {
    localStorage.setItem("aeroforge-onboarding-complete", "true");

    // Auto-create tailored project
    const buildObj = WHAT_BUILDING.find((b) => b.id === selectedBuilding);
    const projName = `${buildObj?.label || "Engineering"} Research Project`;
    const projId = `PROJ-${Date.now().toString().slice(-4)}`;

    const newProject = {
      _id: projId,
      name: projName,
      description: `Tailored workspace for ${selectedBuilding} focusing on ${selectedAccomplish}.`,
      status: "active" as const,
      createdDate: new Date(),
      updatedDate: new Date(),
      owner: "Lead Architect",
      tags: [selectedBuilding, selectedAccomplish],
    };

    setCurrentProject(newProject);
    setWorkspace({
      projectId: projId,
      activeTab: "notebook",
    });

    onClose();

    if (selectedBuilding === "explore") {
      navigate("/flagship-workflow");
    } else {
      navigate("/projects");
    }
  };

  const handleSkip = () => {
    localStorage.setItem("aeroforge-onboarding-complete", "true");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-[#080E1C] border border-cyan-500/30 rounded-2xl max-w-xl w-full p-6 md:p-8 shadow-2xl relative font-sans text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h2 className="font-mono text-base font-bold text-white">
                Initialize Research Environment
              </h2>
            </div>
            <button
              onClick={handleSkip}
              className="text-white/40 hover:text-white text-xs font-mono"
            >
              Skip setup ✕
            </button>
          </div>

          {/* Question 1: What are you building? */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-widest block mb-1">
                  STEP 1 OF 2
                </span>
                <h3 className="text-xl font-bold text-white">What are you building?</h3>
                <p className="text-xs text-white/50 mt-1">
                  Select your primary engineering system to configure solvers and tools.
                </p>
              </div>

              <div className="space-y-2">
                {WHAT_BUILDING.map((item) => {
                  const Icon = item.icon;
                  const isSel = selectedBuilding === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedBuilding(item.id)}
                      className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl border text-left transition-all ${
                        isSel
                          ? "bg-cyan-500/15 border-cyan-500/50 text-white shadow-lg shadow-cyan-500/10"
                          : "bg-white/[0.02] border-white/8 text-white/70 hover:bg-white/5"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${isSel ? "bg-cyan-500 text-black" : "bg-white/5 text-cyan-400"}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold font-mono">{item.label}</p>
                        <p className="text-[11px] text-white/40">{item.desc}</p>
                      </div>
                      {isSel && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition-all flex items-center justify-center gap-2 mt-4"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Question 2: What do you want to accomplish? */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-widest block mb-1">
                  STEP 2 OF 2
                </span>
                <h3 className="text-xl font-bold text-white">What do you want to accomplish?</h3>
                <p className="text-xs text-white/50 mt-1">
                  We will tailor your initial workspace and AI Copilot focus.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {WHAT_ACCOMPLISH.map((item) => {
                  const Icon = item.icon;
                  const isSel = selectedAccomplish === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedAccomplish(item.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        isSel
                          ? "bg-cyan-500/15 border-cyan-500/50 text-white"
                          : "bg-white/[0.02] border-white/8 text-white/70 hover:bg-white/5"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 mb-2 ${isSel ? "text-cyan-400" : "text-white/40"}`}
                      />
                      <p className="text-xs font-bold font-mono text-white">{item.label}</p>
                      <p className="text-[10px] text-white/40 mt-0.5">{item.desc}</p>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-mono text-xs transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  className="flex-1 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition-all flex items-center justify-center gap-2"
                >
                  Create Research Workspace
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
