/**
 * AEROFORGE UNIFIED ZUSTAND STORE
 * Central state management for the entire platform.
 * Manages: User mode (Student/Professional), active pillar,
 * saved experiments with localStorage persistence.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Types ───────────────────────────────────────────────────────────────────

export type UserMode = 'student' | 'professional';
export type Pillar = 'astrolab' | 'aerolab' | 'mechlab';

export interface SavedExperiment {
  id: string;
  name: string;
  pillar: Pillar;
  module: string;
  parameters: Record<string, number | string | boolean>;
  results: Record<string, number | string>;
  timestamp: number; // Unix ms
  userMode: UserMode;
  notes: string;
}

export interface SimulationSettings {
  timeStep: number;      // seconds
  trailLength: number;   // number of points
  showGrid: boolean;
  showLabels: boolean;
  animationSpeed: number; // multiplier
}

// ─── Store Interface ─────────────────────────────────────────────────────────

interface AeroForgeState {
  // Global Mode
  userMode: UserMode;
  activePillar: Pillar;

  // Simulation
  simulationSettings: SimulationSettings;

  // Experiments
  savedExperiments: SavedExperiment[];

  // Actions — Mode
  toggleMode: () => void;
  setMode: (mode: UserMode) => void;
  setActivePillar: (pillar: Pillar) => void;

  // Actions — Simulation
  updateSimulationSettings: (settings: Partial<SimulationSettings>) => void;

  // Actions — Experiments
  saveExperiment: (experiment: Omit<SavedExperiment, 'id' | 'timestamp'>) => void;
  deleteExperiment: (id: string) => void;
  updateExperimentNotes: (id: string, notes: string) => void;
  clearAllExperiments: () => void;
}

// ─── Default Values ──────────────────────────────────────────────────────────

const DEFAULT_SIMULATION_SETTINGS: SimulationSettings = {
  timeStep: 0.01,
  trailLength: 200,
  showGrid: true,
  showLabels: true,
  animationSpeed: 1,
};

// ─── Store Creation ──────────────────────────────────────────────────────────

export const useAeroForgeStore = create<AeroForgeState>()(
  persist(
    (set) => ({
      // Initial state
      userMode: 'student',
      activePillar: 'astrolab',
      simulationSettings: DEFAULT_SIMULATION_SETTINGS,
      savedExperiments: [],

      // Mode actions
      toggleMode: () =>
        set((state) => ({
          userMode: state.userMode === 'student' ? 'professional' : 'student',
        })),

      setMode: (mode) => set({ userMode: mode }),

      setActivePillar: (pillar) => set({ activePillar: pillar }),

      // Simulation settings
      updateSimulationSettings: (settings) =>
        set((state) => ({
          simulationSettings: { ...state.simulationSettings, ...settings },
        })),

      // Experiment CRUD
      saveExperiment: (experiment) =>
        set((state) => ({
          savedExperiments: [
            ...state.savedExperiments,
            {
              ...experiment,
              id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              timestamp: Date.now(),
            },
          ],
        })),

      deleteExperiment: (id) =>
        set((state) => ({
          savedExperiments: state.savedExperiments.filter((e) => e.id !== id),
        })),

      updateExperimentNotes: (id, notes) =>
        set((state) => ({
          savedExperiments: state.savedExperiments.map((e) =>
            e.id === id ? { ...e, notes } : e
          ),
        })),

      clearAllExperiments: () => set({ savedExperiments: [] }),
    }),
    {
      name: 'aeroforge-state', // localStorage key
      partialize: (state) => ({
        userMode: state.userMode,
        activePillar: state.activePillar,
        simulationSettings: state.simulationSettings,
        savedExperiments: state.savedExperiments,
      }),
    }
  )
);

// ─── Selector Hooks ──────────────────────────────────────────────────────────

export const useUserMode = () => useAeroForgeStore((s) => s.userMode);
export const useIsStudentMode = () => useAeroForgeStore((s) => s.userMode === 'student');
export const useIsProfessionalMode = () => useAeroForgeStore((s) => s.userMode === 'professional');
export const useActivePillar = () => useAeroForgeStore((s) => s.activePillar);
export const useSimulationSettings = () => useAeroForgeStore((s) => s.simulationSettings);
export const useSavedExperiments = () => useAeroForgeStore((s) => s.savedExperiments);
