import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


import { AspNetPartyDevotee } from "../../profile/types/devotee.types";
import { FamilyProfile } from "../types/sankalpam.types";

export function mapDevoteeToFamilyProfile(
  devotee: AspNetPartyDevotee,
  
): FamilyProfile {
  return {
    id: devotee.id,
    aspNetPartyId: devotee.aspNetPartyId,
    fullName: devotee.name,
    mobileNo: devotee.mobileNo,
    email: devotee.email ?? null,
    nakshatra: devotee.nak,
    rashi: devotee.ras,
    gotra: devotee.got,
  };
}

type FamilyProfileState = {
  profiles: FamilyProfile[];

  setProfiles: (profiles: FamilyProfile[]) => void;

  addProfile: (profile: FamilyProfile) => void;

  updateProfile: (id: string, profile: Partial<FamilyProfile>) => void;

  removeProfile: (id: string) => void;

  clearProfiles: () => void;
};

export const useFamilyProfileStore = create<FamilyProfileState>()(
  persist(
    (set) => ({
      profiles: [],

      setProfiles: (profiles) => {
        set({ profiles });
      },

      addProfile: (profile) => {
        set((state) => ({
          profiles: [...state.profiles, profile],
        }));
      },

      updateProfile: (id, profile) => {
        set((state) => ({
          profiles: state.profiles.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...profile,
                }
              : item,
          ),
        }));
      },

      removeProfile: (id) => {
        set((state) => ({
          profiles: state.profiles.filter((item) => item.id !== id),
        }));
      },

      clearProfiles: () => {
        set({
          profiles: [],
        });
      },
    }),
    {
      name: "family-profile-storage",

      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
