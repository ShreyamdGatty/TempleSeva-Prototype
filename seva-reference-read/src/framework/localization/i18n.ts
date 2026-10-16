
import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { getSavedLanguage } from "./languageStorage";
import en from "./translations/en";
import kn from "./translations/kn";

// Detect the phone's system language.
function getSystemLanguage(): "en" | "kn" {
  const languageCode = getLocales()[0]?.languageCode;

  if (languageCode === "kn") {
    return "kn";
  }

  return "en";
}

async function initializeI18n() {
  try {
    // Check whether the user previously selected an app language.
    const savedLanguage = await getSavedLanguage();

    // Saved language has priority.
    // If there is no saved language, use the system language.
    const initialLanguage = savedLanguage ?? getSystemLanguage();

    await i18n
      .use(initReactI18next)
      .init({
        compatibilityJSON: "v4",

        resources: {
          en: {
            translation: en,
          },
          kn: {
            translation: kn,
          },
        },

        lng: initialLanguage,

        fallbackLng: "en",

        interpolation: {
          escapeValue: false,
        },

        react: {
          useSuspense: false,
        },
      });

    
  } catch (error) {
    console.error(
      "Failed to initialize i18n:",
      error
    );
  }
}

void initializeI18n();

export default i18n;