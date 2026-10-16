import AsyncStorage from "@react-native-async-storage/async-storage";

const LANGUAGE_KEY = "@sahakari_selected_language";

export type AppLanguage = "en" | "kn";

export async function saveLanguage(
  language: AppLanguage
): Promise<void> {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.error("Failed to save language:", error);
  }
}

export async function getSavedLanguage(): Promise<AppLanguage | null> {
  try {
    const language = await AsyncStorage.getItem(LANGUAGE_KEY);

    if (language === "en" || language === "kn") {
      return language;
    }

    return null;
  } catch (error) {
    console.error("Failed to load saved language:", error);
    return null;
  }
}

export async function clearSavedLanguage(): Promise<void> {
  try {
    await AsyncStorage.removeItem(LANGUAGE_KEY);
  } catch (error) {
    console.error("Failed to clear language:", error);
  }
}