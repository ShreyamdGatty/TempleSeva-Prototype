import { Screen } from "@/src/framework/components";

import { useTempleStore } from "@/src/shared/temple/templeStore";

import { useTheme } from "@/src/framework/theme";
import { router } from "expo-router";

import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BeforeTempleSection from "./components/BeforeTempleSection";
import HeroBanner from "./components/HeroBanner";
import HomeGreeting from "./components/HomeGreeting";
import QuickAccessSection from "./components/QuickAccessSection";
import RecentTempleCarousel from "./components/RecentTempleCarousel";
import SectionHeader from "./components/SectionHeader";

export default function HomeContent() {
   
    const { t } = useTranslation();
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
  const selectTemple = useTempleStore((s) => s.selectTemple);

  const selected = useTempleStore((s) => s.selected);

  const history = useTempleStore((s) => s.history);

  const openTempleSearch = useTempleStore((s) => s.openTempleSearch);
  const recentHistory = history.filter((temple) => temple.id !== selected?.id);

 return (
 <Screen
  scroll
  style={{ backgroundColor: theme.colors.page }}
  contentContainerStyle={{
    paddingBottom: insets.bottom + 100,
  }}
>
      {/* ================================= */}
      {/* Greeting */}
      {/* ================================= */}

      <HomeGreeting />

      {/* ================================= */}
      {/* Hero */}
      {/* ================================= */}

      <HeroBanner
        onSelectTemple={() => {
          openTempleSearch();
        }}
        onContinueBooking={() => {
          router.navigate("/sevas");
        }}
      />

      {/* ================================= */}
      {/* BEFORE TEMPLE SELECTION */}
      {/* ================================= */}

      {!selected && <BeforeTempleSection />}

      {/* ================================= */}
      {/* AFTER TEMPLE SELECTION */}
      {/* ================================= */}

      {selected && (
        <>
          {/* Quick Access */}

         <SectionHeader title={t("homeContent.quickAccess")} />

          <QuickAccessSection />

          {/* Recent Temples */}

          {recentHistory.length > 0 && (
            <>
              <SectionHeader title={t("homeContent.recentTemples")} />

              <RecentTempleCarousel
  history={recentHistory}
  onSelectTemple={(temple) => {
    selectTemple(temple);
  }}
/>
            </>
          )}
        </>
      )}
    </Screen>
  );
}
