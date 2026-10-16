import { StyleSheet, View } from "react-native";

import { useTheme } from "@/src/framework/theme";

const DATE_COUNT = 4;

type SkeletonBoxProps = {
  width: number | `${number}%`;
  height: number | `${number}%`;
  borderRadius?: number;
};

function SkeletonBox({ width, height, borderRadius = 8 }: SkeletonBoxProps) {
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

const SevaDateSkeliton = () => {
  return (
    <View style={styles.dateSection}>
      <SkeletonBox width={150} height={20} />

      <View style={styles.dateRow}>
        {Array.from({ length: DATE_COUNT }).map((_, index) => (
          <View key={index} style={styles.dateCard}>
            <SkeletonBox width={45} height={12} />
            <SkeletonBox width={60} height={18} />
            <SkeletonBox width="90%" height={18} />
            <SkeletonBox width="85%" height={16} />
          </View>
        ))}

        <View style={styles.dateCard}>
          <SkeletonBox width={32} height={32} borderRadius={6} />

          <SkeletonBox width={60} height={12} />
        </View>
      </View>
    </View>
  );
};

export default SevaDateSkeliton;

const styles = StyleSheet.create({
  dateSection: {
    paddingTop: 20,
    paddingLeft: 20,
  },

  dateRow: {
    flexDirection: "row",
    marginTop: 20,
    paddingBottom: 12,
  },

  dateCard: {
    width: 100,
    height: 100,
    marginRight: 7,
    borderRadius: 13,
    paddingHorizontal: 8,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
});
