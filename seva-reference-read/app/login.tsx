
import { getSmsAppHash, GuestRoute, useAuth } from "@/src/framework/auth";
import { requestOtp } from "@/src/framework/auth/authService";
import { useTheme } from "@/src/framework/theme";
import { showPhoneNumberHint } from "@shayrn/react-native-android-phone-number-hint";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { useSplash } from "@/src/features/splash/SplashProvider";
import { Button, Screen, Text } from "@/src/framework/components";

export default function Login() {
  const router = useRouter();

  // --------------------------------------------------
  // THEME
  // --------------------------------------------------

  const { theme } = useTheme();
  const { colors } = theme;
  const { t } = useTranslation();

  // --------------------------------------------------
  // AUTH
  // --------------------------------------------------

  const { setAccessToken } = useAuth();

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const { splashFinished } = useSplash();

  const phoneHintShown = useRef(false);

  // --------------------------------------------------
  // PHONE NUMBER HINT
  // --------------------------------------------------

  const handlePhoneHint = async () => {
    try {
      const selectedPhone = await showPhoneNumberHint({
        showGuidanceDialog: true,
      });

      if (!selectedPhone) {
        return;
      }

      const digits = selectedPhone.replace(/\D/g, "");

      setPhone(
        digits.length > 10
          ? digits.slice(-10)
          : digits
      );

      setError(undefined);
    } catch {
      // User cancelled the picker.
    }
  };

  // --------------------------------------------------
  // AUTO OPEN PHONE NUMBER HINT
  // --------------------------------------------------

  useEffect(() => {
    if (!splashFinished) {
      return;
    }

    if (phoneHintShown.current) {
      return;
    }

    phoneHintShown.current = true;

    void handlePhoneHint();
  }, [splashFinished]);

  // --------------------------------------------------
  // SEND OTP
  // --------------------------------------------------

  const handleContinue = async () => {
    setError(undefined);

    const normalizedPhone = phone.replace(/\D/g, "");

    if (normalizedPhone.length !== 10) {
      setError(t("login.invalidPhone"));
     
      return;
    }

    setLoading(true);

    try {
      // --------------------------------------------
      // 1. Get Android SMS Retriever app signature
      // --------------------------------------------

      const appHash = await getSmsAppHash();

      if (!appHash) {
        throw new Error(
          t("login.smsSignatureUnavailable")
        );
      }

      // --------------------------------------------
      // 2. Request OTP
      // --------------------------------------------

      const response = await requestOtp(
        normalizedPhone,
        appHash
      );

      // --------------------------------------------
      // 3. Backend must return otpRef
      // --------------------------------------------

      if (!response.otpRef) {
        throw new Error(
          t("login.otpRefMissing")
        );
      }

      // --------------------------------------------
      // 4. Navigate to OTP screen
      // --------------------------------------------

      router.push({
        pathname: "/otp",
        params: {
          phone: normalizedPhone,
          otpRef: response.otpRef,
        },
      });
    } catch (error) {
      console.error(
        "OTP request failed:",
        error
      );

      setError(
        t("login.otpFailed")
        
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestRoute>
      <Screen
        style={[
          styles.screen,
          {
            backgroundColor: colors.page,
          },
        ]}
      >
        <KeyboardAvoidingView
          style={styles.keyboard}
          behavior={
            Platform.OS === "ios"
              ? "padding"
              : undefined
          }
        >
          <ScrollView
            contentContainerStyle={
              styles.scrollContent
            }
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>

              {/* ==================================
                  TEMPLE SEVA DESIGN IMAGE
                  ================================== */}

              <Image
                source={require(
                  "../assets/images/LoginImage_Background.webp"
                )}
                style={styles.loginImage}
                resizeMode="contain"
              />

              {/* ==================================
                  LOGIN SECTION
                  ================================== */}

              <View style={styles.loginSection}>

                {/* --------------------------------
                    SUBTITLE
                    -------------------------------- */}

                <Text
                  style={[
                    styles.subtitle,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  {t("login.subtitle")}
              
                </Text>

                {/* --------------------------------
                    MOBILE NUMBER
                    -------------------------------- */}

                <View
                  style={[
                    styles.phoneField,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.accent,
                    },
                  ]}
                >
                  {/* Country Code */}

                  <View style={styles.countryCode}>
                    <Text
                      style={[
                        styles.countryText,
                        {
                          color: colors.textPrimary,
                        },
                      ]}
                    >
                      +91
                    </Text>

                    <Text
                      style={[
                        styles.arrow,
                        {
                          color: colors.textMuted,
                        },
                      ]}
                    >
                      ⌄
                    </Text>
                  </View>

                  {/* Divider */}

                  <View
                    style={[
                      styles.verticalDivider,
                      {
                        backgroundColor:
                          colors.border,
                      },
                    ]}
                  />

                  {/* Phone Input */}

                  <TextInput
                    value={phone}
                    onChangeText={(value) => {
                      const digits =
                        value.replace(/\D/g, "");

                      setPhone(
                        digits.slice(0, 10)
                      );

                      setError(undefined);
                    }}
                    placeholder={t("login.mobilePlaceholder")}
                    placeholderTextColor={
                      colors.textMuted
                    }
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                    autoComplete="tel"
                    textContentType="telephoneNumber"
                    maxLength={10}
                    style={[
                      styles.phoneInput,
                      {
                        color: colors.textPrimary,
                      },
                    ]}
                  />
                </View>

                {/* --------------------------------
                    ERROR
                    -------------------------------- */}

                {error ? (
                  <Text
                    style={[
                      styles.errorText,
                      {
                        color: colors.error,
                      },
                    ]}
                  >
                    {error}
                  </Text>
                ) : null}

                {/* --------------------------------
                    SEND OTP
                    -------------------------------- */}

                <Button
                  title={t("login.sendOtp")}
                  onPress={handleContinue}
                  loading={loading}
                  style={[
                    styles.sendButton,
                    {
                      backgroundColor: colors.accent,
                    },
                  ]}
                />

                {/* --------------------------------
                    SECURITY MESSAGE
                    -------------------------------- */}

                <View
                  style={[
                    styles.safety,
                    {
                      backgroundColor:
                        colors.accentMuted,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.shield,
                      {
                        backgroundColor:
                          colors.accentMuted,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.shieldIcon,
                        {
                          color: colors.success,
                        },
                      ]}
                    >
                      ✓
                    </Text>
                  </View>

                  <View
                    style={styles.safetyContent}
                  >
                    <Text
                      style={[
                        styles.safetyTitle,
                        {
                          color:
                            colors.textPrimary,
                        },
                      ]}
                    >
                      {t("login.securityTitle")}
                    </Text>

                    <Text
                      style={[
                        styles.safetyDescription,
                        {
                          color:
                            colors.textSecondary,
                        },
                      ]}
                    >
                      {t("login.securityDescription")}
                    </Text>
                  </View>
                </View>

                {/* --------------------------------
                    BOTTOM DECORATION
                    -------------------------------- */}

                <View
                  style={styles.bottomDecoration}
                >
                  <View
                    style={[
                      styles.decorativeLine,
                      {
                        backgroundColor:
                          colors.border,
                      },
                    ]}
                  />

                  <Text
                    style={[
                      styles.lotus,
                      {
                        color: colors.accent,
                      },
                    ]}
                  >
                    ♢
                  </Text>

                  <View
                    style={[
                      styles.decorativeLine,
                      {
                        backgroundColor:
                          colors.border,
                      },
                    ]}
                  />
                </View>

              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Screen>
    </GuestRoute>
  );
}

// ==================================================
// STYLES
// ==================================================

const styles = StyleSheet.create({

  // --------------------------------------------------
  // SCREEN
  // --------------------------------------------------

  screen: {
    flex: 1,
  },

  keyboard: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },

  content: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    alignItems: "center",
  },

  // --------------------------------------------------
  // LOGIN DESIGN IMAGE
  // --------------------------------------------------

  loginImage: {
    width: "100%",
    height: 250,
    marginTop: 100,
    marginBottom: 1,
    alignSelf: "center",
    marginLeft: -10,
  },

  // --------------------------------------------------
  // LOGIN SECTION
  // --------------------------------------------------

  loginSection: {
    width: "100%",
    alignItems: "center",
  },

  // --------------------------------------------------
  // SUBTITLE
  // --------------------------------------------------

  subtitle: {
    marginTop: 0,
    marginBottom: 10,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Roboto_400Regular",
    textAlign: "center",
  },

  // --------------------------------------------------
  // PHONE FIELD
  // --------------------------------------------------

  phoneField: {
    width: "100%",
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
  },

  // --------------------------------------------------
  // COUNTRY CODE
  // --------------------------------------------------

  countryCode: {
    height: "100%",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  countryText: {
    fontSize: 13,
    fontFamily: "Roboto_500Medium",
  },

  arrow: {
    fontSize: 15,
    lineHeight: 15,
    marginTop: -3,
  },

  // --------------------------------------------------
  // VERTICAL DIVIDER
  // --------------------------------------------------

  verticalDivider: {
    width: 1,
    height: "60%",
  },

  // --------------------------------------------------
  // PHONE INPUT
  // --------------------------------------------------

  phoneInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 12,
    fontSize: 13,
    fontFamily: "Roboto_400Regular",
  },

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  errorText: {
    width: "100%",
    marginTop: 6,
    marginLeft: 4,
    fontSize: 11,
    fontFamily: "Roboto_400Regular",
  },

  // --------------------------------------------------
  // SEND OTP BUTTON
  // --------------------------------------------------

  sendButton: {
    width: "75%",
    height: 46,
    marginTop: 15,
    borderRadius: 8,
  },

  // --------------------------------------------------
  // SAFETY MESSAGE
  // --------------------------------------------------

  safety: {
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    width: "88%",
    padding: 10,
    borderRadius: 8,
  },

  shield: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  shieldIcon: {
    fontSize: 15,
    fontFamily: "Roboto_700Bold",
  },

  safetyContent: {
    flex: 1,
    marginLeft: 10,
  },

  safetyTitle: {
    fontSize: 11,
    fontFamily: "Roboto_700Bold",
  },

  safetyDescription: {
    marginTop: 2,
    fontSize: 10,
    lineHeight: 14,
    fontFamily: "Roboto_400Regular",
  },

  // --------------------------------------------------
  // BOTTOM DECORATION
  // --------------------------------------------------

  bottomDecoration: {
    width: "70%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },

  decorativeLine: {
    flex: 1,
    height: 1,
  },

  lotus: {
    marginHorizontal: 10,
    fontSize: 18,
  },
});

