import { Image, View } from "react-native";
import { useTheme } from "../theme";
import { Text } from "./Text";

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
}

export function Avatar({ uri, name, size = 40 }: AvatarProps) {
  const { theme } = useTheme();

  const initials = (name ?? "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const base = {
    width: size,
    height: size,
    borderRadius: size / 2, // half of size = perfect circle
  };

  // If we have an image, show it.
  if (uri) {
    return <Image source={{ uri }} style={base} />;
  }

  // Otherwise, a colored circle with initials.
  return (
    <View
      style={[
        base,
        {
          backgroundColor: theme.colors.accent,
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    >
      <Text
        variant="label"
        style={{ color: theme.colors.onAccent, fontSize: size * 0.4 }}
      >
        {initials}
      </Text>
    </View>
  );
}
