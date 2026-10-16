import { Theme, ThemeRadii, ThemeSpacing, ThemeTypography } from "./types";

const spacing: ThemeSpacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 22, xxl: 28 };
const radii: ThemeRadii = { control: 12, card: 16, pill: 999 };

const typography: ThemeTypography = {
  heading: { fontSize: 24, fontWeight: "500", letterSpacing: -0.48 },
  title: { fontSize: 20, fontWeight: "500", letterSpacing: -0.2 },
  body: { fontSize: 14, fontWeight: "400", letterSpacing: 0 },
  label: {
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
};

export const lightTheme: Theme = {
  mode: "light",
  spacing,
  radii,
  typography,
  colors: {
    accent: "#C1440E", // deep saffron-orange (primary — buttons, key actions)
    onAccent: "#FFF8F0", // warm off-white on accent
    accentMuted: "#FBEBDD", // faint saffron tint (selected chips, subtle bg)
    page: "#FBF7F0", // warm ivory background
    card: "#FFFFFF",
    textPrimary: "#030303", // warm near-black (brown-black)
    textSecondary: "#8A7A6D",
    textMuted: "#B9AA9C",
    border: "#EBE2D6",
    success: "#3F7A34", // sacred green
    onSuccess: "#FFFFFF",
    warning: "#C98A1E", // temple gold / amber
    onWarning: "#2B1D14",
    error: "#A5241C", // kumkum red
    onError: "#FFFFFF",
  },
  shadows: {
    card: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 2,
      elevation: 1,
    },
    raised: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
  },
};

export const darkTheme: Theme = {
  mode: "dark",
  spacing,
  radii,
  typography,
  colors: {
    accent: "#E8823C", // lighter saffron (readable on dark)
    onAccent: "#1A120C",
    accentMuted: "#33241A",
    page: "#161210", // warm near-black
    card: "#211A15",
    textPrimary: "#F5EDE2",
    textSecondary: "#A89A8C",
    textMuted: "#6E6055",
    border: "#332A22",
    success: "#6FBF5E",
    onSuccess: "#161210",
    warning: "#E0B24E",
    onWarning: "#161210",
    error: "#E5837C",
    onError: "#161210",
  },
  shadows: {
    card: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 1,
    },
    raised: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 14,
      elevation: 4,
    },
  },
};
