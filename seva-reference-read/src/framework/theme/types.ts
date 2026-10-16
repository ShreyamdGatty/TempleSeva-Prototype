export type ThemeMode = 'light' | 'dark';

export type ThemePreference = 'light' | 'dark' | 'system';


export interface ThemeColors {
  accent: string;          // near-black / off-white
  onAccent: string;        // text/icon on accent surfaces
  accentMuted: string;     // faint accent tint (selected chips, subtle bg)
  page: string;            // app background
  card: string;            // elevated surface
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  success: string;
  onSuccess: string;
  warning: string;
  onWarning: string;
  error: string;
  onError: string;         // text/icon on error surfaces (e.g. destructive buttons)
}

export interface ThemeSpacing {
  xs: number;   // 4
  sm: number;   // 8
  md: number;   // 12
  lg: number;   // 16
  xl: number;   // 22
  xxl: number;  // 28
}

export interface ThemeRadii {
  control: number;  // 11–12 (buttons, inputs)
  card: number;     // 14–16
  pill: number;     // fully rounded
}

export interface ThemeTypeStyle {
  fontSize: number;
  fontWeight: '400' | '500';
  letterSpacing: number;
  textTransform?: 'none' | 'uppercase';
}

export interface ThemeTypography {
  heading: ThemeTypeStyle;  // 24
  title: ThemeTypeStyle;    // 20
  body: ThemeTypeStyle;     // 13–14
  label: ThemeTypeStyle;    // 11 uppercase
}

export interface ThemeShadow {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;        // Android
}

export interface ThemeShadows {
  card: ThemeShadow;
  raised: ThemeShadow;
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  spacing: ThemeSpacing;
  radii: ThemeRadii;
  typography: ThemeTypography;
  shadows: ThemeShadows;
}
