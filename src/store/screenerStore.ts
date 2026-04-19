import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ScreenerResponse, Condition } from "@/api/screener";

interface ScreenerState {
  // Auth
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;

  // Sector selection
  selectedSector: string | null;
  setSelectedSector: (sector: string | null) => void;

  // Conditions
  conditions: Condition[];
  setConditions: (conditions: Condition[]) => void;
  probabilityThreshold: number;
  setProbabilityThreshold: (v: number) => void;

  // Screener results
  screenerResults: ScreenerResponse | null;
  setScreenerResults: (results: ScreenerResponse | null) => void;

  // Active tab
  activeTab: "screener" | "history";
  setActiveTab: (tab: "screener" | "history") => void;
}

export const useScreenerStore = create<ScreenerState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      logout: () => set({ token: null }),

      selectedSector: null,
      setSelectedSector: (sector) => set({ selectedSector: sector, screenerResults: null }),

      conditions: [],
      setConditions: (conditions) => set({ conditions }),

      probabilityThreshold: 0.7,
      setProbabilityThreshold: (v) => set({ probabilityThreshold: v }),

      screenerResults: null,
      setScreenerResults: (results) => set({ screenerResults: results }),

      activeTab: "screener",
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    { name: "vwap-screener-store", partialize: (s) => ({ token: s.token }) }
  )
);
