import { useAuth } from "@/src/framework/auth";
import { Button, Text, useToast } from "@/src/framework/components";
import { AppError } from "@/src/framework/network/errors";
import { useTheme } from "@/src/framework/theme";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import {
  useOrderCount,
  useOrderRows,
  useOrderStore,
  useOrderSubmitting,
  useOrderTotal,
} from "@/src/features/checkout/store/orderStore";
import { PaymentStatusResponse } from "../../checkout/types/order.types";

type Props = {
  onAssignDevotees?: () => void;
  // Called when payment succeeded — parent shows the result modal (QR/BillNo).
  onPaymentResult?: (result: PaymentStatusResponse) => void;
  // Called when the order was placed but not paid (cancel/fail) — parent can
  // close the cart; the order is saved and can be paid later from My Sevas.
  onPaymentPending?: () => void;
};

export default function CartCheckoutFooter({
  onAssignDevotees,
  onPaymentResult,
  onPaymentPending,
}: Props) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { show } = useToast();
  const { user } = useAuth();

  const itemCount = useOrderCount();
  const totalAmount = useOrderTotal();
  const rows = useOrderRows();
  const display = useOrderStore((s) => s.display);
  const submitOrder = useOrderStore((s) => s.submitOrder);
  const submitting = useOrderSubmitting();

  // Does any item require devotee assignment?
  const anyNeedsSankalpam =
    itemCount > 0 &&
    rows.some((r) => display[r.itMastID]?.needsSankalpam === true);

  const runPayment = async () => {
    const result = await submitOrder({
      extPartyId: user?.id ?? "",
      partyName: user?.name ?? "",
      mobile: user?.phone ?? "",
      email: user?.email ?? "",
    });

    if (result.ok) {
      if (result.paid && result.data) {
        // Paid → parent shows the success modal (QR + BillNo).
        onPaymentResult?.(result.data);
      } else {
        // Order placed but not paid → pay later from My Sevas.
        show(t("cartCheckoutFooter.paymentPending"), "error");
        onPaymentPending?.();
      }
    } else if (result.reason === "empty") {
      show(t("cartCheckoutFooter.cartEmpty"), "error");
    } else if (result.reason === "no-model") {
      show(t("cartCheckoutFooter.selectTempleAndDate"), "error");
    } else {
      show(errorMessage(result.error, t), "error");
    }
  };

  const handlePress = async () => {
    if (submitting) return;

    if (anyNeedsSankalpam) {
      // Route through the sankalpam page to collect devotee details.
      onAssignDevotees?.();
      return;
    }

    // No devotee details needed — pay directly from the cart.
    await runPayment();
  };

  const label = anyNeedsSankalpam
    ? t("cartCheckoutFooter.assignDevoteesAndBook")
    : t("cartCheckoutFooter.proceedToPay");

  return (
    <>
      {itemCount > 0 && (
        <View
          style={[
            styles.container,
            {
              backgroundColor: theme.colors.page,
              borderTopColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.content}>
            <View style={styles.totalSection}>
              <Text
                variant="label"
                style={[styles.label, { color: theme.colors.textSecondary }]}
              >
                {itemCount}{" "}
                {itemCount === 1
                  ? t("cartCheckoutFooter.item")
                  : t("cartCheckoutFooter.items")}
              </Text>

              <Text
                variant="title"
                style={[styles.total, { color: theme.colors.textPrimary }]}
              >
                ₹ {totalAmount.toFixed(2)}
              </Text>
            </View>

            <Button
              title={submitting ? t("cartCheckoutFooter.processing") : label}
              onPress={handlePress}
              disabled={submitting}
              style={[
                styles.proceedButton,
                { backgroundColor: theme.colors.accent },
              ]}
            />
          </View>
        </View>
      )}
    </>
  );
}

// Prefer the backend's message for validation/known errors; otherwise generic.
function errorMessage(error: unknown, t: (key: string) => string): string {
  if (error instanceof AppError) {
    if (error.kind === "validation" || error.kind === "conflict") {
      return error.message;
    }
    if (error.kind === "unauthorized") {
      return t("cartCheckoutFooter.sessionExpired");
    }
  }
  return t("cartCheckoutFooter.orderFailed");
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  content: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalSection: { flex: 1 },
  label: { fontSize: 11, fontWeight: "600" },
  total: { fontSize: 20, fontWeight: "800", marginTop: 3 },
  proceedButton: { width: "55%", height: 44, borderRadius: 12 },
});
