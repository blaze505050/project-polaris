import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import OnboardingModal from "@/components/OnboardingModal";
import {
  ArrowRight,
  Wind,
  Layers,
  Cpu,
  Rocket,
  Zap,
  BookOpen,
  Database,
  Target,
  Globe,
  Thermometer,
  Wrench,
  Orbit,
  Gauge,
  FolderOpen,
  BarChart3,
  Brain,
  FileText,
  CheckCircle2,
  GitBranch,
  Shield,
  Sparkles,
  Search,
  Activity,
  Compass,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeatureStatusBadge, { FeatureStatus } from "@/components/ui/FeatureStatusBadge";
import StandardsAndPractices from "@/components/StandardsAndPractices";
import Engineering3DCanvas from "@/components/Engineering3DCanvas";
import HeroVisualizationCanvas from "@/components/HeroVisualizationCanvas";
import DigitalThreadProvenance from "@/components/DigitalThreadProvenance";
import { usePageMeta } from "@/hooks/usePageMeta";

// ─── Data ─────────────────────────────────────────────────────────────────────

const DOMAINS = [
  {
    id: "aerospace" as const,
    title: "Aerospace & Aerodynamics",
    tagline: "Flow Fields, Shockwaves & Lift Dynamics",
    desc: "2D/3D potential flow, thin airfoil theory, Prandtl-Glauert compressibility correction, and supersonic shock relations.",
    icon: Wind,
    metrics: ["Mach 0.15–5.0", "C_L / C_D Polars", "Oblique Shock Angle β"],
    color: "text-cyan-400",
    borderColor: "border-cyan-500/40",
  },
  {
    id: "mechanical" as const,
    title: "Mechanical & Structures",
    tagline: "Stress Tensors, Deflection & Spar FEA",
    desc: "Euler-Bernoulli beam bending, composite laminate stiffness matrix, von Mises yield criterion, and modal vibration frequencies.",
    icon: Layers,
    metrics: ["Safety Factor SF > 1.5", "von Mises σ_vm", "Euler Deflection w(x)"],
    color: "text-blue-400",
    borderColor: "border-blue-500/40",
  },
  {
    id: "astrospace" as const,
    title: "Astrospace & Orbital Dynamics",
    tagline: "Keplerian Elements, Porkchop Plots & Reentry",
    desc: "Two-body orbital propagation, Hohmann transfer Delta-V, porkchop departure plots, and hypersonic atmospheric reentry corridors.",
    icon: Orbit,
    metrics: ["Delta-V Δv", "Semi-Major Axis a", "Eccentricity e"],
    color: "text-purple-400",
    borderColor: "border-purple-500/40",
  },
];

const PROBLEM_ENTRIES = [
  {
    title: "Analyze an Airfoil",
    desc: "Thin airfoil theory, NACA 4-digit profiles & C_L/C_D polars",
    icon: Wind,
    path: "/aerolab",
    tag: "AERODYNAMICS",
  },
  {
    title: "Optimize a Wing",
    desc: "Multi-objective Pareto optimization & morphing UAV study",
    icon: Target,
    path: "/flagship-workflow",
    tag: "OPTIMIZATION",
  },
  {
    title: "Design a Rocket Nozzle",
    desc: "Nozzle expansion ratios, chamber pressure & thrust curves",
    icon: Rocket,
    path: "/aerolab",
    tag: "PROPULSION",
  },
  {
    title: "Study a Beam",
    desc: "Euler-Bernoulli bending stress, deflection & shear diagrams",
    icon: Layers,
    path: "/mechlab",
    tag: "STRUCTURES",
  },
  {
    title: "Analyze an Orbit",
    desc: "Keplerian elements, porkchop plots & ground station tracks",
    icon: Orbit,
    path: "/astrolab/orbital-mechanics",
    tag: "ASTROSPACE",
  },
  {
    title: "Run Physics AI",
    desc: "Fourier Neural Operator surrogate model for rapid flow field estimation",
    icon: Brain,
    path: "/physics-ai",
    tag: "EXPERIMENTAL",
  },
  {
    title: "Research a Topic",
    desc: "arXiv & OpenAlex paper search with instant IEEE/BibTeX citations",
    icon: BookOpen,
    path: "/documentation?tab=research",
    tag: "LITERATURE",
  },
  {
    title: "Validate Benchmarks",
    desc: "Compare results directly against Abbott wind tunnel data & ISO tables",
    icon: CheckCircle2,
    path: "/validation",
    tag: "VERIFICATION",
  },
];

export default function HomePage() {
  usePageMeta("AeroForge AI — Connected Aerospace & Mechanical Research Environment");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeDomain, setActiveDomain] = useState<"aerospace" | "mechanical" | "astrospace">(
    "aerospace",
  );
  const [scrollProgress, setScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll();
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const unsubscribe = smoothScroll.on("change", (v) => setScrollProgress(v));
    return () => unsubscribe();
  }, [smoothScroll]);

  useEffect(() => {
    const done = localStorage.getItem("aeroforge-onboarding-complete");
    if (!done) {
      const timer = setTimeout(() => setShowOnboarding(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#050914] text-white font-mono flex flex-col relative selection:bg-cyan-500 selection:text-black">
      {/* Fixed Full-Viewport 3D WebGL Background Layer */}
      <Engineering3DCanvas scrollProgress={scrollProgress} activeDomain={activeDomain} />

      <Header />
      <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />

      <main className="flex-1 w-full flex flex-col z-10">
        {/* ═══════════════════════════════════════════════════════════════════
            CHAPTER 01 — ARRIVAL
            ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative w-full min-h-[92vh] flex flex-col justify-center border-b border-white/10 px-6 md:px-12 pt-16 pb-16">
          <div className="max-w-[84rem] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 flex-wrap"
              >
                <span className="text-[10px] font-bold px-3 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 tracking-widest uppercase">
                  CHAPTER 01 // ARRIVAL
                </span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded tracking-wider uppercase">
                  A PROJECT POLARIS INITIATIVE
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  AEROSPACE • MECHANICAL • ASTROSPACE
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-sans uppercase leading-[1.02]"
              >
                ENGINEERING,
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500">
                  CONNECTED.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="text-base md:text-lg text-slate-300 leading-relaxed font-sans max-w-2xl"
              >
                A browser-based engineering research workstation. Connect requirements, 3D wing
                geometries, reduced-order physics solvers, notebooks, and scientific benchmarks into
                one persistent digital thread.
              </motion.p>

              {/* Live Telemetry Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 bg-slate-950/80 border border-white/10 rounded-xl p-3 backdrop-blur-md"
              >
                <div>
                  <span className="text-[9px] text-slate-400 block font-mono">MACH NUMBER</span>
                  <span className="text-sm font-bold text-cyan-400 font-mono">M = 0.15</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block font-mono">REYNOLDS NO.</span>
                  <span className="text-sm font-bold text-blue-400 font-mono">Re = 3.0M</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block font-mono">ANGLE OF ATTACK</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">α = 4.0°</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block font-mono">SOLVER STATUS</span>
                  <span className="text-sm font-bold text-amber-400 font-mono">ANALYTICAL 2D</span>
                </div>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.45 }}
                className="flex flex-col sm:flex-row gap-3 pt-2"
              >
                <Link
                  to="/projects"
                  className="px-7 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 font-mono shadow-xl shadow-cyan-500/20 active:scale-[0.98]"
                >
                  <FolderOpen className="w-4 h-4" />
                  START A PROJECT
                </Link>
                <Link
                  to="/aerolab"
                  className="px-7 py-4 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 font-mono"
                >
                  <Wind className="w-4 h-4 text-cyan-400" />
                  EXPLORE THE LAB
                </Link>
                <Link
                  to="/demo"
                  className="px-5 py-4 bg-transparent border border-white/10 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 font-mono"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  RUN DEMO
                </Link>
              </motion.div>
            </div>

            {/* Right Column Canvas Interactive Specimen */}
            <div className="lg:col-span-5">
              <HeroVisualizationCanvas />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            CHAPTER 02 — ENTER THE SYSTEM (TRANSFORMATION RHYTHM)
            ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative w-full py-24 border-b border-white/10 px-6 md:px-12 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-[84rem] mx-auto space-y-12">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase block mb-2 font-mono">
                  CHAPTER 02 // ENTER THE SYSTEM
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-sans">
                  The Continuous Engineering Pipeline
                </h2>
              </div>
              <p className="text-slate-400 text-sm font-sans max-w-xl leading-relaxed">
                As you iterate, AeroForge continuously transforms geometry into mesh, runs
                reduced-order solvers, outputs pressure fields, and links validation error back to
                mission requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                {
                  step: "01",
                  title: "REQUIREMENTS",
                  desc: "Define target L/D > 14.5 and SF > 1.5 bounds",
                  icon: FileText,
                  color: "text-cyan-400",
                },
                {
                  step: "02",
                  title: "GEOMETRY",
                  desc: "Parametric NACA 4-digit airfoil curve generation",
                  icon: Layers,
                  color: "text-blue-400",
                },
                {
                  step: "03",
                  title: "SOLVER RUN",
                  desc: "2D thin airfoil potential flow + Prandtl-Glauert",
                  icon: Cpu,
                  color: "text-emerald-400",
                },
                {
                  step: "04",
                  title: "RESULTS",
                  desc: "C_L vs Alpha polars & pressure gradient maps",
                  icon: BarChart3,
                  color: "text-amber-400",
                },
                {
                  step: "05",
                  title: "VALIDATION",
                  desc: "Abbott (1959) wind tunnel dataset cross-check",
                  icon: CheckCircle2,
                  color: "text-purple-400",
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    viewport={{ once: true }}
                    className="p-5 bg-slate-900/90 border border-white/10 rounded-xl space-y-3 hover:border-cyan-500/40 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-500">
                        {item.step}
                      </span>
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <h3 className="text-xs font-bold text-white font-mono group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            CHAPTER 03 — THE THREE WORLDS
            ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative w-full py-24 border-b border-white/10 px-6 md:px-12 bg-[#050914]/90 backdrop-blur-lg">
          <div className="max-w-[84rem] mx-auto space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase font-mono px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/30">
                CHAPTER 03 // THE THREE WORLDS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-sans">
                Three Spatial Engineering Disciplines
              </h2>
              <p className="text-slate-400 text-sm font-sans">
                Hover over a domain to warp the WebGL viewport into its specific environment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DOMAINS.map((domain) => {
                const Icon = domain.icon;
                const isActive = activeDomain === domain.id;
                return (
                  <motion.div
                    key={domain.id}
                    onMouseEnter={() => setActiveDomain(domain.id)}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer space-y-4 ${
                      isActive
                        ? "bg-slate-900/90 border-cyan-500/60 shadow-2xl shadow-cyan-500/10 scale-[1.02]"
                        : "bg-slate-950/60 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`p-3 rounded-xl bg-white/5 border border-white/10 ${domain.color}`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 font-bold uppercase px-2 py-0.5 rounded bg-white/5">
                        {isActive ? "ACTIVE VIEWPORT" : "SELECT DOMAIN"}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white font-sans">{domain.title}</h3>
                      <p className="text-xs text-cyan-400/80 font-mono mt-0.5">{domain.tagline}</p>
                    </div>

                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {domain.desc}
                    </p>

                    <div className="pt-2 border-t border-white/10 space-y-1.5 font-mono text-[10px] text-slate-400">
                      {domain.metrics.map((m) => (
                        <div key={m} className="flex items-center justify-between">
                          <span>{m}</span>
                          <span className="text-emerald-400 font-bold">READY</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            CHAPTER 04 — THE ENGINEERING THREAD (PROVENANCE CENTERPIECE)
            ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative w-full py-24 border-b border-white/10 px-6 md:px-12 bg-slate-950/90">
          <div className="max-w-[84rem] mx-auto space-y-8">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase block mb-2 font-mono">
                  CHAPTER 04 // THE DIGITAL THREAD
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-sans">
                  Connected Digital Traceability Chain
                </h2>
              </div>
              <p className="text-slate-400 text-sm font-sans max-w-xl leading-relaxed">
                Nothing in AeroForge exists in isolation. Click any node in the provenance graph to
                navigate directly into its live project state.
              </p>
            </div>

            <DigitalThreadProvenance />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            CHAPTER 05 — PROBLEM → SOLUTION
            ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative w-full py-24 border-b border-white/10 px-6 md:px-12 bg-[#050914]">
          <div className="max-w-[84rem] mx-auto space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase font-mono px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/30">
                CHAPTER 05 // PROBLEM → SOLUTION
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-sans">
                What are you trying to engineer?
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PROBLEM_ENTRIES.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      to={item.path}
                      className="block p-5 bg-slate-900/90 border border-white/10 hover:border-cyan-400/50 rounded-xl transition-all group h-full flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-[9px] font-mono text-slate-400 font-bold uppercase px-2 py-0.5 rounded bg-white/5">
                            {item.tag}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors font-sans">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-400 font-sans mt-1 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 mt-4 group-hover:translate-x-1 transition-transform">
                        <span>LAUNCH WORKFLOW</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            CHAPTER 06 — FLAGSHIP RESEARCH SHOWCASE
            ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative w-full py-24 border-b border-white/10 px-6 md:px-12 bg-slate-950/90">
          <div className="max-w-[84rem] mx-auto space-y-10">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase block mb-2 font-mono">
                  CHAPTER 06 // FLAGSHIP RESEARCH
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-sans">
                  Adaptive Morphing UAV Aerodynamic Workflow
                </h2>
              </div>
              <Link
                to="/flagship-workflow"
                className="px-5 py-3 rounded-lg bg-cyan-500 text-black font-bold text-xs font-mono flex items-center gap-2 hover:bg-cyan-400 transition-colors"
              >
                <span>OPEN FLAGSHIP WORKFLOW</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-6 bg-slate-900/90 border border-white/10 rounded-2xl grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
              <div className="space-y-3">
                <span className="text-cyan-400 font-bold text-[10px] uppercase">
                  01 // PARAMETRIC WING MESH
                </span>
                <p className="text-slate-300 font-sans leading-relaxed">
                  Morphing wing trailing edge deflection angle \(\delta \in [-5^\circ, +15^\circ]\)
                  with adaptive camber variation.
                </p>
                <div className="bg-slate-950 p-3 rounded border border-white/10 text-emerald-400">
                  <span>C_L max = 1.68 @ α = 12°</span>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-cyan-400 font-bold text-[10px] uppercase">
                  02 // MULTI-OBJECTIVE PARETO
                </span>
                <p className="text-slate-300 font-sans leading-relaxed">
                  Simultaneous maximization of cruise L/D ratio while minimizing root bending stress
                  moment M_x.
                </p>
                <div className="bg-slate-950 p-3 rounded border border-white/10 text-cyan-300">
                  <span>Pareto Optimal Solutions: 48</span>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-cyan-400 font-bold text-[10px] uppercase">
                  03 // NOTEBOOK & PUBLISH
                </span>
                <p className="text-slate-300 font-sans leading-relaxed">
                  Export complete reproducible package with LaTeX equations, dataset CSV, and public
                  verification link.
                </p>
                <div className="bg-slate-950 p-3 rounded border border-white/10 text-purple-400">
                  <span>Digital Thread: Linked PRJ-MORPH-01</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            CHAPTER 07 — SCIENTIFIC VALIDATION
            ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative w-full py-24 border-b border-white/10 px-6 md:px-12 bg-[#050914]">
          <div className="max-w-[84rem] mx-auto space-y-8">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase block mb-2 font-mono">
                  CHAPTER 07 // SCIENTIFIC VALIDATION
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-sans">
                  Transparent Validation Center
                </h2>
              </div>
              <Link
                to="/validation"
                className="px-5 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold text-xs font-mono flex items-center gap-2 hover:border-cyan-500/40 transition-colors"
              >
                <span>VIEW VALIDATION SUITE</span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
              <div className="p-6 bg-slate-900/90 border border-emerald-500/30 rounded-xl space-y-3">
                <span className="text-[10px] font-bold text-emerald-400 uppercase block">
                  NACA 2412 AIRFOIL BENCHMARK
                </span>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Model C_L slope:</span>
                  <span className="font-bold text-white">0.108 / deg</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Abbott Wind Tunnel:</span>
                  <span className="font-bold text-white">0.106 / deg</span>
                </div>
                <div className="flex items-center justify-between text-emerald-400 font-bold border-t border-white/10 pt-2">
                  <span>Relative Error:</span>
                  <span>1.88% (VERIFIED)</span>
                </div>
              </div>

              <div className="p-6 bg-slate-900/90 border border-cyan-500/30 rounded-xl space-y-3">
                <span className="text-[10px] font-bold text-cyan-400 uppercase block">
                  EULER-BERNOULLI SPAR DEFLECTION
                </span>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Model Deflection:</span>
                  <span className="font-bold text-white">14.2 mm</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Analytical Exact:</span>
                  <span className="font-bold text-white">14.0 mm</span>
                </div>
                <div className="flex items-center justify-between text-cyan-300 font-bold border-t border-white/10 pt-2">
                  <span>Relative Error:</span>
                  <span>1.42% (VERIFIED)</span>
                </div>
              </div>

              <div className="p-6 bg-slate-900/90 border border-purple-500/30 rounded-xl space-y-3">
                <span className="text-[10px] font-bold text-purple-400 uppercase block">
                  HOHMANN ORBITAL TRANSFER ΔV
                </span>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Model Δv Total:</span>
                  <span className="font-bold text-white">3.93 km/s</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Kepler Exact:</span>
                  <span className="font-bold text-white">3.93 km/s</span>
                </div>
                <div className="flex items-center justify-between text-purple-300 font-bold border-t border-white/10 pt-2">
                  <span>Relative Error:</span>
                  <span>0.00% (EXACT)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            CHAPTER 08 — PHYSICS AI
            ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative w-full py-24 border-b border-white/10 px-6 md:px-12 bg-slate-950/90">
          <div className="max-w-[84rem] mx-auto space-y-8">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase block mb-2 font-mono">
                  CHAPTER 08 // PHYSICS AI
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-sans">
                  Experimental Neural Operator Surrogates
                </h2>
              </div>
              <Link
                to="/physics-ai"
                className="px-5 py-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-xs font-mono flex items-center gap-2 hover:bg-cyan-500 hover:text-black transition-colors"
              >
                <span>OPEN PHYSICS AI LAB</span>
                <Brain className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-6 bg-slate-900/90 border border-cyan-500/30 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 uppercase">MODEL ARCHITECTURE</span>
                <h3 className="text-sm font-bold text-white font-sans">
                  Fourier Neural Operator (FNO-2D)
                </h3>
                <p className="text-slate-400 text-[11px] font-sans">
                  Trained on 10,000 OpenFOAM RANS CFD flow field samples for 14ms surrogate
                  predictions.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 uppercase">CLASSIFICATION</span>
                <h3 className="text-sm font-bold text-cyan-400 font-sans">
                  PHYSICS AI — EXPERIMENTAL
                </h3>
                <p className="text-slate-400 text-[11px] font-sans">
                  Clearly distinguished from validated analytical tools. Fast initial design space
                  screening.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 uppercase">INFERENCE SPEED</span>
                <h3 className="text-sm font-bold text-emerald-400 font-sans">14ms / Flow Field</h3>
                <p className="text-slate-400 text-[11px] font-sans">
                  100x faster than traditional 3D RANS mesh solver iteration loops.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            CHAPTER 09 & 10 — RESEARCH & PUBLIC ARTIFACTS
            ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative w-full py-24 border-b border-white/10 px-6 md:px-12 bg-[#050914]">
          <div className="max-w-[84rem] mx-auto space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Research Hub */}
              <div className="p-8 bg-slate-900/90 border border-white/10 rounded-2xl space-y-4">
                <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase block font-mono">
                  CHAPTER 09 // RESEARCH & LITERATURE
                </span>
                <h3 className="text-xl font-bold text-white font-sans">
                  arXiv & OpenAlex Integration
                </h3>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Search live peer-reviewed aerospace papers directly inside your notebook. Generate
                  instant IEEE and BibTeX citations tied to your project equations.
                </p>
                <Link
                  to="/documentation?tab=research"
                  className="inline-flex items-center gap-2 text-xs text-cyan-400 font-mono font-bold hover:underline"
                >
                  <span>SEARCH LITERATURE HUB</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Public Artifacts */}
              <div className="p-8 bg-slate-900/90 border border-white/10 rounded-2xl space-y-4">
                <span className="text-[10px] font-bold text-purple-400 tracking-widest uppercase block font-mono">
                  CHAPTER 10 // PUBLIC ARTIFACTS
                </span>
                <h3 className="text-xl font-bold text-white font-sans">
                  Shareable Engineering Knowledge
                </h3>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Turn verified simulation runs into public scientific artifacts. Collaborators can
                  duplicate complete experiments with 1 click.
                </p>
                <Link
                  to="/share/ART-DEMO-01"
                  className="inline-flex items-center gap-2 text-xs text-purple-400 font-mono font-bold hover:underline"
                >
                  <span>EXPLORE PUBLIC ARTIFACT SPECIMEN</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <StandardsAndPractices />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            CHAPTER 11 — EXIT / CTA
            ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative w-full py-32 px-6 md:px-12 text-center bg-gradient-to-b from-[#050914] to-black">
          <div className="max-w-[84rem] mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase font-mono px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/30">
                CHAPTER 11 // SYSTEM EXIT
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-sans uppercase">
                BUILD SOMETHING WORTH VALIDATING.
              </h2>
              <p className="text-slate-400 text-sm max-w-xl mx-auto font-sans">
                Launch AeroForge in your browser. Complete engineering workspace with 54 physics
                tools and zero installation.
              </p>
              <div className="pt-4">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-lg transition-all font-mono shadow-2xl shadow-cyan-500/20 active:scale-[0.98]"
                >
                  <FolderOpen className="w-4 h-4" />
                  START A PROJECT
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
