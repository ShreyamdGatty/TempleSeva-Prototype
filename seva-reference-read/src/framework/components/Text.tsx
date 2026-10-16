import { Text as RNText, TextProps as RNTextProps } from "react-native";

import { useTheme } from "../theme";

type Variant = "heading" | "title" | "body" | "label";

type ColorKey =
  | "textPrimary"
  | "textSecondary"
  | "textMuted"
  | "onAccent"
  | "success"
  | "error";

interface TextProps extends RNTextProps {
  variant?: Variant;
  color?: ColorKey;
}

// Map a numeric fontWeight to the matching Roboto family.
function robotoFamily(weight?: string): string {
  switch (weight) {
    case "500":
      return "Roboto_500Medium";
    case "600":
    case "700":
    case "800":
    case "900":
      return "Roboto_700Bold";
    default:
      return "Roboto_400Regular";
  }
}

export function Text({
  variant = "body",
  color = "textPrimary",
  style,
  ...rest
}: TextProps) {
  const { theme } = useTheme();

  const t = theme.typography[variant];

  return (
    <RNText
      style={[
        {
          fontFamily: robotoFamily(t.fontWeight),
          fontSize: t.fontSize,
          letterSpacing: t.letterSpacing,
          textTransform: t.textTransform ?? "none",
          color: theme.colors[color],
        },
        style,
      ]}
      {...rest}
    />
  );
}