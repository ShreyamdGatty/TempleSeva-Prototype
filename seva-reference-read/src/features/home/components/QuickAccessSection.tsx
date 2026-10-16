
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

import { useAuth } from "@/src/framework/auth";
import { Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";

import { getMySevas } from "@/src/features/mySevas/services/mySevas.service";
import type { POSTranListItem } from "@/src/features/mySevas/types/mySevas.types";

import QRCodeModal, {
  type SevaRecord,
} from "@/src/shared/components/QRCodeModal";

import { useTempleStore } from "@/src/shared/temple/templeStore";
import { quickActions } from "../data/quickActions";
import QuickActionCard from "./QuickActionCard";

export default function QuickAccessSection() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { t } = useTranslation();

  const selectedTemple = useTempleStore((state) => state.selected);

  const [transactions, setTransactions] = useState<POSTranListItem[]>([]);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [selectedSeva, setSelectedSeva] = useState<SevaRecord | null>(null);

  const loadBookings = useCallback(async () => {
    if (!user?.id || !selectedTemple?.id) {
      setTransactions([]);
      return [];
    }

    try {
      const response = await getMySevas({
        LastId: "",
        PageSize: 10,
        IsCountNeed: true,
        ExtPartyId: user.id,
      });

      const items = response.posTranListItems ?? [];

      setTransactions(items);

      return items;
    } catch (error) {
      console.error(
        "[QuickAccessSection] Failed to load bookings:",
        error,
      );

      return [];
    }
  }, [user?.id, selectedTemple?.id]);

  useFocusEffect(
    useCallback(() => {
      void loadBookings();
    }, [loadBookings]),
  );

  const sevaRecords: SevaRecord[] = useMemo(
    () =>
      [...transactions]
        .filter(
          (transaction) =>
            transaction.paymentStatus === 1 &&
            !!transaction.qrCodeText,
        )
        .sort(
          (a, b) =>
            new Date(b.dt).getTime() - new Date(a.dt).getTime(),
        )
        .map((transaction) => {
          const firstSeva = transaction.posTranDetItems?.[0];

          return {
            sevaId: transaction.id,
            devoteeName: firstSeva?.devoteeName ?? "",
            templeName: selectedTemple?.orgName ?? "",
            sevaName:
              firstSeva?.sevaName ?? t("quickAccess.sevaBooking"),
            bookingId: transaction.billNo,
            qrCodeText: transaction.qrCodeText,
            amount: transaction.entryNetAmt,
            status:
              transaction.orderStatus === 0 ? "active" : "received",
          };
        }),
    [transactions, selectedTemple?.orgName, t],
  );

  const activeSeva = sevaRecords[0] ?? null;

  const actionColors = {
    accent: theme.colors.accent,
    info: theme.colors.textPrimary,
    error: theme.colors.error,
    success: theme.colors.accent,
  };

  const handleQRPress = async (seva: SevaRecord) => {
    const latestTransactions = await loadBookings();

    const latestSevas: SevaRecord[] = [...latestTransactions]
      .filter(
        (transaction) =>
          transaction.paymentStatus === 1 &&
          !!transaction.qrCodeText,
      )
      .sort(
        (a, b) =>
          new Date(b.dt).getTime() - new Date(a.dt).getTime(),
      )
      .map((transaction) => {
        const firstSeva = transaction.posTranDetItems?.[0];

        return {
          sevaId: transaction.id,
          devoteeName: firstSeva?.devoteeName ?? "",
          templeName: selectedTemple?.orgName ?? "",
          sevaName:
            firstSeva?.sevaName ?? t("quickAccess.sevaBooking"),
          bookingId: transaction.billNo,
          qrCodeText: transaction.qrCodeText,
          amount: transaction.entryNetAmt,
          status:
            transaction.orderStatus === 0 ? "active" : "received",
        };
      });

    setSelectedSeva(latestSevas[0] ?? seva);
    setQrModalVisible(true);
  };

  const handleCloseQR = () => {
    setQrModalVisible(false);
    setSelectedSeva(null);
  };

  return (
    <>
      <View style={styles.container}>
        {/* QR CARD: PAID STATE OR FIRST-TIME EMPTY STATE */}
        <View
          style={[
            styles.qrCard,
            {
              // Keep the original card color after payment.
              // Use the app page color before a QR code is available.
              backgroundColor: activeSeva
                ? "#f0e6e3"
                : theme.colors.page,
              borderColor: activeSeva
                ? "#E1F2E7"
                : `${theme.colors.accent}30`,
              minHeight: activeSeva ? 180 : 190,
            },
            !activeSeva && styles.emptyCard,
          ]}
        >
          {activeSeva ? (
            <>
              {/* EXISTING PAID QR CARD */}
              <View style={styles.qrContent}>
                <View style={styles.qrTitleRow}>
                  <View
                    style={[
                      styles.qrIconContainer,
                      {
                        backgroundColor: `${theme.colors.accent}18`,
                      },
                    ]}
                  >
                    <Ionicons
                      name="qr-code-outline"
                      size={23}
                      color={theme.colors.accent}
                    />
                  </View>

                  <View style={styles.qrTitleContent}>
                    <Text
                      style={[
                        styles.qrTitle,
                        { color: theme.colors.textPrimary },
                      ]}
                    >
                      {t("quickAccess.myQrCode")}
                    </Text>

                    <Text
                      style={[
                        styles.qrSubtitle,
                        { color: theme.colors.textSecondary },
                      ]}
                    >
                      {t("quickAccess.scanQrCode")}
                      {"\n"}
                      {t("quickAccess.receiveSevas")}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.activeBadge,
                    {
                      backgroundColor: `${theme.colors.accent}18`,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.activeDot,
                      { backgroundColor: theme.colors.success },
                    ]}
                  />

                  <Text
                    style={[
                      styles.activeText,
                      { color: theme.colors.success },
                    ]}
                  >
                    {activeSeva.status === "active"
                      ? t("quickAccess.active")
                      : t("quickAccess.received", {
                          defaultValue: "Received",
                        })}
                  </Text>
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.viewQRButton,
                    {
                      backgroundColor: theme.colors.accent,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                  onPress={() => {
                    void handleQRPress(activeSeva);
                  }}
                  accessibilityRole="button"
                >
                  <Ionicons
                    name="scan-outline"
                    size={18}
                    color="#FFFFFF"
                  />

                  <Text style={styles.viewQRText}>
                    {t("quickAccess.viewShareQrCode")}
                  </Text>

                  <Ionicons
                    name="chevron-forward"
                    size={17}
                    color="#FFFFFF"
                  />
                </Pressable>
              </View>

              {/* QR PREVIEW */}
              <Pressable
                style={styles.qrPreviewWrapper}
                onPress={() => {
                  void handleQRPress(activeSeva);
                }}
                accessibilityRole="button"
                accessibilityLabel={t("quickAccess.viewShareQrCode")}
              >
                <View style={styles.qrPreview}>
                  <QRCode
                    value={activeSeva.qrCodeText}
                    size={100}
                    backgroundColor="#FFFFFF"
                    color="#000000"
                  />
                </View>
              </Pressable>
            </>
          ) : (
            <>
              {/* FIRST-TIME USER EMPTY STATE */}
              <View style={styles.emptyIconContainer}>
                <Ionicons
                  name="calendar-outline"
                  size={38}
                  color={theme.colors.accent}
                />

                <View
                  style={[
                    styles.calendarCheckBadge,
                    { backgroundColor: theme.colors.page },
                  ]}
                >
                  <Ionicons
                    name="checkmark"
                    size={15}
                    color={theme.colors.accent}
                  />
                </View>
              </View>

              <Text
                style={[
                  styles.emptyDescription,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {t("quickAccess.emptyDescription")}
              
              </Text>

              <Pressable
                style={({ pressed }) => [
                  styles.exploreButton,
                  {
                    backgroundColor: theme.colors.accent,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
                onPress={() => router.push("/sevas")}
                accessibilityRole="button"
              >
                <Text style={styles.exploreButtonText}>
                  {t("quickAccess.exploreSevas", {
                    defaultValue: "Explore Sevas",
                  })}
                </Text>
              </Pressable>
            </>
          )}
        </View>

        {/* OTHER QUICK ACCESS CARDS */}
        <View style={styles.grid}>
          {quickActions
            .filter((item) => item.type !== "qr")
            .map((item) => {
              const Icon = item.icon;
              const color = actionColors[item.color];

              return (
                <QuickActionCard
                  key={item.id}
                  title={item.title}
                  subtitle={item.subtitle}
                  icon={
                    <View
                      style={[
                        styles.iconBackground,
                        { backgroundColor: `${color}20` },
                      ]}
                    >
                      <Icon size={20} color={color} />
                    </View>
                  }
                  onPress={() => {
                    if (item.route) {
                      router.push(item.route);
                    }
                  }}
                />
              );
            })}
        </View>
      </View>

      {/* QR CODE MODAL */}
      <QRCodeModal
        visible={qrModalVisible}
        onClose={handleCloseQR}
        selectedSeva={selectedSeva ?? activeSeva}
        sevaRecords={sevaRecords}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
  },

  // Shared outer card. Background and border colors are state-dependent.
  qrCard: {
    minHeight: 180,
    flexDirection: "row",
    borderRadius: 20,
    paddingVertical: 15,
    paddingLeft: 15,
    paddingRight: 12,
    borderWidth: 1,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  // First-time user layout
  emptyCard: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },

  emptyIconContainer: {
    width: 48,
    height: 43,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 7,
  },

  calendarCheckBadge: {
    position: "absolute",
    right: -2,
    bottom: 0,
    borderRadius: 10,
  },

  emptyDescription: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 10,
  },

  exploreButton: {
    minHeight: 46,
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },

  exploreButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    lineHeight: 22,
    fontWeight: "700",
  },

  // Paid QR card content
  qrContent: {
    flex: 1,
    paddingRight: 8,
  },

  qrTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  qrIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 9,
  },

  qrTitleContent: {
    flex: 1,
  },

  qrTitle: {
    fontSize: 17,
    fontWeight: "700",
  },

  qrSubtitle: {
    marginTop: 3,
    fontSize: 11.5,
    lineHeight: 16,
  },

  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },

  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 7,
    marginRight: 5,
  },

  activeText: {
    fontSize: 10.5,
    fontWeight: "600",
  },

  viewQRButton: {
    minHeight: 40,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginTop: 12,
    alignSelf: "flex-start",
  },

  viewQRText: {
    color: "#FFFFFF",
    fontSize: 11.5,
    fontWeight: "600",
    marginHorizontal: 6,
  },

  qrPreviewWrapper: {
    width: 126,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 32,
  },

  qrPreview: {
    width: 116,
    height: 116,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E3EEE7",
  },

  // Other quick access cards
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  iconBackground: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
