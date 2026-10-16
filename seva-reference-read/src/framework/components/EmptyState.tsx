import { View } from 'react-native';
import { useTheme } from '../theme';
import { Text } from './Text';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  message?: string;
  /** Anything renderable: an emoji <Text>, an icon, etc. */
  icon?: React.ReactNode;
  /** Optional action button. */
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, message, icon, actionLabel, onAction }: EmptyStateProps) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.xl,
        gap: theme.spacing.sm,
      }}
    >
      {icon && <View style={{ marginBottom: theme.spacing.sm }}>{icon}</View>}

      <Text variant="title" style={{ textAlign: 'center' }}>
        {title}
      </Text>

      {message && (
        <Text variant="body" color="textSecondary" style={{ textAlign: 'center' }}>
          {message}
        </Text>
      )}

      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} style={{ marginTop: theme.spacing.md }} />
      )}
    </View>
  );
}