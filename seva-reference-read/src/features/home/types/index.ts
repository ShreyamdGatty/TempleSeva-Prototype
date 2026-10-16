import { Href } from "expo-router";
import { LucideIcon } from "lucide-react-native";
export type QuickActionColor = "accent" | "info" | "error" | "success";
export type QuickActionType = "qr" | "route";

export interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: QuickActionColor;
  type?: QuickActionType;
  route?: Href;
}
