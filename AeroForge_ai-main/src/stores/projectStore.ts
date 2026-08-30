import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ProjectRequirement {
  id: string;
  code: string;
  category: string;
  specification: string;
  targetValue: string;
  currentValue: string;
  status: "VERIFIED" | "IN_PROGRESS" | "FAILED";
}

export interface ProjectSimulation {
  id: string;
  name: string;
  domain: string;
  solver: string;
  status: "COMPLETED" | "RUNNING" | "FAILED";
  date: string;
  metrics: Record<string, string | number>;
}

export interface ProjectDataset {
  id: string;
  name: string;
  type: "airfoil" | "mesh" | "telemetry" | "cad";
  size: string;
  uploadDate: string;
}

export interface ProjectNotebookEntry {
  id: string;
  title: string;
  author: string;
  lastUpdated: string;
  content: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  status: "active" | "archived" | "completed";
  createdDate: string | Date;
  updatedDate: string | Date;
  owner?: string;
  tags?: string[];
  requirements?: ProjectRequirement[];
  simulations?: ProjectSimulation[];
  datasets?: ProjectDataset[];
  notebooks?: ProjectNotebookEntry[];
}

export interface ProjectWorkspace {
  projectId: string;
  activeTab:
    | "overview"
    | "requirements"
    | "comparison"
    | "provenance"
    | "notebook"
    | "simulations"
    | "datasets"
    | "results"
    | "validation";
  notebookContent?: string;
  selectedDataset?: string;
  selectedSimulation?: string;
}

interface ProjectStore {
  currentProject: Project | null;
  workspace: ProjectWorkspace | null;
  projects: Project[];

  setCurrentProject: (project: Project | null) => void;
  setWorkspace: (workspace: ProjectWorkspace | null) => void;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  updateWorkspaceTab: (tab: ProjectWorkspace["activeTab"]) => void;

  // Project Entity Operations
  addRequirement: (projectId: string, requirement: Omit<ProjectRequirement, "id">) => void;
  updateRequirement: (
    projectId: string,
    reqId: string,
    updates: Partial<ProjectRequirement>,
  ) => void;
  addSimulation: (projectId: string, sim: Omit<ProjectSimulation, "id">) => void;
  addNotebookEntry: (projectId: string, entry: Omit<ProjectNotebookEntry, "id">) => void;
}

