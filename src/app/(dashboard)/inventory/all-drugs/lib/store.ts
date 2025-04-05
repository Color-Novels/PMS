// lib/store.ts
import { create } from 'zustand';
  
interface FilterState {
  drugModel: string[];
  drugBrand: string[];
  supplier: string[];
  batchStatus: string[];
  setFilters: (category: string, items: string[]) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  drugModel: [],
  drugBrand: [],
  supplier: [],
  batchStatus: [],
  setFilters: (category, items) => set({ [category]: items }),
  resetFilters: () => set({ 
    drugModel: [], 
    drugBrand: [], 
    supplier: [], 
    batchStatus: [] 
  })
}));