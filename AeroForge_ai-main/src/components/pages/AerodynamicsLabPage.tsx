import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Wind,
  Zap,
  Settings,
  Plus,
  ChevronRight,
  AlertCircle,
  Activity,
  Cpu,
  Layers,
  Database,
  FileText,
  Rocket,
  Shield,
  BarChart3,
  Sliders,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CommandCenterSidebar from "@/components/CommandCenterSidebar";
import AICopilotSidebar from "@/components/AICopilotSidebar";
import { AerodynamicSolver, AtmosphericModel } from "@/services/enhancedPhysicsEngine";
import EngineeringTable, { ColumnDef } from "@/components/ui/EngineeringTable";

interface LabWorkflow {
  id: string;
  name: string;
  category: string;
  solverEngine: string;
  status: "ACTIVE" | "BETA" | "READY";
  description: string;
}

export default function AerodynamicsLabPage() {
  const [showCopilot, setShowCopilot] = useState(false);
  const [altitude, setAltitude] = useState(10000);
  const [mach, setMach] = useState(0.85);
  const [aoa, setAoa] = useState(4.0);

  // Atmospheric physics calculation
  const atmo = AtmosphericModel.getAtmosphericProperties(altitude);
  const wingChord = 2.5;
  const reynoldsNumber = (atmo.rho * mach * atmo.speedOfSound * wingChord) / atmo.viscosity;
  const cl = AerodynamicSolver.computeLiftCoefficient(aoa, mach, reynoldsNumber);
  const cd = AerodynamicSolver.computeDragCoefficient(aoa, mach, reynoldsNumber);
  const wingArea = 50;
  const dynamicPressure = 0.5 * atmo.rho * Math.pow(mach * atmo.speedOfSound, 2);
  const lift = cl * dynamicPressure * wingArea;
  const drag = cd * dynamicPressure * wingArea;
  const liftToDrag = drag > 0 ? lift / drag : 0;

  const workflows: LabWorkflow[] = [
    {
      id: "wf_1",
      name: "CFD Compressible Wind Tunnel Simulation",
      category: "Computational Aerodynamics",
      solverEngine: "OpenFOAM (rhoSimpleFoam k-omega SST)",
      status: "ACTIVE",
      description: "Full 3D steady RANS flow solution over wings, nacelles, and fuselages.",
    },
    {
      id: "wf_2",
      name: "Transonic Airfoil Polar & Cp Analysis",
      category: "Airfoil Analysis",
      solverEngine: "XFOIL / Panel Method + Boundary Layer",
      status: "READY",
      description: "Fast 2D pressure coefficient distribution and stall angle prediction.",
    },
    {
      id: "wf_3",
      name: "Hypersonic Shockwave Corridor Solver",
      category: "High Mach Flow",
      solverEngine: "SU2 Compressible Euler Solver",
      status: "BETA",
      description: "Oblique shock angle, detachment boundaries, and aerothermal heat flux.",
    },
  ];

  const workflowCols: ColumnDef<LabWorkflow>[] = [
    { key: "name", header: "Workflow Name", accessor: (w) => w.name },
    { key: "category", header: "Category", accessor: (w) => w.category, width: "180px" },
    { key: "solverEngine", header: "Solver Engine", accessor: (w) => w.solverEngine },
    {
      key: "status",
      header: "Status",
      accessor: (w) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-mono">
          {w.status}
        </span>
      ),
      width: "100px",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050A16] flex flex-col font-mono text-white">
      <Header />
      <div className="flex flex-1">
        <CommandCenterSidebar />
        <main className="flex-1 lg:ml-64 p-4 md:p-6 space-y-6">
          {/* Standardized Lab UX Header */}
          <div className="bg-[#080E1C] border border-white/10 rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Wind className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm font-bold text-white tracking-tight uppercase">
                    AERODYNAMICS LABORATORY
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
                    LAB ID: LAB-AERO-01
                  </span>
                </div>
                <p className="text-xs text-white/60 font-sans max-w-3xl leading-relaxed">
                  Computational fluid dynamics, supersonic wind tunnel simulations, and wing
                  boundary layer shear stress analysis for aircraft and aerospace vehicles.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/40">ACTIVE PROJECT:</span>
                <span className="text-xs font-bold text-cyan-300 bg-white/5 px-2.5 py-1 rounded border border-white/10">
                  Hypersonic UAV
                </span>
              </div>
            </div>

            {/* Physics Engine & Solvers Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-white/40 block text-[10px]">PHYSICS ENGINE:</span>
                <span className="text-white/90 font-bold">US Standard Atmosphere 1976</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px]">AVAILABLE SOLVERS:</span>
                <span className="text-cyan-300 font-bold">OpenFOAM, SU2, XFOIL</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px]">VISCOSITY MODEL:</span>
                <span className="text-amber-400 font-bold">Sutherland (Air)</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px]">TURBULENCE MODEL:</span>
                <span className="text-pink-400 font-bold">k-omega SST / Spalart-Allmaras</span>
              </div>
            </div>
          </div>

          {/* Interactive Atmospheric Aerodynamics Calculator */}
          <div className="bg-[#080E1C] border border-white/10 rounded-xl p-5 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Real-Time Aerodynamic Solver Console
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sliders */}
              <div className="space-y-3 bg-[#050914] p-3.5 rounded border border-white/5 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-white/60">Altitude (m):</span>
                    <span className="font-bold text-cyan-400">{altitude.toLocaleString()} m</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="35000"
                    value={altitude}
                    onChange={(e) => setAltitude(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-white/60">Flight Mach Number:</span>
                    <span className="font-bold text-pink-400">Mach {mach.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="3.0"
                    step="0.05"
                    value={mach}
                    onChange={(e) => setMach(Number(e.target.value))}
                    className="w-full accent-pink-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-white/60">Angle of Attack α (°):</span>
                    <span className="font-bold text-amber-400">{aoa.toFixed(1)}°</span>
                  </div>
                  <input
                    type="range"
                    min="-5"
                    max="20"
                    step="0.5"
                    value={aoa}
                    onChange={(e) => setAoa(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Atmospheric Output */}
              <div className="bg-[#050914] p-3.5 rounded border border-white/5 space-y-2 text-xs">
                <span className="text-[10px] text-white/40 uppercase font-bold block mb-1">
                  Atmospheric Conditions
                </span>
                <div className="flex justify-between">
                  <span className="text-white/60">Temperature T:</span>
                  <span className="font-bold text-white">{(atmo.T - 273.15).toFixed(1)} °C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Pressure p:</span>
                  <span className="font-bold text-cyan-300">{(atmo.P / 1000).toFixed(2)} kPa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Density ρ:</span>
                  <span className="font-bold text-white">{atmo.rho.toFixed(4)} kg/m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Speed of Sound c:</span>
                  <span className="font-bold text-white">{atmo.speedOfSound.toFixed(1)} m/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Reynolds Re:</span>
                  <span className="font-bold text-amber-300">
                    {(reynoldsNumber / 1e6).toFixed(2)}M
                  </span>
                </div>
              </div>

              {/* Solved Forces & L/D */}
              <div className="bg-[#050914] p-3.5 rounded border border-white/5 space-y-2 text-xs">
                <span className="text-[10px] text-cyan-400 uppercase font-bold block mb-1">
                  Solved Forces & Coefficients
                </span>
                <div className="flex justify-between">
                  <span className="text-white/60">Lift Coeff C_L:</span>
                  <span className="font-bold text-emerald-400">{cl.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Drag Coeff C_D:</span>
                  <span className="font-bold text-pink-400">{cd.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Total Lift Force:</span>
                  <span className="font-bold text-emerald-300">{(lift / 1000).toFixed(2)} kN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Total Drag Force:</span>
                  <span className="font-bold text-pink-300">{(drag / 1000).toFixed(2)} kN</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-1.5 mt-1.5">
                  <span className="font-bold text-white">Lift-to-Drag Ratio L/D:</span>
                  <span className="font-bold text-cyan-400 text-sm">{liftToDrag.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Standardized Workflows Table */}
          <EngineeringTable
            title="Available Aerodynamics Workflows"
            description="Select a workflow to launch simulation case setups."
            data={workflows}
            columns={workflowCols}
            keyExtractor={(w) => w.id}
          />
        </main>
      </div>

      <Footer />

      <AICopilotSidebar
        projectId="aerodynamics-lab"
        isOpen={showCopilot}
        onToggle={setShowCopilot}
      />
    </div>
  );
}
