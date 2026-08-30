import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap,
  Cpu,
  Database,
  Sliders,
  RefreshCw,
  Layers,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PhysicsAiHeaderBanner from "@/components/physicsAi/PhysicsAiHeaderBanner";
import AirfoilExperimentUI from "@/components/physicsAi/AirfoilExperimentUI";
import ModelRegistryView from "@/components/physicsAi/ModelRegistryView";
import DatasetRegistryView from "@/components/physicsAi/DatasetRegistryView";
import ModelRouterView from "@/components/physicsAi/ModelRouterView";
import ActiveLearningRoadmapView from "@/components/physicsAi/ActiveLearningRoadmapView";
import ResearchRoadmapView from "@/components/physicsAi/ResearchRoadmapView";
import ThirdPartyLicensesModal from "@/components/physicsAi/ThirdPartyLicensesModal";
import { usePageMeta } from "@/hooks/usePageMeta";

type TabType = "experiment" | "models" | "datasets" | "router" | "active-learning" | "roadmap";

export default function PhysicsAiLabPage() {
  usePageMeta(
    "Physics AI Lab | Accelerated Simulation & Neural Operators",
    "Explore neural operators, graph models, and physics-informed learning for accelerated engineering simulation.",
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabType) || "experiment";
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [showLicenseModal, setShowLicenseModal] = useState<boolean>(false);

  useEffect(() => {
    const tabParam = searchParams.get("tab") as TabType;
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <div className="min-h-screen bg-[#060B18] text-white flex flex-col font-sans">
      <Header />

      {/* Physics AI Header Banner */}
      <PhysicsAiHeaderBanner computeTarget="FastAPI PyTorch Backend & Client Surrogate Hybrid" />

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-8 w-full space-y-8">
        {/* HERO SECTION */}
        <div className="relative bg-gradient-to-r from-cyan-950/40 via-[#0A1020] to-purple-950/40 border border-cyan-500/20 rounded-2xl p-6 md:p-10 shadow-2xl overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                EXPERIMENTAL RESEARCH LAB
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold font-mono tracking-tight text-white leading-tight">
              Physics AI Lab
            </h1>

            <p className="text-sm md:text-base text-white/70 font-sans leading-relaxed">
              Explore neural operators, graph models and physics-informed learning for accelerated
              engineering simulation.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex items-center gap-3 pt-2 flex-wrap font-mono text-xs">
              <button
                onClick={() => handleTabChange("experiment")}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-all shadow-lg flex items-center gap-2"
              >
                Run Physics AI Experiment
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleTabChange("models")}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10 transition-all flex items-center gap-2"
              >
                Explore Models
                <Cpu className="w-4 h-4 text-cyan-400" />
              </button>

              <button
                onClick={() => setShowLicenseModal(true)}
                className="px-4 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                Third-Party Licenses
              </button>
            </div>
          </div>

          {/* Background Glow */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl pointer-events-none" />
        </div>

        {/* MANDATORY SCIENTIFIC POSITIONING DISCLAIMER BOX */}
        <div className="p-4 bg-[#0A1020] border border-amber-500/30 rounded-xl flex items-start gap-3 text-xs text-amber-300 font-mono">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-extrabold uppercase text-[11px] block">
              Scientific Positioning & Verification Disclaimer
            </span>
            <p className="text-amber-200/80 font-sans text-xs leading-relaxed">
              Physics AI models are experimental research tools. Predictions must not be treated as
              certified engineering analysis. Where available, compare predictions against validated
              analytical or numerical solvers.
            </p>
          </div>
        </div>

        {/* SUB-NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto font-mono text-xs">
          {[
            { id: "experiment", label: "Airfoil AI Experiment", icon: Zap },
            { id: "models", label: "Model Registry", icon: Cpu },
            { id: "datasets", label: "Dataset Registry", icon: Database },
            { id: "router", label: "Model Router", icon: Sliders },
            { id: "active-learning", label: "Active Learning", icon: RefreshCw },
            { id: "roadmap", label: "Research Roadmap", icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as TabType)}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap font-bold ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md"
                    : "text-white/60 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-white/40"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENT VIEWS */}
        <div className="w-full">
          {activeTab === "experiment" && <AirfoilExperimentUI />}
          {activeTab === "models" && <ModelRegistryView />}
          {activeTab === "datasets" && <DatasetRegistryView />}
          {activeTab === "router" && <ModelRouterView />}
          {activeTab === "active-learning" && <ActiveLearningRoadmapView />}
          {activeTab === "roadmap" && <ResearchRoadmapView />}
        </div>
      </main>

      {/* Third Party Licenses Modal */}
      {showLicenseModal && (
        <ThirdPartyLicensesModal
          isOpen={showLicenseModal}
          onClose={() => setShowLicenseModal(false)}
        />
      )}

      <Footer />
    </div>
  );
}
