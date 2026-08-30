import React from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  GraduationCap,
  Briefcase,
  BookOpen,
  Code,
  Zap,
  BarChart3,
  Eye,
  Shield,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAeroForgeStore } from "@/stores/aeroforgeStore";

export default function DualMode() {
  const navigate = useNavigate();
  const { userMode, toggleMode, setMode } = useAeroForgeStore();

  const features = {
    student: [
      {
        icon: BookOpen,
        title: "Educational Tooltips",
        desc: "Plain-language explanations appear on every control, slider, and data output across all modules.",
        color: "#00F0FF",
      },
      {
        icon: Eye,
        title: "Simplified Controls",
        desc: "Parameter ranges are bounded to physically meaningful values. Presets help you get started quickly.",
        color: "#10B981",
      },
      {
        icon: Zap,
        title: "Guided Learning",
        desc: 'Step-by-step instructions and "What does this mean?" callouts explain the physics behind every calculation.',
        color: "#F59E0B",
      },
      {
        icon: BarChart3,
        title: "Visual Emphasis",
        desc: "Charts, animations, and color-coded feedback help build intuition before diving into raw numbers.",
        color: "#A78BFA",
      },
    ],
    professional: [
      {
        icon: Code,
        title: "Raw Data Matrices",
        desc: "Full-precision state vectors, Jacobians, and intermediate computation steps exposed in every module.",
        color: "#FF007A",
      },
      {
        icon: BarChart3,
        title: "CSV/JSON Export",
        desc: "Export simulation results, orbital elements, photometry tables, and telemetry data in standard formats.",
        color: "#06B6D4",
      },
      {
        icon: Shield,
        title: "Advanced Inputs",
        desc: "No bounds on parameter ranges. Custom initial conditions, arbitrary body counts, and algorithm selection.",
        color: "#F59E0B",
      },
      {
        icon: Zap,
        title: "LaTeX Equations",
        desc: "Full mathematical formulations displayed alongside computed values for verification and publication.",
        color: "#10B981",
      },
    ],
  };

  const currentFeatures = features[userMode];

  return (
    <div className="min-h-screen bg-[#060B18] text-white">
      <Header />
      <div className="max-w-[120rem] mx-auto px-4 md:px-[4%] py-6">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/astrolab")}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-pink-500 bg-clip-text text-transparent">
              Dual Mode — Experience Control
            </h1>
            <p className="text-sm text-white/50 font-mono">
              Global Student/Professional toggle · Persisted across all modules
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="max-w-3xl mx-auto mb-12">
          <div
            className="flex rounded-2xl bg-white/[0.03] border border-white/10 p-1.5 mb-8"
            style={{ backdropFilter: "blur(20px)" }}
          >
            <button
              onClick={() => setMode("student")}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-semibold transition-all duration-300 ${
                userMode === "student"
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/10"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              <GraduationCap className="w-5 h-5" />
              Student Mode
            </button>
            <button
              onClick={() => setMode("professional")}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-semibold transition-all duration-300 ${
                userMode === "professional"
                  ? "bg-gradient-to-r from-pink-500/20 to-violet-500/20 border border-pink-500/30 text-pink-400 shadow-lg shadow-pink-500/10"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              <Briefcase className="w-5 h-5" />
              Professional Mode
            </button>
          </div>

          {/* Active Mode Status */}
          <motion.div
            key={userMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-10"
          >
            <div
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border ${
                userMode === "student"
                  ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                  : "bg-pink-500/10 border-pink-500/20 text-pink-400"
              }`}
            >
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: userMode === "student" ? "#00F0FF" : "#FF007A" }}
              />
              <span className="font-mono text-sm">
                {userMode === "student" ? "Student Mode Active" : "Professional Mode Active"}
              </span>
              <Check className="w-4 h-4" />
            </div>
            <p className="mt-3 text-sm text-white/40 max-w-md mx-auto">
              {userMode === "student"
                ? "Optimized for learning. Simplified controls with educational tooltips across all AeroForge modules."
                : "Unrestricted access. Full data precision, raw matrices, export capabilities, and advanced parameters."}
            </p>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentFeatures.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl bg-white/[0.03] border border-white/10 p-5 hover:border-white/20 transition-all"
                style={{ backdropFilter: "blur(20px)" }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg" style={{ backgroundColor: feat.color + "15" }}>
                    <feat.icon className="w-5 h-5" style={{ color: feat.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{feat.title}</h3>
                    <p className="text-xs text-white/40 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Live Preview Comparison */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-white/70 mb-4 text-center">Live UI Preview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Preview */}
            <div
              className={`rounded-xl border p-5 transition-all ${userMode === "student" ? "border-cyan-500/30 bg-cyan-500/5" : "border-white/5 bg-white/[0.02] opacity-50"}`}
            >
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-cyan-400">Student View</span>
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                  <label className="text-xs text-white/50 block mb-1">Orbital Altitude</label>
                  <input
                    type="range"
                    min={200}
                    max={2000}
                    defaultValue={400}
                    className="w-full h-1.5 rounded-full appearance-none bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400"
                  />
                  <div className="text-right text-xs font-mono text-cyan-400 mt-1">400 km</div>
                </div>
                <div className="p-2.5 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
                  <p className="text-xs text-cyan-400/70">
                    💡 The ISS orbits at about 400 km altitude — that's the edge of space!
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-black/30 border border-white/5 text-center">
                  <span className="text-2xl font-bold text-cyan-400">7.67</span>
                  <span className="text-sm text-white/40 ml-1">km/s</span>
                  <p className="text-xs text-white/30 mt-1">Orbital Velocity</p>
                </div>
              </div>
            </div>

            {/* Professional Preview */}
            <div
              className={`rounded-xl border p-5 transition-all ${userMode === "professional" ? "border-pink-500/30 bg-pink-500/5" : "border-white/5 bg-white/[0.02] opacity-50"}`}
            >
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-4 h-4 text-pink-400" />
                <span className="text-sm font-semibold text-pink-400">Professional View</span>
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                  <label className="text-xs text-white/50 block mb-1">Semi-Major Axis (m)</label>
                  <input
                    type="text"
                    defaultValue="6.771e6"
                    className="w-full bg-transparent border border-white/10 rounded px-2 py-1 text-sm font-mono text-white/80 focus:border-pink-500/30 focus:outline-none"
                  />
                </div>
                <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                  <p className="text-xs font-mono text-white/40 leading-relaxed">
                    v = √(μ/r) = √(3.986×10¹⁴ / 6.771×10⁶)
                    <br />
                    v = 7672.45 m/s = 7.672 km/s
                    <br />
                    T = 2π√(a³/μ) = 5553.6 s = 92.56 min
                    <br />ε = −μ/2a = −2.945×10⁷ J/kg
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { l: "v", v: "7672.45 m/s" },
                    { l: "T", v: "5553.6 s" },
                    { l: "ε", v: "-2.945e7 J/kg" },
                    { l: "h", v: "5.195e10 m²/s" },
                  ].map((d) => (
                    <div key={d.l} className="p-2 rounded bg-black/20 border border-white/5">
                      <span className="text-xs text-white/30 font-mono">{d.l}</span>
                      <span className="block text-xs font-mono text-pink-400">{d.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
