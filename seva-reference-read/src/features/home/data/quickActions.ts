import { QrCode } from "lucide-react-native";
import { QuickAction } from "../types";

export const quickActions: QuickAction[] = [
   {
     id: "qr",
    title: "My QR",
    subtitle: "Show QR Code",
    icon: QrCode,
    color: "accent",
    type: "qr",
  },
  // {
  //   id: "sevas",
  //   title: "Book Seva",
  //   subtitle: "Book Temple Sevas",
  //   icon: Flower,
  //   color: "accent",
  //   route: "/sevas",
  // },
  // {
  //   id: "gatepass",
  //   title: "Active Sevas",
  //   subtitle: "View Recent Sevas",
  //   icon: ReceiptText,
  //   color: "accent",
  //   route: "/mysevas",
  // },
  // {
  //   id: "hundi",
  //   title: "E-Hundi",
  //   subtitle: "Online Donation",
  //   icon: Landmark,
  //   color: "success",
  //   route: "/sevas",
  // },
  // {
  //   id: "history",
  //   title: "History",
  //   subtitle: "Your Bookings",
  //   icon: History,
  //   color: "accent",
  //   route: "/mysevas",
  // },
];
