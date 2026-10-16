import { ReactNode, useState } from "react";
import { TextInput, TextInputProps, View } from "react-native";
import { useTheme } from "../theme";
import { Text } from "./Text";
interface InputProps extends TextInputProps {
  label?: string;
  error?: string;

  leftIcon?: ReactNode;

  rightIcon?: ReactNode;
}

export function Input({
  label,
  error,
  style,
  onFocus,
  onBlur,
  leftIcon,
  rightIcon,
  ...rest
}: InputProps) {
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? theme.colors.error
    : focused
      ? theme.colors.accent
      : theme.colors.border;

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: theme.colors.card,
          borderWidth: 1,
          borderColor,
          borderRadius: theme.radii.control,
          paddingHorizontal: theme.spacing.lg,
        },
      ]}
    >
      {leftIcon}

      <TextInput
        placeholderTextColor={theme.colors.textMuted}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[
          {
            flex: 1,
            color: theme.colors.textPrimary,
            paddingVertical: 18,
            paddingHorizontal: 12,
            fontSize: theme.typography.body.fontSize,
          },
          style,
        ]}
        {...rest}
      />

      {error && (
        <Text variant="label" color="error">
          {error}
        </Text>
      )}
    </View>
  );
}
