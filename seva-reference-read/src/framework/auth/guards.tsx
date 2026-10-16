import { Redirect } from "expo-router";
import React from "react";
import { appConfig } from "../config";
import { useAuth } from "./AuthProvider";

// Blocks a screen unless the user is allowed to see it.
// 'required' mode: must be authenticated. 'optional'/'deferred': guests allowed.
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();

  if (status === "loading") return null;

  if (status === "guest" && appConfig.authMode === "required") {
    return <Redirect href="/login" />;
  }

  return <>{children}</>;
}

// For guest-only screens (login). Authenticated users get bounced to dashboard.
export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();

  if (status === "loading") return null;

  if (status === "authenticated") {
    return <Redirect href="/(tabs)" />;
  }

  return <>{children}</>;
}
