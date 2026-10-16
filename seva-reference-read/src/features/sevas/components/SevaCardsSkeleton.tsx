import { StyleSheet, View } from "react-native";

import { Card } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";

const SEVA_COUNT = 5;

function SkeletonBox({
  width,
  height,
  borderRadius = 8,
}: {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
}) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: theme.colors.border,
      }}
    />
  );
}

export default function SevaCardsSkeleton() {
  return (
    <View style={styles.container}>
      {Array.from({ length: SEVA_COUNT }).map((_, index) => (
        <Card key={index} elevated style={styles.card}>
          <SkeletonBox width="70%" height={20} />

          <View style={styles.gap} />

          <SkeletonBox width="35%" height={26} />

          <View style={styles.gapSmall} />

          <SkeletonBox width="55%" height={16} />

          <View style={styles.gap} />

          <SkeletonBox width="100%" height={44} borderRadius={12} />
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },

  card: {
    padding: 18,
    marginBottom: 16,
  },

  gap: {
    height: 16,
  },

  gapSmall: {
    height: 14,
  },
});
