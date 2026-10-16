import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useTheme } from "../theme";
import { Text } from "./Text";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends Omit<PressableProps, "style"> {
  title: string;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  bgColor?: string;
  fgColor?: string;
}

export function Button({
  title,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
  bgColor,
  fgColor,
  ...rest
}: ButtonProps) {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;

  const defaultBg = {
    primary: theme.colors.accent,
    secondary: theme.colors.card,
    ghost: "transparent",
  }[variant];

  const defaultFg = {
    primary: theme.colors.onAccent,
    secondary: theme.colors.textPrimary,
    ghost: theme.colors.textPrimary,
  }[variant];

  const bg = bgColor ?? defaultBg;
  const fg = fgColor ?? defaultFg;

  const border = variant === "secondary" ? theme.colors.border : "transparent";

  return (
    <Pressable
      disabled={isDisabled}
      style={({ pressed }) => [
        {
          backgroundColor: bg,
          borderWidth: 1,
          borderColor: border,
          borderRadius: theme.radii.control,
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.xl,
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <Text variant="body" style={{ color: fg, fontWeight: "500" }}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}
