import {
  useOrderCount,
  useOrderTotal,
} from "@/src/features/checkout/store/orderStore";

import { Ionicons } from "@expo/vector-icons";

import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/src/framework/theme";

import { useEffect } from "react";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type CartSummaryVariant = "header" | "floating";

type Props = {
  onPress: () => void;
  variant?: CartSummaryVariant;
};

const SCREEN_WIDTH = Dimensions.get("window").width;

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export default function CartSummaryButton({
  onPress,
  variant = "header",
}: Props) {
  const { theme } = useTheme();

  const itemCount = useOrderCount();
  const totalAmount = useOrderTotal();

  const insets = useSafeAreaInsets();

  /*
   * ------------------------------------------------
   * Floating cart animation values
   * ------------------------------------------------
   */

  const translateY = useSharedValue(70);

  const opacity = useSharedValue(0);

  const scale = useSharedValue(0.96);

  /*
   * ------------------------------------------------
   * Animate floating cart when item count changes
   * ------------------------------------------------
   *
   * 0 → 1
   *     Cart smoothly appears.
   *
   * 1 → 2
   *     Cart stays visible and only content updates.
   *
   * 1 → 0
   *     Cart smoothly disappears.
   */

  useEffect(() => {
    if (itemCount > 0) {
      translateY.value = withSpring(0, {
        damping: 18,
        stiffness: 170,
        mass: 0.7,
      });

      opacity.value = withTiming(1, {
        duration: 220,
      });

      scale.value = withSpring(1, {
        damping: 18,
        stiffness: 170,
        mass: 0.7,
      });
    } else {
      translateY.value = withTiming(70, {
        duration: 250,
      });

      opacity.value = withTiming(0, {
        duration: 180,
      });

      scale.value = withTiming(0.96, {
        duration: 180,
      });
    }
  }, [itemCount, opacity, scale, translateY]);

  /*
   * ------------------------------------------------
   * Animated floating cart style
   * ------------------------------------------------
   */

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,

    transform: [
      {
        translateY: translateY.value,
      },
      {
        scale: scale.value,
      },
    ],
  }));

  /*
   * ------------------------------------------------
   * Header cart
   *
   * Keep this exactly as the normal header cart.
   * It does NOT use the floating animation.
   * ------------------------------------------------
   */

  if (variant === "header") {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[
          styles.headerButton,
          {
            backgroundColor: theme.colors.page,

            borderColor: theme.colors.border,
          },
        ]}
      >
        <Ionicons name="cart-outline" size={18} color={theme.colors.accent} />

        {itemCount > 0 && (
          <View
            style={[
              styles.headerBadge,
              {
                backgroundColor: theme.colors.error,
              },
            ]}
          >
            <Text style={styles.headerBadgeText}>
              {itemCount > 99 ? "99+" : itemCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  /*
   * ------------------------------------------------
   * Floating cart
   * ------------------------------------------------
   *
   * IMPORTANT:
   *
   * We don't return null when itemCount === 0.
   *
   * The animated view stays mounted and becomes
   * invisible through opacity/translateY.
   *
   * This allows the exit animation to complete.
   * ------------------------------------------------
   */

  const TAB_BAR_HEIGHT = 50;

  const FLOATING_CART_GAP = 15;

  return (
    <Animated.View
      pointerEvents={itemCount > 0 ? "auto" : "none"}
      style={[
        styles.floatingContainer,
        {
          bottom: insets.bottom + TAB_BAR_HEIGHT + FLOATING_CART_GAP,

          backgroundColor: theme.colors.accent,

          borderColor: theme.colors.border,
        },

        animatedStyle,
      ]}
    >
      <AnimatedTouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={styles.floatingContent}
      >
        {/* -------------------------------- */}
        {/* Cart Icon */}
        {/* -------------------------------- */}

        <View
          style={[
            styles.floatingIcon,
            {
              backgroundColor: theme.colors.accent,
            },
          ]}
        >
          <Ionicons name="cart" size={21} color={theme.colors.onAccent} />

          {/* -------------------------------- */}
          {/* Cart Badge */}
          {/* -------------------------------- */}

          <View
            style={[
              styles.floatingBadge,
              {
                backgroundColor: theme.colors.error,
              },
            ]}
          >
            <Text style={styles.floatingBadgeText}>
              {itemCount > 99 ? "99+" : itemCount}
            </Text>
          </View>
        </View>

        {/* -------------------------------- */}
        {/* Cart Information */}
        {/* -------------------------------- */}

        <View style={styles.floatingInfo}>
          <Text
            numberOfLines={1}
            style={[
              styles.itemsText,
              {
                color: theme.colors.onAccent,
              },
            ]}
          >
            {itemCount === 1 ? "1 Seva" : `${itemCount} Sevas`}
          </Text>

          <Text
            numberOfLines={1}
            style={[
              styles.price,
              {
                color: theme.colors.onAccent,
              },
            ]}
          >
            ₹ {totalAmount.toFixed(0)}
          </Text>
        </View>

        {/* -------------------------------- */}
        {/* Arrow */}
        {/* -------------------------------- */}

        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.colors.onAccent}
        />
      </AnimatedTouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  /*
   * =================================================
   * HEADER CART
   * =================================================
   */

  headerButton: {
    width: 44,
    height: 44,

    borderRadius: 15,

    borderWidth: 1,

    alignItems: "center",
    justifyContent: "center",

    position: "relative",

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 1,
    },

    shadowOpacity: 0.05,

    shadowRadius: 3,

    elevation: 2,
  },

  headerBadge: {
    position: "absolute",

    top: -5,
    right: -5,

    minWidth: 19,
    height: 19,

    paddingHorizontal: 4,

    borderRadius: 10,

    alignItems: "center",
    justifyContent: "center",
  },

  headerBadgeText: {
    color: "#FFFFFF",

    fontSize: 9,

    fontWeight: "800",
  },

  /*
   * =================================================
   * FLOATING CART
   * =================================================
   */

  floatingContainer: {
    position: "absolute",
    left: 27,
    width: SCREEN_WIDTH * 0.35,
    minWidth: 125,
    maxWidth: 170,
    height: 58,
    borderRadius: 28,

    borderWidth: 1,

    boxShadow: "-3px 3px 4px rgba(211, 102, 102, 0.7)",

    zIndex: 1000,
  },

  floatingContent: {
    flex: 1,

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 13,
  },

  /*
   * =================================================
   * FLOATING CART ICON
   * =================================================
   */

  floatingIcon: {
    width: 38,
    height: 38,

    borderRadius: 19,

    alignItems: "center",
    justifyContent: "center",

    position: "relative",
  },

  /*
   * =================================================
   * FLOATING CART BADGE
   * =================================================
   */

  floatingBadge: {
    position: "absolute",

    top: -5,
    right: -5,

    minWidth: 20,
    height: 20,

    borderRadius: 10,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 5,
  },

  floatingBadgeText: {
    color: "#FFFFFF",

    fontSize: 10,

    fontWeight: "800",
  },

  /*
   * =================================================
   * FLOATING CART TEXT
   * =================================================
   */

  floatingInfo: {
    flex: 1,

    minWidth: 0,

    marginLeft: 8,
  },

  itemsText: {
    fontSize: 9,

    fontWeight: "600",
  },

  price: {
    fontSize: 13,

    fontWeight: "800",

    marginTop: 1,
  },
});
