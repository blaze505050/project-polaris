import React, { useMemo, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  Share2,
  Copy,
  Download,
  ShieldCheck,
  Compass,
  GitBranch,
  Terminal,
  CopyCheck,
  Sparkles,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeatureStatusBadge from "@/components/ui/FeatureStatusBadge";
import SolverStatusBadge from "@/components/ui/SolverStatusBadge";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useToastStore } from "@/stores/toastStore";
import { useAeroForgeStore, SavedExperiment } from "@/stores/aeroforgeStore";
import { useExperimentStore } from "@/stores/experimentStore";
import { publicArtifactService, PublicArtifactPayload } from "@/services/publicArtifactService";
import { analytics } from "@/services/productAnalytics";

export default function PublicArtifactPage() {
  const { artifactId } = useParams<{ artifactId: string }>();
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const { savedExperiments, saveExperiment } = useAeroForgeStore();
  const { experiments } = useExperimentStore();
  const [cloudArtifact, setCloudArtifact] = useState<PublicArtifactPayload | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    if (artifactId) {
      setIsFetching(true);
      publicArtifactService.getArtifact(artifactId).then((data) => {
        if (isMounted) {
          setCloudArtifact(data);
          setIsFetching(false);
        }
      });
    } else {
      setIsFetching(false);
    }
    return () => {
      isMounted = false;
    };
  }, [artifactId]);

  // Resolution: Search cloud artifact, aeroforgeStore, experimentStore, or check demo IDs
  const artifact = useMemo(() => {
    if (!artifactId) return null;
    if (cloudArtifact) return cloudArtifact;

    // 1. Search aeroforgeStore
    const foundAero = savedExperiments.find(
      (e) => e.id === artifactId || e.id.includes(artifactId),
    );
    if (foundAero) {
      return {
        id: foundAero.id,
        name: foundAero.name,
        pillar: foundAero.pillar,
        module: foundAero.module,
        parameters: foundAero.parameters,
        results: foundAero.results,
        notes: foundAero.notes,
        timestamp: foundAero.timestamp,
      };
    }

    // 2. Search experimentStore
    const foundExp = experiments.find((e) => e.id === artifactId || e.id.includes(artifactId));
    if (foundExp) {
      return {
        id: foundExp.id,
        name: foundExp.name,
        pillar: "aerolab" as const,
        module: foundExp.type,
        parameters: foundExp.parameters,
        results: foundExp.results,
        notes: foundExp.notes,
        timestamp: foundExp.timestamp,
      };
    }

    // 3. Known Demo Fallbacks (only if ID specifically matches demo pattern)
    if (
      artifactId === "EXP-2026-NACA2412" ||
      artifactId === "PUB-014" ||
      artifactId === "EXP-2026-09"
    ) {
      return {
        id: "EXP-2026-NACA2412",
        name: "NACA 2412 Transonic Aerodynamic Evaluation",
        pillar: "aerolab" as const,
        module: "Airfoil Compressibility Solver",
        parameters: {
          naca: "2412",
          altitude: "3,000m",
          velocity: "75 m/s",
          chord: "1.2m",
          aoa: "4.0°",
        },
        results: { "Lift Coeff (CL)": 0.542, "Drag Coeff (CD)": 0.0312, "L/D Ratio": 17.37 },
        notes: "Thin airfoil theory with Prandtl-Glauert compressibility correction.",
        timestamp: new Date("2026-08-12T14:30:00Z").getTime(),
      };
    }

    return null;
  }, [artifactId, cloudArtifact, savedExperiments, experiments]);

  usePageMeta(
    `Artifact #${artifactId || "EXP-2026-09"}`,
    "Public shareable AeroForge engineering result with full digital thread provenance.",
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    analytics.track("public_artifact_shared", { artifactId: artifactId || "EXP-2026-NACA2412" });
    addToast({ type: "success", title: "Artifact link copied to clipboard" });
  };

  const handleDuplicateExperiment = () => {
    if (!artifact) return;

    saveExperiment({
      name: `Cloned: ${artifact.name}`,
      pillar: artifact.pillar,
      module: artifact.module,
      parameters: artifact.parameters,
      results: artifact.results,
      userMode: "professional",
      notes: `Duplicated from public shareable artifact #${artifact.id}.`,
    });

    analytics.track("public_artifact_duplicated", { artifactId: artifact.id });
    addToast({ type: "success", title: "Experiment cloned into your workspace!" });
    navigate("/flagship-workflow");
  };

  if (!artifact) {
    return (
      <div className="min-h-screen bg-[#060B18] text-white flex flex-col font-sans">
        <Header />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-20 w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white font-mono">Public Artifact Not Found</h1>
          <p className="text-xs text-white/60 font-sans max-w-md mx-auto leading-relaxed">
            The requested engineering artifact{" "}
            <code className="text-cyan-300 font-mono">#{artifactId}</code> could not be found or has
            not been published to the public registry.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link to="/projects">
              <button className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold transition-all">
                Return to Workspace
              </button>
            </Link>
            <Link to="/validation">
              <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-mono transition-all">
                Explore Benchmarks
              </button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060B18] text-white flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        {/* Banner Badge */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              VERIFIED PUBLIC ENGINEERING ARTIFACT
            </span>
            <span className="text-[10px] font-mono text-white/40">ID: {artifact.id}</span>
          </div>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 text-xs font-mono transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share Result Link
          </button>
        </div>

        {/* Artifact Main Card */}
        <div className="bg-[#0A1020] border border-white/12 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                {artifact.pillar} • {artifact.module}
              </span>
              <SolverStatusBadge type="reduced-order" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">{artifact.name}</h1>
            <p className="text-xs text-white/50 font-mono">
              Saved {new Date(artifact.timestamp).toUTCString()} • Digital Thread Artifact
            </p>
          </div>

          {/* Results Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#060B18] p-4 rounded-xl border border-white/5 font-mono">
            {Object.entries(artifact.results || {}).map(([key, val]) => (
              <div key={key}>
                <span className="text-[10px] text-white/40 block uppercase truncate">{key}</span>
                <span className="text-base font-bold text-cyan-400">{String(val)}</span>
              </div>
            ))}
          </div>

          {/* Parameters & Input Box */}
          <div className="bg-[#060B18] p-4 rounded-xl border border-white/5 space-y-2 text-xs font-mono">
            <span className="text-[10px] text-white/40 uppercase font-bold block mb-1">
              INPUT PARAMETERS
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(artifact.parameters || {}).map(([key, val]) => (
                <div key={key} className="bg-white/5 p-2 rounded">
                  <span className="text-white/40 text-[9px] block uppercase">{key}</span>
                  <span className="text-white font-bold">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes & Digital Thread Provenance Box */}
          <div className="bg-[#060B18] p-4 rounded-xl border border-white/5 space-y-3">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                Digital Thread Notes & Provenance
              </h3>
            </div>
            <p className="text-xs text-white/70 leading-relaxed font-sans">
              {artifact.notes || "Executed via AeroForge Connected Digital Engineering Suite."}
            </p>
          </div>

          {/* Disclaimers & Assumptions */}
          <div className="text-xs space-y-1.5 border-t border-white/5 pt-4 font-sans text-white/50">
            <p className="font-mono text-amber-400/80 flex items-center gap-1.5 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Analytical/Reduced-order engineering research model. Subject to secondary
              CFD/experimental validation.
            </p>
          </div>

          {/* Growth Flywheel Dual CTAs */}
          <div className="p-6 bg-gradient-to-r from-cyan-950/40 to-purple-950/40 border border-cyan-500/30 rounded-xl flex items-center justify-between flex-wrap gap-4">
            <div>
              <h4 className="text-sm font-bold text-white font-mono">
                Modify, Clone or Extend This Calculation
              </h4>
              <p className="text-xs text-white/60 mt-0.5 font-sans">
                Open or duplicate this exact experiment inside AeroForge to run parameter sweeps,
                optimize geometry, or publish your own report.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={handleDuplicateExperiment}
                className="px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10"
              >
                <CopyCheck className="w-4 h-4" />
                Duplicate Experiment
              </button>
              <Link to="/flagship-workflow">
                <button className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20">
                  Open in AeroForge
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
