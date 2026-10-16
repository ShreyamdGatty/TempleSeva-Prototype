import BottomSheetModal from "@/src/framework/components/BottomSheetModal";
import { useTheme } from "@/src/framework/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useOrderRows,
  useOrderStore,
} from "@/src/features/checkout/store/orderStore";
import { useToast } from "@/src/framework/components";
import { PaymentStatusResponse } from "../../checkout/types/order.types";
import CartCheckoutFooter from "./CartCheckoutFooter";
import CartItem from "./CartItem";

type Props = {
  visible: boolean;
  closeCart: () => void;
  onPaymentResult: (result: PaymentStatusResponse) => void;
  onPaymentPending: () => void;
};
// A grouped line for display: one per seva+slot, summed qty.
type CartLine = {
  key: string;
  sevaMastId: string;
  slotId: string;
  qty: number;
  rate: number;
  worshipDate: string;
  rowIds: string[]; // the underlying detail rows
};

export default function CartBottomSheet({
  visible,
  closeCart,
  onPaymentResult,
  onPaymentPending,
}: Props) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { show } = useToast();

  const rows = useOrderRows();
  const display = useOrderStore((s) => s.display);
  const clearOrder = useOrderStore((s) => s.clearOrder);

  // Group rows by seva+slot for display.
  const linesMap = new Map<string, CartLine>();
  for (const r of rows) {
    const key = `${r.itMastID}__${r.SevaSlotID}`;
    const existing = linesMap.get(key);
    if (existing) {
      existing.qty += r.entryQty;
      existing.rowIds.push(r.id);
    } else {
      linesMap.set(key, {
        key,
        sevaMastId: r.itMastID,
        slotId: r.SevaSlotID,
        qty: r.entryQty,
        rate: r.entryRate,
        worshipDate: r.sevaDt,
        rowIds: [r.id],
      });
    }
  }
  const lines = Array.from(linesMap.values());

  const itemCount = rows.reduce((n, r) => n + r.entryQty, 0);

  const handleClearCart = useCallback(() => {
    clearOrder();
    closeCart();
  }, [clearOrder, closeCart, show]);

  const handleBrowseSevas = useCallback(() => {
    closeCart();
    setTimeout(() => router.push("/sevas"), 300);
  }, [closeCart]);

  const header = (
    <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
      <View style={styles.headerLeft}>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
          {t("cartBottomSheet.title")}
        </Text>
        <Text
          style={[styles.itemSummary, { color: theme.colors.textSecondary }]}
        >
          {lines.length}{" "}
          {lines.length === 1
            ? t("cartBottomSheet.seva")
            : t("cartBottomSheet.sevas")}{" "}
          · {itemCount}{" "}
          {itemCount === 1
            ? t("cartBottomSheet.item")
            : t("cartBottomSheet.items")}
        </Text>
      </View>

      <View style={styles.headerActions}>
        {lines.length > 0 && (
          <TouchableOpacity
            onPress={handleClearCart}
            style={styles.clearButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name="trash-outline"
              size={17}
              color={theme.colors.error}
            />
            <Text style={[styles.clearText, { color: theme.colors.error }]}>
              {" "}
              {t("cartBottomSheet.clear")}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={closeCart}
          style={[styles.closeButton, { backgroundColor: theme.colors.page }]}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={22} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const body =
    lines.length > 0 ? (
      <FlatList
        data={lines}
        keyExtractor={(line) => line.key}
        renderItem={({ item }) => (
          <CartItem line={item} display={display[item.sevaMastId]} />
        )}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    ) : (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="cart-outline"
          size={48}
          color={theme.colors.textSecondary}
        />
        <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>
          {t("cartBottomSheet.cartEmpty")}
        </Text>
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          {t("cartBottomSheet.addSevasToContinue")}
        </Text>
        <TouchableOpacity onPress={handleBrowseSevas} style={styles.browseBtn}>
          <Text style={[styles.browseText, { color: theme.colors.accent }]}>
            {t("cartBottomSheet.browseSevas")}
          </Text>
        </TouchableOpacity>
      </View>
    );

  const footer =
    lines.length > 0 ? (
      <CartCheckoutFooter
        onAssignDevotees={() => {
          closeCart();
          setTimeout(() => router.push("/sankalpam"), 300);
        }}
        onPaymentResult={onPaymentResult}
        onPaymentPending={onPaymentPending}
      />
    ) : null;

  return (
    <BottomSheetModal
      visible={visible}
      onClose={closeCart}
      header={header}
      footer={footer}
    >
      {body}
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  headerLeft: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: "800" },
  itemSummary: { marginTop: 3, fontSize: 11 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  clearButton: {
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  clearText: { marginLeft: 4, fontSize: 11, fontWeight: "700" },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 16 },
  separator: { height: 8 },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  emptyTitle: { fontSize: 18, fontWeight: "800", marginTop: 12 },
  emptyText: { textAlign: "center", fontSize: 12, marginTop: 6 },
  browseBtn: { marginTop: 16, paddingHorizontal: 20, paddingVertical: 10 },
  browseText: { fontSize: 14, fontWeight: "700" },
});
