import { StyleSheet } from "react-native";

import { Card, Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";

export default function LatestUpdates() {
  const { theme } = useTheme();

  return (
    <Card style={styles.card}>
      <Text variant="title">Latest Updates</Text>

      <Text
        variant="body"
        style={{
          marginTop: theme.spacing.md,
          color: theme.colors.textSecondary,
        }}
      >
        New temples, festivals and announcements will appear here.
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 5,
    marginBottom: "20%",
  },
});
