// src/framework/onboarding/types.ts

import { PropsWithChildren } from "react";

export interface OnboardingContextType {
  /**
   * True if the user has completed onboarding.
   */
  isCompleted: boolean;

  /**
   * True while checking AsyncStorage.
   */
  isLoading: boolean;

  /**
   * Marks onboarding as completed.
   */
  completeOnboarding: () => Promise<void>;

  /**
   * Resets onboarding (useful for testing).
   */
  resetOnboarding: () => Promise<void>;
}

export interface OnboardingProviderProps extends PropsWithChildren {}
