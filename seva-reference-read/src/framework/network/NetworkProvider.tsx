import NetInfo from "@react-native-community/netinfo";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface NetworkContextType {
  isConnected: boolean;
  isChecking: boolean;
  checkConnection: () => Promise<void>;
}

const NetworkContext = createContext<NetworkContextType | undefined>(
  undefined
);

interface NetworkProviderProps {
  children: React.ReactNode;
}

export function NetworkProvider({
  children,
}: NetworkProviderProps) {
  const [isConnected, setIsConnected] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  /**
   * Manually check the actual internet connection.
   * Used when the user presses "Try Again".
   */
  const checkConnection = useCallback(async () => {
    setIsChecking(true);

    try {
      const state = await NetInfo.fetch();

      const connected =
        state.isConnected === true &&
        state.isInternetReachable !== false;

      setIsConnected(connected);
    } catch (error) {
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    /**
     * Listen continuously for network changes.
     *
     * isConnected is used here because we want the
     * OfflineScreen to react immediately when the
     * device loses its network connection.
     */
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected === false) {
        // Network connection is definitely gone.
        setIsConnected(false);
        setIsChecking(false);
        return;
      }

      if (state.isConnected === true) {
        // Network connection exists.
        // Do not wait for isInternetReachable here.
        setIsConnected(true);
        setIsChecking(false);
      }
    });

    /**
     * Perform the initial connection check.
     */
    checkConnection();

    return unsubscribe;
  }, [checkConnection]);

  return (
    <NetworkContext.Provider
      value={{
        isConnected,
        isChecking,
        checkConnection,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);

  if (!context) {
    throw new Error(
      "useNetwork must be used inside NetworkProvider"
    );
  }

  return context;
}