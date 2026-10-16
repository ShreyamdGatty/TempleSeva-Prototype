import { create } from "zustand";

export type ProfilePreviousPath = "/" | "/sevas" | "/mysevas";

type NavigationState = {
  profilePreviousPath: ProfilePreviousPath;

  setProfilePreviousPath: (path: ProfilePreviousPath) => void;
};

export const useNavigationStore = create<NavigationState>((set) => ({
  profilePreviousPath: "/",

  setProfilePreviousPath: (path) =>
    set({
      profilePreviousPath: path,
    }),
}));
