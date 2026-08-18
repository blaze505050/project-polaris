/**
 * ASTROLAB EXPERIMENT PERSISTENCE STORE
 * Manages saved experiments using localStorage + Zustand
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SavedExperiment {
  id: string;
  name: string;
  type: 'orbital' | 'gravity' | 'transit' | 'stellar' | 'leo' | 'exoplanet' | 'star-classification';
  parameters: Record<string, any>;
  results: Record<string, any>;
  timestamp: number;
  notes: string;
  tags: string[];
}

interface ExperimentStore {
  experiments: SavedExperiment[];
  
  // Actions
  saveExperiment: (experiment: Omit<SavedExperiment, 'id' | 'timestamp'>) => SavedExperiment;
  loadExperiment: (id: string) => SavedExperiment | null;
  deleteExperiment: (id: string) => void;
  getAllExperiments: () => SavedExperiment[];
  updateExperiment: (id: string, updates: Partial<SavedExperiment>) => void;
  exportExperiments: (format: 'json' | 'csv') => string;
  importExperiments: (data: string, format: 'json' | 'csv') => void;
  clearAllExperiments: () => void;
}

export const useExperimentStore = create<ExperimentStore>()(
  persist(
    (set, get) => ({
      experiments: [],

      saveExperiment: (experiment) => {
        const newExperiment: SavedExperiment = {
          ...experiment,
          id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
        };

        set((state) => ({
          experiments: [...state.experiments, newExperiment],
        }));

        return newExperiment;
      },

      loadExperiment: (id) => {
        const state = get();
        return state.experiments.find((exp) => exp.id === id) || null;
      },

      deleteExperiment: (id) => {
        set((state) => ({
          experiments: state.experiments.filter((exp) => exp.id !== id),
        }));
      },

      getAllExperiments: () => {
        return get().experiments;
      },

      updateExperiment: (id, updates) => {
        set((state) => ({
          experiments: state.experiments.map((exp) =>
            exp.id === id ? { ...exp, ...updates } : exp
          ),
        }));
      },

      exportExperiments: (format) => {
        const experiments = get().experiments;

        if (format === 'json') {
          return JSON.stringify(experiments, null, 2);
        }

        if (format === 'csv') {
          const headers = ['ID', 'Name', 'Type', 'Date', 'Notes', 'Parameters', 'Results'];
          const rows = experiments.map((exp) => [
            exp.id,
            exp.name,
            exp.type,
            new Date(exp.timestamp).toISOString(),
            exp.notes,
            JSON.stringify(exp.parameters),
            JSON.stringify(exp.results),
          ]);

          const csvContent = [
            headers.join(','),
            ...rows.map((row) =>
              row
                .map((cell) => {
                  const str = String(cell);
                  return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
                })
                .join(',')
            ),
          ].join('\n');

          return csvContent;
        }

        return '';
      },

      importExperiments: (data, format) => {
        try {
          let parsed: SavedExperiment[] = [];

          if (format === 'json') {
            parsed = JSON.parse(data);
          } else if (format === 'csv') {
            // Simple CSV parser
            const lines = data.split('\n');
            const headers = lines[0].split(',');
            parsed = lines.slice(1).map((line) => {
              const values = line.split(',');
              return {
                id: values[0],
                name: values[1],
                type: values[2] as any,
                timestamp: new Date(values[3]).getTime(),
                notes: values[4],
                parameters: JSON.parse(values[5]),
                results: JSON.parse(values[6]),
                tags: [],
              };
            });
          }

          set((state) => ({
            experiments: [...state.experiments, ...parsed],
          }));
        } catch (error) {
          console.error('Failed to import experiments:', error);
        }
      },

      clearAllExperiments: () => {
        set({ experiments: [] });
      },
    }),
    {
      name: 'astrolab-experiments',
      version: 1,
    }
  )
);
