import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { queryClient } from "../query";

import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../auth";
import { DialogProvider, ToastProvider } from "../components";
import { NetworkProvider } from "../network/NetworkProvider";
import { ThemeProvider } from "../theme";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <ThemeProvider>
            <NetworkProvider>
          <ToastProvider>
            <DialogProvider>
              <AuthProvider>{children}</AuthProvider>
            </DialogProvider>
          </ToastProvider>
          </NetworkProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
