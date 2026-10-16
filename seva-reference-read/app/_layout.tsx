import "@/src/framework/localization/i18n";
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { BottomSheetProvider } from "@/src/features/cart/provider/BottomSheetProvider";

import AnimatedSplash from "@/src/features/splash/AnimatedSplash";

import {
  SplashProvider,
  useSplash,
} from "@/src/features/splash/SplashProvider";

import { AppProviders } from "@/src/framework/providers/AppProviders";

import { NetworkProvider } from "@/src/framework/network/NetworkProvider";

import NetworkGate from "@/src/framework/network/NetworkGate";

import { useTenantSync } from "@/src/shared/temple/useTenantSync";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  useTenantSync();

  useEffect(() => {
    if (fontsLoaded) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SplashProvider>
        <RootContent />
      </SplashProvider>
    </GestureHandlerRootView>
  );
}

function RootContent() {
  const [showSplash, setShowSplash] = useState(true);

  const { setSplashFinished } = useSplash();

  const handleSplashFinish = () => {
    setSplashFinished(true);
    setShowSplash(false);
  };

  return (
    <>
      <AppProviders>
        <NetworkProvider>
          <NetworkGate>
            <BottomSheetProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="(tabs)" />
              </Stack>
            </BottomSheetProvider>
          </NetworkGate>
        </NetworkProvider>
      </AppProviders>

      {showSplash && <AnimatedSplash onFinish={handleSplashFinish} />}
    </>
  );
}
