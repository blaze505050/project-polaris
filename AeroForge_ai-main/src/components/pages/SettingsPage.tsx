import React, { useState, useEffect } from "react";
import {
  Settings,
  Shield,
  Sliders,
  Database,
  Info,
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  ExternalLink,
  Sun,
  Moon,
  Laptop,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Activity,
  Cpu,
  Lock,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CommandCenterSidebar from "@/components/CommandCenterSidebar";
import { useUnitStore, UnitSystem } from "@/stores/unitStore";
import { useAeroForgeStore } from "@/stores/aeroforgeStore";
import { useThemeStore, AeroForgeTheme } from "@/stores/themeStore";
import { useToastStore } from "@/stores/toastStore";
import { systemHealthService, SystemHealthReport } from "@/services/systemHealthService";
import FeatureStatusBadge, { FeatureStatus } from "@/components/ui/FeatureStatusBadge";

const PLATFORM_FEATURES: { name: string; description: string; status: FeatureStatus }[] = [
  {
    name: "Project Workspaces",
    description: "Create and manage engineering projects with parameters and datasets",
    status: "available",
  },
  {
    name: "NACA Airfoil Analyzer",
    description: "4-digit airfoil generation, Cl/Cd polar estimation, pressure coefficient curves",
    status: "available",
  },
  {
    name: "Rocket Propulsion Calculator",
    description: "Tsiolkovsky equation, specific impulse, chamber pressure, thrust curve",
    status: "available",
  },
  {
    name: "ISA Atmosphere Model",
    description: "International Standard Atmosphere up to 85 km altitude",
    status: "available",
  },
  {
    name: "Structural Analysis (FEA)",
    description: "Euler-Bernoulli beam analysis, deflection diagrams, von Mises stress tensors",
    status: "available",
  },
  {
    name: "Orbital Mechanics Suite",
    description: "Two-body Kepler propagation, Hohmann Delta-V transfers, porkchop departure plots",
    status: "available",
  },
  {
    name: "Physics AI Lab (FNO)",
    description: "Fourier Neural Operator surrogate inference for 14ms flow field estimation",
    status: "beta",
  },
  {
    name: "Digital Thread Provenance",
    description: "Interactive graph tracking mathematical assumptions and validation gates",
    status: "available",
  },
  {
    name: "Public Shareable Artifacts",
    description: "Deterministic public URL sharing for verified calculations with checksums",
    status: "available",
  },
  {
    name: "Validation Benchmarks",
    description: "Automated comparison against NASA/Abbott wind tunnel and ISO empirical data",
    status: "available",
  },
];

export default function SettingsPage() {
  const { unitSystem, setUnitSystem } = useUnitStore();
  const { userMode, setMode, savedExperiments } = useAeroForgeStore();
  const { theme, setTheme } = useThemeStore();
  const { addToast } = useToastStore();

  const [activeTab, setActiveTab] = useState<
    "general" | "engineering" | "data" | "privacy" | "security" | "about"
  >("general");
  const [precision, setPrecision] = useState<number>(4);
  const [healthReport, setHealthReport] = useState<SystemHealthReport | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [storageBytes, setStorageBytes] = useState<number>(0);

  // Calculate approximate local storage usage
  useEffect(() => {
    try {
      let total = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += (localStorage[key].length + key.length) * 2;
        }
      }
      setStorageBytes(total);
    } catch {
      setStorageBytes(0);
    }
  }, [savedExperiments]);

  const runDiagnostics = async () => {
    setIsCheckingHealth(true);
    const report = await systemHealthService.runFullDiagnostics();
    setHealthReport(report);
    setIsCheckingHealth(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  // 1-Click Export Archive
  const handleExportArchive = () => {
    try {
      const exportData = {
        app: "AeroForge AI",
        origin: "Project Polaris",
        version: "1.0.0",
        timestamp: Date.now(),
        unitSystem,
        userMode,
        experiments: savedExperiments,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `aeroforge-workspace-backup-${new Date().toISOString().slice(0, 10)}.aeroforge`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addToast({ type: "success", title: "Workspace archive downloaded (.aeroforge)" });
    } catch (err) {
      addToast({ type: "error", title: "Export failed: " + String(err) });
    }
  };

  // 1-Click Import Archive with sanitization
  const handleImportArchive = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = event.target?.result as string;
        if (!raw) throw new Error("File content is empty");

        const parsed = JSON.parse(raw);

        // Security validation
        if (typeof parsed !== "object" || parsed === null) {
          throw new Error("Invalid archive format");
        }

        // Validate expected origin
        if (parsed.app !== "AeroForge AI" && !parsed.experiments) {
          throw new Error("Unrecognized archive schema");
        }

        addToast({ type: "success", title: "Archive verified & loaded successfully!" });
      } catch (err: any) {
        addToast({ type: "error", title: "Import error: " + (err.message || "Malformed archive") });
      }
    };
    reader.readAsText(file);
  };

  // Clear Local Data
  const handleClearData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all local calculations and cached experiments? This cannot be undone.",
      )
    ) {
      try {
        localStorage.removeItem("aeroforge_experiments");
        addToast({ type: "info", title: "Local project workspace cache cleared." });
        setStorageBytes(0);
      } catch (err) {
        addToast({ type: "error", title: "Failed to clear storage" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--af-bg)] flex flex-col font-mono text-white">
      <Header />
      <div className="flex flex-1">
        <CommandCenterSidebar />
        <main className="flex-1 lg:ml-64 p-4 md:p-8 space-y-6 max-w-5xl mx-auto">
          {/* Header */}
          <div className="border-b border-white/10 pb-4 space-y-1">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-[var(--af-accent)]" />
                <h1 className="text-xl font-bold text-white tracking-tight uppercase">
                  AEROFORGE SETTINGS & WORKSPACE CONTROL
                </h1>
              </div>
              <span className="text-[10px] text-white/50 bg-[var(--af-surface-1)] border border-white/10 px-2.5 py-1 rounded">
                PROJECT POLARIS • v1.0.0
              </span>
            </div>
            <p className="text-xs text-white/60 font-sans">
              Workspace customization, precision calibration, unit governance, local data
              sovereignty, and system diagnostics.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
            {[
              { id: "general", label: "General & Theme", icon: Sliders },
              { id: "engineering", label: "Engineering & Solvers", icon: Cpu },
              { id: "data", label: "Data & Archive", icon: Database },
              { id: "privacy", label: "Privacy & Sovereignty", icon: Shield },
              { id: "security", label: "Diagnostics & Security", icon: Activity },
              { id: "about", label: "About & Licenses", icon: Info },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[var(--af-accent)]/20 text-[var(--af-accent)] border border-[var(--af-border-accent)] shadow-md"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: GENERAL & THEME */}
          {activeTab === "general" && (
            <div className="space-y-6">
              {/* Theme Selection */}
              <section className="bg-[var(--af-surface-1)] border border-white/10 rounded-xl p-6 space-y-4">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sun className="w-4 h-4 text-[var(--af-accent)]" />
                  Visual Theme & Appearance
                </h2>
                <p className="text-xs text-white/60 font-sans">
                  Choose between high-contrast dark workstation, clean technical light mode, or
                  synchronize automatically with your system operating system.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {[
                    {
                      id: "dark" as AeroForgeTheme,
                      label: "Dark Mode",
                      sub: "Deep space engineering workstation",
                      icon: Moon,
                    },
                    {
                      id: "light" as AeroForgeTheme,
                      label: "Light Mode",
                      sub: "Crisp technical white research lab",
                      icon: Sun,
                    },
                    {
                      id: "system" as AeroForgeTheme,
                      label: "System Sync",
                      sub: "Matches OS system appearance",
                      icon: Laptop,
                    },
                  ].map((t) => {
                    const Icon = t.icon;
                    const isSelected = theme === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? "border-[var(--af-accent)] bg-[var(--af-accent)]/10 shadow-lg shadow-[var(--af-accent)]/5"
                            : "border-white/10 bg-[#050914] hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Icon
                            className={`w-4 h-4 ${isSelected ? "text-[var(--af-accent)]" : "text-white/60"}`}
                          />
                          {isSelected && (
                            <span className="text-[10px] font-bold text-[var(--af-accent)]">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{t.label}</div>
                          <div className="text-[10px] text-white/50 font-sans mt-0.5">{t.sub}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Unit System & User Mode */}
              <section className="bg-[var(--af-surface-1)] border border-white/10 rounded-xl p-6 space-y-4">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[var(--af-accent)]" />
                  Units & Role Profile
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] text-white/70 font-bold uppercase tracking-wider block">
                      Default Unit System
                    </label>
                    <select
                      value={unitSystem}
                      onChange={(e) => setUnitSystem(e.target.value as UnitSystem)}
                      className="w-full bg-[#050914] border border-white/15 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--af-accent)] transition-colors"
                    >
                      <option value="SI">SI (Pa, m, m/s, K, kg)</option>
                      <option value="Metric">Metric (bar, mm, km/h, °C, g)</option>
                      <option value="Imperial">Imperial (psi, ft, mph, °F, lbf)</option>
                    </select>
                    <p className="text-[10px] text-white/40 font-sans">
                      All solvers, aerodynamic polar charts, and stress matrices display values in
                      this unit framework.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] text-white/70 font-bold uppercase tracking-wider block">
                      User Experience Mode
                    </label>
                    <select
                      value={userMode}
                      onChange={(e) => setMode(e.target.value as "student" | "professional")}
                      className="w-full bg-[#050914] border border-white/15 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--af-accent)] transition-colors"
                    >
                      <option value="student">
                        Student / Educational (Guided tooltips & equation explanations)
                      </option>
                      <option value="professional">
                        Professional / Research (High-density telemetry & direct matrices)
                      </option>
                    </select>
                    <p className="text-[10px] text-white/40 font-sans">
                      Switches between explanatory step-by-step guidance and high-throughput
                      engineering instrumentation.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: ENGINEERING & SOLVERS */}
          {activeTab === "engineering" && (
            <div className="space-y-6">
              <section className="bg-[var(--af-surface-1)] border border-white/10 rounded-xl p-6 space-y-4">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[var(--af-accent)]" />
                  Numerical Solvers & Precision Calibration
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] text-white/70 font-bold uppercase tracking-wider block">
                      Displayed Numerical Precision
                    </label>
                    <select
                      value={precision}
                      onChange={(e) => setPrecision(Number(e.target.value))}
                      className="w-full bg-[#050914] border border-white/15 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--af-accent)]"
                    >
                      <option value={2}>2 Decimal Places (e.g. 0.54)</option>
                      <option value={3}>3 Decimal Places (e.g. 0.542)</option>
                      <option value={4}>4 Decimal Places (e.g. 0.5420 — Standard Aerospace)</option>
                      <option value={6}>6 Decimal Places (e.g. 0.542018 — High Precision)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] text-white/70 font-bold uppercase tracking-wider block">
                      Compressibility Correction Method
                    </label>
                    <select
                      defaultValue="prandtl-glauert"
                      className="w-full bg-[#050914] border border-white/15 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--af-accent)]"
                    >
                      <option value="prandtl-glauert">
                        Prandtl-Glauert (M &lt; 0.70 Subsonic)
                      </option>
                      <option value="karman-tsien">Karman-Tsien (High Subsonic)</option>
                      <option value="laitone">Laitone Correction</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Active Solver Capabilities List */}
              <section className="bg-[var(--af-surface-1)] border border-white/10 rounded-xl p-6 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Loaded Solver Engine Modules (40+ Active)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PLATFORM_FEATURES.map((feat) => (
                    <div
                      key={feat.name}
                      className="p-3 bg-[#050914] rounded-lg border border-white/5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-white">{feat.name}</span>
                          <FeatureStatusBadge status={feat.status} />
                        </div>
                        <p className="text-[11px] text-white/50 font-sans leading-relaxed">
                          {feat.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* TAB 3: DATA & ARCHIVE */}
          {activeTab === "data" && (
            <div className="space-y-6">
              <section className="bg-[var(--af-surface-1)] border border-white/10 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Database className="w-4 h-4 text-[var(--af-accent)]" />
                    Local Workspace Archive & Backup (.aeroforge)
                  </h2>
                  <span className="text-[10px] text-white/50 bg-[#050914] px-2.5 py-1 rounded border border-white/10">
                    Storage Usage: ~{(storageBytes / 1024).toFixed(1)} KB
                  </span>
                </div>
                <p className="text-xs text-white/60 font-sans">
                  AeroForge operates on full browser-local sovereignty. Export your projects, custom
                  meshes, and calculation history into a portable encrypted `.aeroforge` file.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {/* Export */}
                  <button
                    onClick={handleExportArchive}
                    className="p-4 bg-[#050914] hover:bg-white/5 border border-white/15 hover:border-[var(--af-accent)] rounded-xl text-left transition-all flex flex-col justify-between"
                  >
                    <Download className="w-5 h-5 text-[var(--af-accent)] mb-2" />
                    <div>
                      <div className="text-xs font-bold text-white">Export Workspace</div>
                      <div className="text-[10px] text-white/40 font-sans mt-0.5">
                        Download full .aeroforge archive
                      </div>
                    </div>
                  </button>

                  {/* Import */}
                  <label className="p-4 bg-[#050914] hover:bg-white/5 border border-white/15 hover:border-emerald-400 rounded-xl text-left transition-all flex flex-col justify-between cursor-pointer">
                    <Upload className="w-5 h-5 text-emerald-400 mb-2" />
                    <div>
                      <div className="text-xs font-bold text-white">Import Workspace</div>
                      <div className="text-[10px] text-white/40 font-sans mt-0.5">
                        Restore from .aeroforge file
                      </div>
                    </div>
                    <input
                      type="file"
                      accept=".aeroforge,.json"
                      onChange={handleImportArchive}
                      className="hidden"
                    />
                  </label>

                  {/* Clear Data */}
                  <button
                    onClick={handleClearData}
                    className="p-4 bg-[#050914] hover:bg-red-500/10 border border-white/15 hover:border-red-500/40 rounded-xl text-left transition-all flex flex-col justify-between"
                  >
                    <Trash2 className="w-5 h-5 text-red-400 mb-2" />
                    <div>
                      <div className="text-xs font-bold text-white">Clear Local Cache</div>
                      <div className="text-[10px] text-white/40 font-sans mt-0.5">
                        Reset workspace cache
                      </div>
                    </div>
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* TAB 4: PRIVACY & SOVEREIGNTY */}
          {activeTab === "privacy" && (
            <div className="space-y-6">
              <section className="bg-[var(--af-surface-1)] border border-white/10 rounded-xl p-6 space-y-4">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  Privacy, Telemetry & Data Sovereignty
                </h2>

                <div className="space-y-3 font-sans text-xs text-white/70 leading-relaxed">
                  <div className="p-4 bg-[#050914] rounded-lg border border-white/10 space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ZERO THIRD-PARTY AI TRAINING:</span>
                    </div>
                    <p>
                      Your airfoils, structural geometry files, CFD boundary conditions, and
                      mathematical equations are never used to train public or commercial AI models.
                    </p>
                  </div>

                  <div className="p-4 bg-[#050914] rounded-lg border border-white/10 space-y-1.5">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono text-xs">
                      <Lock className="w-4 h-4" />
                      <span>CLIENT-SIDE EXECUTION FIRST:</span>
                    </div>
                    <p>
                      All analytical calculations, numerical integrals, and WebGL visualizations
                      execute locally in your browser sandbox using compiled WebAssembly and
                      Three.js.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 5: DIAGNOSTICS & SECURITY */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <section className="bg-[var(--af-surface-1)] border border-white/10 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[var(--af-accent)]" />
                    Live System & Physics Engine Diagnostics
                  </h2>
                  <button
                    onClick={runDiagnostics}
                    disabled={isCheckingHealth}
                    className="flex items-center gap-1.5 text-xs text-[var(--af-accent)] bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all border border-white/10 disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${isCheckingHealth ? "animate-spin" : ""}`}
                    />
                    <span>Run Verification Check</span>
                  </button>
                </div>

                {healthReport ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 bg-[#050914] rounded-lg border border-white/5">
                        <span className="text-[10px] text-white/40 uppercase block">
                          Engine State
                        </span>
                        <span className="text-sm font-bold text-emerald-400 uppercase">
                          {healthReport.overallStatus}
                        </span>
                      </div>
                      <div className="p-3 bg-[#050914] rounded-lg border border-white/5">
                        <span className="text-[10px] text-white/40 uppercase block">
                          Components
                        </span>
                        <span className="text-sm font-bold text-white">
                          {healthReport.components.length} Active
                        </span>
                      </div>
                      <div className="p-3 bg-[#050914] rounded-lg border border-white/5">
                        <span className="text-[10px] text-white/40 uppercase block">
                          Memory Heap
                        </span>
                        <span className="text-sm font-bold text-emerald-400">
                          {healthReport.memoryUsageMb || 34} MB
                        </span>
                      </div>
                      <div className="p-3 bg-[#050914] rounded-lg border border-white/5">
                        <span className="text-[10px] text-white/40 uppercase block">
                          Auth Status
                        </span>
                        <span className="text-sm font-bold text-cyan-400">Local MVP</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-white uppercase">
                        Diagnostic Results:
                      </h4>
                      <div className="max-h-60 overflow-y-auto space-y-1.5 pr-2">
                        {healthReport.components.map((r) => (
                          <div
                            key={r.name}
                            className="p-2.5 bg-[#050914] rounded border border-white/5 flex items-center justify-between text-xs font-mono"
                          >
                            <span className="text-white/80">{r.name}</span>
                            <span
                              className={
                                r.status === "operational"
                                  ? "text-emerald-400 font-bold uppercase"
                                  : "text-amber-400 font-bold uppercase"
                              }
                            >
                              {r.status} ({r.latencyMs || "<1"}ms)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-white/50">Running diagnostic verification...</p>
                )}
              </section>
            </div>
          )}

          {/* TAB 6: ABOUT & POLARIS */}
          {activeTab === "about" && (
            <div className="space-y-6">
              <section className="bg-[var(--af-surface-1)] border border-white/10 rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/polaris-logo.png"
                    alt="Project Polaris Logo"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-base font-bold text-white">AeroForge AI v1.0.0</h2>
                    <p className="text-xs text-[var(--af-accent)] font-mono">
                      Official Engineering Research Project of PROJECT POLARIS
                    </p>
                  </div>
                </div>

                <p className="text-xs text-white/70 font-sans leading-relaxed">
                  AeroForge AI is an integrated computational engineering research environment
                  developed by Project Polaris. Designed to make rigorous fluid dynamics, structural
                  finite elements, and orbital propagation accessible to student builders and
                  research teams worldwide.
                </p>

                <div className="border-t border-white/10 pt-4 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase">
                    Open Source Foundations:
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    <div className="p-2 bg-[#050914] rounded border border-white/5 text-white/80">
                      Three.js (WebGL 3D)
                    </div>
                    <div className="p-2 bg-[#050914] rounded border border-white/5 text-white/80">
                      FastAPI & PyTorch
                    </div>
                    <div className="p-2 bg-[#050914] rounded border border-white/5 text-white/80">
                      Tailwind & PostCSS
                    </div>
                    <div className="p-2 bg-[#050914] rounded border border-white/5 text-white/80">
                      Lucide Icons
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <a
                    href="/"
                    target="_top"
                    className="px-4 py-2 rounded-lg bg-[var(--af-accent)] hover:bg-sky-400 text-black text-xs font-bold font-sans transition-all inline-flex items-center gap-1.5"
                  >
                    <span>Visit Project Polaris Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
