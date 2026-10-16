import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Card, Text, useToast } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";

import { useOrderStore } from "@/src/features/checkout/store/orderStore";
import { availabilityMessage } from "@/src/features/checkout/utils/availabilityMessage";
type CartLine = {
  key: string;
  sevaMastId: string;
  slotId: string;
  qty: number;
  rate: number;
  worshipDate: string;
  rowIds: string[];
};

type SevaDisplay = {
  sevaName: string;
  sevaGroup?: string | null;
  rate: number;
  maxQtyPerBill: number;
  needsSankalpam: boolean;
  slotNameById: Record<string, string>;
};

type Props = {
  line: CartLine;
  display?: SevaDisplay;
};
const formatDisplayDate = (date: string) => {
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
};

export default function CartItem({ line, display }: Props) {
  const { theme } = useTheme();
  const { show } = useToast();

  const incrementByRow = useOrderStore((s) => s.incrementByRow);
  const decrementRow = useOrderStore((s) => s.decrementRow);
  const clearSeva = useOrderStore((s) => s.clearSeva);

  const [busy, setBusy] = useState(false);

  const sevaName = display?.sevaName ?? "Seva";
  const slotName = display?.slotNameById?.[line.slotId] ?? "";

  const handleIncrement = async () => {
    if (busy) return;
    setBusy(true);
    // Increment re-checks availability; use the last underlying row id.
    const lastRowId = line.rowIds[line.rowIds.length - 1];
    const result = await incrementByRow(lastRowId ?? "");
    setBusy(false);

    if (!result.ok) {
      if (result.reason === "unavailable") show(availabilityMessage(result.status), "error");
      else if (result.reason === "max-qty") show("Maximum quantity reached.", "error");
      else show("Couldn't add. Try again.", "error");
    }
  };

  const handleDecrement = () => {
    const lastRowId = line.rowIds[line.rowIds.length - 1];
    if (lastRowId) decrementRow(lastRowId);
  };

  const handleRemove = () => {
    clearSeva(line.sevaMastId, line.slotId);
  };

  return (
    <Card
      padded
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
          borderRadius: 16,
          ...theme.shadows.card,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.info}>
          <Text variant="title" numberOfLines={2} style={[styles.name, { color: theme.colors.textPrimary }]}>
            {sevaName}
          </Text>

          <Text variant="label" style={[styles.unitPrice, { color: theme.colors.textSecondary }]}>
            ₹ {line.rate.toFixed(2)} each
          </Text>

          <View style={styles.metaContainer}>
            {!!line.worshipDate && (
              <View style={styles.metaRow}>
                <Ionicons name="calendar-outline" size={13} color={theme.colors.textSecondary} />
                <Text variant="label" style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                  {formatDisplayDate(line.worshipDate)}
                </Text>
              </View>
            )}
            {!!slotName && (
              <View style={styles.metaRow}>
                <Ionicons name="time-outline" size={13} color={theme.colors.textSecondary} />
                <Text variant="label" style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                  {slotName}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.actions}>
          <View style={[styles.quantityControl, { backgroundColor: theme.colors.onAccent, borderColor: theme.colors.border }]}>
            <TouchableOpacity onPress={handleDecrement} style={styles.quantityButton} hitSlop={6} activeOpacity={0.6}>
              <Ionicons name="remove" size={18} color={theme.colors.textPrimary} />
            </TouchableOpacity>

            <View style={[styles.quantityValue, { borderLeftColor: theme.colors.border, borderRightColor: theme.colors.border }]}>
              <Text variant="label" style={[styles.quantity, { color: theme.colors.textPrimary }]}>
                {busy ? "…" : line.qty}
              </Text>
            </View>

            <TouchableOpacity onPress={handleIncrement} disabled={busy} style={styles.quantityButton} hitSlop={6} activeOpacity={0.6}>
              <Ionicons name="add" size={18} color={theme.colors.accent} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleRemove}
            style={[styles.deleteButton, { backgroundColor: theme.colors.onAccent }]}
            hitSlop={8}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={18} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, overflow: "hidden", paddingVertical: 25, paddingHorizontal: 17, minHeight: 106 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  info: { flex: 1, minWidth: 0, paddingRight: 10 },
  name: { fontSize: 17, lineHeight: 22, fontWeight: "800" },
  unitPrice: { fontSize: 12, marginTop: 5 },
  actions: { flexDirection: "row", alignItems: "center", gap: 7, marginLeft: 4 },
  quantityControl: { height: 45, minWidth: 110, flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 1, borderRadius: 10, overflow: "hidden" },
  quantityButton: { width: 32, height: 40, alignItems: "center", justifyContent: "center" },
  quantityValue: { height: 28, minWidth: 30, alignItems: "center", justifyContent: "center", borderLeftWidth: 1, borderRightWidth: 1 },
  quantity: { fontSize: 14, fontWeight: "800", textAlign: "center" },
  deleteButton: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  metaContainer: { marginTop: 6, gap: 3 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  metaText: { fontSize: 10, fontWeight: "600" },
});