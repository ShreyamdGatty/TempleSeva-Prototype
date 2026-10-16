import { View } from 'react-native';
import { useTheme } from '../theme';

interface DividerProps {
  spacing?: number;
}

export function Divider({ spacing }: DividerProps) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        height: 1,
        alignSelf: 'stretch',   // ← force full width regardless of parent
        width: '100%',          // ← belt-and-suspenders
        backgroundColor: theme.colors.border,
        marginVertical: spacing ?? theme.spacing.md,
      }}
    />
  );
}