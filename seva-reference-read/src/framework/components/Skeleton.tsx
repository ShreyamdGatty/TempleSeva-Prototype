import { useEffect, useRef } from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";
import { useTheme } from "../theme";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({
  width = "100%",
  height = 16,
  radius,
  style,
}: SkeletonProps) {
  const { theme } = useTheme();

  // Animated value that pulses 0 → 1 → 0 forever (the shimmer).
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animated.loop repeats the sequence endlessly.
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    // Cleanup: stop the animation when the component leaves.
    return () => animation.stop();
  }, [pulse]);

  // Map 0→1 onto an opacity range (0.3 → 0.6) so it gently fades in and out.
  const opacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });

  return (
    <Animated.View
      style={[
        {
          width: width as ViewStyle["width"],
          height,
          borderRadius: radius ?? theme.radii.control,
          backgroundColor: theme.colors.border,
          opacity,
        },
        style,
      ]}
    />
  );
}
