import { useBottomSheet } from "@/src/features/cart/provider/BottomSheetProvider";
import { Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";
import Header from "@/src/shared/components/AppHeader";
import { Tabs, usePathname } from "expo-router";
import { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs";
import {
  Flower,
  Home as HomeIcon,
  ReceiptText,
  User,
} from "lucide-react-native";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function AnimatedTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomOffset = insets.bottom > 30 ? insets.bottom : 1;
  const { theme } = useTheme();
  const { width } = useWindowDimensions();

  const TAB_BAR_WIDTH = width;
  const TAB_WIDTH = TAB_BAR_WIDTH / state.routes.length;

  const translateX = useSharedValue(state.index * TAB_WIDTH);

  useEffect(() => {
    translateX.value = withSpring(state.index * TAB_WIDTH, {
      damping: 18,
      stiffness: 180,
      mass: 0.8,
    });
  }, [state.index, TAB_WIDTH]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
    ],
  }));

  return (
    <View
      style={[
        styles.customTabBar,
        {
          width: TAB_BAR_WIDTH,
          bottom: bottomOffset,
          backgroundColor: theme.colors.page,
        },
      ]}
    >
      {/* Animated selection pill */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.animatedIndicator,
          {
            width: TAB_WIDTH - 10,
          },
          indicatorStyle,
        ]}
      />

      {state.routes.map((route, index) => {
        const descriptor = descriptors[route.key];

        if (!descriptor) {
          return null;
        }

        const { options } = descriptor;
        const isFocused = state.index === index;

        const color = isFocused ? "rgb(255, 107, 0)" : "#8E8E93";

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.customTabButton}
          >
            {options.tabBarIcon?.({
              focused: isFocused,
              color,
              size: 24,
            })}

            <Text
              style={[
                styles.tabLabel,
                {
                  color,
                  fontWeight: isFocused ? "600" : "400",
                },
              ]}
            >
              {options.title}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
export default function TabLayout() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { setFloatingCartVisible } = useBottomSheet();
  useEffect(() => {
    const shouldShowCart =
      pathname === "/" || pathname === "/sevas" || pathname === "/mysevas";

    setFloatingCartVisible(shouldShowCart);
  }, [pathname, setFloatingCartVisible]);
  return (
    <View style={{ flex: 1 }}>
      <Header />

      <View style={{ flex: 1 }}>
        <Tabs
          tabBar={(props) => <AnimatedTabBar {...props} />}
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: t("tabs.home"),
              tabBarIcon: ({ color, size }) => (
                <HomeIcon size={size} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="sevas"
            options={{
              title: t("tabs.sevas"),
              tabBarIcon: ({ color, size }) => (
                <Flower size={size} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="mysevas"
            options={{
              title: t("tabs.mySevas"),
              tabBarIcon: ({ color, size }) => (
                <ReceiptText size={size} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="profile"
            options={{
              title: t("tabs.profile"),
              tabBarIcon: ({ color, size }) => (
                <User size={size} color={color} />
              ),
            }}
          />
        </Tabs>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  customTabBar: {
    position: "absolute",

    left: 0,
    right: 0,

    height: 60,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#FFFFFF",

    borderRadius: 0,

    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",

    zIndex: 100,
    elevation: 10,
  },
  animatedIndicator: {
    position: "absolute",

    left: 5,

    height: 50,

    borderRadius: 26,

    backgroundColor: "#FFF0E6",
  },

  customTabButton: {
    flex: 1,

    height: 60,

    alignItems: "center",
    justifyContent: "center",

    zIndex: 2,
  },

  tabLabel: {
    marginTop: 2,

    fontSize: 11,
  },
});
