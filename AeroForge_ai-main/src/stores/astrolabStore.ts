import { create } from 'zustand';

export type LabMode = 'explorer' | 'learning' | 'research' | 'investor-demo';

export interface ExperimentData {
  id: string;
  name: string;
  mode: LabMode;
  parameters: Record<string, any>;
  results: Record<string, any>;
  timestamp: Date;
  notes: string;
  status: 'running' | 'completed' | 'failed';
}

export interface AstroLabState {
  currentMode: LabMode;
  experiments: ExperimentData[];
  selectedExperiment: ExperimentData | null;
  isSimulationRunning: boolean;
  
  // Actions
  setMode: (mode: LabMode) => void;
  addExperiment: (experiment: ExperimentData) => void;
  updateExperiment: (id: string, updates: Partial<ExperimentData>) => void;
  selectExperiment: (id: string | null) => void;
  deleteExperiment: (id: string) => void;
  setSimulationRunning: (running: boolean) => void;
  clearExperiments: () => void;
}

export const useAstroLabStore = create<AstroLabState>((set) => ({
  currentMode: 'explorer',
  experiments: [],
  selectedExperiment: null,
  isSimulationRunning: false,

  setMode: (mode) => set({ currentMode: mode }),
  
  addExperiment: (experiment) =>
    set((state) => ({
      experiments: [...state.experiments, experiment],
      selectedExperiment: experiment,
    })),

  updateExperiment: (id, updates) =>
    set((state) => ({
      experiments: state.experiments.map((exp) =>
        exp.id === id ? { ...exp, ...updates } : exp
      ),
      selectedExperiment:
        state.selectedExperiment?.id === id
          ? { ...state.selectedExperiment, ...updates }
          : state.selectedExperiment,
    })),

  selectExperiment: (id) =>
    set((state) => ({
      selectedExperiment: id
        ? state.experiments.find((exp) => exp.id === id) || null
        : null,
    })),

  deleteExperiment: (id) =>
    set((state) => ({
      experiments: state.experiments.filter((exp) => exp.id !== id),
      selectedExperiment:
        state.selectedExperiment?.id === id ? null : state.selectedExperiment,
    })),

  setSimulationRunning: (running) => set({ isSimulationRunning: running }),

  clearExperiments: () =>
    set({
      experiments: [],
      selectedExperiment: null,
    }),
}));
