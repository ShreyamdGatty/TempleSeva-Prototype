import { Search } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const GOD_NAMES = [
  "Shiva",
  "Parvathi",
  "Ganesha",
  "Hanuman",
  "Krishna",
  "Rama",
  "Murugan",
  "Lakshmi",
  "Durga",
  "Ayyappa",
];

type Props = {
  onPress: () => void;
  highlightTrigger?: number;
};

export default function AnimatedSearch({
  onPress,
  highlightTrigger = 0,
}: Props) {
  const { theme } = useTheme();

  const [index, setIndex] = useState(0);

  const highlightProgress = useSharedValue(0);

  useEffect(() => {
    if (highlightTrigger === 0) {
      return;
    }

    // Reset current animation immediately.
    highlightProgress.value = 0;

    // 375ms ON + 375ms OFF = 750ms
    // 4 repetitions = exactly 3 seconds.
    highlightProgress.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 375,
        }),
        withTiming(0, {
          duration: 375,
        }),
      ),
      4,
      false,
    );
  }, [highlightTrigger, highlightProgress]);

  /*
   * Animate only the OUTER highlight.
   *
   * The search box itself stays normal.
   */
  const highlightStyle = useAnimatedStyle(() => {
    return {
      opacity: highlightProgress.value,
      transform: [
        {
          scale: 1 + highlightProgress.value * 0.025,
        },
      ],
    };
  });

  /*
   * Rotate the placeholder text.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % GOD_NAMES.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Pressable onPress={onPress}>
      <View style={styles.wrapper}>
        {/* Blinking outer highlight */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.highlightBorder,
            {
              borderColor: theme.colors.accent,
            },
            highlightStyle,
          ]}
        />

        {/* Normal search box */}
        <View
          style={[
            styles.container,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Search size={22} color={theme.colors.accent} />

          <View style={styles.textContainer}>
            <Text variant="body" color="textSecondary">
              Try "{GOD_NAMES[index]}"
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    marginVertical: 18,
  },

  /*
   * This is the blinking outer border.
   * It sits OUTSIDE the actual search box.
   */
  highlightBorder: {
    position: "absolute",

    top: -4,
    left: -4,
    right: -4,
    bottom: -4,

    borderWidth: 2,
    borderRadius: 22,
  },

  container: {
    height: 58,

    borderRadius: 18,

    borderWidth: 1,

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 18,
  },

  textContainer: {
    marginLeft: 12,

    flex: 1,
  },
});
