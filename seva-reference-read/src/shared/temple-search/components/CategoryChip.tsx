import { Text } from "@/src/framework/components";
import { StyleSheet, TouchableOpacity } from "react-native";

interface CategoryChipProps {
  title: string;
  selected: boolean;
  onPress: () => void;
}

const CategoryChip = ({ title, selected, onPress }: CategoryChipProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, selected && styles.selectedChip]}
    >
      <Text style={[styles.chipText, selected && styles.selectedChipText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryChip;

const styles = StyleSheet.create({
  chip: {
    height: 26, // controls the exact chip height

    paddingHorizontal: 14,

    borderRadius: 14, // half of height = perfect pill shape

    backgroundColor: "#F5F5F5",

    borderWidth: 1,
    borderColor: "#E2E2E2",

    marginRight: 8,

    justifyContent: "center",
    alignItems: "center",
  },

  selectedChip: {
    backgroundColor: "#6B2D18",

    borderColor: "#6B2D18",
  },

  chipText: {
    fontSize: 12,
    

    color: "#555555",
  },

  selectedChipText: {
    color: "#FFFFFF",
  },
});
