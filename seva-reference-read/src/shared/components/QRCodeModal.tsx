
import { Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";
import { router } from "expo-router";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import QRCode from "react-native-qrcode-svg";

export interface SevaRecord {
  sevaId: string;
  devoteeName: string;
  templeName: string;
  sevaName: string;
  bookingId: string;
  qrCodeText: string;
  amount: number;
  status: "active" | "received";
  sevaDate?: string;
  slotName?: string | null;
}

interface QRCodeModalProps {
  visible: boolean;
  onClose: () => void;
  selectedSeva: SevaRecord | null;
  sevaRecords: SevaRecord[];
}

interface QRCodeRef {
  toDataURL: (callback: (data: string) => void) => void;
}

// FORMAT DATE WITHOUT CHANGING THE CALENDAR DAY
function formatSevaDate(date: string): string {
  if (!date?.trim()) return "";

  const match = date.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (match) {
    const [, year, month, day] = match;
    const parsed = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
    );

    if (
      parsed.getFullYear() !== Number(year) ||
      parsed.getMonth() !== Number(month) - 1 ||
      parsed.getDate() !== Number(day)
    ) {
      return date;
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function QRCodeModal({
  visible,
  onClose,
  selectedSeva,
  sevaRecords,
}: QRCodeModalProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { width: screenWidth } = useWindowDimensions();

  const colors = theme.colors;
  const modalWidth = Math.min(screenWidth * 0.88, 420);
  const QR_CARD_WIDTH = Math.min(300, modalWidth - 32);
  const CARD_WIDTH = QR_CARD_WIDTH + 16;
  const QR_SIZE = Math.min(200, QR_CARD_WIDTH - 60);
  const QR_CONTAINER_SIZE = QR_SIZE + 28;
  const accentColor = colors.accent;

  const records = useMemo(() => sevaRecords, [sevaRecords]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [qrBase64, setQrBase64] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const qrRefs = useRef<Record<string, QRCodeRef | null>>({});
  const scrollRef = useRef<ScrollView>(null);
  const currentSeva = records[currentIndex];

  const currentSevaRef = useRef<SevaRecord | undefined>(currentSeva);
  currentSevaRef.current = currentSeva;

  // OPEN MY SEVAS WITH THE SELECTED QR BOOKING
  const handleQRCodePress = useCallback(
    (seva: SevaRecord) => {
      if (!seva.sevaId && !seva.bookingId) {
        console.warn(
          "Cannot navigate: booking identifiers are missing.",
        );
        return;
      }

      onClose();

      router.push({
        pathname: "/mysevas",
        params: {
          sevaId: String(seva.sevaId ?? ""),
          bookingId: String(seva.bookingId ?? ""),
          qrFocus: "true",
        },
      });
    },
    [onClose],
  );

  // SELECT INITIAL RECORD WHEN MODAL OPENS
  useEffect(() => {
    if (!visible) return;

    setQrBase64(null);
    setIsSharing(false);

    if (records.length === 0) {
      setCurrentIndex(0);
      return;
    }

    const selectedIndex = selectedSeva
      ? records.findIndex(
          (seva) => seva.sevaId === selectedSeva.sevaId,
        )
      : -1;

    const initialIndex = selectedIndex >= 0 ? selectedIndex : 0;
    setCurrentIndex(initialIndex);

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        x: initialIndex * CARD_WIDTH,
        animated: false,
      });
    });
  }, [visible, selectedSeva, records, CARD_WIDTH]);

  // RESET WHEN MODAL CLOSES
  useEffect(() => {
    if (!visible) {
      setQrBase64(null);
      setIsSharing(false);
    }
  }, [visible]);

  // CAPTURE QR IMAGE FOR SHARING
  const captureQR = useCallback(
    (sevaId: string) => {
      const seva = records.find(
        (record) => record.sevaId === sevaId,
      );

      if (
        !seva ||
        seva.status !== "active" ||
        !seva.qrCodeText
      ) {
        setQrBase64(null);
        return;
      }

      const qrRef = qrRefs.current[sevaId];

      if (!qrRef) return;

      qrRef.toDataURL((data) => {
        const latestSeva = currentSevaRef.current;

        if (
          latestSeva?.sevaId !== sevaId ||
          latestSeva.status !== "active" ||
          latestSeva.qrCodeText !== seva.qrCodeText
        ) {
          return;
        }

        setQrBase64(data);
      });
    },
    [records],
  );

  // HANDLE HORIZONTAL SCROLLING
  const handleScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    if (records.length === 0) return;

    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / CARD_WIDTH);

    const safeIndex = Math.max(
      0,
      Math.min(index, records.length - 1),
    );

    const nextSeva = records[safeIndex];

    if (!nextSeva) return;

    if (safeIndex !== currentIndex) {
      setCurrentIndex(safeIndex);
      setQrBase64(null);
    }

    if (
      nextSeva.status === "active" &&
      nextSeva.qrCodeText
    ) {
      setTimeout(() => {
        captureQR(nextSeva.sevaId);
      }, 50);
    } else {
      setQrBase64(null);
    }
  };

  // SHARE ACTIVE QR CODE ONLY
  const handleShareQR = async () => {
    const seva = currentSevaRef.current;

    if (
      !seva ||
      seva.status !== "active" ||
      !seva.qrCodeText ||
      isSharing
    ) {
      return;
    }

    if (!qrBase64) {
      captureQR(seva.sevaId);
      return;
    }

    try {
      setIsSharing(true);

      if (!FileSystem.cacheDirectory) {
        throw new Error(
          "FileSystem cache directory is unavailable.",
        );
      }

      const safeBookingId = seva.bookingId.replace(
        /[^a-zA-Z0-9_-]/g,
        "_",
      );

      const fileUri =
        FileSystem.cacheDirectory +
        `${safeBookingId}-qr.png`;

      await FileSystem.writeAsStringAsync(fileUri, qrBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const canShare = await Sharing.isAvailableAsync();

      if (!canShare) {
        console.warn("Sharing is not available on this device.");
        return;
      }

      await Sharing.shareAsync(fileUri, {
        mimeType: "image/png",
        dialogTitle: t("qrModal.shareSevaQrCode"),
        UTI: "public.png",
      });
    } catch (error) {
      console.error(t("qrModal.shareError"), error);
    } finally {
      setIsSharing(false);
    }
  };

  if (!visible || records.length === 0) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />

        <View
          style={[
            styles.modalContainer,
            {
              width: modalWidth,
              backgroundColor: colors.page,
            },
          ]}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <Pressable
              onPress={onClose}
              style={[
                styles.closeButton,
                { backgroundColor: colors.page },
              ]}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Close QR codes"
            >
              <Text
                style={[
                  styles.closeText,
                  { color: accentColor },
                ]}
              >
                ×
              </Text>
            </Pressable>
          </View>

          {/* HORIZONTAL QR LIST */}
          <ScrollView
            horizontal
            ref={scrollRef}
            style={[
              styles.horizontalViewport,
              { width: CARD_WIDTH },
            ]}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
            nestedScrollEnabled
            directionalLockEnabled
            onScroll={handleScroll}
            scrollEventThrottle={16}
            snapToInterval={CARD_WIDTH}
            snapToAlignment="start"
            decelerationRate="fast"
          >
            {records.map((seva) => {
              const isActive = seva.status === "active";

              return (
                <View
                  key={seva.sevaId}
                  style={[
                    styles.qrSection,
                    { width: CARD_WIDTH },
                  ]}
                >
                  <View
                    style={[
                      styles.qrCard,
                      {
                        width: QR_CARD_WIDTH,
                        backgroundColor: isActive
                          ? accentColor
                          : "#E5E7EB",
                      },
                    ]}
                  >
                    {/* ACTIVE BADGE */}
                    {isActive ? (
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: "#FFFFFF" },
                        ]}
                      >
                        <View
                          style={[
                            styles.statusDot,
                            { backgroundColor: "#16A34A" },
                          ]}
                        />
                        <Text
                          style={[
                            styles.statusText,
                            { color: "#16A34A" },
                          ]}
                        >
                          {t("qrModal.active")}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.statusBadgeSpacer} />
                    )}

                    {/* CLICKABLE QR CODE */}
                    <Pressable
                      onPress={() => handleQRCodePress(seva)}
                      accessibilityRole="button"
                      accessibilityLabel={`Open My Sevas for booking ${seva.bookingId}`}
                      style={({ pressed }) => [
                        styles.qrContainer,
                        {
                          width: QR_CONTAINER_SIZE,
                          height: QR_CONTAINER_SIZE,
                          backgroundColor: "#FFFFFF",
                          opacity: pressed ? 0.85 : 1,
                        },
                      ]}
                    >
                      {seva.qrCodeText ? (
                        <QRCode
                          value={String(seva.qrCodeText)}
                          size={QR_SIZE}
                          backgroundColor="#FFFFFF"
                          color={isActive ? accentColor : "#D1D5DB"}
                          quietZone={8}
                          getRef={(ref) => {
                            qrRefs.current[seva.sevaId] =
                              ref as QRCodeRef | null;

                            if (
                              isActive &&
                              ref &&
                              seva.sevaId ===
                                currentSevaRef.current?.sevaId
                            ) {
                              setTimeout(() => {
                                captureQR(seva.sevaId);
                              }, 50);
                            }
                          }}
                        />
                      ) : (
                        <Text style={styles.missingQrText}>
                          {t("qrModal.qrUnavailable")}
                        </Text>
                      )}

                      {!isActive && (
                        <View
                          pointerEvents="none"
                          style={styles.receivedQrOverlay}
                        >
                          <View style={styles.receivedQrWatermark}>
                            <Text
                              style={styles.receivedQrWatermarkText}
                            >
                              {t("qrModal.received")}
                            </Text>
                          </View>
                        </View>
                      )}
                    </Pressable>

                    {/* BOOKING ID */}
                    <Text
                      style={[
                        styles.bookingId,
                        {
                          color: isActive ? "#FFFFFF" : "#374151",
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {`#${String(seva.bookingId).replace(/^#/, "")}`}
                    </Text>

                    {/* SHARE BUTTON — ACTIVE ONLY */}
                    {isActive && (
                      <Pressable
                        onPress={handleShareQR}
                        disabled={isSharing}
                        accessibilityRole="button"
                        accessibilityLabel="Share QR code"
                        style={({ pressed }) => [
                          styles.shareButton,
                          {
                            opacity: isSharing
                              ? 0.6
                              : pressed
                                ? 0.8
                                : 1,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.shareIcon,
                            { color: accentColor },
                          ]}
                        >
                          ↗
                        </Text>

                        <Text
                          style={[
                            styles.shareButtonText,
                            { color: accentColor },
                          ]}
                        >
                          {isSharing
                            ? t("qrModal.preparing")
                            : t("qrModal.shareQrCode")}
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* PAGINATION */}
          {records.length > 1 && (
            <View style={styles.pagination}>
              {records.map((seva, index) => {
                const isCurrentDot = index === currentIndex;

                return (
                  <View
                    key={`${seva.sevaId}-${index}`}
                    style={[
                      styles.paginationDot,
                      {
                        backgroundColor: isCurrentDot
                          ? seva.status === "active"
                            ? accentColor
                            : "#9CA3AF"
                          : colors.textMuted,
                      },
                    ]}
                  />
                );
              })}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    maxWidth: 420,
    maxHeight: "82%",
    borderRadius: 24,
    overflow: "hidden",
    paddingBottom: 12,
    flexShrink: 1,
  },

  header: {
    width: "100%",
    height: 60,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingHorizontal: 12,
  },

  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  closeText: {
    fontSize: 30,
    fontWeight: "400",
    lineHeight: 34,
  },

  horizontalViewport: {
    alignSelf: "center",
    flexGrow: 0,
    flexShrink: 0,
  },

  horizontalScrollContent: {
    alignItems: "center",
    paddingHorizontal: 0,
    paddingBottom: 8,
  },

  qrSection: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  qrCard: {
    minHeight: 450,
    borderRadius: 24,
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
    height: 32,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 14,
  },

  statusBadgeSpacer: {
    height: 46,
    width: 120,
    marginBottom: 14,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 7,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.7,
  },

  qrContainer: {
    borderRadius: 18,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    position: "relative",
    overflow: "hidden",
  },

  missingQrText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },

  receivedQrOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(229, 231, 235, 0.18)",
    borderRadius: 18,
  },

  receivedQrWatermark: {
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 3,
    borderColor: "rgba(185, 28, 28, 0.55)",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    transform: [{ rotate: "-25deg" }],
    zIndex: 10,
    elevation: 10,
  },

  receivedQrWatermarkText: {
    color: "rgba(185, 28, 28, 0.65)",
    fontSize: 25,
    fontWeight: "900",
    letterSpacing: 2,
    textAlign: "center",
  },

  bookingId: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    maxWidth: "95%",
  },

  shareButton: {
    height: 42,
    minWidth: 170,
    paddingHorizontal: 20,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 12,
    backgroundColor: "#FFFFFF",
  },

  shareIcon: {
    fontSize: 19,
    fontWeight: "700",
    marginRight: 7,
  },

  shareButtonText: {
    fontSize: 13,
    fontWeight: "700",
  },

  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    paddingBottom: 4,
  },

  paginationDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
