import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Folder,
  Calendar,
  Eye,
  X,
  Wind,
  Rocket,
  Layers,
  Thermometer,
  Cpu,
  Wrench,
  Orbit,
  Gauge,
  Zap,
  FlaskConical,
  Download,
} from "lucide-react";
import { useProjectStore, Project } from "@/stores/projectStore";
import { useToastStore } from "@/stores/toastStore";
import { projectArchiveService } from "@/services/projectArchiveService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CommandCenterSidebar from "@/components/CommandCenterSidebar";

// ─── 5 Canonical Beta Project Templates ───────────────────────────────────────
export interface BetaProjectTemplate {
  id: string;
  name: string;
  domain: string;
  description: string;
  objective: string;
  recommendedTools: string[];
  initialParameters: Record<string, any>;
  tags: string[];
}

export const CANONICAL_BETA_TEMPLATES: BetaProjectTemplate[] = [
  {
    id: "template-naca0012",
    name: "NACA 0012 Airfoil Investigation",
    domain: "Aerodynamics",
    description:
      "Thin airfoil theory, lift curve slope, pressure distribution, and subsonic compressible polars.",
    objective:
      "Evaluate NACA 0012 lift-to-drag ratio across angles of attack from -4° to +14° at Mach 0.20.",
    recommendedTools: [
      "NACA Airfoil Generator",
      "Subsonic Thin-Airfoil Solver",
      "Prandtl-Glauert Compressibility",
    ],
    initialParameters: { naca: "0012", chord: 1.0, altitude: 0, velocity: 68 },
    tags: ["aerodynamics", "airfoil", "subsonic", "naca0012"],
  },
  {
    id: "template-uav-wing",
    name: "UAV Wing Performance & Morphing Study",
    domain: "Optimization",
    description:
      "Multi-objective Pareto optimization for morphing UAV wing camber & thickness distribution.",
    objective:
      "Maximize L/D ratio subject to structural weight constraints and Mach 0.82 cruise velocity.",
    recommendedTools: ["Flagship Morphing UAV Workflow", "Pareto Optimizer", "AeroLab Suite"],
    initialParameters: { targetLd: 18.0, cruisingMach: 0.82, maxWeightKg: 450 },
    tags: ["optimization", "uav", "wing", "pareto"],
  },
  {
    id: "template-rocket-nozzle",
    name: "Preliminary Rocket Nozzle Sizing",
    domain: "Propulsion",
    description:
      "Combustion chamber thermochemistry, De Laval nozzle expansion ratios, and specific impulse (Isp).",
    objective:
      "Determine optimal nozzle expansion ratio (Ae/At) for LOX/RP-1 sea level to vacuum ascent.",
    recommendedTools: [
      "Rocket Thrust Calculator",
      "Nozzle Expansion Solver",
      "Thermodynamic Suite",
    ],
    initialParameters: { pc: 7.0, pe: 0.1, gamma: 1.22, chamberTemp: 3400 },
    tags: ["propulsion", "rocket", "nozzle", "isp"],
  },
  {
    id: "template-cantilever-beam",
    name: "Cantilever Beam Structural Bending Study",
    domain: "Structures",
    description:
      "Euler-Bernoulli beam theory bending stress, shear force diagrams, and tip deflection.",
    objective:
      "Calculate maximum bending stress σ_max and tip deflection δ for 2.0m aluminum cantilever beam.",
    recommendedTools: ["Beam Bending Solver", "MechLab Structural Suite", "Material Database"],
    initialParameters: { loadN: 5000, lengthM: 2.0, widthM: 0.05, heightM: 0.1, modE: 70e9 },
    tags: ["structures", "beam", "bending", "mechlab"],
  },
  {
    id: "template-keplerian-orbit",
    name: "Keplerian Orbit & Mission Analysis",
    domain: "Astrospace",
    description:
      "Two-body orbital mechanics, Kepler elements, specific orbital energy, and ground track.",
    objective:
      "Analyze ISS LEO orbit (400km altitude), determine orbital period, velocity, and delta-v budget.",
    recommendedTools: ["Orbital Mechanics Simulator", "Porkchop Plot Generator", "AstroLab Suite"],
    initialParameters: { altKm: 400, incDeg: 51.6, centralBody: "Earth" },
    tags: ["astrolab", "orbital", "kepler", "space"],
  },
];

