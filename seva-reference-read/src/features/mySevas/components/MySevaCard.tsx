import { useMySevasRefreshStore } from "@/src/features/mySevas/store/mySevasRefreshStore";
import { Text, useToast } from "@/src/framework/components";
import { AppError } from "@/src/framework/network";
import { useTheme } from "@/src/framework/theme";
import { payForOrder } from "@/src/services/ccavenue.service";
import { Ionicons } from "@expo/vector-icons";
import { CalendarDays, Clock } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { cancelTransaction, retryPayment } from "../services/mySevas.service";
import { POSTranListItem } from "../types/mySevas.types";
type Props = {
  transaction: POSTranListItem;
  onViewQr: (transaction: POSTranListItem) => void;
};

// Monospace font gives the "printed receipt" feel
const MONO = Platform.select({
  ios: "Courier",
  android: "monospace",
  default: "monospace",
});

const TOOTH = 12; // width of one tear-off tooth

function formatTransactionDate(date: string, locale: string): string {
  if (!date) return "";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return date;
  return parsedDate.toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTransactionTime(date: string, locale: string): string {
  if (!date) return "";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "";
  return parsedDate.toLocaleTimeString(locale, {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatSevaDate(date: string, locale: string): string {
  if (!date) return "";
  const parts = date.split("-");
  if (parts.length !== 3) return date;
  const [year, month, day] = parts;
  const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
  if (Number.isNaN(parsedDate.getTime())) return date;
  return parsedDate.toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

// Dashed line like  - - - - - - - - -  (works on both iOS and Android)
function DottedDivider({
  color,
  style,
}: {
  color: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.dottedWrap, style]}>
      <View style={[styles.dottedLine, { borderColor: color }]} />
    </View>
  );
}

// Torn-paper zigzag edge at the bottom of the receipt.
// Triangles use the card colour, so no page background colour is needed.
function TearEdge({ color }: { color: string }) {
  const [width, setWidth] = useState(0);
  const count = Math.ceil(width / TOOTH);

  return (
    <View
      style={styles.tearWrap}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      <View style={styles.tearRow}>
        {Array.from({ length: count }).map((_, i) => (
          <View key={i} style={[styles.tearTooth, { borderTopColor: color }]} />
        ))}
      </View>
    </View>
  );
}

type PaymentTone = "success" | "failed" | "pending" | "refund" | "cancelled";

// const CANCELLED_STATUS: {
//   label: string;
//   tone: PaymentTone;
//   icon: keyof typeof Ionicons.glyphMap;
// } = { label: "Order Cancelled", tone: "cancelled", icon: "close-circle" };

function getPaymentStatus(
  status: number,
  t: (key: string) => string,
): {
  label: string;
  tone: PaymentTone;
  icon: keyof typeof Ionicons.glyphMap;
} {
  switch (status) {
    case 1:
      return {
        label: t("mySevaCard.paymentSuccess"),
        tone: "success",
        icon: "checkmark-circle",
      };
    case 2:
      return {
        label: t("mySevaCard.paymentFailed"),
        tone: "failed",
        icon: "close-circle",
      };

    case -1:
      return {
        label: t("mySevaCard.paymentPending"),
        tone: "pending",
        icon: "time",
      };
    default:
      return {
        label: t("mySevaCard.orderCancelled"),
        tone: "cancelled",
        icon: "close-circle",
      };
  }
}

function getOrderStatusLabel(
  status: number | string,
  t: (key: string) => string,
): string {
  switch (Number(status)) {
    case 0:
      return t("mySevaCard.orderPlaced");
    case 1:
      return t("mySevaCard.received");
    case -2:
      return t("mySevaCard.orderCancelled");
    default:
      return String(status);
  }
}

export default function MySevaCard({ transaction, onViewQr }: Props) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith("kn") ? "kn-IN" : "en-IN";
  const CANCELLED_STATUS = {
    label: t("mySevaCard.orderCancelled"),
    tone: "cancelled" as const,
    icon: "close-circle" as const,
  };
  const { theme } = useTheme();
  const requestRefresh = useMySevasRefreshStore(
    (state) => state.requestRefresh,
  );
  const { colors } = theme;
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const { show } = useToast();
  const [retrying, setRetrying] = useState(false);
  const handleCancelTransaction = () => {
    if (cancelling) return;

    Alert.alert(
      t("mySevaCard.cancelBooking"),
      t("mySevaCard.cancelConfirmation"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("common.okay"),
          onPress: async () => {
            if (cancelling) return;

            try {
              setCancelling(true);

              await cancelTransaction(transaction.id);

              setCancelled(true);
              show(t("mySevaCard.cancelSuccess"), "success");
            } catch (error: unknown) {
              const message =
                error instanceof AppError
                  ? error.message
                  : "Unable to cancel booking";

              Alert.alert("Error", message);
            } finally {
              setCancelling(false);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  // Order is cancelled if the server says so (-2) or the user just cancelled it.
  const effectiveOrderStatus = cancelled ? -2 : Number(transaction.orderStatus);
  const isOrderCancelled = effectiveOrderStatus === -2;

  // A cancelled order (or an unrecognised payment status) shows "Order Cancelled".
  const payment = isOrderCancelled
    ? CANCELLED_STATUS
    : getPaymentStatus(transaction.paymentStatus, t);
  const isCancelledBanner = payment.tone === "cancelled";

  // Tone -> colors, taken from the existing theme only.
  const toneColor =
    payment.tone === "failed" || isCancelledBanner
      ? theme.colors.error
      : payment.tone === "success"
        ? colors.accent
        : colors.textMuted;
  const toneBg =
    payment.tone === "failed" || isCancelledBanner
      ? `${theme.colors.error}1A`
      : payment.tone === "success"
        ? colors.accentMuted
        : colors.border;

  const showRetry =
    !isOrderCancelled &&
    (transaction.paymentStatus === 2 || transaction.paymentStatus === -1);
  const showQr = !isOrderCancelled && transaction.paymentStatus === 1;
  const showCancel =
    !isOrderCancelled &&
    effectiveOrderStatus === 0 &&
    transaction.paymentStatus === 1;

  const InfoRow = ({
    label,
    value,
    valueColor,
  }: {
    label: string;
    value: string | number;
    valueColor?: string;
  }) => (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: colors.textMuted }]}>
        {label}
      </Text>
      <Text
        style={[
          styles.infoValue,
          { color: valueColor ?? colors.textSecondary },
        ]}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );

  const handleRetryPayment = async () => {
    if (retrying) return;

    let sdkWasOpened = false;

    try {
      setRetrying(true);

      // 1. Request fresh payment details from the backend.
      const response = await retryPayment(transaction.id);

      if (!response.valid) {
        show("Unable to retry payment. Please try again.", "error");
        return;
      }

      if (!response.accessCode || !response.encRequest || !response.extId) {
        show("Payment details are incomplete.", "error");
        return;
      }

      // 2. Open CCAvenue. Cancellation or failure may throw here.
      sdkWasOpened = true;

      const result = await payForOrder({
        extId: response.extId,
        accessCode: response.accessCode,
        encRequest: response.encRequest,
      });

      if (result.result.paymentStatus === 1) {
        show("Payment successful!", "success");
      } else {
        show("Payment was not successful. Please check My Sevas.", "error");
      }
    } catch (error) {
      console.log(
        "[MySevas] Retry payment ended with an error:",
        error instanceof Error ? error.message : error,
      );

      show("Payment was cancelled or could not be completed.", "error");
    } finally {
      // Refresh My Sevas after returning from the CCAvenue SDK,
      // whether the user paid successfully or cancelled.
      if (sdkWasOpened) {
        requestRefresh();
      }

      setRetrying(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {/* Payment status banner (top of card) */}
        <View style={[styles.banner, { backgroundColor: toneBg }]}>
          <View style={styles.bannerLeft}>
            <Ionicons name={payment.icon} size={16} color={toneColor} />
            <Text style={[styles.bannerText, { color: toneColor }]}>
              {payment.label}
            </Text>
          </View>

          {/* Hidden when the banner already says "Order Cancelled" */}
          {!isCancelledBanner && (
            <View
              style={[
                styles.orderChip,
                { backgroundColor: colors.card, borderColor: toneColor },
              ]}
            >
              <Text style={[styles.orderChipText, { color: toneColor }]}>
                {getOrderStatusLabel(effectiveOrderStatus, t)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.body}>
          {/* Receipt no (left) + date/time (right) in one compact row */}
          <View style={styles.headerRow}>
            <Text
              style={[styles.billNo, { color: colors.accent }]}
              numberOfLines={1}
            >
              {t("mySevaCard.receiptNo")}: #{transaction.billNo || "-"}
            </Text>
            <Text
              style={[styles.headerDate, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {formatTransactionDate(transaction.dt, locale)}
              {formatTransactionTime(transaction.dt, locale)
                ? `  ${formatTransactionTime(transaction.dt, locale)}`
                : ""}
            </Text>
          </View>

          <DottedDivider color={colors.border} style={styles.divider} />

          {/* Sevas */}
          <View>
            {transaction.posTranDetItems?.map((seva, index) => (
              <View
                key={seva.id || `${transaction.id}-${index}`}
                style={styles.sevaItem}
              >
                {index > 0 && (
                  <DottedDivider color={colors.border} style={styles.divider} />
                )}

                <View style={styles.sevaHeader}>
                  <Text
                    style={[styles.sevaName, { color: colors.accent }]}
                    numberOfLines={2}
                  >
                    {seva.sevaName}
                  </Text>
                  <Text style={[styles.sevaAmount, { color: colors.accent }]}>
                    {formatAmount(seva.entryAmt)}
                  </Text>
                </View>

                {/* Compact meta line */}
                <View style={styles.metaRow}>
                  <Text style={[styles.metaText, { color: colors.textMuted }]}>
                    {t("mySevaCard.quantity")}: {seva.qty}
                  </Text>

                  <View style={styles.metaChip}>
                    <CalendarDays
                      size={10}
                      color={colors.textMuted}
                      strokeWidth={2}
                    />
                    <Text
                      style={[styles.metaText, { color: colors.textMuted }]}
                    >
                      {formatSevaDate(seva.sevaDt, locale)}
                    </Text>
                  </View>

                  {!!seva.slotName?.replace(/-+$/, "") && (
                    <View style={styles.metaChip}>
                      <Clock
                        size={10}
                        color={colors.textMuted}
                        strokeWidth={2}
                      />
                      <Text
                        style={[styles.metaText, { color: colors.textMuted }]}
                        numberOfLines={1}
                      >
                        {seva.slotName?.replace(/-+$/, "")}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Devotee details */}
                {(seva.devoteeName || seva.ras || seva.nak || seva.got) && (
                  <View style={styles.devoteeSection}>
                    <Text
                      style={[styles.devoteeTitle, { color: colors.accent }]}
                    >
                      {t("mySevaCard.devoteeDetails")}
                    </Text>

                    {seva.devoteeName ? (
                      <InfoRow
                        label={t("mySevaCard.devoteeName")}
                        value={seva.devoteeName}
                      />
                    ) : null}
                    {seva.ras ? (
                      <InfoRow label={t("mySevaCard.rashi")} value={seva.ras} />
                    ) : null}
                    {seva.nak ? (
                      <InfoRow
                        label={t("mySevaCard.nakshatra")}
                        value={seva.nak}
                      />
                    ) : null}
                    {seva.got ? (
                      <InfoRow
                        label={t("mySevaCard.gothra")}
                        value={seva.got}
                      />
                    ) : null}
                  </View>
                )}
              </View>
            ))}
          </View>

          <DottedDivider color={colors.border} style={styles.divider} />

          {/* Grand total (bottom of the slip, like a real receipt) */}
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.textMuted }]}>
              {t("mySevaCard.total")}
            </Text>
            <Text style={[styles.amount, { color: colors.accent }]}>
              {formatAmount(transaction.entryNetAmt)}
            </Text>
          </View>

          {/* Actions */}
          {(showRetry || showQr || showCancel) && (
            <View style={styles.actions}>
              {showRetry && (
                <Pressable
                  onPress={handleRetryPayment}
                  disabled={retrying}
                  style={[
                    styles.primaryButton,
                    { backgroundColor: colors.accent },
                  ]}
                >
                  {retrying ? (
                    <ActivityIndicator size="small" color={colors.onAccent} />
                  ) : (
                    <Ionicons
                      name="refresh"
                      size={16}
                      color={colors.onAccent}
                    />
                  )}

                  <Text
                    style={[
                      styles.primaryButtonText,
                      { color: colors.onAccent },
                    ]}
                  >
                    {retrying ? "Preparing Payment..." : "Retry Payment"}
                  </Text>
                </Pressable>
              )}

              {showQr && (
                <Pressable
                  onPress={() => onViewQr(transaction)}
                  style={[
                    styles.primaryButton,
                    { backgroundColor: colors.accent },
                  ]}
                >
                  <Ionicons
                    name="qr-code-outline"
                    size={14}
                    color={colors.onAccent}
                  />
                  <Text
                    style={[
                      styles.primaryButtonText,
                      { color: colors.onAccent },
                    ]}
                    numberOfLines={1}
                  >
                    {t("mySevaCard.viewQrCode")}
                  </Text>
                </Pressable>
              )}

              {showCancel && (
                <Pressable
                  onPress={handleCancelTransaction}
                  disabled={cancelling}
                  style={[
                    styles.cancelButton,
                    { borderColor: theme.colors.error },
                  ]}
                >
                  {cancelling ? (
                    <ActivityIndicator
                      size="small"
                      color={theme.colors.error}
                    />
                  ) : (
                    <Ionicons
                      name="close-circle-outline"
                      size={14}
                      color={theme.colors.error}
                    />
                  )}
                  <Text
                    style={[
                      styles.cancelButtonText,
                      { color: theme.colors.error },
                    ]}
                    numberOfLines={1}
                  >
                    {cancelling
                      ? t("mySevaCard.cancelling")
                      : t("mySevaCard.cancelBooking")}
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      </View>

      {/* Tear-off zigzag edge */}
      <TearEdge color={colors.card} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },

  // Paper slip: flat bottom (the zigzag edge continues it)
  card: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderWidth: 1,
    borderBottomWidth: 0,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },

  // Tear-off edge
  tearWrap: {
    height: 6,
    overflow: "hidden",
  },
  tearRow: {
    flexDirection: "row",
  },
  tearTooth: {
    width: 0,
    height: 0,
    borderLeftWidth: TOOTH / 2,
    borderRightWidth: TOOTH / 2,
    borderTopWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },

  // Dashed divider ( - - - - - - - - )
  dottedWrap: {
    height: 1,
    overflow: "hidden",
  },
  dottedLine: {
    height: 2,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 1,
  },
  divider: {
    marginVertical: 8,
  },

  // Status banner
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  bannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },
  bannerText: {
    fontSize: 12,
    fontFamily: "Roboto_700Bold",
    letterSpacing: 0.5,
  },
  orderChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginLeft: 8,
  },
  orderChipText: {
    fontSize: 11,
    fontFamily: "Roboto_500Medium",
  },

  body: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
  },

  // Header row
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  billNo: {
    flex: 1,
    fontSize: 12,
    fontFamily: MONO,
    fontWeight: "700",
  },
  headerDate: {
    fontSize: 11,
    fontFamily: MONO,
  },

  // Seva line items
  sevaItem: {},
  sevaHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  sevaName: {
    flex: 1,
    fontSize: 13,
    lineHeight: 17,
    paddingRight: 8,
    fontFamily: MONO,
    fontWeight: "700",
  },
  sevaAmount: {
    fontSize: 13,
    fontFamily: MONO,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: 12,
    rowGap: 2,
    marginTop: 3,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    maxWidth: "100%",
  },
  metaText: {
    fontSize: 10,
    fontFamily: MONO,
  },

  // Devotee
  devoteeSection: {
    marginTop: 6,
  },
  devoteeTitle: {
    fontSize: 10,
    fontFamily: MONO,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  infoLabel: {
    fontSize: 11,
    fontFamily: MONO,
  },
  infoValue: {
    flex: 1,
    marginLeft: 10,
    textAlign: "right",
    fontSize: 11,
    fontFamily: MONO,
    fontWeight: "700",
  },

  // Total
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 12,
    fontFamily: MONO,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  amount: {
    fontSize: 17,
    fontFamily: MONO,
    fontWeight: "700",
  },

  // Actions (side by side to save height)
  actions: {
    flexDirection: "row",
    marginTop: 10,
    gap: 8,
  },
  primaryButton: {
    flex: 1,
    height: 34,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  primaryButtonText: {
    fontSize: 12,
    fontWeight: "700",
  },
  cancelButton: {
    flex: 1,
    height: 34,
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