export const INITIAL_DEMO_PROJECTS: Project[] = [
  {
    _id: "template-naca0012",
    name: "NACA 0012 Airfoil Investigation",
    description:
      "Thin airfoil theory, lift curve slope, pressure distribution, and subsonic compressible polars.",
    status: "active",
    createdDate: new Date("2026-08-01").toISOString(),
    updatedDate: new Date("2026-08-12").toISOString(),
    owner: "Beta Template",
    tags: ["aerodynamics", "airfoil", "subsonic", "naca0012"],
    requirements: [
      {
        id: "req_1",
        code: "REQ-AERO-01",
        category: "Aerodynamics",
        specification: "Cruise Lift-to-Drag Ratio (L/D)",
        targetValue: "> 14.5",
        currentValue: "15.2 (Verified)",
        status: "VERIFIED",
      },
      {
        id: "req_2",
        code: "REQ-AERO-02",
        category: "Aerodynamics",
        specification: "Maximum Lift Coefficient CL_max",
        targetValue: "> 1.20",
        currentValue: "1.34 (Verified)",
        status: "VERIFIED",
      },
    ],
    simulations: [
      {
        id: "sim_1",
        name: "NACA 0012 Subsonic AoA Sweep",
        domain: "Aerodynamics",
        solver: "Thin Airfoil + PG Correction",
        status: "COMPLETED",
        date: "2026-08-10",
        metrics: { CL: 0.44, CD: 0.008, "L/D": 55.0 },
      },
    ],
    notebooks: [
      {
        id: "nb_1",
        title: "Thin Airfoil Polar Analysis Notes",
        author: "Aerospace Researcher",
        lastUpdated: "2026-08-11",
        content: "Evaluated NACA 0012 section properties under subcritical flow.",
      },
    ],
  },
  {
    _id: "template-uav-wing",
    name: "UAV Wing Performance & Morphing Study",
    description:
      "Multi-objective Pareto optimization for morphing UAV wing camber & thickness distribution.",
    status: "active",
    createdDate: new Date("2026-08-02").toISOString(),
    updatedDate: new Date("2026-08-14").toISOString(),
    owner: "Beta Template",
    tags: ["optimization", "uav", "wing", "pareto"],
    requirements: [
      {
        id: "req_uav_1",
        code: "REQ-UAV-01",
        category: "Optimization",
        specification: "Morphing L/D Target",
        targetValue: "> 18.0",
        currentValue: "17.8 (In Progress)",
        status: "IN_PROGRESS",
      },
    ],
  },
  {
    _id: "template-cantilever-beam",
    name: "Cantilever Beam Structural Bending Study",
    description:
      "Euler-Bernoulli beam theory bending stress, shear force diagrams, and tip deflection.",
    status: "active",
    createdDate: new Date("2026-08-05").toISOString(),
    updatedDate: new Date("2026-08-15").toISOString(),
    owner: "Beta Template",
    tags: ["structures", "beam", "bending", "mechlab"],
    requirements: [
      {
        id: "req_bm_1",
        code: "REQ-STRUCT-01",
        category: "Structures",
        specification: "Tip Deflection Limit",
        targetValue: "< 15.0 mm",
        currentValue: "11.8 mm (Verified)",
        status: "VERIFIED",
      },
    ],
  },
];

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      currentProject: INITIAL_DEMO_PROJECTS[0],
      workspace: {
        projectId: INITIAL_DEMO_PROJECTS[0]._id,
        activeTab: "overview",
      },
      projects: INITIAL_DEMO_PROJECTS,

      setCurrentProject: (project) => set({ currentProject: project }),
      setWorkspace: (workspace) => set({ workspace }),
      setProjects: (projects) => set({ projects }),

      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, project],
          currentProject: project,
          workspace: { projectId: project._id, activeTab: "overview" },
        })),

      updateProject: (id, updates) =>
        set((state) => {
          const updatedProjects = state.projects.map((p) =>
            p._id === id ? { ...p, ...updates, updatedDate: new Date().toISOString() } : p,
          );
          const updatedCurrent =
            state.currentProject?._id === id
              ? { ...state.currentProject, ...updates, updatedDate: new Date().toISOString() }
              : state.currentProject;
          return { projects: updatedProjects, currentProject: updatedCurrent };
        }),

      deleteProject: (id) =>
        set((state) => {
          const filtered = state.projects.filter((p) => p._id !== id);
          const nextCurrent =
            state.currentProject?._id === id ? filtered[0] || null : state.currentProject;
          return {
            projects: filtered,
            currentProject: nextCurrent,
            workspace: nextCurrent ? { projectId: nextCurrent._id, activeTab: "overview" } : null,
          };
        }),

      updateWorkspaceTab: (tab) =>
        set((state) => ({
          workspace: state.workspace ? { ...state.workspace, activeTab: tab } : null,
        })),

      addRequirement: (projectId, req) =>
        set((state) => {
          const newReq: ProjectRequirement = {
            ...req,
            id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          };
          const updatedProjects = state.projects.map((p) => {
            if (p._id !== projectId) return p;
            return {
              ...p,
              requirements: [...(p.requirements || []), newReq],
              updatedDate: new Date().toISOString(),
            };
          });
          const updatedCurrent =
            state.currentProject?._id === projectId
              ? {
                  ...state.currentProject,
                  requirements: [...(state.currentProject.requirements || []), newReq],
                  updatedDate: new Date().toISOString(),
                }
              : state.currentProject;

          return { projects: updatedProjects, currentProject: updatedCurrent };
        }),

      updateRequirement: (projectId, reqId, updates) =>
        set((state) => {
          const updatedProjects = state.projects.map((p) => {
            if (p._id !== projectId) return p;
            return {
              ...p,
              requirements: (p.requirements || []).map((r) =>
                r.id === reqId ? { ...r, ...updates } : r,
              ),
              updatedDate: new Date().toISOString(),
            };
          });
          const updatedCurrent =
            state.currentProject?._id === projectId
              ? {
                  ...state.currentProject,
                  requirements: (state.currentProject.requirements || []).map((r) =>
                    r.id === reqId ? { ...r, ...updates } : r,
                  ),
                  updatedDate: new Date().toISOString(),
                }
              : state.currentProject;

          return { projects: updatedProjects, currentProject: updatedCurrent };
        }),

      addSimulation: (projectId, sim) =>
        set((state) => {
          const newSim: ProjectSimulation = {
            ...sim,
            id: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          };
          const updatedProjects = state.projects.map((p) => {
            if (p._id !== projectId) return p;
            return {
              ...p,
              simulations: [...(p.simulations || []), newSim],
              updatedDate: new Date().toISOString(),
            };
          });
          const updatedCurrent =
            state.currentProject?._id === projectId
              ? {
                  ...state.currentProject,
                  simulations: [...(state.currentProject.simulations || []), newSim],
                  updatedDate: new Date().toISOString(),
                }
              : state.currentProject;

          return { projects: updatedProjects, currentProject: updatedCurrent };
        }),

      addNotebookEntry: (projectId, entry) =>
        set((state) => {
          const newEntry: ProjectNotebookEntry = {
            ...entry,
            id: `nb_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          };
          const updatedProjects = state.projects.map((p) => {
            if (p._id !== projectId) return p;
            return {
              ...p,
              notebooks: [...(p.notebooks || []), newEntry],
              updatedDate: new Date().toISOString(),
            };
          });
          const updatedCurrent =
            state.currentProject?._id === projectId
              ? {
                  ...state.currentProject,
                  notebooks: [...(state.currentProject.notebooks || []), newEntry],
                  updatedDate: new Date().toISOString(),
                }
              : state.currentProject;

          return { projects: updatedProjects, currentProject: updatedCurrent };
        }),
    }),
    {
      name: "aeroforge-projects-v1",
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (
          !persistedState ||
          !Array.isArray(persistedState.projects) ||
          persistedState.projects.length === 0
        ) {
          return {
            currentProject: INITIAL_DEMO_PROJECTS[0],
            workspace: { projectId: INITIAL_DEMO_PROJECTS[0]._id, activeTab: "overview" },
            projects: INITIAL_DEMO_PROJECTS,
          };
        }
        return persistedState;
      },
    },
  ),
);
