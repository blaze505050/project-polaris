import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Play,
  Pause,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  Terminal,
  Activity,
  Cpu,
  Layers,
  X,
  FileText,
  RotateCcw,
  Zap,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToastStore } from "@/stores/toastStore";
import EngineeringTable, { ColumnDef } from "@/components/ui/EngineeringTable";
import ReproducibilityPanel from "@/components/ui/ReproducibilityPanel";

export type SimulationStatus =
  "QUEUED" | "RUNNING" | "CONVERGING" | "COMPLETED" | "FAILED" | "CANCELLED";

export interface SimulationJob {
  id: string;
  jobId: string;
  name: string;
  project: string;
  solver: string;
  status: SimulationStatus;
  progress: number;
  cpuCores: number;
  gpuMemory: string;
  ramUsage: string;
  runtime: number; // seconds
  estCompletion: number; // seconds
  meshSize: string; // e.g., '4.2M cells'
  residuals: number[];
  logs: string[];
  createdAt: Date;
}

interface SimulationManagerProps {
  projectId?: string;
}

export default function SimulationManager({ projectId }: SimulationManagerProps) {
  const { addToast } = useToastStore();

  const [simulations, setSimulations] = useState<SimulationJob[]>([
    {
      id: "sim_1",
      jobId: "SIM-2026-0419",
      name: "Transonic Wing Boundary Layer CFD",
      project: "Hypersonic UAV",
      solver: "OpenFOAM (simpleFoam k-omega SST)",
      status: "RUNNING",
      progress: 74,
      cpuCores: 64,
      gpuMemory: "12.4 / 24 GB (A100)",
      ramUsage: "48.2 GB",
      runtime: 3420,
      estCompletion: 1200,
      meshSize: "4.2M cells",
      residuals: [1e-1, 5e-2, 2e-2, 8e-3, 3e-3, 1e-3, 5e-4, 2e-4],
      logs: [
        "[16:40:01] Initializing mesh geometry from OpenFOAM mesh registry...",
        "[16:40:05] Applying boundary conditions: Inlet Mach = 0.85, Pressure = 101.3 kPa, Temp = 288.15 K",
        "[16:41:12] Iteration 100: Residual p = 4.2e-3, Ux = 1.1e-3, Uy = 8.4e-4, k = 5.2e-4",
        "[16:42:30] Iteration 300: Residual p = 8.1e-4, Ux = 2.4e-4, Uy = 1.9e-4, k = 1.1e-4",
        "[16:44:00] Iteration 500: Residual p = 2.0e-4, Ux = 8.2e-5, Uy = 6.1e-5, k = 3.4e-5 (Converging)",
      ],
      createdAt: new Date(Date.now() - 3420000),
    },
    {
      id: "sim_2",
      jobId: "SIM-2026-0420",
      name: "Fuselage Structural FEA Stress Distribution",
      project: "Hypersonic UAV",
      solver: "CalculiX FEA (Nonlinear Static)",
      status: "QUEUED",
      progress: 0,
      cpuCores: 32,
      gpuMemory: "0 / 24 GB",
      ramUsage: "8.0 GB",
      runtime: 0,
      estCompletion: 1800,
      meshSize: "1.8M elements",
      residuals: [],
      logs: ["[16:44:10] Job queued in HPC scheduler. Waiting for available compute node..."],
      createdAt: new Date(),
    },
    {
      id: "sim_3",
      jobId: "SIM-2026-0418",
      name: "Nozzle Aerothermal Heat Flux Simulation",
      project: "Hypersonic UAV",
      solver: "SU2 Aerothermal Solver",
      status: "COMPLETED",
      progress: 100,
      cpuCores: 128,
      gpuMemory: "22.1 / 24 GB",
      ramUsage: "96.5 GB",
      runtime: 7200,
      estCompletion: 0,
      meshSize: "8.5M cells",
      residuals: [1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6],
      logs: [
        "[14:00:00] Job started on node compute-04.",
        "[16:00:00] Convergence criteria (1e-6) met successfully.",
        "[16:00:02] Exporting VTK visual contour fields and log archives.",
      ],
      createdAt: new Date(Date.now() - 7200000),
    },
    {
      id: "sim_4",
      jobId: "SIM-2026-0415",
      name: "Shockwave Intersection Mesh Test",
      project: "Hypersonic UAV",
      solver: "OpenFOAM (rhoCentralFoam)",
      status: "FAILED",
      progress: 32,
      cpuCores: 64,
      gpuMemory: "8.2 / 24 GB",
      ramUsage: "32.0 GB",
      runtime: 840,
      estCompletion: 0,
      meshSize: "3.1M cells",
      residuals: [1e-1, 2e-1, 8e-1, 4.5],
      logs: [
        "[12:10:00] Solved 320 iterations.",
        "[12:14:00] ERROR: Surface intersection detected near Wing Root leading edge.",
        "[12:14:01] Fatal divergence: Courant number exceeded 1.0 (Co max = 4.82). Solver terminated.",
      ],
      createdAt: new Date(Date.now() - 14400000),
    },
  ]);

  const [activeFilter, setActiveFilter] = useState<"ALL" | SimulationStatus>("ALL");
  const [selectedSimId, setSelectedSimId] = useState<string | null>("sim_1");
  const [showNewSimModal, setShowNewSimModal] = useState(false);
  const [newSimName, setNewSimName] = useState("");
  const [newSimSolver, setNewSimSolver] = useState("OpenFOAM (simpleFoam k-omega SST)");

  const selectedSim = simulations.find((s) => s.id === selectedSimId);

  const getStatusBadge = (status: SimulationStatus) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "RUNNING":
      case "CONVERGING":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      case "QUEUED":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "FAILED":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      case "CANCELLED":
        return "bg-white/10 text-white/50 border-white/20";
    }
  };

  const formatRuntime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  const filteredSimulations = simulations.filter(
    (s) => activeFilter === "ALL" || s.status === activeFilter,
  );

  const handleCreateSimulation = () => {
    if (!newSimName.trim()) return;
    const newSim: SimulationJob = {
      id: `sim_${Date.now()}`,
      jobId: `SIM-2026-0${Math.floor(Math.random() * 800 + 100)}`,
      name: newSimName,
      project: "Hypersonic UAV",
      solver: newSimSolver,
      status: "QUEUED",
      progress: 0,
      cpuCores: 64,
      gpuMemory: "0 / 24 GB",
      ramUsage: "16.0 GB",
      runtime: 0,
      estCompletion: 2400,
      meshSize: "3.5M cells",
      residuals: [],
      logs: [
        `[${new Date().toLocaleTimeString()}] Job queued successfully in AeroForge compute cluster.`,
      ],
      createdAt: new Date(),
    };

    setSimulations([newSim, ...simulations]);
    setSelectedSimId(newSim.id);
    setNewSimName("");
    setShowNewSimModal(false);

    addToast({
      title: "Simulation Queued",
      description: `${newSim.jobId} submitted to HPC solver pipeline.`,
      type: "success",
    });
  };

  const columns: ColumnDef<SimulationJob>[] = [
    {
      key: "jobId",
      header: "Job ID",
      accessor: (s) => s.jobId,
      width: "120px",
    },
    {
      key: "name",
      header: "Simulation Name",
      accessor: (s) => s.name,
    },
    {
      key: "solver",
      header: "Solver Engine",
      accessor: (s) => s.solver,
    },
    {
      key: "status",
      header: "Status",
      accessor: (s) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold border font-mono ${getStatusBadge(
            s.status,
          )}`}
        >
          {s.status}
        </span>
      ),
      width: "110px",
    },
    {
      key: "meshSize",
      header: "Mesh Size",
      accessor: (s) => s.meshSize,
      width: "100px",
    },
    {
      key: "progress",
      header: "Progress",
      accessor: (s) => `${s.progress}%`,
      width: "90px",
      align: "right",
    },
    {
      key: "runtime",
      header: "Runtime",
      accessor: (s) => formatRuntime(s.runtime),
      width: "100px",
      align: "right",
    },
  ];

  return (
    <div className="space-y-6 font-mono text-xs text-white">
      {/* Compute Cluster Header Ticker */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#080E1C] border border-white/10 rounded-lg p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-white/50 uppercase">ACTIVE SOLVERS</div>
            <div className="text-xl font-bold text-cyan-400 mt-0.5">
              {
                simulations.filter((s) => s.status === "RUNNING" || s.status === "CONVERGING")
                  .length
              }{" "}
              / 8
            </div>
          </div>
          <Cpu className="w-6 h-6 text-cyan-400/50" />
        </div>

        <div className="bg-[#080E1C] border border-white/10 rounded-lg p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-white/50 uppercase">QUEUED JOBS</div>
            <div className="text-xl font-bold text-amber-400 mt-0.5">
              {simulations.filter((s) => s.status === "QUEUED").length}
            </div>
          </div>
          <Clock className="w-6 h-6 text-amber-400/50" />
        </div>

        <div className="bg-[#080E1C] border border-white/10 rounded-lg p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-white/50 uppercase">COMPLETED TODAY</div>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">
              {simulations.filter((s) => s.status === "COMPLETED").length}
            </div>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-400/50" />
        </div>

        <div className="bg-[#080E1C] border border-white/10 rounded-lg p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-white/50 uppercase">HPC UTILIZATION</div>
            <div className="text-xl font-bold text-pink-400 mt-0.5">84.2%</div>
          </div>
          <Zap className="w-6 h-6 text-pink-400/50" />
        </div>
      </div>

      {/* Main Table & Detail Split Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: Simulation Jobs List Table */}
        <div className="lg:col-span-2 space-y-3">
          {/* Status Filter Bar */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 bg-[#080E1C] p-1 border border-white/10 rounded-lg">
              {(["ALL", "RUNNING", "QUEUED", "COMPLETED", "FAILED"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setActiveFilter(st)}
                  className={`px-3 py-1 rounded text-[11px] transition-all ${
                    activeFilter === st
                      ? "bg-cyan-500 text-black font-bold"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowNewSimModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold tracking-tight shadow-md transition-all text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Queue Simulation</span>
            </button>
          </div>

          <EngineeringTable
            title="HPC Simulation Jobs"
            description="Select a job to view convergence residuals, mesh specs, and stdout logs."
            data={filteredSimulations}
            columns={columns}
            keyExtractor={(s) => s.id}
            onRowClick={(s) => setSelectedSimId(s.id)}
            exportFilename="aeroforge-simulations"
          />
        </div>

        {/* Right 1 Col: Selected Simulation Workspace Detail Drawer */}
        <div className="bg-[#080E1C] border border-white/10 rounded-lg p-4 space-y-4">
          {selectedSim ? (
            <>
              <div className="border-b border-white/10 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                    {selectedSim.jobId}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(
                      selectedSim.status,
                    )}`}
                  >
                    {selectedSim.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mt-1 leading-snug">
                  {selectedSim.name}
                </h3>
                <p className="text-[11px] text-white/50 mt-0.5">{selectedSim.solver}</p>
              </div>

              {/* Progress & Specs */}
              <div className="space-y-2.5 text-[11px]">
                <div>
                  <div className="flex justify-between text-white/60 mb-1">
                    <span>Progress:</span>
                    <span className="font-bold text-cyan-400">{selectedSim.progress}%</span>
                  </div>
                  <Progress value={selectedSim.progress} className="h-1.5 bg-white/10" />
                </div>

                <div className="grid grid-cols-2 gap-2 bg-[#050914] p-2.5 rounded border border-white/5">
                  <div>
                    <span className="text-white/40 block text-[10px]">CPU Cores:</span>
                    <span className="font-bold text-white/90">{selectedSim.cpuCores} Cores</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px]">Mesh Resolution:</span>
                    <span className="font-bold text-cyan-300">{selectedSim.meshSize}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px]">GPU VRAM:</span>
                    <span className="font-bold text-white/90">{selectedSim.gpuMemory}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px]">Elapsed Time:</span>
                    <span className="font-bold text-white/90">
                      {formatRuntime(selectedSim.runtime)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Residual Convergence sparkline visualization */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] text-white/50">
                  <span className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-cyan-400" />
                    CONVERGENCE RESIDUALS
                  </span>
                  <span>Target: 1e-4</span>
                </div>
                <div className="h-20 bg-[#050914] rounded border border-white/5 p-2 flex items-end gap-1">
                  {selectedSim.residuals.length > 0 ? (
                    selectedSim.residuals.map((r, i) => (
                      <div
                        key={i}
                        className="bg-cyan-400/80 rounded-t flex-1 hover:bg-cyan-300 transition-colors"
                        style={{
                          height: `${Math.min(100, Math.max(10, Math.log10(1 / r) * 20))}%`,
                        }}
                        title={`Iter ${i * 100}: Residual = ${r}`}
                      />
                    ))
                  ) : (
                    <div className="w-full text-center text-white/30 text-[10px] py-4">
                      No convergence data logged yet
                    </div>
                  )}
                </div>
              </div>

              {/* Live Terminal Output Logs */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] text-white/50">
                  <Terminal className="w-3.5 h-3.5 text-pink-400" />
                  <span>SOLVER LOG OUTPUT (STDOUT/STDERR)</span>
                </div>
                <div className="h-32 bg-[#040710] border border-white/10 rounded p-2.5 overflow-y-auto space-y-1 text-[10px] text-emerald-400/90 leading-relaxed font-mono">
                  {selectedSim.logs.map((log, i) => (
                    <div key={i} className="whitespace-pre-wrap">
                      {log}
                    </div>
                  ))}
                </div>
              </div>

              {/* Reproducibility Record */}
              <ReproducibilityPanel
                data={{
                  solver: selectedSim.solver,
                  solverVersion: "v23.12 (OpenFOAM Foundation)",
                  geometryVersion: "STEP-v1.4",
                  meshVersion: "Gmsh-v4.11",
                  meshCells: selectedSim.meshSize,
                  turbulenceModel: "k-omega SST",
                  material: "Air (Ideal Gas)",
                  boundaryConditions: [
                    "Inlet: Mach 0.85, T=288.15 K",
                    "Outlet: Pressure Outlet (101.325 kPa)",
                    "Wall: No-Slip Adiabatic",
                  ],
                  units: "SI (m, kg, s, K, Pa)",
                  computeEnvironment: `${selectedSim.cpuCores} Cores, ${selectedSim.gpuMemory} VRAM`,
                  date: new Date(selectedSim.createdAt).toLocaleDateString(),
                }}
              />

              {/* Quick Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() =>
                    addToast({
                      title: "Results Downloaded",
                      description: "VTK vector fields and solution logs exported.",
                      type: "success",
                    })
                  }
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 font-bold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Solution</span>
                </button>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-white/40">
              Select a simulation to view workspace.
            </div>
          )}
        </div>
      </div>

      {/* New Simulation Dialog Modal */}
      {showNewSimModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#080E1C] border border-cyan-500/30 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                Queue New Simulation Job
              </h3>
              <button
                onClick={() => setShowNewSimModal(false)}
                className="text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] text-white/60 uppercase mb-1">
                  Simulation Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Hypersonic Nozzle Boundary Flow"
                  value={newSimName}
                  onChange={(e) => setNewSimName(e.target.value)}
                  className="w-full bg-[#050914] border border-white/20 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[10px] text-white/60 uppercase mb-1">
                  Physics Solver Engine
                </label>
                <select
                  value={newSimSolver}
                  onChange={(e) => setNewSimSolver(e.target.value)}
                  className="w-full bg-[#050914] border border-white/20 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="OpenFOAM (simpleFoam k-omega SST)">
                    OpenFOAM (simpleFoam k-omega SST)
                  </option>
                  <option value="SU2 Aerothermal Solver">SU2 Compressible Aerothermal</option>
                  <option value="CalculiX FEA (Nonlinear Structural)">
                    CalculiX FEA (Nonlinear Structural)
                  </option>
                  <option value="RK4 Astrodynamics N-Body Engine">
                    RK4 Astrodynamics N-Body Engine
                  </option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
              <button
                onClick={() => setShowNewSimModal(false)}
                className="px-3.5 py-1.5 rounded border border-white/15 text-white/70 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSimulation}
                className="px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
              >
                Submit to HPC
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
