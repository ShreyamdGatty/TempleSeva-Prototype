import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";

type Props = {
  templeName: string;
  worshipDate: string;
};

export default function SankalpamHeader({ templeName, worshipDate }: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.page,
          borderBottomColor: theme.colors.border,
          paddingTop: insets.top + 10,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
        hitSlop={8}
        activeOpacity={0.7}
      >
        <Ionicons
          name="arrow-back"
          size={26}
          color={theme.colors.textPrimary}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text
          variant="heading"
          numberOfLines={1}
          style={[
            styles.title,
            {
              color: theme.colors.textPrimary,
            },
          ]}
        >
          Devotee Details (Sankalpam)
        </Text>

        <Text
          variant="label"
          numberOfLines={1}
          style={[
            styles.subtitle,
            {
              color: theme.colors.accent,
            },
          ]}
        >
          {templeName} • {worshipDate}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 72,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 16,
    paddingBottom: 10,

    borderBottomWidth: 1,
  },

  backButton: {
    width: 40,
    height: 40,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 8,
  },

  content: {
    flex: 1,
    minWidth: 0,
  },

  title: {
    fontSize: 16,
    fontFamily: "Roboto_700Bold",
  },

  subtitle: {
    marginTop: 3,
    fontSize: 11,
  },
});
