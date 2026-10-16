import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import OnboardingScreen from "@/src/features/onboarding/screens/OnBoarding";

import { OnboardingContext } from "./OnboardingContext";
import {
  getOnboardingStatus,
  resetOnboarding,
  setOnboardingCompleted,
} from "./storage";

export function OnboardingProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  /**
   * Bootstrap onboarding state from storage.
   */
  const bootstrap = useCallback(async () => {
    try {
      const completed = await getOnboardingStatus();
      setIsCompleted(completed);
    } catch (error) {
      console.error("[OnboardingProvider] Bootstrap failed:", error);
      setIsCompleted(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  /**
   * Called when the user finishes onboarding.
   */
  const completeOnboarding = useCallback(async () => {
    try {
      await setOnboardingCompleted();
      setIsCompleted(true);
    } catch (error) {
      console.error(
        "[OnboardingProvider] Failed to complete onboarding:",
        error,
      );
    }
  }, []);

  /**
   * Development helper.
   */
  const reset = useCallback(async () => {
    try {
      await resetOnboarding();
      setIsCompleted(false);
    } catch (error) {
      console.error("[OnboardingProvider] Failed to reset onboarding:", error);
    }
  }, []);

  const value = useMemo(
    () => ({
      isCompleted,
      isLoading,
      completeOnboarding,
      resetOnboarding: reset,
    }),
    [isCompleted, isLoading, completeOnboarding, reset],
  );

  if (isLoading) {
    return null;
    // or return <SplashScreen />;
  }

  if (!isCompleted) {
    return (
      <OnboardingContext.Provider value={value}>
        <OnboardingScreen onFinish={completeOnboarding} />
      </OnboardingContext.Provider>
    );
  }

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}
