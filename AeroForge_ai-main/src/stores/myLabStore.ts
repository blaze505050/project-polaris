/**
 * MY LAB PERSISTENCE STORE
 * Zustand store for saving and managing user experiments
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ExperimentData {
  id: string;
  name: string;
  type: 'orbital' | 'gravity' | 'transit' | 'stellar';
  timestamp: number;
  data: Record<string, any>;
  results?: Record<string, any>;
  notes?: string;
}

export interface MyLabState {
  experiments: ExperimentData[];
  
  // Actions
  addExperiment: (experiment: Omit<ExperimentData, 'id' | 'timestamp'>) => string;
  updateExperiment: (id: string, updates: Partial<ExperimentData>) => void;
  deleteExperiment: (id: string) => void;
  getExperiment: (id: string) => ExperimentData | undefined;
  getExperimentsByType: (type: ExperimentData['type']) => ExperimentData[];
  clearAll: () => void;
}

export const useMyLabStore = create<MyLabState>()(
  persist(
    (set, get) => ({
      experiments: [],
      
      addExperiment: (experiment) => {
        const id = crypto.randomUUID();
        const newExperiment: ExperimentData = {
          ...experiment,
          id,
          timestamp: Date.now(),
        };
        
        set((state) => ({
          experiments: [...state.experiments, newExperiment],
        }));
        
        return id;
      },
      
      updateExperiment: (id, updates) => {
        set((state) => ({
          experiments: state.experiments.map((exp) =>
            exp.id === id ? { ...exp, ...updates } : exp
          ),
        }));
      },
      
      deleteExperiment: (id) => {
        set((state) => ({
          experiments: state.experiments.filter((exp) => exp.id !== id),
        }));
      },
      
      getExperiment: (id) => {
        return get().experiments.find((exp) => exp.id === id);
      },
      
      getExperimentsByType: (type) => {
        return get().experiments.filter((exp) => exp.type === type);
      },
      
      clearAll: () => {
        set({ experiments: [] });
      },
    }),
    {
      name: 'astrolab-my-lab',
      version: 1,
    }
  )
);
