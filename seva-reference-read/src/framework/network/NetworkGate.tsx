import React from "react";

import {
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";

import OfflineScreen from "../../features/network/screens/OfflineScreen";

import { Text } from "../components/Text";

import { useNetwork } from "./NetworkProvider";

interface NetworkGateProps {
  children: React.ReactNode;
}

export default function NetworkGate({
  children,
}: NetworkGateProps) {
  const {
    isConnected,
    isChecking,
    checkConnection,
  } = useNetwork();

  /**
   * If the network is unavailable, show the OfflineScreen
   * immediately.
   *
   * This is checked BEFORE isChecking so that we don't
   * unnecessarily show "Checking internet connection..."
   * after the network has already been lost.
   */
  if (!isConnected) {
    return (
      <OfflineScreen
        onRetry={checkConnection}
        isChecking={isChecking}
      />
    );
  }

  /**
   * Only show the initial checking screen while the
   * connection status is being determined.
   */
  if (isChecking) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#E2840B"
        />

        <Text
          variant="body"
          color="textSecondary"
          style={styles.loadingText}
        >
          Checking internet connection...
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF8EE",
  },

  loadingText: {
    marginTop: 12,
  },
});