import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { AppError, http } from "../network";
import { getPartyData } from "./partyService";
import { AuthStatus, BootstrapTarget, User } from "./types";

const USER_KEY = "@auth_user";
const TOKEN_KEY = "auth_token";

interface AuthContextValue {
  status: AuthStatus;
  user: User | null;

  updateUser: (updates: Partial<User>) => Promise<void>;

  signInWithPhone: (
    phone: string,
    name: string,
    email?: string,
  ) => Promise<void>;

  setAccessToken: (token: string) => Promise<void>;

  completeLogin: (phone: string) => Promise<{
    isExistingUser: boolean;
    party?: User;
  }>;

  signOut: () => Promise<void>;

  requireAuth: (action: () => void) => void;

  resolveBootstrapTarget: () => BootstrapTarget;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [status, setStatus] = useState<AuthStatus>("loading");

  const [user, setUser] = useState<User | null>(null);

  const tokenRef = useRef<string | null>(null);

  // --------------------------------------------------
  // RESTORE SESSION
  // --------------------------------------------------

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const [savedUser, savedToken] = await Promise.all([
          AsyncStorage.getItem(USER_KEY), // user → AsyncStorage
          SecureStore.getItemAsync(TOKEN_KEY), // token → SecureStore (encrypted)
        ]);

        tokenRef.current = savedToken;

        if (savedUser && savedToken) {
          setUser(JSON.parse(savedUser) as User);
          setStatus("authenticated");
        } else {
          tokenRef.current = null;
          setUser(null);
          setStatus("guest");
        }
      } catch {
        tokenRef.current = null;
        setUser(null);
        setStatus("guest");
      }
    };

    void restoreSession();
  }, []);

  // --------------------------------------------------
  // HTTP AUTH CONFIGURATION
  // --------------------------------------------------

  useEffect(() => {
    http.setTokenGetter(() => tokenRef.current);

    /*
     * Backend refresh endpoint is not available yet.
     *
     * Do NOT generate a fake JWT.
     *
     * Once backend authentication is implemented,
     * replace this with the real refresh endpoint.
     */
    http.setRefreshHandlers(
      async () => {
        return null;
      },

      () => {
        tokenRef.current = null;

        void AsyncStorage.removeItem(USER_KEY);
        void SecureStore.deleteItemAsync(TOKEN_KEY);

        setUser(null);
        setStatus("guest");
      },
    );
  }, []);

  // --------------------------------------------------
  // COMPLETE LOGIN
  // --------------------------------------------------

  const signInWithPhone = async (
    phone: string,
    name: string,
    email?: string,
  ) => {
    const user: User = {
      id: phone,
      phone,
      name,
      email: email?.trim() || undefined,
    };

    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

    setUser(user);
    setStatus("authenticated");
  };
  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------
  const updateUser = async (updates: Partial<User>) => {
    if (!user) {
      return;
    }

    const updatedUser: User = {
      ...user,
      ...updates,
    };

    await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));

    setUser(updatedUser);
  };
  const signOut = async () => {
    tokenRef.current = null;

    await AsyncStorage.removeItem(USER_KEY);
    await SecureStore.deleteItemAsync(TOKEN_KEY);

    setUser(null);
    setStatus("guest");
  };

  // --------------------------------------------------
  // PROTECTED ACTION
  // --------------------------------------------------

  const requireAuth = (action: () => void) => {
    if (status === "authenticated") {
      action();
      return;
    }

    router.push("/login");
  };

  // --------------------------------------------------
  // BOOTSTRAP
  // --------------------------------------------------

  const resolveBootstrapTarget = (): BootstrapTarget => {
    if (status === "authenticated") {
      return "dashboard";
    }

    return "login";
  };
  const setAccessToken = async (token: string) => {
    const accessToken = token.trim();

    if (!accessToken) {
      throw new Error("Access token is empty");
    }

    tokenRef.current = accessToken;

    await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
  };
  const completeLogin = async (
    phone: string,
  ): Promise<{
    isExistingUser: boolean;
    party?: User;
  }> => {
    const normalizedPhone = phone.replace(/\D/g, "");

    if (!normalizedPhone) {
      throw new Error("Mobile number is missing");
    }

    try {
     

      const party = await getPartyData(normalizedPhone);

   

      const user: User = {
        id: String(party.id),
        phone: party.mobileNo,
        name: party.name,
        email: party.eMail ?? party.email ?? undefined,
      };

      

      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

      setUser(user);
      setStatus("authenticated");

      return {
        isExistingUser: true,
        party: user,
      };
    } catch (error) {
      if (error instanceof AppError && error.status === 404) {
   

        return {
          isExistingUser: false,
        };
      }

      throw error;
    }
  };
  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      updateUser,
      signInWithPhone,
      setAccessToken,
      completeLogin,
      signOut,
      requireAuth,
      resolveBootstrapTarget,
    }),
    [status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
}
