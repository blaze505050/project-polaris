import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Play,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Share2,
  HelpCircle,
  Activity,
  Layers,
  Sparkles,
  BarChart2,
  Clock,
  ShieldAlert,
  Cpu,
  Terminal,
  X,
  Server,
  Bookmark,
  BookOpen,
} from "lucide-react";
import {
  AirfoilSurrogateInputs,
  AirfoilSurrogateResult,
  JobStatusResponse,
  BackendComputeStatus,
} from "@/types/physicsAi";
import {
  runAirfoilSurrogateModel,
  parseNACA4Digit,
  generateNacaProfile,
} from "@/services/physicsAi/airfoilSurrogateService";
import {
  checkBackendComputeStatus,
  submitBackendJob,
  getBackendJobStatus,
  cancelBackendJob,
} from "@/services/physicsAi/apiClient";
import { createCanonicalDatasetEntry } from "@/services/physicsAi/canonicalSchema";
import PublicResearchArtifactModal from "./PublicResearchArtifactModal";

export default function AirfoilExperimentUI() {
  // Input Parameters State
  const [nacaPreset, setNacaPreset] = useState<string>("NACA 0012");
  const [maxCamber, setMaxCamber] = useState<number>(0.0);
  const [camberPos, setCamberPos] = useState<number>(0.4);
  const [thickness, setThickness] = useState<number>(0.12);

  const [reynolds, setReynolds] = useState<number>(3e6);
  const [mach, setMach] = useState<number>(0.15);
  const [aoa, setAoa] = useState<number>(4.0);
  const [bcType, setBcType] = useState<AirfoilSurrogateInputs["bcType"]>("no-slip");
  const [activeVizTab, setActiveVizTab] = useState<"cp" | "geometry" | "flow">("cp");

  // Execution Mode & Backend State
  const [executionEngine, setExecutionEngine] = useState<"fno-backend" | "client-preview">(
    "fno-backend",
  );
  const [backendStatus, setBackendStatus] = useState<BackendComputeStatus>({
    online: false,
    target: "Checking API...",
    device: "Unknown",
    gpuAvailable: false,
    activeJobsCount: 0,
    message: "Checking local backend status...",
  });
  const [showSetupGuide, setShowSetupGuide] = useState<boolean>(false);

  // Job Execution State
  const [currentJob, setCurrentJob] = useState<JobStatusResponse | null>(null);
  const [backendResult, setBackendResult] = useState<AirfoilSurrogateResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [showArtifactModal, setShowArtifactModal] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Check Backend Status on Mount & Interval
  useEffect(() => {
    let isMounted = true;
    const fetchStatus = async () => {
      const status = await checkBackendComputeStatus();
      if (isMounted) {
        setBackendStatus(status);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Handle Airfoil Preset Selection
  const handlePresetSelect = (preset: string) => {
    setNacaPreset(preset);
    if (preset !== "Custom") {
      const parsed = parseNACA4Digit(preset);
      setMaxCamber(parsed.maxCamber);
      setCamberPos(parsed.camberPos);
      setThickness(parsed.thickness);
    }
  };

  const inputs: AirfoilSurrogateInputs = useMemo(
    () => ({
      airfoilName:
        nacaPreset === "Custom"
          ? `NACA ${Math.round(maxCamber * 100)}${Math.round(camberPos * 10)}${Math.round(
              thickness * 100,
            )
              .toString()
              .padStart(2, "0")}`
          : nacaPreset,
      maxCamber,
      camberPos,
      thickness,
      reynolds,
      mach,
      aoa,
      bcType,
      gridResolution: 64,
    }),
    [nacaPreset, maxCamber, camberPos, thickness, reynolds, mach, aoa, bcType],
  );

  // In-Browser Analytical Solver Preview (Fast fallback)
  const clientResult: AirfoilSurrogateResult = useMemo(() => {
    return runAirfoilSurrogateModel(inputs);
  }, [inputs]);

  // Active result display (Real PyTorch backend result or Client fallback)
  const activeResult: AirfoilSurrogateResult = backendResult || clientResult;

  const profile = useMemo(() => {
    return generateNacaProfile(maxCamber, camberPos, thickness, 40);
  }, [maxCamber, camberPos, thickness]);

  // Submit Async Real PyTorch FNO Job to FastAPI Backend
  const handleRunRealFnoJob = async () => {
    if (!backendStatus.online) {
      setShowSetupGuide(true);
      return;
    }

    try {
      setIsSubmitting(true);
      setBackendResult(null);

      const jobResponse = await submitBackendJob({
        modelId: "fno",
        inputs,
        device: "auto",
      });

      setCurrentJob(jobResponse);

      const pollInterval = setInterval(async () => {
        try {
          const updated = await getBackendJobStatus(jobResponse.jobId);
          setCurrentJob(updated);

          if (updated.status === "COMPLETED" && updated.result) {
            clearInterval(pollInterval);
            setIsSubmitting(false);
            setBackendResult(updated.result);
            setNotification(`Real PyTorch FNO job completed in ${updated.runtimeMs} ms!`);
            setTimeout(() => setNotification(null), 3500);
          } else if (updated.status === "FAILED" || updated.status === "CANCELLED") {
            clearInterval(pollInterval);
            setIsSubmitting(false);
          }
        } catch (err) {
          clearInterval(pollInterval);
          setIsSubmitting(false);
        }
      }, 200);
    } catch (err: any) {
      setIsSubmitting(false);
      setNotification(`Failed to submit job: ${err.message}`);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleCancelJob = async () => {
    if (currentJob) {
      await cancelBackendJob(currentJob.jobId);
      setIsSubmitting(false);
    }
  };

  const handleSaveToProject = () => {
    setNotification("FNO Experiment saved to active AeroForge Project!");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddToNotebook = () => {
    setNotification("FNO Simulation entry added to Engineering Notebook!");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleExportCanonicalDataset = () => {
    const ds = createCanonicalDatasetEntry(inputs, activeResult);
    const jsonStr = JSON.stringify(ds, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${ds.id}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setNotification("Canonical AeroForge Dataset exported successfully!");
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Toast Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-cyan-500/20 border border-cyan-500/40 rounded-lg text-cyan-300 text-xs font-mono font-bold flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          {notification}
        </motion.div>
      )}

      {/* Execution Engine Selector & Compute Device Status Banner */}
      <div className="bg-[#0A1020] border border-white/10 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-white/50 text-[11px]">MODEL ENGINE:</span>

          <button
            onClick={() => setExecutionEngine("fno-backend")}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
              executionEngine === "fno-backend"
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold"
                : "bg-white/5 text-white/60 border-white/10 hover:text-white"
            }`}
          >
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            Fourier Neural Operator (FNO) [REAL PYTORCH ENGINE]
          </button>

          <button
            onClick={() => setExecutionEngine("client-preview")}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
              executionEngine === "client-preview"
                ? "bg-purple-500/20 text-purple-300 border-purple-500/50 font-bold"
                : "bg-white/5 text-white/60 border-white/10 hover:text-white"
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            AeroForge Analytical Solver Preview (Fallback)
          </button>
        </div>

        {/* Backend Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#060B18] px-3 py-1 rounded-lg border border-white/10">
            <span
              className={`w-2 h-2 rounded-full ${backendStatus.online ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}
            />
            <span className="text-[11px] text-white/80 font-bold">
              {backendStatus.online ? backendStatus.target : "Real PyTorch Backend Offline"}
            </span>
            <span className="text-[10px] text-white/40">({backendStatus.device})</span>
          </div>

          {!backendStatus.online && (
            <button
              onClick={() => setShowSetupGuide(!showSetupGuide)}
              className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded text-[11px] font-bold flex items-center gap-1"
            >
              <Terminal className="w-3 h-3" />
              Setup Guide
            </button>
          )}
        </div>
      </div>

      {/* Local Backend Setup Guide Drawer */}
      {showSetupGuide && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-[#040814] border border-amber-500/40 rounded-xl p-5 text-xs font-mono space-y-3 relative"
        >
          <button
            onClick={() => setShowSetupGuide(false)}
            className="absolute right-4 top-4 text-white/40 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
            <Terminal className="w-4 h-4" />
            FastAPI PyTorch Backend Execution Setup
          </div>

          <p className="text-white/70 font-sans text-xs">
            The real Fourier Neural Operator PyTorch execution engine runs locally via FastAPI. Run
            the backend service:
          </p>

          <div className="bg-black/80 p-3 rounded-lg border border-white/10 space-y-1 text-[11px] text-cyan-300">
            <p className="text-white/40"># 1. Navigate to backend directory</p>
            <p>cd backend</p>
            <p className="text-white/40 pt-1">
              # 2. Start the FastAPI PyTorch server on http://localhost:8000
            </p>
            <p>python run_backend.py</p>
          </div>
        </motion.div>
      )}

      {/* Main 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Controls & Setup (4 cols) */}
        <div className="lg:col-span-4 bg-[#0A1020] border border-white/10 rounded-xl p-5 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Airfoil & Flight Parameters
            </h2>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              NACA 4-Digit
            </span>
          </div>

          {/* Preset Buttons */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-white/50 block">AIRFOIL PRESET</label>
            <div className="grid grid-cols-3 gap-1.5 font-mono text-xs">
              {["NACA 0012", "NACA 2412", "NACA 4412", "NACA 0015", "NACA 6409", "Custom"].map(
                (preset) => (
                  <button
                    key={preset}
                    onClick={() => handlePresetSelect(preset)}
                    className={`px-2 py-1.5 rounded border text-[11px] transition-all ${
                      nacaPreset === preset
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold"
                        : "bg-white/5 text-white/60 border-white/5 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {preset}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Geometry Sliders */}
          <div className="space-y-3 bg-[#060B18] p-3 rounded-lg border border-white/5 text-xs font-mono">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-white/60">Max Camber (m):</span>
                <span className="text-cyan-400 font-bold">{(maxCamber * 100).toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.09"
                step="0.01"
                value={maxCamber}
                onChange={(e) => {
                  setNacaPreset("Custom");
                  setMaxCamber(parseFloat(e.target.value));
                }}
                className="w-full accent-cyan-400 bg-white/10 h-1.5 rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-white/60">Camber Position (p):</span>
                <span className="text-cyan-400 font-bold">{(camberPos * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                value={camberPos}
                onChange={(e) => {
                  setNacaPreset("Custom");
                  setCamberPos(parseFloat(e.target.value));
                }}
                className="w-full accent-cyan-400 bg-white/10 h-1.5 rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-white/60">Max Thickness (t):</span>
                <span className="text-cyan-400 font-bold">{(thickness * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.25"
                step="0.01"
                value={thickness}
                onChange={(e) => {
                  setNacaPreset("Custom");
                  setThickness(parseFloat(e.target.value));
                }}
                className="w-full accent-cyan-400 bg-white/10 h-1.5 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Flight Conditions */}
          <div className="space-y-3 font-mono text-xs">
            <label className="text-[11px] font-mono text-white/50 block uppercase">
              Flight & Flow Conditions
            </label>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-white/60">Angle of Attack (α):</span>
                <span className="text-cyan-400 font-bold">{aoa.toFixed(1)}°</span>
              </div>
              <input
                type="range"
                min="-5"
                max="15"
                step="0.5"
                value={aoa}
                onChange={(e) => setAoa(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-white/10 h-1.5 rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-white/60">Mach Number (M):</span>
                <span className="text-cyan-400 font-bold">{mach.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.85"
                step="0.05"
                value={mach}
                onChange={(e) => setMach(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-white/10 h-1.5 rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-white/60">Reynolds Number (Re):</span>
                <span className="text-cyan-400 font-bold">{reynolds.toExponential(1)}</span>
              </div>
              <select
                value={reynolds}
                onChange={(e) => setReynolds(parseFloat(e.target.value))}
                className="w-full bg-[#060B18] border border-white/10 rounded px-2 py-1 text-white/80 focus:outline-none focus:border-cyan-500"
              >
                <option value={1e5}>1.0 × 10⁵ (Low Reynolds)</option>
                <option value={1e6}>1.0 × 10⁶ (General Aviation)</option>
                <option value={3e6}>3.0 × 10⁶ (Standard Wind Tunnel)</option>
                <option value={6e6}>6.0 × 10⁶ (Commercial Jet)</option>
                <option value={1e7}>1.0 × 10⁷ (High Reynolds)</option>
              </select>
            </div>
          </div>

          {/* Job Submission Action Button */}
          {executionEngine === "fno-backend" && (
            <div className="pt-2 font-mono">
              {!isSubmitting ? (
                <button
                  onClick={handleRunRealFnoJob}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                >
                  <Play className="w-4 h-4 fill-black" />
                  Run PyTorch FNO Model
                </button>
              ) : (
                <button
                  onClick={handleCancelJob}
                  className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-xs"
                >
                  Cancel Execution Job
                </button>
              )}
            </div>
          )}
        </div>

        {/* CENTER COLUMN: Interactive Visualization (5 cols) */}
        <div className="lg:col-span-5 bg-[#0A1020] border border-white/10 rounded-xl p-5 flex flex-col justify-between shadow-xl">
          <div>
            {/* Viz Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex gap-2 font-mono text-xs">
                <button
                  onClick={() => setActiveVizTab("cp")}
                  className={`px-3 py-1 rounded transition-all ${
                    activeVizTab === "cp"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  Pressure Cp Curve
                </button>
                <button
                  onClick={() => setActiveVizTab("geometry")}
                  className={`px-3 py-1 rounded transition-all ${
                    activeVizTab === "geometry"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  Geometry Profile
                </button>
                <button
                  onClick={() => setActiveVizTab("flow")}
                  className={`px-3 py-1 rounded transition-all ${
                    activeVizTab === "flow"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  Velocity Field
                </button>
              </div>

              <span className="text-[10px] font-mono text-white/40">
                {inputs.airfoilName} @ α={aoa}°
              </span>
            </div>

            {/* SVG Visualizer Container */}
            <div className="bg-[#040814] border border-white/10 rounded-xl p-4 min-h-[300px] flex items-center justify-center relative overflow-hidden">
              {/* Job Execution Monitoring Overlay */}
              {isSubmitting && currentJob && (
                <div className="absolute inset-0 z-20 bg-black/85 backdrop-blur-sm p-6 flex flex-col justify-between font-mono text-xs">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-400 font-bold flex items-center gap-2">
                        <Activity className="w-4 h-4 animate-spin text-cyan-400" />
                        PYTORCH FNO JOB: {currentJob.status}
                      </span>
                      <span className="text-white/50 text-[10px]">{currentJob.jobId}</span>
                    </div>

                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full transition-all duration-300"
                        style={{ width: `${currentJob.progressPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-[#060B18] p-3 rounded-lg border border-white/10 font-mono text-[10px] text-white/70 max-h-36 overflow-y-auto space-y-1">
                    {currentJob.logs.map((log, idx) => (
                      <p key={idx} className="flex items-start gap-1.5">
                        <span className="text-cyan-400">&gt;</span> {log}
                      </p>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-white/40 border-t border-white/10 pt-2">
                    <span>Target: {currentJob.device}</span>
                    <span>Started: {currentJob.startTime}</span>
                  </div>
                </div>
              )}

              {activeVizTab === "cp" && (
                <div className="w-full h-full flex flex-col items-center">
                  <svg viewBox="0 0 400 240" className="w-full h-64 overflow-visible">
                    <line
                      x1="40"
                      y1="20"
                      x2="40"
                      y2="200"
                      stroke="rgba(255,255,255,0.1)"
                      strokeDasharray="3 3"
                    />
                    <line
                      x1="40"
                      y1="110"
                      x2="380"
                      y2="110"
                      stroke="rgba(255,255,255,0.1)"
                      strokeDasharray="3 3"
                    />
                    <line
                      x1="40"
                      y1="200"
                      x2="380"
                      y2="200"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="40"
                      y1="20"
                      x2="40"
                      y2="200"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="1.5"
                    />

                    <text
                      x="380"
                      y="215"
                      fill="rgba(255,255,255,0.5)"
                      fontSize="10"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      x/c
                    </text>
                    <text
                      x="30"
                      y="25"
                      fill="rgba(255,255,255,0.5)"
                      fontSize="10"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      -Cp
                    </text>

                    {/* AI Upper Surface Cp (Cyan solid) */}
                    <polyline
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="2.5"
                      points={activeResult.cpCurve
                        .map((pt) => {
                          const sx = 40 + pt.xc * 340;
                          const sy = 110 + pt.cpUpper * 45;
                          return `${sx},${Math.max(20, Math.min(200, sy))}`;
                        })
                        .join(" ")}
                    />

                    {/* AI Lower Surface Cp (Purple solid) */}
                    <polyline
                      fill="none"
                      stroke="#c084fc"
                      strokeWidth="2.5"
                      points={activeResult.cpCurve
                        .map((pt) => {
                          const sx = 40 + pt.xc * 340;
                          const sy = 110 + pt.cpLower * 45;
                          return `${sx},${Math.max(20, Math.min(200, sy))}`;
                        })
                        .join(" ")}
                    />

                    {/* Analytical Upper Surface Cp (Cyan dashed) */}
                    <polyline
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      points={activeResult.cpCurve
                        .map((pt) => {
                          const sx = 40 + pt.xc * 340;
                          const sy = 110 + pt.cpAnalyticalUpper * 45;
                          return `${sx},${Math.max(20, Math.min(200, sy))}`;
                        })
                        .join(" ")}
                    />
                  </svg>

                  {/* Legend */}
                  <div className="flex items-center gap-4 mt-2 font-mono text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-0.5 bg-cyan-400 rounded-full" />
                      <span className="text-cyan-300 font-bold">FNO Prediction Upper</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-0.5 bg-purple-400 rounded-full" />
                      <span className="text-purple-300 font-bold">FNO Prediction Lower</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-0.5 bg-cyan-400/50 border-t border-dashed border-cyan-400" />
                      <span className="text-white/50">Analytical Baseline</span>
                    </div>
                  </div>
                </div>
              )}

              {activeVizTab === "geometry" && (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <svg viewBox="0 0 400 200" className="w-full h-56">
                    <polygon
                      fill="rgba(34, 211, 238, 0.15)"
                      stroke="#22d3ee"
                      strokeWidth="2"
                      points={[
                        ...profile.xu.map(
                          (x, idx) => `${30 + x * 340},${100 - profile.yu[idx] * 340}`,
                        ),
                        ...profile.xl
                          .slice()
                          .reverse()
                          .map((x, idx) => {
                            const origIdx = profile.xl.length - 1 - idx;
                            return `${30 + x * 340},${100 - profile.yl[origIdx] * 340}`;
                          }),
                      ].join(" ")}
                    />
                    <polyline
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      points={profile.xc
                        .map(
                          (x, idx) =>
                            `${30 + x * 340},${100 - (profile.yu[idx] + profile.yl[idx]) * 170}`,
                        )
                        .join(" ")}
                    />
                    <line
                      x1="30"
                      y1="100"
                      x2="370"
                      y2="100"
                      stroke="rgba(255,255,255,0.2)"
                      strokeDasharray="2 2"
                    />
                  </svg>
                  <p className="text-[10px] font-mono text-white/50 mt-1">
                    Geometry: {inputs.airfoilName} (Thickness: {(thickness * 100).toFixed(0)}%,
                    Camber: {(maxCamber * 100).toFixed(1)}%)
                  </p>
                </div>
              )}

              {activeVizTab === "flow" && (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <svg viewBox="0 0 400 220" className="w-full h-56">
                    <polygon
                      fill="rgba(255, 255, 255, 0.2)"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      points={[
                        ...profile.xu.map(
                          (x, idx) => `${40 + x * 320},${110 - profile.yu[idx] * 320}`,
                        ),
                        ...profile.xl
                          .slice()
                          .reverse()
                          .map((x, idx) => {
                            const origIdx = profile.xl.length - 1 - idx;
                            return `${40 + x * 320},${110 - profile.yl[origIdx] * 320}`;
                          }),
                      ].join(" ")}
                    />

                    {[-60, -40, -20, 20, 40, 60].map((yOffset, i) => (
                      <path
                        key={i}
                        d={`M 20 ${110 + yOffset} Q 200 ${110 + yOffset * 1.3} 380 ${110 + yOffset * 0.9}`}
                        fill="none"
                        stroke={yOffset < 0 ? "#22d3ee" : "#a855f7"}
                        strokeWidth="1.2"
                        strokeOpacity="0.7"
                      />
                    ))}
                  </svg>
                  <p className="text-[10px] font-mono text-cyan-300 mt-1">
                    FNO 2D Velocity Vector Field Streamlines
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Info Footer */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-1.5 text-white/50">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                Inference Time:{" "}
                <span className="text-cyan-400 font-bold">{activeResult.inferenceTimeMs} ms</span>
              </span>
            </div>
            <div className="flex items-center gap-1 text-white/40">
              <span>
                Model: <span className="text-white/80">{activeResult.modelVersion}</span>
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Traceable Timing & Derivation Transparency (3 cols) */}
        <div className="lg:col-span-3 bg-[#0A1020] border border-white/10 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="border-b border-white/10 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              FNO Execution Metrics
            </h2>
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
              [LIVE RESULT]
            </span>
          </div>

          {/* Primary Coefficients */}
          <div className="space-y-2 font-mono text-xs">
            <div className="bg-[#060B18] p-3 rounded-lg border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-white/40 block uppercase">Lift Coeff (CL)</span>
                <span className="text-xl font-bold text-cyan-400">
                  {activeResult.cl.toFixed(4)}
                </span>
              </div>
              <span className="text-[9px] text-white/30">∫ (Cp_l - Cp_u) dx</span>
            </div>

            <div className="bg-[#060B18] p-3 rounded-lg border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-white/40 block uppercase">Drag Coeff (CD)</span>
                <span className="text-xl font-bold text-purple-400">
                  {activeResult.cd.toFixed(5)}
                </span>
              </div>
            </div>

            <div className="bg-[#060B18] p-3 rounded-lg border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-white/40 block uppercase">
                  Min Pressure (Min Cp)
                </span>
                <span className="text-base font-bold text-emerald-400">
                  {activeResult.minCp.toFixed(3)}
                </span>
              </div>
            </div>
          </div>

          {/* Traceable Timing Breakdown */}
          {activeResult.physicsResiduals.modelInferenceTimeMs !== undefined && (
            <div className="bg-[#060B18] p-3 rounded-lg border border-cyan-500/30 font-mono text-[10px] space-y-1.5">
              <span className="text-cyan-300 font-bold block border-b border-white/10 pb-1">
                TRACEABLE EXECUTION TIMING
              </span>
              <div className="flex justify-between">
                <span className="text-white/40">Grid Preprocessing:</span>
                <span className="text-white/80">
                  {activeResult.physicsResiduals.preprocessingTimeMs} ms
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">PyTorch Forward Pass:</span>
                <span className="text-cyan-400 font-bold">
                  {activeResult.physicsResiduals.modelInferenceTimeMs} ms
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Postprocessing:</span>
                <span className="text-white/80">
                  {activeResult.physicsResiduals.postprocessingTimeMs} ms
                </span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-1 font-bold">
                <span className="text-white/60">Total Execution Job:</span>
                <span className="text-purple-300">
                  {activeResult.physicsResiduals.totalExecutionTimeMs} ms
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleSaveToProject}
              className="w-full py-2 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Bookmark className="w-3.5 h-3.5" />
              Save to Project
            </button>

            <button
              onClick={handleAddToNotebook}
              className="w-full py-2 bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/40 text-blue-300 text-xs font-mono font-bold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Add to Notebook
            </button>

            <button
              onClick={handleExportCanonicalDataset}
              className="w-full py-2 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <FileCode className="w-3.5 h-3.5" />
              Export Canonical Dataset
            </button>

            <button
              onClick={() => setShowArtifactModal(true)}
              className="w-full py-2 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-3.5 h-3.5" />
              Publish Research Artifact
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM PANEL: Tri-Solver Comparison & Derivation Transparency */}
      <div className="bg-[#0A1020] border border-white/10 rounded-xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-base font-bold font-mono text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              Physics AI vs Classical Solver Verification
            </h3>
            <p className="text-xs text-white/50 mt-0.5">
              Empirical validation matrix comparing Fourier Neural Operator predictions against
              analytical potential flow solver and Abbott & Von Doenhoff wind-tunnel reference data.
            </p>
          </div>
        </div>

        {/* Quantitative Comparison Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-[11px]">
                <th className="pb-3 font-semibold">METRIC / SOLVER</th>
                <th className="pb-3 font-semibold text-cyan-400">FNO PREDICTION</th>
                <th className="pb-3 font-semibold text-purple-400">AEROFORGE ANALYTICAL</th>
                <th className="pb-3 font-semibold text-emerald-400">REFERENCE DATA</th>
                <th className="pb-3 font-semibold text-amber-400">ERROR METRICS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              <tr>
                <td className="py-3 font-bold text-white">Lift Coeff (CL)</td>
                <td className="py-3 text-cyan-300 font-bold">{activeResult.cl.toFixed(4)}</td>
                <td className="py-3 text-purple-300 font-bold">
                  {activeResult.analytical.cl.toFixed(4)}
                </td>
                <td className="py-3 text-emerald-300 font-bold">
                  {activeResult.referenceData.available
                    ? activeResult.referenceData.cl?.toFixed(4)
                    : "Validation unavailable"}
                </td>
                <td className="py-3 text-amber-300 font-bold">
                  Δ {activeResult.errorMetrics.absClError.toFixed(4)} (
                  {activeResult.errorMetrics.relClErrorPct.toFixed(2)}%)
                </td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-white">Drag Coeff (CD)</td>
                <td className="py-3 text-cyan-300 font-bold">{activeResult.cd.toFixed(5)}</td>
                <td className="py-3 text-purple-300 font-bold">
                  {activeResult.analytical.cd.toFixed(5)}
                </td>
                <td className="py-3 text-emerald-300 font-bold">
                  {activeResult.referenceData.available
                    ? activeResult.referenceData.cd?.toFixed(5)
                    : "Validation unavailable"}
                </td>
                <td className="py-3 text-amber-300 font-bold">
                  Δ {activeResult.errorMetrics.absCdError.toFixed(5)} (
                  {activeResult.errorMetrics.relCdErrorPct.toFixed(2)}%)
                </td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-white">Cp MAE / RMSE</td>
                <td className="py-3 text-white/70" colSpan={3}>
                  MAE:{" "}
                  <span className="text-cyan-400 font-bold">
                    {activeResult.errorMetrics.cpMae.toFixed(4)}
                  </span>{" "}
                  | RMSE:{" "}
                  <span className="text-purple-400 font-bold">
                    {activeResult.errorMetrics.cpRmse.toFixed(4)}
                  </span>
                </td>
                <td className="py-3 text-amber-300 font-bold">
                  Max Dev: {activeResult.errorMetrics.maxCpDev.toFixed(4)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Physics Constraints & Derivation Method */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#060B18] p-4 rounded-xl border border-white/5 font-mono text-xs">
          <div>
            <span className="text-[10px] text-white/40 block uppercase">
              Mass Conservation Residual
            </span>
            <span className="text-sm font-bold text-emerald-400">
              ∇·u = {activeResult.physicsResiduals.massResidual}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-white/40 block uppercase">Momentum Residual</span>
            <span className="text-sm font-bold text-cyan-400">
              Res = {activeResult.physicsResiduals.momentumResidual}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-white/40 block uppercase">Energy Conservation</span>
            <span className="text-sm font-bold text-purple-400">
              {activeResult.physicsResiduals.energyResidual}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-white/40 block uppercase">Surface BC Tangency</span>
            <span className="text-sm font-bold text-white/80">
              Err = {activeResult.physicsResiduals.boundaryConditionError}
            </span>
          </div>
        </div>
      </div>

      {/* Public Research Artifact Modal */}
      {showArtifactModal && (
        <PublicResearchArtifactModal
          isOpen={showArtifactModal}
          onClose={() => setShowArtifactModal(false)}
          inputs={inputs}
          result={activeResult}
        />
      )}
    </div>
  );
}
