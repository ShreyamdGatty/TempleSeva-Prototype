import { Ionicons } from "@expo/vector-icons";

import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Text } from "@/src/framework/components";

import { useTheme } from "@/src/framework/theme";

import { PosTrDet } from "@/src/features/checkout/types/order.types";

import { useTranslation } from "react-i18next";
import { FamilyProfile } from "../types/sankalpam.types";

type Props = {
  row: PosTrDet;
  sevaName: string;
  slotName?: string;
  ticketNumber: number;
  profiles?: FamilyProfile[];
  onSelectProfile?: (profile: FamilyProfile) => void;
  onAddFamily?: () => void;
  onClearAssignment?: () => void;
};

export default function TicketCard({
  row,
  sevaName,
  slotName,
  ticketNumber,
  profiles = [],
  onSelectProfile,
  onAddFamily,
}: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  // Assigned if this row already carries a devotee name.
  const isAssigned = (row.devoteeName ?? "").trim().length > 0;

  // Best-effort: which saved profile matches this row (for chip highlight).
  const assignedProfile =
    profiles.find(
      (p) =>
        p.fullName === row.devoteeName &&
        p.nakshatra === row.nak &&
        p.rashi === row.ras &&
        p.gotra === row.got,
    ) ?? null;

  const assignedProfileId = assignedProfile?.id ?? null;

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
      {/* Accent edge: accent once a devotee is assigned, neutral until then */}
      <View
        style={[
          styles.edge,
          {
            backgroundColor: isAssigned
              ? theme.colors.accent
              : theme.colors.border,
          },
        ]}
      />

      <View style={styles.body}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text
              variant="label"
              style={[styles.ticketLabel, { color: theme.colors.textMuted }]}
            >
              {t("ticketCard.ticket")} #{ticketNumber}
            </Text>

            <Text
              variant="title"
              numberOfLines={2}
              style={[styles.sevaName, { color: theme.colors.textPrimary }]}
            >
              {sevaName}
            </Text>
          </View>

          <Ionicons
            name={isAssigned ? "checkmark-circle" : "ellipse-outline"}
            size={22}
            color={isAssigned ? theme.colors.accent : theme.colors.border}
          />
        </View>

        {/* Date + slot */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={theme.colors.textMuted}
            />
            <Text
              variant="label"
              style={[styles.metaText, { color: theme.colors.textSecondary }]}
            >
              {formatDate(row.sevaDt)}
            </Text>
          </View>

          {!!slotName && (
            <View style={styles.metaItem}>
              <Ionicons
                name="time-outline"
                size={14}
                color={theme.colors.textMuted}
              />
              <Text
                variant="label"
                style={[styles.metaText, { color: theme.colors.textSecondary }]}
              >
                {slotName}
              </Text>
            </View>
          )}
        </View>

        <View
          style={[styles.divider, { backgroundColor: theme.colors.border }]}
        />

        {/* Devotee */}
        <View style={styles.devoteeHeader}>
          <Ionicons
            name="person-outline"
            size={15}
            color={theme.colors.accent}
          />
          <Text
            variant="label"
            style={[styles.devoteeTitle, { color: theme.colors.textPrimary }]}
          >
            {t("ticketCard.devotee")}
          </Text>
        </View>

        {profiles.length > 0 && (
          <View style={styles.quickSelect}>
            <Text
              variant="label"
              style={[
                styles.quickSelectLabel,
                { color: theme.colors.textSecondary },
              ]}
            >
              {t("ticketCard.quickSelect")}
            </Text>

            <View style={styles.profileRow}>
              {profiles.map((profile) => {
                const selected = profile.id === assignedProfileId;

                return (
                  <TouchableOpacity
                    key={profile.id}
                    activeOpacity={0.75}
                    onPress={() => onSelectProfile?.(profile)}
                    style={[
                      styles.profileChip,
                      {
                        backgroundColor: selected
                          ? theme.colors.accentMuted
                          : theme.colors.card,
                        borderColor: selected
                          ? theme.colors.accent
                          : theme.colors.border,
                      },
                    ]}
                  >
                    {selected && (
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color={theme.colors.accent}
                      />
                    )}

                    <Text
                      variant="label"
                      numberOfLines={1}
                      style={[
                        styles.profileChipText,
                        {
                          color: selected
                            ? theme.colors.accent
                            : theme.colors.textPrimary,
                        },
                      ]}
                    >
                      {profile.fullName}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                activeOpacity={0.75}
                onPress={onAddFamily}
                style={[styles.addChip, { borderColor: theme.colors.accent }]}
              >
                <Ionicons name="add" size={15} color={theme.colors.accent} />

                <Text
                  variant="label"
                  style={[styles.addChipText, { color: theme.colors.accent }]}
                >
                  {t("ticketCard.add")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {isAssigned && (
          <View
            style={[
              styles.assignedCard,
              { backgroundColor: theme.colors.accentMuted },
            ]}
          >
            <View
              style={[
                styles.assignedAvatar,
                { backgroundColor: theme.colors.accent },
              ]}
            >
              <Text
                variant="label"
                style={[
                  styles.assignedAvatarText,
                  { color: theme.colors.onAccent },
                ]}
              >
                {getInitials(row.devoteeName)}
              </Text>
            </View>

            <View style={styles.assignedInfo}>
              <Text
                variant="title"
                numberOfLines={1}
                style={[
                  styles.assignedName,
                  { color: theme.colors.textPrimary },
                ]}
              >
                {row.devoteeName}
              </Text>

              <Text
                variant="label"
                numberOfLines={1}
                style={[
                  styles.assignedDetails,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {row.nak}
                {row.nak && row.ras ? " · " : ""}
                {row.ras}
                {row.got ? ` · ${row.got}` : ""}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

function getInitials(name?: string | null): string {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  const first = parts.at(0);

  if (!first) {
    return "?";
  }

  if (parts.length === 1) {
    return first.slice(0, 2).toUpperCase();
  }

  const last = parts.at(-1);

  if (!last) {
    return first.slice(0, 2).toUpperCase();
  }

  const firstInitial = first.at(0);
  const lastInitial = last.at(0);

  if (!firstInitial || !lastInitial) {
    return first.slice(0, 2).toUpperCase();
  }

  return (firstInitial + lastInitial).toUpperCase();
}

function formatDate(date: string): string {
  if (!date) return "";

  const parts = date.split("-");

  if (parts.length !== 3) return date;

  const [year, month, day] = parts;

  return `${day}-${month}-${year}`;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },
  edge: {
    width: 4,
  },
  body: {
    flex: 1,
    padding: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
    paddingRight: 10,
  },
  ticketLabel: {
    fontSize: 11,
    letterSpacing: 0.4,
  },
  sevaName: {
    fontSize: 16,
    lineHeight: 21,
    marginTop: 2,
    fontFamily: "Roboto_700Bold",
  },

  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 16,
    rowGap: 4,
    marginTop: 10,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metaText: {
    fontSize: 12.5,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 14,
  },

  devoteeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  devoteeTitle: {
    fontSize: 13,
    fontFamily: "Roboto_700Bold",
  },

  quickSelect: {
    marginTop: 10,
  },
  quickSelectLabel: {
    fontSize: 11.5,
    marginBottom: 8,
  },
  profileRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  profileChip: {
    maxWidth: 160,
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 17,
    paddingHorizontal: 12,
    gap: 4,
  },
  profileChipText: {
    fontSize: 12.5,
    fontFamily: "Roboto_500Medium",
    flexShrink: 1,
  },
  addChip: {
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 17,
    paddingHorizontal: 12,
    gap: 3,
  },
  addChipText: {
    fontSize: 12.5,
    fontFamily: "Roboto_500Medium",
  },

  assignedCard: {
    marginTop: 12,
    borderRadius: 12,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  assignedAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  assignedAvatarText: {
    fontSize: 12,
    fontFamily: "Roboto_700Bold",
  },
  assignedInfo: {
    flex: 1,
    minWidth: 0,
  },
  assignedName: {
    fontSize: 14,
    fontFamily: "Roboto_700Bold",
  },
  assignedDetails: {
    fontSize: 11.5,
    marginTop: 2,
  },
});
