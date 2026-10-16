import { ActivityIndicator, StyleSheet, View } from "react-native";

import { Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";

export default function SevaFooterLoader() {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={theme.colors.textPrimary} />

      <Text variant="body" color="textSecondary" style={styles.text}>
        Loading more sevas...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    marginTop: 10,
  },
});
