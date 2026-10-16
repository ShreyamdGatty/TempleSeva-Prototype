import { StyleSheet } from "react-native";

import { Card, Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";

type Props = {
  title: string;
  description: string;
};

export default function InfoCard({ title, description }: Props) {
  const { theme } = useTheme();

  return (
    <Card style={styles.card}>
      <Text variant="title">{title}</Text>

      <Text
        variant="body"
        style={{
          marginTop: theme.spacing.md,
          color: theme.colors.textSecondary,
          lineHeight: 22,
        }}
      >
        {description}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
  },
});
