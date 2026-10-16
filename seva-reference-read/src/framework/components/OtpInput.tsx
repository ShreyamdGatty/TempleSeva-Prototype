import { useRef, useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { useTheme } from '../theme';
import { Text } from './Text';

interface OtpInputProps {
  length: number;
  value: string;
  onChange: (code: string) => void;
  error?: string;
  autoFocus?: boolean;
}

/**
 * Segmented OTP entry. Renders `length` boxes but is backed by a single
 * hidden TextInput — this is the reliable RN pattern (per-box inputs fight
 * over focus and break paste). The boxes are just a visual overlay.
 */
export function OtpInput({ length, value, onChange, error, autoFocus }: OtpInputProps) {
  const { theme } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  const focus = () => inputRef.current?.focus();

  const handleChange = (text: string) => {
    const digits = text.replace(/[^0-9]/g, '').slice(0, length);
    onChange(digits);
  };

  const boxes = Array.from({ length });

  return (
    <View style={{ gap: theme.spacing.sm, width: '100%' }}>
      <Pressable onPress={focus} style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
        {boxes.map((_, i) => {
          const char = value[i] ?? '';
          const isActive = focused && i === value.length;
          const isFilled = char !== '';
          const borderColor = error
            ? theme.colors.error
            : isActive || isFilled
            ? theme.colors.accent
            : theme.colors.border;

          return (
            <View
              key={i}
              style={{
                flex: 1,
                height: 52,
                borderWidth: isActive || isFilled ? 1.5 : 1,
                borderColor,
                borderRadius: theme.radii.control,
                backgroundColor: theme.colors.card,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text variant="title" style={{ fontSize: 22 }}>
                {char}
              </Text>
            </View>
          );
        })}
      </Pressable>

      {/* Hidden input that actually captures keystrokes + paste */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        textContentType="oneTimeCode"   // iOS: pulls code from SMS keyboard suggestion
        autoComplete="sms-otp"           // Android: hint for autofill
        maxLength={length}
        autoFocus={autoFocus}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ position: 'absolute', opacity: 0, height: 52, width: '100%' }}
      />

      {error && (
        <Text variant="label" color="error">
          {error}
        </Text>
      )}
    </View>
  );
}