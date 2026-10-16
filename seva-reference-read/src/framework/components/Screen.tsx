import { ScrollView, StyleProp, View, ViewProps, ViewStyle, } from "react-native";
import { useTheme } from "../theme";

interface ScreenProps extends ViewProps {
  scroll?: boolean;
  padded?: boolean;
  center?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function Screen({
  scroll = false,
  padded = true,
  center = false,
  style,
  contentContainerStyle,
  children,
  ...rest
}: ScreenProps) {
  const { theme } = useTheme();

  const inner = {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,

    paddingVertical: theme.spacing.lg,

    justifyContent: center ? ("center" as const) : undefined,
    alignItems: center ? ("center" as const) : undefined,
  };

  return scroll ? (
    <ScrollView
  contentContainerStyle={[
    inner,
    { flex: undefined, flexGrow: 1 },
    style,
    contentContainerStyle,
  ]}
  {...rest}
>
      {children}
    </ScrollView>
  ) : (
    <View style={[inner, style]} {...rest}>
      {children}
    </View>
  );
}
