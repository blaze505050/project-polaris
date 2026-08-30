import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Cpu,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sliders,
  Sparkles,
} from "lucide-react";
import { ModelRouterRequest, ModelCategory } from "@/types/physicsAi";
import { routePhysicsModel } from "@/services/physicsAi/modelRouterService";

export default function ModelRouterView() {
  const [domain, setDomain] = useState<string>("2D Airfoil Aerodynamics");
  const [pdeType, setPdeType] = useState<string>("Incompressible RANS Navier-Stokes");
  const [geometryType, setGeometryType] = useState<string>("Unstructured Surface Mesh");
  const [speedRequirement, setSpeedRequirement] =
    useState<ModelRouterRequest["speedRequirement"]>("real-time");
  const [category, setCategory] = useState<ModelCategory>("External Aerodynamics");

  const req: ModelRouterRequest = useMemo(
    () => ({
      domain,
      pdeType,
      geometryType,
      speedRequirement,
      physicsCategory: category,
    }),
    [domain, pdeType, geometryType, speedRequirement, category],
  );

  const recommendations = useMemo(() => {
    return routePhysicsModel(req);
  }, [req]);

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-[#0A1020] border border-cyan-500/20 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 font-bold">
              PHYSICS MODEL ROUTER
            </span>
          </div>
          <h2 className="text-xl font-extrabold font-mono text-white">
            Intelligent Neural Operator Dispatcher
          </h2>
          <p className="text-xs text-white/60 mt-1 max-w-2xl font-sans">
            Automatically routes your engineering intent, geometry discretization, and PDE
            constraints to the optimal neural operator architecture.
          </p>
        </div>

        <div className="bg-[#060B18] px-4 py-2 rounded-lg border border-white/10 font-mono text-xs text-right">
          <span className="text-white/40 block text-[10px]">CANDIDATE MODELS</span>
          <span className="text-cyan-400 font-bold text-lg">
            {recommendations.length} Evaluated
          </span>
        </div>
      </div>

      {/* Main 2-Column Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Selection (5 cols) */}
        <div className="lg:col-span-5 bg-[#0A1020] border border-white/10 rounded-xl p-5 space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Define Engineering Intent & PDE Setup
          </h3>

          <div>
            <label className="text-white/50 text-[11px] block mb-1">PHYSICS CATEGORY</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ModelCategory)}
              className="w-full bg-[#060B18] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="External Aerodynamics">External Aerodynamics</option>
              <option value="General PDE">General PDE</option>
              <option value="Physics-Informed">Physics-Informed</option>
              <option value="Atmospheric">Atmospheric</option>
              <option value="Multi-Physics">Multi-Physics</option>
            </select>
          </div>

          <div>
            <label className="text-white/50 text-[11px] block mb-1">PROBLEM DOMAIN</label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full bg-[#060B18] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="2D Airfoil Aerodynamics">2D Airfoil Aerodynamics</option>
              <option value="3D Aircraft Fuselage Flow">3D Aircraft Fuselage Flow</option>
              <option value="Compressible Shock Reflection">Compressible Shock Reflection</option>
              <option value="Planetary Weather & Density">Planetary Weather & Density</option>
              <option value="Turbulent Vortex Shedding">Turbulent Vortex Shedding</option>
            </select>
          </div>

          <div>
            <label className="text-white/50 text-[11px] block mb-1">
              PDE / GOVERNING EQUATION TYPE
            </label>
            <select
              value={pdeType}
              onChange={(e) => setPdeType(e.target.value)}
              className="w-full bg-[#060B18] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Incompressible RANS Navier-Stokes">
                Incompressible RANS Navier-Stokes
              </option>
              <option value="Compressible Euler Equations">Compressible Euler Equations</option>
              <option value="Advection-Diffusion Transport">Advection-Diffusion Transport</option>
              <option value="Navier-Stokes + Exact Residual Constraints">
                Navier-Stokes + Exact Residual Constraints
              </option>
            </select>
          </div>

          <div>
            <label className="text-white/50 text-[11px] block mb-1">GEOMETRY DISCRETIZATION</label>
            <select
              value={geometryType}
              onChange={(e) => setGeometryType(e.target.value)}
              className="w-full bg-[#060B18] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Unstructured Surface Mesh">Unstructured Surface Mesh</option>
              <option value="Regular Rectangular 2D Spatial Grid">
                Regular Rectangular 2D Spatial Grid
              </option>
              <option value="3D Unstructured Point Cloud">3D Unstructured Point Cloud</option>
              <option value="Signed Distance Function (SDF)">Signed Distance Function (SDF)</option>
            </select>
          </div>

          <div>
            <label className="text-white/50 text-[11px] block mb-1">
              INFERENCE SPEED REQUIREMENT
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["real-time", "interactive", "batch"] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => setSpeedRequirement(spd)}
                  className={`py-1.5 rounded border text-[10px] uppercase font-bold transition-all ${
                    speedRequirement === spd
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                      : "bg-white/5 text-white/50 border-white/5 hover:bg-white/10"
                  }`}
                >
                  {spd}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Ranked Candidate Recommendations (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white flex items-center justify-between">
            <span>Ranked Neural Operator Candidates</span>
            <span className="text-[10px] text-white/40 font-normal">
              Sorted by confidence match
            </span>
          </h3>

          <div className="space-y-3">
            {recommendations.slice(0, 5).map((rec, idx) => (
              <motion.div
                key={rec.modelId}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`bg-[#0A1020] border rounded-xl p-4 shadow-lg transition-all ${
                  idx === 0
                    ? "border-cyan-500/50 bg-gradient-to-r from-cyan-950/20 to-[#0A1020]"
                    : "border-white/10"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full font-mono text-xs font-bold flex items-center justify-center ${
                        idx === 0 ? "bg-cyan-500 text-black" : "bg-white/10 text-white/70"
                      }`}
                    >
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="font-mono text-sm font-bold text-white flex items-center gap-2">
                        {rec.modelName}
                        {idx === 0 && (
                          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.2 rounded border border-emerald-500/20">
                            TOP MATCH
                          </span>
                        )}
                      </h4>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-extrabold font-mono text-cyan-400">
                      {rec.confidenceScore}%
                    </span>
                    <span className="text-[10px] font-mono text-white/40 block">
                      Confidence Score
                    </span>
                  </div>
                </div>

                <p className="text-xs text-white/70 font-sans mb-3 pl-8">{rec.reasoning}</p>

                <div className="pl-8 pt-2 border-t border-white/5 flex items-center justify-between font-mono text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-white/40">Status:</span>
                    <span
                      className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                        rec.status === "LIVE"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {rec.status}
                    </span>
                  </div>

                  {rec.tradeoffs.length > 0 && (
                    <span className="text-white/40 text-[10px] italic">
                      Note: {rec.tradeoffs[0]}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
