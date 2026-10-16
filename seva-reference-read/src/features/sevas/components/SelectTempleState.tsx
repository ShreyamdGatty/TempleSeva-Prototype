import { Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

type Props = {
  onSelectTemple: () => void;
};

export default function SelectTempleState({ onSelectTemple }: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.page,
        },
      ]}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.card,

            borderColor: theme.colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: theme.colors.accentMuted,
            },
          ]}
        >
          <Text
            style={[
              styles.icon,
              {
                color: theme.colors.accent,
              },
            ]}
          >
            🛕
          </Text>
        </View>

        <Text
          variant="title"
          style={[
            styles.title,
            {
              color: theme.colors.textPrimary,
            },
          ]}
        >
            {t("selectTemple.title")}
        </Text>

        <Text
          variant="body"
          style={[
            styles.description,
            {
              color: theme.colors.textSecondary,
            },
          ]}
        >
          {t("selectTemple.description")}
        </Text>

        <Pressable
          onPress={onSelectTemple}
          style={[
            styles.button,
            {
              backgroundColor: theme.colors.accent,
            },
          ]}
        >
          <Text variant="label" style={styles.buttonText}>
            {t("selectTemple.button")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingHorizontal: 16,

    paddingTop: 24,
  },

  card: {
    borderWidth: 1,

    borderRadius: 20,

    paddingHorizontal: 24,

    paddingVertical: 32,

    alignItems: "center",
  },

  iconContainer: {
    width: 72,

    height: 72,

    borderRadius: 36,

    alignItems: "center",

    justifyContent: "center",

    marginBottom: 18,
  },

  icon: {
    fontSize: 34,
  },

  title: {
    fontSize: 20,

    lineHeight: 26,

    

    textAlign: "center",
  },

  description: {
    fontSize: 13,

    lineHeight: 20,

    textAlign: "center",

    maxWidth: 310,

    marginTop: 8,
  },

  button: {
    minWidth: 150,

    height: 44,

    borderRadius: 10,

    justifyContent: "center",

    alignItems: "center",

    marginTop: 22,

    paddingHorizontal: 20,
  },

  buttonText: {
    color: "#FFFFFF",

    fontSize: 13,
  },
});
