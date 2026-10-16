import { Text } from "@/src/framework/components";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import { useTheme } from "@/src/framework/theme";

type Props = {
  groups: string[];
  selectedGroup: string;
  onSelectGroup: (group: string) => void;
};

export default function SevaGroupFilter({
  groups,
  selectedGroup,
  onSelectGroup,
}: Props) {
  const { theme } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {groups.map((group) => {
        const selected = selectedGroup === group;

        return (
          <TouchableOpacity
            key={group}
            activeOpacity={0.8}
            onPress={() => onSelectGroup(group)}
            style={[
              styles.chip,
              {
                backgroundColor: selected
                  ? theme.colors.accent
                  : theme.colors.card,

                borderColor: selected
                  ? theme.colors.accent
                  : theme.colors.border,
              },
            ]}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.text,
                {
                  color: selected
                    ? theme.colors.onAccent
                    : theme.colors.textSecondary,
                },
              ]}
            >
              {group}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 7,
  },

  chip: {
    height: 34,

    paddingHorizontal: 14,

    borderRadius: 999,

    borderWidth: 1,

    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    fontSize: 10,
  },
});
