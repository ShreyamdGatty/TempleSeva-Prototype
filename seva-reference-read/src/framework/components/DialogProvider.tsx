import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Modal, Pressable, View, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { Text } from './Text';
import { Button } from './Button';

// What a confirm dialog can be configured with.
interface ConfirmOptions {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean; // makes the confirm button red (for deletes)
}

interface DialogContextValue {
  // Returns a Promise<boolean>: true if confirmed, false if cancelled.
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  const [options, setOptions] = useState<ConfirmOptions | null>(null);

  // Here we stash the Promise's resolve function so a button tap can call it.
  // useRef because it must persist without causing re-renders.
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts); // show the dialog
    // Create a Promise but DON'T resolve it yet — stash resolve for later.
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  // Called by both buttons. Resolves the waiting Promise, then hides.
  const close = (result: boolean) => {
    resolver.current?.(result); // wake up the awaiting code with true/false
    resolver.current = null;
    setOptions(null);
  };

  return (
    <DialogContext.Provider value={{ confirm }}>
      {children}

      <Modal
        visible={options !== null}
        transparent
        animationType="fade"
        onRequestClose={() => close(false)} // Android back button = cancel
      >
        {/* Dark backdrop; tapping it cancels. */}
        <Pressable style={styles.backdrop} onPress={() => close(false)}>
          {/* Stop taps on the card from bubbling to the backdrop. */}
          <Pressable
            style={[
              styles.card,
              { backgroundColor: theme.colors.card, borderRadius: theme.radii.card },
            ]}
            onPress={() => {}}
          >
            {options && (
              <>
                <Text variant="title" style={{ marginBottom: theme.spacing.sm }}>
                  {options.title}
                </Text>

                {options.message && (
                  <Text variant="body" color="textSecondary" style={{ marginBottom: theme.spacing.xl }}>
                    {options.message}
                  </Text>
                )}

                <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
                  <Button
                    title={options.cancelText ?? 'Cancel'}
                    variant="secondary"
                    onPress={() => close(false)}
                    style={{ flex: 1 }}
                  />
                  <Button
                    title={options.confirmText ?? 'Confirm'}
                    variant="primary"
                    onPress={() => close(true)}
                    style={{ flex: 1 }}
                  />
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </DialogContext.Provider>
  );
}

export function useDialog(): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('useDialog must be used within DialogProvider');
  return ctx;
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
});