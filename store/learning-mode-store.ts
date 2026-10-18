import { create } from 'zustand';
import { LearningMode, ModuleId, SimulationSpeed } from '@/types/simulation';

interface LearningState {
  mode: LearningMode;
  activeModule: ModuleId;
  simulationSpeed: SimulationSpeed;
  highlightedSymbol: string | null;

  setMode: (mode: LearningMode) => void;
  toggleMode: () => void;
  setActiveModule: (id: ModuleId) => void;
  setSimulationSpeed: (speed: SimulationSpeed) => void;
  setHighlightedSymbol: (symbol: string | null) => void;
}

export const useLearningStore = create<LearningState>((set) => ({
  mode: 'intuition',
  activeModule: 1,
  simulationSpeed: 1,
  highlightedSymbol: null,

  setMode: (mode) => set({ mode }),
  toggleMode: () =>
    set((state) => ({
      mode: state.mode === 'intuition' ? 'math' : 'intuition',
    })),
  setActiveModule: (id) => set({ activeModule: id, highlightedSymbol: null }),
  setSimulationSpeed: (simulationSpeed) => set({ simulationSpeed }),
  setHighlightedSymbol: (highlightedSymbol) => set({ highlightedSymbol }),
}));
