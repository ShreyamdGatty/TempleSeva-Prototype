import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, OtpInput, Screen, Text } from "../src/framework/components";

import {
  clearPendingOtp,
  startSmsRetriever,
  stopSmsRetriever,
  subscribeToOtp,
  useAuth,
} from "@/src/framework/auth";

import { loginWithOtp } from "@/src/framework/auth/authService";
import { AppError } from "@/src/framework/network";
import { appConfig } from "../src/framework/config";

import { useTheme } from "@/src/framework/theme";
import { Image, StyleSheet, View } from "react-native";

const RESEND_SECONDS = 30;

export default function Otp() {
  const router = useRouter();
  const { setAccessToken, completeLogin } = useAuth();

  const { theme } = useTheme();
  const { colors } = theme;
const { t } = useTranslation();
  const { phone, otpRef } = useLocalSearchParams<{
    phone?: string;
    otpRef?: string;
  }>();

  const length = appConfig.auth.otpLength;

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [isReadingOtp, setIsReadingOtp] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  // ---------------- SMS RETRIEVER ----------------

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupSmsRetriever = async () => {
      try {
        unsubscribe = subscribeToOtp((otp) => {
          setCode(otp);
          setError(undefined);
          setIsReadingOtp(false);
        });

        setIsReadingOtp(true);
        await startSmsRetriever();
      } catch {
        setIsReadingOtp(false);
      }
    };

    void setupSmsRetriever();

    return () => {
      unsubscribe?.();
      void stopSmsRetriever();
      clearPendingOtp();
    };
  }, []);

  // ---------------- TIMER ----------------

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setTimeout(() => setSeconds((v) => v - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  // ---------------- VERIFY ----------------

  const verify = async () => {
    if (loading) return;
    if (code.length !== length) return;

    if (!phone || !otpRef) {
      setError(t("otp.sessionExpired"));
      return;
    }

    setError(undefined);
    setLoading(true);

    try {
      const response = await loginWithOtp(phone, code, otpRef);

      if (!response.accessToken) {
        throw new Error(t("otp.accessTokenMissing"));
      }

      await setAccessToken(response.accessToken);

      const partyResult = await completeLogin(phone);

      if (partyResult.isExistingUser) {
        router.replace("/(tabs)");
      } else {
        router.replace({
          pathname: "/profile-setup",
          params: { phone },
        });
      }
    } catch (error) {
      if (error instanceof AppError) {
        setError(t("otp.invalidOtp"));
        setCode("");
        return;
      }

      setError(t("otp.verifyFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (code.length === length) {
      void verify();
    }
  }, [code]);

  // ---------------- RESEND ----------------

  const resend = () => {
    setSeconds(RESEND_SECONDS);
    setCode("");
    setError(undefined);
  };

  const displayPhone = phone
    ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`
    : "";

  // ---------------- UI ----------------

  return (
    <Screen style={[styles.screen, { backgroundColor: colors.page }]}>
      <View style={styles.container}>

        {/* TOP IMAGE */}
        <Image
          source={require("../assets/images/LoginImage_Background.webp")}
          style={styles.image}
          resizeMode="contain"
        />

        {/* HEADER */}
        <Text style={[styles.title, { color: colors.textPrimary }]}>
           {t("otp.title")}
        </Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
         {t("otp.subtitle")}
        </Text>

        <Text style={[styles.phone, { color: colors.textPrimary }]}>
          {displayPhone}
        </Text>

        {/* OTP BOX */}
        <View
          style={[
            styles.otpBox,
            {
              backgroundColor: colors.card,
              borderColor: colors.accent,
            },
          ]}
        >
          <OtpInput
            length={length}
            value={code}
            onChange={(val) => {
              setCode(val);
              setError(undefined);
            }}
            autoFocus
          />
        </View>

        {/* ERROR */}
        {error && (
          <Text style={[styles.error, { color: colors.error }]}>
            {error}
          </Text>
        )}

        {/* RESEND */}
        <View style={styles.resend}>
          {seconds > 0 ? (
            <Text style={{ color: colors.textSecondary }}>
              {t("otp.resendIn")}{" "}
              <Text style={{ color: colors.accent }}>
                00:{seconds.toString().padStart(2, "0")}
              </Text>
            </Text>
          ) : (
            <Button   title={t("otp.resendOtp")} variant="ghost" onPress={resend} />
          )}
        </View>

        {/* BUTTON */}
        <Button
          title={isReadingOtp    ? t("otp.readingOtp")  : t("otp.verifyContinue")}
          onPress={verify}
          loading={loading || isReadingOtp}
          disabled={code.length !== length || isReadingOtp}
          style={[styles.button, { backgroundColor: colors.accent }]}
        />

        {/* SAFETY */}
        <View
          style={[
            styles.safety,
            { backgroundColor: colors.accentMuted },
          ]}
        >
          <Text style={{ color: colors.success }}>✓</Text>
          <Text style={{ marginLeft: 8, color: colors.textSecondary }}>
            {t("otp.numberSafe")}
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },

  image: {
    width: "100%",
    height: 220,
    marginTop: 60,
  },

  title: {
    fontSize: 20,
    fontFamily: "Roboto_700Bold",
    marginTop: 10,
  },

  subtitle: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: "Roboto_400Regular",
  },

  phone: {
    fontSize: 14,
    marginBottom: 15,
    fontFamily: "Roboto_400Regular",
  },

  otpBox: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
  },

  error: {
    marginTop: 6,
    fontSize: 11,
    fontFamily: "Roboto_400Regular",
  },

  resend: {
    marginTop: 12,
  },

  button: {
    width: "100%",
    height: 46,
    marginTop: 16,
    borderRadius: 8,
  },

  safety: {
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
});