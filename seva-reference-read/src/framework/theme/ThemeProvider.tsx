import React, {
  createContext,
  useContext,
  useMemo
} from "react";
// import { useColorScheme } from "react-native";
import { lightTheme } from "./themes";
import { Theme, ThemeMode, ThemePreference } from "./types";

const STORAGE_KEY = "@theme_preference";

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode; // resolved: what's actually shown
  preference: ThemePreference; // user's choice
  toggleTheme: () => void;
  setPreference: (pref: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  // const [preference, setPreferenceState] = useState<ThemePreference>("system");
  // const [hydrated, setHydrated] = useState(false);

  // const preference: ThemePreference = "light";

  // Load saved preference once on mount
  // useEffect(() => {
  //   AsyncStorage.getItem(STORAGE_KEY)
  //     .then((saved) => {
  //       if (saved === "light" || saved === "dark" || saved === "system") {
  //         setPreferenceState(saved);
  //       }
  //     })
  //     .finally(() => setHydrated(true));
  // }, []);

  // Persist on change
  // const setPreference = (pref: ThemePreference) => {
  //   setPreferenceState(pref);
  //   AsyncStorage.setItem(STORAGE_KEY, pref);
  // };

  // Resolve preference → concrete mode
  // const mode: ThemeMode =
  //   preference === "system"
  //     ? systemScheme === "dark"
  //       ? "dark"
  //       : "light"
  //     : preference;

  const theme = lightTheme;
const mode: ThemeMode = "light";
const preference: ThemePreference = "light";

  // 
  
  const value = useMemo<ThemeContextValue>(
  () => ({
    theme,
    mode,
    preference,

    // Theme switching is disabled.
    toggleTheme: () => {},

    setPreference: () => {},
  }),
  [theme, mode, preference],
);

  // Avoid a light→dark flash before storage loads
  // if (!hydrated) return null;

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
