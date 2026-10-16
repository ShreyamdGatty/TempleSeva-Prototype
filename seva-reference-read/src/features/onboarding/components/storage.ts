// src/framework/onboarding/storage.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ONBOARDING_STORAGE_KEY } from "./constants";

/**
 * Check whether onboarding has been completed.
 */
export async function getOnboardingStatus(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
    return value === "true";
  } catch (error) {
    console.error(
      "[OnboardingStorage] Failed to read onboarding status:",
      error,
    );
    return false;
  }
}

/**
 * Save onboarding as completed.
 */
export async function setOnboardingCompleted(): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
  } catch (error) {
    console.error(
      "[OnboardingStorage] Failed to save onboarding status:",
      error,
    );
    throw error;
  }
}

/**
 * Reset onboarding.
 * Useful while developing or testing.
 */
export async function resetOnboarding(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
  } catch (error) {
    console.error("[OnboardingStorage] Failed to reset onboarding:", error);
    throw error;
  }
}
