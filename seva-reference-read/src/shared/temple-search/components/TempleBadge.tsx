import { Text } from "@/src/framework/components";
import { StyleSheet, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

interface BadgeProps {
  text?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  children?: React.ReactNode;
  variant?: "default" | "active";
}

const Badge = ({ text, icon,  children, variant = "default" }: BadgeProps) => {
  return (
    <View style={[styles.badge, variant === "active" && styles.activeBadge]}>
      {/* Active badge icon */}
      {variant === "active" && (
        <View style={styles.activeIconCircle}>
          <Ionicons name="checkmark" size={9} color="#FFFFFF" />
        </View>
      )}

      {/* Normal badge icon */}
      {variant === "default" && icon && (
        <Ionicons name={icon} size={10} color="#F5C542" />
      )}

      {/* Badge text */}
     {children ? (
  children
) : (
  <Text
    style={[
      styles.badgeText,
      variant === "default" &&
        !icon &&
        styles.templeNameText,
      variant === "default" &&
        icon &&
        styles.iconBadgeText,
      variant === "active" &&
        styles.activeBadgeText,
      variant === "default" &&
        icon &&
        styles.textWithIcon,
    ]}
    numberOfLines={1}
  >
    {text}
  </Text>
)}
    </View>
  );
};

export default Badge;

const styles = StyleSheet.create({
  /* Normal badge container */

  badge: {
  
      width: "90%", 

    flexDirection: "row",

    alignItems: "center",

    backgroundColor: "rgba(0, 0, 0, 0.65)",

    borderRadius: 16,

    paddingHorizontal: 12,

    paddingVertical: 2,
  },

  /* Common text styles */

  badgeText: {
    color: "#E3DED6",

  },

  templeNameText: {
    fontSize: 14,

    lineHeight: 22,
  },

  iconBadgeText: {
    fontSize: 10,

    lineHeight: 14,
  },

  /* Space between the normal icon and text */

  textWithIcon: {
    marginLeft: 6,
  },

  /* Active badge container */

  activeBadge: {
    backgroundColor: "#DCFCE7",

    borderWidth: 1,

    borderColor: "#86EFAC",

    borderRadius: 14,

    paddingHorizontal: 8,

    paddingVertical: 4,
  },

  /* Green circle containing the white check icon */

  activeIconCircle: {
    width: 14,

    height: 14,

    borderRadius: 7,

    backgroundColor: "#16A34A",

    justifyContent: "center",

    alignItems: "center",

    marginRight: 5,
  },

  /* Active badge text */

  activeBadgeText: {
    color: "#15803D",
    
    fontSize: 12,

    lineHeight: 14,

  },
});
