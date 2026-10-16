import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";

import { SevaSlot } from "../types/seva.types";
type Props = {
  slots?: SevaSlot[];
  selectedSlotId?: string | null;
  selectionError?: boolean;
  onSelectSlot?: (slot: SevaSlot) => void;
};

export default function SevaSlotCarousel({
  slots,
  selectedSlotId,
  selectionError = false,
  onSelectSlot,
}: Props) {
  const { theme } = useTheme();

  if (!slots || slots.length === 0) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {slots.map((slot) => {
          const selected = slot.id === selectedSlotId;

          const errorHighlight = selectionError && !selectedSlotId;
          return (
            <Pressable
              key={slot.id}
              onPress={() => onSelectSlot?.(slot)}
              style={[
                styles.chip,
                {
                  backgroundColor: selected
                    ? theme.colors.accent
                    : theme.colors.card,

                  borderColor: selected
                    ? theme.colors.accent
                    : errorHighlight
                      ? theme.colors.error
                      : theme.colors.border,
                },
              ]}
            >
              <Text
                variant="label"
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
                {slot.slotName}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginTop: 10,
  },

  content: {
    gap: 8,
    paddingRight: 4,
  },

  chip: {
    minHeight: 34,
    paddingHorizontal: 12,
    paddingVertical: 7,

    borderRadius: 999,
    borderWidth: 1,

    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    fontSize: 10,
    
  },
  wrapperError: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 4,
  },
});