const DEMO_PROJECTS: Project[] = CANONICAL_BETA_TEMPLATES.map((t) => ({
  _id: t.id,
  name: t.name,
  description: t.description,
  status: "active",
  createdDate: new Date("2026-08-01"),
  updatedDate: new Date("2026-08-12"),
  owner: "Beta Template",
  tags: t.tags,
}));

// ─── Project Types ────────────────────────────────────────────────────────────
const PROJECT_TYPES = [
  { value: "aircraft", label: "Aircraft", icon: Wind },
  { value: "uav", label: "UAV", icon: Rocket },
  { value: "rocket", label: "Rocket / Launch Vehicle", icon: Rocket },
  { value: "spacecraft", label: "Spacecraft / Satellite", icon: Orbit },
  { value: "propulsion", label: "Propulsion System", icon: Zap },
  { value: "mechanical", label: "Mechanical System", icon: Wrench },
  { value: "thermal", label: "Thermal / Heat Transfer", icon: Thermometer },
  { value: "research", label: "Research / Analysis", icon: FlaskConical },
];

const PHYSICS_DOMAINS = [
  "Aerodynamics",
  "Structures",
  "Thermal",
  "Propulsion",
  "Materials",
  "Controls",
  "Orbital Mechanics",
  "Flight Dynamics",
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const { setCurrentProject, projects, setProjects, addProject } = useProjectStore();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "archived" | "completed">(
    "all",
  );
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  // New project form state
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectType, setNewProjectType] = useState("aircraft");
  const [newProjectObjective, setNewProjectObjective] = useState("");
  const [newProjectDomains, setNewProjectDomains] = useState<string[]>(["Aerodynamics"]);
  const [newProjectDescription, setNewProjectDescription] = useState("");

  useEffect(() => {
    // Seed demo projects on first load if no projects exist
    const timer = setTimeout(() => {
      if (projects.length === 0) {
        setProjects(DEMO_PROJECTS);
      }
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [projects.length, setProjects]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const toggleDomain = (domain: string) => {
    setNewProjectDomains((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain],
    );
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;

    const newProject: Project = {
      _id: crypto.randomUUID(),
      name: newProjectName,
      description:
        newProjectDescription ||
        `${
          PROJECT_TYPES.find((t) => t.value === newProjectType)?.label || ""
        } project — ${newProjectDomains.join(", ")}`,
      status: "active",
      createdDate: new Date(),
      updatedDate: new Date(),
      tags: [newProjectType, ...newProjectDomains.map((d) => d.toLowerCase())],
    };

    setProjects([...projects, newProject]);
    setCurrentProject(newProject);

    // Reset form
    setNewProjectName("");
    setNewProjectType("aircraft");
    setNewProjectObjective("");
    setNewProjectDomains(["Aerodynamics"]);
    setNewProjectDescription("");
    setShowNewProjectModal(false);
  };

  const handleSelectProject = (project: Project) => {
    setCurrentProject(project);
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "completed":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      case "archived":
        return "bg-white/5 text-white/40 border-white/10";
      default:
        return "bg-white/5 text-white/40 border-white/10";
    }
  };

  return (
    <div className="min-h-screen bg-[#050A16] flex flex-col font-mono text-white">
      <Header />
      <div className="flex flex-1">
        <CommandCenterSidebar />
        <main className="flex-1 lg:ml-64">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">Projects</h1>
                  <p className="text-xs text-white/50">
                    Manage engineering projects and workspaces
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 rounded-lg text-xs font-mono transition-colors cursor-pointer">
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Import (.aeroforge)</span>
                    <input
                      type="file"
                      accept=".aeroforge,.json"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            try {
                              const imported = projectArchiveService.parseArchive(
                                evt.target?.result as string,
                              );
                              addProject(imported);
                              useToastStore.getState().addToast({
                                type: "success",
                                title: "Project Imported Successfully",
                                description: `Restored ${imported.name}`,
                              });
                            } catch (err) {
                              useToastStore.getState().addToast({
                                type: "error",
                                title: "Import Failed",
                                description: "Invalid .aeroforge archive format.",
                              });
                            }
                          };
                          reader.readAsText(file);
                        }
                      }}
                    />
                  </label>
                  <button
                    onClick={() => setShowNewProjectModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg font-bold text-xs transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    New Project
                  </button>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#080E1C] border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>
                <div className="flex gap-2">
                  {(["all", "active", "completed", "archived"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                        filterStatus === status
                          ? "bg-cyan-500 text-black"
                          : "bg-[#080E1C] border border-white/10 text-white/60 hover:border-cyan-500/30 hover:text-white"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-[#080E1C] border border-white/10 rounded-lg p-6 animate-pulse"
                  >
                    <div className="h-4 bg-white/10 rounded w-3/4 mb-4" />
                    <div className="h-3 bg-white/5 rounded w-full mb-2" />
                    <div className="h-3 bg-white/5 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-12 bg-[#080E1C] border border-white/10 rounded-lg">
                <Folder className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 mb-2 text-sm">No projects found</p>
                <p className="text-white/40 mb-4 text-xs">
                  Create a new engineering project to get started
                </p>
                <button
                  onClick={() => setShowNewProjectModal(true)}
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg font-bold text-xs transition-colors"
                >
                  Create Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-[#080E1C] border border-white/10 rounded-lg p-5 hover:border-cyan-500/30 transition-all cursor-pointer"
                    onClick={() => handleSelectProject(project)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                          <Folder className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-white group-hover:text-cyan-400 transition-colors">
                            {project.name}
                          </h3>
                          <span
                            className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded border mt-1 ${statusBadge(
                              project.status,
                            )}`}
                          >
                            {project.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      {project.owner === "Demo" && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">
                          DEMO
                        </span>
                      )}
                    </div>

                    {project.description && (
                      <p className="text-white/50 text-xs mb-3 line-clamp-2 font-sans leading-relaxed">
                        {project.description}
                      </p>
                    )}

                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {project.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400/80 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-white/40 pt-3 border-t border-white/5">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(project.updatedDate).toLocaleDateString()}
                      </div>
                      <Link
                        to={`/projects/${project._id}`}
                        className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors font-bold"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Eye className="w-3 h-3" />
                        Open
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* New Project Modal — Engineering-Grade Form */}
      {showNewProjectModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowNewProjectModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#080E1C] border border-white/15 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Create Engineering Project</h2>
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Project Name */}
              <div>
                <label className="text-[10px] text-white/50 font-bold uppercase tracking-wider block mb-1.5">
                  Project Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Morphing Wing Research"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#050914] border border-white/15 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 transition-colors"
                  autoFocus
                />
              </div>

              {/* Project Type */}
              <div>
                <label className="text-[10px] text-white/50 font-bold uppercase tracking-wider block mb-1.5">
                  Project Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PROJECT_TYPES.map((type) => {
                    const Icon = type.icon;
                    const selected = newProjectType === type.value;
                    return (
                      <button
                        key={type.value}
                        onClick={() => setNewProjectType(type.value)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
                          selected
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                            : "bg-[#050914] text-white/60 border border-white/10 hover:border-white/20"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Physics Domains */}
              <div>
                <label className="text-[10px] text-white/50 font-bold uppercase tracking-wider block mb-1.5">
                  Physics Domains
                </label>
                <div className="flex flex-wrap gap-2">
                  {PHYSICS_DOMAINS.map((domain) => {
                    const selected = newProjectDomains.includes(domain);
                    return (
                      <button
                        key={domain}
                        onClick={() => toggleDomain(domain)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          selected
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                            : "bg-[#050914] text-white/50 border border-white/10 hover:border-white/20"
                        }`}
                      >
                        {domain}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Objective */}
              <div>
                <label className="text-[10px] text-white/50 font-bold uppercase tracking-wider block mb-1.5">
                  Objective (Optional)
                </label>
                <textarea
                  placeholder="What are you trying to achieve?"
                  value={newProjectObjective}
                  onChange={(e) => setNewProjectObjective(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-[#050914] border border-white/15 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 resize-none transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] text-white/50 font-bold uppercase tracking-wider block mb-1.5">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="Brief project description..."
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-[#050914] border border-white/15 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 resize-none transition-colors"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="flex-1 px-4 py-2.5 bg-[#050914] border border-white/15 text-white/60 rounded-lg hover:text-white hover:border-white/30 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!newProjectName.trim()}
                className="flex-1 px-4 py-2.5 bg-cyan-500 text-black rounded-lg font-bold text-xs hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Create Project
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
}
