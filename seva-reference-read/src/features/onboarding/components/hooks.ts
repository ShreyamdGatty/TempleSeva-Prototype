// src/framework/onboarding/hooks.ts

import { useContext } from "react";
import { OnboardingContext } from "./OnboardingContext";
import { OnboardingContextType } from "./types";

export function useOnboarding(): OnboardingContextType {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider.");    
  }

  return context;
}
