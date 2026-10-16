import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "../../../framework/components/Text";
import { useTheme } from "../../../framework/theme";

interface OfflineScreenProps {
  onRetry: () => void;
  isChecking?: boolean;
}

export default function OfflineScreen({
  onRetry,
  isChecking = false,
}: OfflineScreenProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.page,
        },
      ]}
    >
      {/* Offline Icon */}
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: colors.card,
          },
        ]}
      >
        <Ionicons
          name="cloud-offline-outline"
          size={64}
          color={colors.accent}
        />
      </View>

      {/* Title */}
      <Text
        variant="heading"
        color="textPrimary"
        style={styles.title}
      >
        {t("offlineScreen.title")}
      </Text>

      {/* Message */}
      <Text
        variant="body"
        color="textSecondary"
        style={styles.message}
      >
        {t("offlineScreen.message")}
      </Text>

      {/* Retry Button */}
      <Pressable
        onPress={onRetry}
        disabled={isChecking}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: colors.accent,
          },
          pressed && styles.buttonPressed,
          isChecking && styles.buttonDisabled,
        ]}
      >
        {isChecking ? (
          <ActivityIndicator color={colors.onAccent} />
        ) : (
          <Text
            variant="label"
            color="onAccent"
            style={styles.buttonText}
          >
            {t("offlineScreen.tryAgain")}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },

  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  title: {
    textAlign: "center",
    marginBottom: 12,
  },

  message: {
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },

  button: {
    minWidth: 150,
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonPressed: {
    opacity: 0.8,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    fontWeight: "700",
  },
});