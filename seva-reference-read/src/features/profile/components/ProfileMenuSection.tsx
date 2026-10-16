import { ChevronRight } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

import { Divider, Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";

type MenuItem = {
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{
    size?: number;
    color?: string;
  }>;
  onPress?: () => void;
};

type Props = {
  title: string;
  items: MenuItem[];
};

export default function ProfileMenuSection({ title, items }: Props) {
  const { theme } = useTheme();

  return (
    <View style={styles.section}>
      <Text variant="label" color="textSecondary" style={styles.sectionTitle}>
        {title}
      </Text>

      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.page,
            borderColor: theme.colors.border,
          },
        ]}
      >
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <View key={item.title}>
              <Pressable
                onPress={item.onPress}
                style={({ pressed }) => [
                  styles.item,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.left}>
                  <Icon size={18} color={theme.colors.textSecondary} />

                  <Text variant="body" style={styles.itemText}>
                    {item.title}
                  </Text>
                </View>

                <ChevronRight size={18} color={theme.colors.textMuted} />
              </Pressable>

              {index < items.length - 1 && <Divider />}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    marginBottom: 8,
    marginLeft: 4,
  },

  container: {
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
  },

  item: {
    minHeight: 50,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  itemText: {
    marginLeft: 12,
  },

  pressed: {
    opacity: 0.65,
  },
});
