import { useAuth } from "@/src/framework/auth";
import { Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";

import { StyleSheet, View } from "react-native";

export default function HomeGreeting() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { colors } = theme;

  const name = user?.name || "Devotee";

  return (
    <View style={styles.container}>
      <Text style={[styles.welcome, { color: colors.textSecondary }]}>
        Welcome,{" "}
        <Text style={[styles.name, { color: colors.accent }]}>
          {name} 🙏
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 6,
    paddingTop: 10,
    marginBottom: 6,
  },

  welcome: {
    fontSize: 14,
  },

  name: {
    fontSize: 14,
    fontFamily: "Roboto_700Bold",
  },
});