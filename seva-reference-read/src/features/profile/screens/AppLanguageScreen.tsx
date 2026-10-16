import i18n from "@/src/framework/localization/i18n";
import {
  saveLanguage,
  type AppLanguage,
} from "@/src/framework/localization/languageStorage";
import { useTranslation } from "react-i18next";

import { Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";

import { router } from "expo-router";

import { ArrowLeft, Check, ChevronRight, Languages } from "lucide-react-native";

import { useState } from "react";

import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppLanguageScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { colors } = theme;

  const insets = useSafeAreaInsets();

  const [selectedLanguage, setSelectedLanguage] = useState<AppLanguage>(
    i18n.language === "kn" ? "kn" : "en",
  );

  const languages: {
    code: AppLanguage;
    name: string;
    nativeName: string;
  }[] = [
    {
      code: "en",
      name: t("appLanguage.english"),
      nativeName: "English",
    },
    {
      code: "kn",
      name: t("appLanguage.kannada"),
      nativeName: "ಕನ್ನಡ",
    },
  ];

  const handleLanguageChange = async (language: AppLanguage) => {
    try {
      // Update selected language in the UI
      setSelectedLanguage(language);

      // Change language immediately
      await i18n.changeLanguage(language);

      // Save selected language for the next app launch
      await saveLanguage(language);
    } catch (error) {
      console.error("Failed to change language:", error);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.page,
        },
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top,
            backgroundColor: colors.page,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.headerContent}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              {
                backgroundColor: colors.accentMuted,
                borderColor: colors.border,
              },
              pressed && styles.pressed,
            ]}
          >
            <ArrowLeft size={22} color={colors.accent} strokeWidth={2.3} />
          </Pressable>

          <Text
            style={[
              styles.headerTitle,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            {t("appLanguage.title")}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: insets.bottom + 30,
          },
        ]}
      >
        {/* Intro */}
        <View style={styles.intro}>
          <View
            style={[
              styles.languageIcon,
              {
                backgroundColor: colors.accentMuted,
              },
            ]}
          >
            <Languages size={25} color={colors.accent} strokeWidth={2.2} />
          </View>

          <Text
            style={[
              styles.title,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            {t("appLanguage.chooseLanguage")}
          </Text>

          <Text
            style={[
              styles.description,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {t("appLanguage.description")}
          </Text>
        </View>

        {/* Language Card */}
        <View
          style={[
            styles.languageCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {languages.map((language, index) => {
            const isSelected = selectedLanguage === language.code;

            return (
              <View key={language.code}>
                <Pressable
                  onPress={() => handleLanguageChange(language.code)}
                  style={({ pressed }) => [
                    styles.languageItem,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.languageLeft}>
                    {/* Language Icon */}
                    <View
                      style={[
                        styles.languageCircle,
                        {
                          backgroundColor: isSelected
                            ? colors.accentMuted
                            : colors.page,
                          borderColor: isSelected
                            ? colors.accent
                            : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.languageLetter,
                          {
                            color: isSelected
                              ? colors.accent
                              : colors.textSecondary,
                          },
                        ]}
                      >
                        {language.code === "en" ? "A" : "ಕ"}
                      </Text>
                    </View>

                    {/* Language Name */}
                    <View>
                      <Text
                        style={[
                          styles.languageName,
                          {
                            color: colors.textPrimary,
                          },
                        ]}
                      >
                        {language.name}
                      </Text>

                      <Text
                        style={[
                          styles.nativeName,
                          {
                            color: colors.textSecondary,
                          },
                        ]}
                      >
                        {language.nativeName}
                      </Text>
                    </View>
                  </View>

                  {/* Selected / Not Selected */}
                  {isSelected ? (
                    <View
                      style={[
                        styles.checkCircle,
                        {
                          backgroundColor: colors.accent,
                        },
                      ]}
                    >
                      <Check size={17} color={colors.page} strokeWidth={2.8} />
                    </View>
                  ) : (
                    <ChevronRight
                      size={19}
                      color={colors.textMuted}
                      strokeWidth={2.2}
                    />
                  )}
                </Pressable>

                {/* Divider */}
                {index < languages.length - 1 && (
                  <View
                    style={[
                      styles.divider,
                      {
                        backgroundColor: colors.border,
                      },
                    ]}
                  />
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    borderBottomWidth: 1,
  },

  headerContent: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 14,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },

  intro: {
    alignItems: "center",
    marginBottom: 24,
  },

  languageIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },

  description: {
    fontSize: 14,
    marginTop: 7,
    textAlign: "center",
  },

  languageCard: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden",
  },

  languageItem: {
    minHeight: 76,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  languageLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  languageCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  languageLetter: {
    fontSize: 19,
    fontWeight: "600",
  },

  languageName: {
    fontSize: 16,
    fontWeight: "600",
  },

  nativeName: {
    fontSize: 13,
    marginTop: 3,
  },

  checkCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  divider: {
    height: 1,
    marginLeft: 74,
  },

  pressed: {
    opacity: 0.65,
  },
});
