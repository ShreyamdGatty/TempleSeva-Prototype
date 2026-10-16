import { create } from "zustand";

type MySevasRefreshState = {
  refreshVersion: number;
  requestRefresh: () => void;
};

export const useMySevasRefreshStore = create<MySevasRefreshState>((set) => ({
  refreshVersion: 0,
  requestRefresh: () =>
    set((state) => ({
      refreshVersion: state.refreshVersion + 1,
    })),
}));
