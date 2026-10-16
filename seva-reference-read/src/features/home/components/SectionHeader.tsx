import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";

type Props = {
  title: string;
  actionText?: string;
  onPressAction?: () => void;
};

export default function SectionHeader({
  title,
  actionText,
  onPressAction,
}: Props) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text
  variant="heading"
  style={{
    fontSize: 20,
    fontFamily: "Roboto_700Bold",
  }}
>
  {title}
</Text>

      {actionText && (
        <TouchableOpacity onPress={onPressAction}>
          <Text
            variant="body"
            style={{
              color: theme.colors.textPrimary,
            }}
          >
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 28,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
