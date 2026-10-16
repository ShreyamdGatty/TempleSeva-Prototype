import { Button, Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

type Props = {
  onRefresh?: () => void;
};

export default function SevaEmpty({ onRefresh }: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: theme.colors.textPrimary + "15",
          },
        ]}
      >
        <Ionicons
          name="flower-outline"
          size={70}
          color={theme.colors.textPrimary}
        />
      </View>

      <Text variant="heading" style={styles.title}>
          {t("sevaEmpty.noSevasAvailable")}
      </Text>

      <Text variant="body" color="textSecondary" style={styles.subtitle}>
        {t("sevaEmpty.noSevasDescription")}
      </Text>

      {onRefresh && <Button title={t("sevaEmpty.refresh")} onPress={onRefresh} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 24,
  },

  iconContainer: {
    width: 120,
    height: 120,

    borderRadius: 60,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 24,
  },

  title: {
    marginBottom: 12,
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 22,
  },
});
