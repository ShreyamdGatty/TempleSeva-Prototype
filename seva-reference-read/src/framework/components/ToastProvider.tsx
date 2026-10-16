import Ionicons from "@expo/vector-icons/Ionicons";
import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { Animated, Modal, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../theme";
import { Text } from "./Text";

type ToastType = "info" | "success" | "error";

interface ToastState {
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  show: (message: string, type?: ToastType) => void;
  hide: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [toast, setToast] = useState<ToastState | null>(null);

  const anim = useRef(new Animated.Value(0)).current;

  const show = useCallback(
    (message: string, type: ToastType = "info") => {
      setToast({
        message,
        type,
      });

      anim.stopAnimation();

      anim.setValue(0);

      Animated.spring(anim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 18,
        stiffness: 180,
        mass: 0.8,
      }).start();
    },
    [anim],
  );

  const hide = useCallback(() => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setToast(null);
    });
  }, [anim]);

  const iconName =
    toast?.type === "success"
      ? "checkmark"
      : toast?.type === "error"
        ? "alert"
        : "information";

  const iconBackground =
    toast?.type === "success"
      ? theme.colors.success
      : toast?.type === "error"
        ? theme.colors.error
        : theme.colors.accent;

  return (
    <ToastContext.Provider value={{ show, hide }}>
      {children}

      <Modal
        visible={!!toast}
        transparent
        animationType="none"
        statusBarTranslucent
        hardwareAccelerated
        onRequestClose={hide}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.toast,
              {
                backgroundColor: theme.colors.accentMuted,
                borderColor: theme.colors.border,
              },
            ]}
          >
            {/* Icon */}
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: iconBackground,
                },
              ]}
            >
              <Ionicons
                name={iconName}
                size={24}
                color={theme.colors.onAccent}
              />
            </View>

            {/* Message */}
            <Text
              variant="body"
              style={[
                styles.message,
                {
                  color: theme.colors.textPrimary,
                },
              ]}
            >
              {toast?.message}
            </Text>

            {/* OK */}
            <Pressable
              onPress={hide}
              style={({ pressed }) => [
                styles.okButton,
                {
                  backgroundColor: iconBackground,
                },
                pressed && styles.okPressed,
              ]}
            >
              <Text
                style={[
                  styles.okText,
                  {
                    color: theme.colors.onAccent,
                  },
                ]}
              >
                OK
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);

  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return ctx;
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  wrap: {
    width: "100%",
    alignItems: "center",
  },

  toast: {
    width: "100%",
    maxWidth: 380,

    minHeight: 190,

    borderWidth: 1,
    borderRadius: 22,

    paddingHorizontal: 20,
    paddingVertical: 22,

    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 12,
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 14,
  },

  message: {
    fontWeight: "600",
    lineHeight: 22,
    textAlign: "center",

    marginBottom: 20,
  },

  okButton: {
    minWidth: 100,
    height: 42,

    paddingHorizontal: 24,

    borderRadius: 21,

    alignItems: "center",
    justifyContent: "center",
  },

  okText: {
    fontWeight: "700",
  },

  okPressed: {
    opacity: 0.7,
  },
});
