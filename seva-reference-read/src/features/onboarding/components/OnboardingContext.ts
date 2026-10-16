// src/framework/onboarding/OnboardingContext.ts

import { createContext } from "react";
import { OnboardingContextType } from "./types";

export const OnboardingContext = createContext<
  OnboardingContextType | undefined
>(undefined);
