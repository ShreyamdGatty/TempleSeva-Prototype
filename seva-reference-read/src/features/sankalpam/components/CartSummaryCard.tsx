import { Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import {
  useOrderRows,
  useOrderStore,
} from "@/src/features/checkout/store/orderStore";

type SummaryLine = {
  key: string;
  sevaMastId: string;
  slotId: string;
  qty: number;
  rate: number;
  worshipDate: string;
};

const formatDate = (date: string) => {
  if (!date) return "";

  const [year, month, day] = date.split("-");

  if (!year || !month || !day) return date;

  return `${day}-${month}-${year}`;
};

export default function CartSummaryCard() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const rows = useOrderRows();
  const display = useOrderStore((s) => s.display);

  // Group rows by seva+slot for the summary.
  const lines = useMemo(() => {
    const map = new Map<string, SummaryLine>();
    for (const r of rows) {
      const key = `${r.itMastID}__${r.SevaSlotID}`;
      const existing = map.get(key);
      if (existing) {
        existing.qty += r.entryQty;
      } else {
        map.set(key, {
          key,
          sevaMastId: r.itMastID,
          slotId: r.SevaSlotID,
          qty: r.entryQty,
          rate: r.entryRate,
          worshipDate: r.sevaDt,
        });
      }
    }
    return Array.from(map.values());
  }, [rows]);

  if (lines.length === 0) {
    return null;
  }

  const totalQty = lines.reduce((sum, line) => sum + line.qty, 0);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View
          style={[
            styles.headerIcon,
            { backgroundColor: theme.colors.accentMuted },
          ]}
        >
          <Ionicons
            name="receipt-outline"
            size={20}
            color={theme.colors.accent}
          />
        </View>

        <Text
          variant="heading"
          style={[styles.title, { color: theme.colors.textPrimary }]}
        >
          {t("cartSummary.title")}
        </Text>

        <View
          style={[
            styles.countBadge,
            { backgroundColor: theme.colors.accentMuted },
          ]}
        >
          <Text
            variant="label"
            style={[styles.countText, { color: theme.colors.accent }]}
          >
            {totalQty}
          </Text>
        </View>
      </View>

      <View
        style={[styles.divider, { backgroundColor: theme.colors.border }]}
      />

      {/* Items */}
      <View style={styles.items}>
        {lines.map((line, index) => {
          const info = display[line.sevaMastId];
          const sevaName = info?.sevaName ?? t("cartSummary.seva");
          const slotName = info?.slotNameById?.[line.slotId] ?? "";
          const itemTotal = line.rate * line.qty;

          return (
            <View
              key={line.key}
              style={[
                styles.itemRow,
                index > 0 && {
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderTopColor: theme.colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.qtyTile,
                  { backgroundColor: theme.colors.accentMuted },
                ]}
              >
                <Text
                  variant="label"
                  style={[styles.qtyText, { color: theme.colors.accent }]}
                >
                  {line.qty}×
                </Text>
              </View>

              <View style={styles.itemInfo}>
                <Text
                  variant="body"
                  numberOfLines={2}
                  style={[styles.itemName, { color: theme.colors.textPrimary }]}
                >
                  {sevaName}
                </Text>

                {(!!line.worshipDate || !!slotName) && (
                  <View style={styles.chipRow}>
                    {!!line.worshipDate && (
                      <View
                        style={[
                          styles.chip,
                          { borderColor: theme.colors.border },
                        ]}
                      >
                        <Ionicons
                          name="calendar-outline"
                          size={12}
                          color={theme.colors.textSecondary}
                        />
                        <Text
                          variant="label"
                          style={[
                            styles.chipText,
                            { color: theme.colors.textSecondary },
                          ]}
                        >
                          {formatDate(line.worshipDate)}
                        </Text>
                      </View>
                    )}

                    {!!slotName && (
                      <View
                        style={[
                          styles.chip,
                          { borderColor: theme.colors.border },
                        ]}
                      >
                        <Ionicons
                          name="time-outline"
                          size={12}
                          color={theme.colors.textSecondary}
                        />
                        <Text
                          variant="label"
                          numberOfLines={1}
                          style={[
                            styles.chipText,
                            { color: theme.colors.textSecondary },
                          ]}
                        >
                          {slotName}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>

              <View style={styles.priceBlock}>
                <Text
                  variant="title"
                  style={[
                    styles.itemPrice,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  ₹{itemTotal.toFixed(0)}
                </Text>

                {line.qty > 1 && (
                  <Text
                    variant="label"
                    style={[
                      styles.unitPrice,
                      { color: theme.colors.textMuted },
                    ]}
                  >
                    ₹{line.rate.toFixed(0)} each
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 18,
    marginBottom: 22,
    overflow: "hidden",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "Roboto_700Bold",
  },
  countBadge: {
    minWidth: 28,
    height: 28,
    paddingHorizontal: 9,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    fontSize: 13,
    fontFamily: "Roboto_700Bold",
  },

  divider: {
    height: StyleSheet.hairlineWidth,
  },

  // Items
  items: {
    paddingHorizontal: 16,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 14,
  },
  qtyTile: {
    minWidth: 36,
    height: 36,
    paddingHorizontal: 6,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  qtyText: {
    fontSize: 13,
    fontFamily: "Roboto_700Bold",
  },
  itemInfo: {
    flex: 1,
    paddingRight: 12,
  },
  itemName: {
    fontSize: 15,
    lineHeight: 21,
    fontFamily: "Roboto_500Medium",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    maxWidth: "100%",
  },
  chipText: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  priceBlock: {
    alignItems: "flex-end",
    minWidth: 58,
  },
  itemPrice: {
    fontSize: 15,
    lineHeight: 21,
    fontFamily: "Roboto_700Bold",
  },
  unitPrice: {
    fontSize: 11,
    marginTop: 2,
  },
});
