import { View } from "react-native";
import { useTheme } from "../theme";
import { Text } from "./Text";

type BadgeTone = "neutral" | "success" | "error" | "accent";

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
}

export function Badge({ label, tone = "neutral" }: BadgeProps) {
  const { theme } = useTheme();

  // Pick background + text color per tone (the variant-lookup pattern you know).
  const bg = {
    neutral: theme.colors.border,
    success: theme.colors.success,
    error: theme.colors.error,
    accent: theme.colors.accent,
  }[tone];

  const fg =
    tone === "neutral" ? theme.colors.textSecondary : theme.colors.onAccent;

  return (
    <View
      style={{
        alignSelf: "flex-start", // shrink to fit content, don't stretch
        backgroundColor: bg,
        borderRadius: 999, // fully rounded pill
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 2,
      }}
    >
      <Text variant="label" style={{ color: fg }}>
        {label}
      </Text>
    </View>
  );
}
