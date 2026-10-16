import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../src/framework/auth";
import { useTheme } from "../src/framework/theme";

export default function Bootstrap() {
  const { status, resolveBootstrapTarget } = useAuth();
  const { theme } = useTheme();

  if (status === "loading") {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.page,
        }}
      >
        <ActivityIndicator color={theme.colors.accent} />
      </View>
    );
  }

  const target = resolveBootstrapTarget();

  switch (target) {
    case "dashboard":
      return <Redirect href="/(tabs)" />;

    case "login":
    default:
      return <Redirect href="/login" />;
  }
}
