import { View, ViewProps } from "react-native";
import { useTheme } from "../theme";

interface CardProps extends ViewProps {
  elevated?: boolean; // use the stronger 'raised' shadow
  padded?: boolean;
}

export function Card({
  elevated = false,
  padded = true,
  style,
  children,
  ...rest
}: CardProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.card,
          borderRadius: theme.radii.card,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: padded ? theme.spacing.xl : 0,
          ...(elevated ? theme.shadows.raised : theme.shadows.card),
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
