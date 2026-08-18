import { create } from 'zustand';

export type LabType = 
  | 'aerodynamics' 
  | 'structures' 
  | 'propulsion' 
  | 'thermal' 
  | 'materials' 
  | 'orbital' 
  | 'mission' 
  | 'manufacturing' 
  | 'systems' 
  | 'controls' 
  | 'digital-twin' 
  | 'research';

export interface Lab {
  id: LabType;
  name: string;
  description: string;
  icon: string;
  modules: string[];
  isActive: boolean;
}

interface LabStore {
  activeLab: LabType | null;
  labs: Lab[];
  
  setActiveLab: (lab: LabType | null) => void;
  setLabs: (labs: Lab[]) => void;
}

export const useLabStore = create<LabStore>((set) => ({
  activeLab: null,
  labs: [],
  
  setActiveLab: (lab) => set({ activeLab: lab }),
  setLabs: (labs) => set({ labs }),
}));
