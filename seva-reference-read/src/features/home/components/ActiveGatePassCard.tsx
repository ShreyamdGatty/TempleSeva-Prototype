import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Card, Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";

type Props = {
  activeCount?: number;
  onPress?: () => void;
};

export default function ActiveGatePassCard({ activeCount, onPress }: Props) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <Card style={styles.card}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: theme.colors.accentMuted,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="qrcode-scan"
            size={28}
            color={theme.colors.accent}
          />
        </View>

        <View style={styles.content}>
          <Text variant="title">Active Gate Passes</Text>

          <Text
            variant="body"
            style={{
              color: theme.colors.textSecondary,
              marginTop: theme.spacing.xs,
            }}
          >
            {activeCount} Active Gate Pass
            {activeCount !== 1 ? "es" : ""} Available
          </Text>
        </View>

        <MaterialCommunityIcons
          name="chevron-right"
          size={28}
          color={theme.colors.textSecondary}
        />
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
  },
});
