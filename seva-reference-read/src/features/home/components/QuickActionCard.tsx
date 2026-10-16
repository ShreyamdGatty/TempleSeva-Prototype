import { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Card, Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";

type Props = {
  title: string;
  subtitle: string;
  icon: ReactNode;
  onPress?: () => void;
};

export default function QuickActionCard({
  title,
  subtitle,
  icon,
  onPress,
}: Props) {
    const { theme } = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.touchable}
    >
      <Card elevated style={styles.card}>
        <View style={styles.iconContainer}>{icon}</View>

        <Text variant="label" style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <Text variant="label" style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    width: "32%",
    marginTop: -20,
  },

  card: {
    minHeight: 92,

    paddingVertical: 10,
    paddingHorizontal: 4,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 12,
  },

  iconContainer: {
    marginBottom: 6,
  },

  title: {
    fontSize: 10,

    

    textAlign: "center",
  },

  subtitle: {
    fontSize: 8,

    textAlign: "center",

    marginTop: 2,
  },
});
