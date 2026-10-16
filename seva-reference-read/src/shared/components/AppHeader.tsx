import CartSummaryButton from "@/src/features/cart/components/CartSummaryButton";
import { useBottomSheet } from "@/src/features/cart/provider/BottomSheetProvider";
import { useAuth } from "@/src/framework/auth";
import { Avatar, Text } from "@/src/framework/components";
import TopSheet from "@/src/framework/components/TopSheet";
import { useTheme } from "@/src/framework/theme";
import {
  ProfilePreviousPath,
  useNavigationStore,
} from "@/src/shared/navigation/navigationStore";
import { useTempleStore } from "@/src/shared/temple/templeStore";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TempleSearchContent from "../temple-search/components/TempleSearchContent";
const GOD_NAMES = [
  "Shiva",
  "Parvathi",
  "Ganesha",
  "Hanuman",
  "Krishna",
  "Rama",
  "Murugan",
  "Lakshmi",
  "Durga",
  "Ayyappa",
];
function getPreviousPageIcon(path: string) {
  switch (path) {
    case "/sevas":
      return "flower-outline";

    case "/mysevas":
      return "receipt-outline";

    case "/":
      return "home-outline";

    default:
      return "arrow-back-outline";
  }
}

const Header = () => {
  const getProfilePreviousPath = (path: string): ProfilePreviousPath => {
    switch (path) {
      case "/sevas":
        return "/sevas";

      case "/mysevas":
        return "/mysevas";

      case "/":
        return "/";

      default:
        return "/";
    }
  };
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { openCart } = useBottomSheet();
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const setProfilePreviousPath = useNavigationStore(
    (state) => state.setProfilePreviousPath,
  );

  const profilePreviousPath = useNavigationStore(
    (state) => state.profilePreviousPath,
  );
  const selected = useTempleStore((s) => s.selected);
  const selectTemple = useTempleStore((s) => s.selectTemple);
  const [godIndex, setGodIndex] = useState(0);
  const openTempleSearchTrigger = useTempleStore(
    (s) => s.openTempleSearchTrigger,
  );
  useEffect(() => {
    if (openTempleSearchTrigger === 0) {
      return;
    }

    setSearchOpen(true);
  }, [openTempleSearchTrigger]);
  useEffect(() => {
    if (selected) {
      return;
    }

    const interval = setInterval(() => {
      setGodIndex((current) => (current + 1) % GOD_NAMES.length);
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [selected]);

  const selectedTempleName =
    selected?.orgName ?? `Try "${GOD_NAMES[godIndex]}"`;

  const selectedShrine = selected?.shrine ?? t("appHeader.chooseYourTemple");

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: insets.top - 10,
          height: 76 + insets.top,
          backgroundColor: theme.colors.page,
          borderBottomColor: theme.colors.border,
        },
      ]}
    >
      {/* -------------------------------- */}
      {/* Profile */}
      {/* -------------------------------- */}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (pathname === "/profile") {
            router.navigate(profilePreviousPath);
            return;
          }

          setProfilePreviousPath(getProfilePreviousPath(pathname));

          router.navigate("/profile");
        }}
        style={styles.profileButton}
      >
        <View
          style={[
            styles.profile,
            {
              backgroundColor: theme.colors.accent,
            },
          ]}
        >
          {pathname === "/profile" ? (
            <Ionicons
              name={getPreviousPageIcon(profilePreviousPath)}
              size={22}
              color={theme.colors.onAccent}
            />
          ) : (
            <Avatar name={user?.name} size={40} />
          )}
        </View>
      </TouchableOpacity>

      {/* -------------------------------- */}
      {/* Temple Selector */}
      {/* -------------------------------- */}

      <View style={styles.templeSelectorWrapper}>
        <TouchableOpacity
          activeOpacity={0.88}
          style={[
            styles.templeSelector,
            {
              backgroundColor: theme.colors.page,

              borderColor: theme.colors.border,

              shadowColor: theme.shadows.card.shadowColor,
            },
          ]}
          onPress={() => setSearchOpen(true)}
        >
          <View
            style={[
              styles.locationContainer,
              {
                backgroundColor: theme.colors.accentMuted,
              },
            ]}
          >
            <Ionicons name="location" size={18} color={theme.colors.accent} />
          </View>

          <View style={styles.templeInfo}>
            <View style={styles.templeTitleRow}>
              <Text
                numberOfLines={1}
                style={[
                  styles.templeText,
                  {
                    color: theme.colors.accent,
                  },
                ]}
              >
                {selectedTempleName}
              </Text>

              <Ionicons
                name="chevron-down"
                size={16}
                color={theme.colors.textSecondary}
              />
            </View>
          </View>

          <View
            style={[
              styles.searchIconContainer,
              {
                backgroundColor: theme.colors.accentMuted,
              },
            ]}
          >
            <Ionicons name="search" size={17} color={theme.colors.accent} />
          </View>
        </TouchableOpacity>
      </View>

      {/* -------------------------------- */}
      {/* Cart */}
      {/* -------------------------------- */}

      <CartSummaryButton variant="header" onPress={openCart} />

      {/* -------------------------------- */}
      {/* Temple Search Top Sheet */}
      {/* -------------------------------- */}

      <TopSheet visible={searchOpen} onClose={() => setSearchOpen(false)}>
        <TempleSearchContent
          visible={searchOpen}
          selectedTemple={selected?.orgName ?? ""}
          onClose={() => setSearchOpen(false)}
          onSelectTemple={(temple) => {
            selectTemple(temple);
            setSearchOpen(false);
          }}
        />
      </TopSheet>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    height: 76,

    paddingHorizontal: 16,

    flexDirection: "row",

    alignItems: "center",

    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  profileButton: {
    justifyContent: "center",

    alignItems: "center",
  },

  profile: {
    width: 40,

    height: 40,

    borderRadius: 20,

    justifyContent: "center",

    alignItems: "center",
  },

  templeSelectorWrapper: {
    flex: 1,

    minWidth: 0,

    height: 52,

    position: "relative",

    justifyContent: "center",

    // Gap between profile and temple selector
    marginLeft: 8,

    // Gap between temple selector and cart
    marginRight: 8,
  },

  templeSelector: {
    flex: 1,

    width: "100%",

    height: 52,

    marginHorizontal: 0,

    paddingHorizontal: 8,

    borderRadius: 18,

    borderWidth: 1,

    flexDirection: "row",

    alignItems: "center",

    shadowOffset: {
      width: 0,

      height: 1,
    },

    shadowOpacity: 0.05,

    shadowRadius: 3,

    elevation: 2,
  },

  locationContainer: {
    width: 36,

    height: 36,

    borderRadius: 12,

    justifyContent: "center",

    alignItems: "center",

    marginRight: 9,
  },

  templeInfo: {
    flex: 1,

    minWidth: 0,

    justifyContent: "center",
  },

  templeTitleRow: {
    flexDirection: "row",

    alignItems: "center",

    paddingRight: 4,
  },

  templeText: {
    flex: 1,

    fontSize: 12,

    fontFamily: "Roboto_700Bold",

    letterSpacing: -0.1,
  },

  searchIconContainer: {
    width: 34,

    height: 34,

    borderRadius: 12,

    justifyContent: "center",

    alignItems: "center",

    marginLeft: 6,
  },

  templeHighlight: {
    position: "absolute",

    top: 0,

    left: 0,

    right: 0,

    bottom: 0,

    borderWidth: 2,

    borderRadius: 18,

    zIndex: 20,
  },
});
