import { useTheme } from "@/src/framework/theme";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

function SkeletonBlock({
  width,
  height,
  radius = 8,
  color,
}: {
  width: number | `${number}%`;
  height: number;
  radius?: number;
  color: string;
}) {
  return (
    <View
      style={{
        width,
        height,
        borderRadius: radius,
        backgroundColor: color,
      }}
    />
  );
}

export default function MySevasSkeleton() {
  const { theme } = useTheme();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  const colors = theme.colors;

  return (
    <View style={[styles.container, { backgroundColor: colors.page }]}>
      {[1, 2, 3].map((item) => (
        <Animated.View
          key={item}
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity,
            },
          ]}
        >
          <View style={styles.topRow}>
            <View style={styles.left}>
              <SkeletonBlock width="65%" height={17} color={colors.border} />
              <View style={styles.gap} />
              <SkeletonBlock width="42%" height={12} color={colors.border} />
            </View>

            <SkeletonBlock
              width={72}
              height={27}
              radius={10}
              color={colors.border}
            />
          </View>

          <View style={styles.line}>
            <SkeletonBlock width={105} height={12} color={colors.border} />
            <SkeletonBlock width={82} height={12} color={colors.border} />
          </View>

          <View style={styles.line}>
            <SkeletonBlock width="48%" height={12} color={colors.border} />
          </View>

          <View style={styles.bottomRow}>
            <SkeletonBlock
              width={95}
              height={25}
              radius={8}
              color={colors.border}
            />
            <SkeletonBlock
              width={90}
              height={32}
              radius={10}
              color={colors.border}
            />
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    minHeight: 165,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flex: 1,
    gap: 8,
  },
  gap: {
    height: 2,
  },
  line: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 16,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
  },
});
