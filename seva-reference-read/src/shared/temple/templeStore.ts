import { DigiorgSearchItem } from "@/src/shared/temple-search/types/digiorg.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const MAX_HISTORY = 10;

interface TempleStore {
  selected: DigiorgSearchItem | null;

  history: DigiorgSearchItem[];

  // UI trigger for opening Temple Search.
  openTempleSearchTrigger: number;

  selectTemple: (temple: DigiorgSearchItem) => void;

  openTempleSearch: () => void;

  clearTemple: () => void;

  clearHistory: () => void;
}

export const useTempleStore = create<TempleStore>()(
  persist(
    (set) => ({
      selected: null,

      history: [],

      openTempleSearchTrigger: 0,

      selectTemple: (temple) =>
        set((state) => {
          const withoutDupe = state.history.filter((t) => t.id !== temple.id);

          const history = [temple, ...withoutDupe].slice(0, MAX_HISTORY);

          return {
            selected: temple,
            history,
          };
        }),

      openTempleSearch: () =>
        set((state) => ({
          openTempleSearchTrigger: state.openTempleSearchTrigger + 1,
        })),

      clearTemple: () =>
        set({
          selected: null,
        }),

      clearHistory: () =>
        set({
          history: [],
        }),
    }),

    {
      name: "temple-store",

      storage: createJSONStorage(() => AsyncStorage),

      // Don't persist UI trigger.
      partialize: (state) => ({
        selected: state.selected,
        history: state.history,
      }),
    },
  ),
);
