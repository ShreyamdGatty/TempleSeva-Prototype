import { useAuth } from "@/src/framework/auth/AuthProvider";
import { Button, Text, useToast } from "@/src/framework/components";
import { AppError } from "@/src/framework/network/errors";
import { useTheme } from "@/src/framework/theme";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  useOrderRows,
  useOrderStore,
  useOrderSubmitting,
  useOrderTotal,
} from "@/src/features/checkout/store/orderStore";

import { PaymentStatusResponse } from "@/src/features/checkout/types/order.types";

type Props = {
  onPaymentResult?: (result: PaymentStatusResponse) => void;
  onPaymentPending?: () => void;
};

export default function SankalpamFooter({
  onPaymentResult,
  onPaymentPending,
}: Props) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { show } = useToast();
  const { user } = useAuth();

  const totalAmount = useOrderTotal();
  const rows = useOrderRows();
  const display = useOrderStore((s) => s.display);
  const submitOrder = useOrderStore((s) => s.submitOrder);
  const submitting = useOrderSubmitting();

  const ticketCount = useMemo(
    () =>
      rows.filter((r) => display[r.itMastID]?.needsSankalpam === true).length,
    [rows, display],
  );

  const runPayment = async () => {
    const result = await submitOrder({
      extPartyId: user?.id ?? "",
      partyName: user?.name ?? "",
      mobile: user?.phone ?? "",
      email: user?.email ?? "",
    });

    if (result.ok) {
      if (result.paid && result.data) {
        // Payment successful → parent handles result modal.
        onPaymentResult?.(result.data);
      } else {
        // Payment cancelled/failed → parent closes Sankalpam.
        show(t("sankalpamFooter.paymentPending"), "error");
        onPaymentPending?.();
      }
    } else if (result.reason === "empty") {
      show(t("sankalpamFooter.cartEmpty"), "error");
    } else if (result.reason === "no-model") {
      show(t("sankalpamFooter.selectTempleAndDate"), "error");
    } else {
      show(errorMessage(result.error, t), "error");
    }
  };

  const handleProceed = async () => {
    if (submitting) return;
    await runPayment();
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          paddingBottom: insets.bottom + 12,
        },
      ]}
    >
      <View style={styles.info}>
        <Text
          variant="label"
          style={[styles.ticketCount, { color: theme.colors.textSecondary }]}
        >
          {ticketCount}{" "}
          {ticketCount === 1
            ? t("sankalpamFooter.ticket")
            : t("sankalpamFooter.tickets")}
        </Text>

        <Text
          variant="title"
          style={[styles.total, { color: theme.colors.textPrimary }]}
        >
          ₹{totalAmount.toFixed(2)}
        </Text>
      </View>

      <Button
        title={
          submitting
            ? t("cartCheckoutFooter.processing")
            : t("cartCheckoutFooter.proceedToPay")
        }
        onPress={handleProceed}
        disabled={submitting}
        style={[styles.button, { backgroundColor: theme.colors.accent }]}
      />
    </View>
  );
}

// Prefer the backend's message for validation/known errors; otherwise generic.
function errorMessage(error: unknown, t: (key: string) => string): string {
  if (error instanceof AppError) {
    if (error.kind === "validation" || error.kind === "conflict") {
      return error.message;
    }
    if (error.kind === "unauthorized") {
      return t("sankalpamFooter.sessionExpired");
    }
  }
  return t("sankalpamFooter.orderFailed");
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  info: { flex: 1 },
  ticketCount: { fontSize: 12 },
  total: { fontSize: 20, fontFamily: "Roboto_700Bold", marginTop: 1 },
  button: { minWidth: 168, height: 48, borderRadius: 12 },
});
