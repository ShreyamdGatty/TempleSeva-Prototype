import { ActivityIndicator, View, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../theme';

interface SpinnerProps {
  size?: 'small' | 'large';
  /** Center it in the available space. */
  center?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Spinner({ size = 'large', center = false, style }: SpinnerProps) {
  const { theme } = useTheme();
  const spinner = <ActivityIndicator size={size} color={theme.colors.accent} />;

  if (!center) return spinner;
  return (
    <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' }, style]}>
      {spinner}
    </View>
  );
}