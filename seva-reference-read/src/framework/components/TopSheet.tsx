import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme";

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function TopSheet({ visible, onClose, children }: Props) {
  const { height } = useWindowDimensions();
  const { theme } = useTheme();

  const SHEET_HEIGHT = height * 0.86;

  const translateY = useRef(new Animated.Value(-SHEET_HEIGHT)).current;

  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setMounted(true);

      translateY.setValue(-SHEET_HEIGHT);
      backdropOpacity.setValue(0);

      Animated.sequence([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),

        Animated.spring(translateY, {
          toValue: 0,
          tension: 60,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (mounted) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(backdropOpacity, {
            toValue: 0,
            duration: 120,
            useNativeDriver: true,
          }),

          Animated.timing(translateY, {
            toValue: -SHEET_HEIGHT,
            duration: 280,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        setMounted(false);
      });
    }
  }, [visible, SHEET_HEIGHT]);

  if (!mounted) return null;

  return (
    <Modal
      visible
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar
        barStyle={theme.mode === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.page}
      />

      {/* Backdrop */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        />
      </Pressable>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheetContainer,
          {
            height: SHEET_HEIGHT,
            transform: [{ translateY }],
            backgroundColor: theme.colors.page,
          },
        ]}
      >
        <SafeAreaView
          style={[styles.sheet, { backgroundColor: theme.colors.page }]}
        >
          {children}
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  sheetContainer: {
    position: "absolute",

    top: 0,
    left: 0,
    right: 0,

    overflow: "hidden",

    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.18,
    shadowRadius: 12,

    elevation: 12,
  },

  sheet: {
    flex: 1,

    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,

    overflow: "hidden",

  },
});
