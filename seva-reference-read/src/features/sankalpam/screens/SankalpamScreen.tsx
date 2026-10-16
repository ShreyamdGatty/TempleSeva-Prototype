import { useBottomSheet } from "@/src/features/cart/provider/BottomSheetProvider";
import {
  useOrderRows,
  useOrderStore,
} from "@/src/features/checkout/store/orderStore";
import { useAuth } from "@/src/framework/auth";
import { Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";
import { useTempleStore } from "@/src/shared/temple/templeStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  getAllPartyDevotees,
  postPartyDevotee,
} from "../../profile/services/devotee.service";
import CartSummaryCard from "../components/CartSummaryCard";
import FamilyMemberModal from "../components/FamilyMemberModal";
import FamilyProfileList from "../components/FamilyProfileList";
import SankalpamFooter from "../components/SankalpamFooter";
import SankalpamHeader from "../components/SankalpamHeader";
import TicketCard from "../components/TicketCard";
import {
  mapDevoteeToFamilyProfile,
  useFamilyProfileStore,
} from "../store/familyProfileStore";
import type { FamilyProfile } from "../types/sankalpam.types";

export default function SankalpamScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [selectedProfile, setSelectedProfile] = useState<FamilyProfile | null>(
    null,
  );
  const { showPaymentResult } = useBottomSheet();
  const [familyModalVisible, setFamilyModalVisible] = useState(false);
  const [familyModalRowId, setFamilyModalRowId] = useState<string | null>(null);
  const [devoteesLoading, setDevoteesLoading] = useState(false);

  const [devoteesError, setDevoteesError] = useState<string | null>(null);
  const rows = useOrderRows();
  const display = useOrderStore((s) => s.display);
  const worshipDate = useOrderStore((s) => s.worshipDate);
  const formattedWorshipDate = worshipDate
    ? worshipDate.split("-").reverse().join("-")
    : "";
  const setDevotee = useOrderStore((s) => s.setDevotee);

  const profiles = useFamilyProfileStore((state) => state.profiles);

  const addProfile = useFamilyProfileStore((state) => state.addProfile);

  const setProfiles = useFamilyProfileStore((state) => state.setProfiles);
  const selectedTemple = useTempleStore((state) => state.selected);

  // Only rows whose seva needs devotee details (sankalpam).
  const sankalpamRows = useMemo(
    () => rows.filter((r) => display[r.itMastID]?.needsSankalpam === true),
    [rows, display],
  );

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    let cancelled = false;

    const loadDevotees = async () => {
      try {
        setDevoteesLoading(true);
        setDevoteesError(null);

        const devotees = await getAllPartyDevotees(user.id);

        if (cancelled) {
          return;
        }

        const mappedProfiles = devotees.map(mapDevoteeToFamilyProfile);
        setProfiles(mappedProfiles);
      } catch {
        if (!cancelled) {
          setProfiles([]);
          setDevoteesError(t("sankalpamScreen.unableToLoadFamilyMembers"));
        }
      } finally {
        if (!cancelled) {
          setDevoteesLoading(false);
        }
      }
    };

    void loadDevotees();

    return () => {
      cancelled = true;
    };
  }, [user?.id, setProfiles]);

  // Apply a profile's details to a specific row.
  const applyProfileToRow = (profile: FamilyProfile, detId: string) => {
    setDevotee(detId, {
      devoteeName: profile.fullName,
      nak: profile.nakshatra,
      ras: profile.rashi,
      got: profile.gotra,
    });
  };

  if (sankalpamRows.length === 0) {
    // No sevas require devotee details — nothing to assign.
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.page }]}>
        <SankalpamHeader
          templeName={selectedTemple?.orgName ?? ""}
          worshipDate={formattedWorshipDate}
        />
        <View style={styles.emptyWrap}>
          <Ionicons
            name="people-outline"
            size={34}
            color={theme.colors.textMuted}
          />
          <Text
            variant="body"
            style={[styles.emptyText, { color: theme.colors.textSecondary }]}
          >
            {t("sankalpamScreen.noSevasRequireDevotee")}
          </Text>
        </View>
        <SankalpamFooter
          onPaymentResult={(result) => {
            router.back();
            setTimeout(() => {
              showPaymentResult(result);
            }, 300);
          }}
          onPaymentPending={() => {
            router.back();
          }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.page }]}>
      <SankalpamHeader
        templeName={selectedTemple?.orgName ?? ""}
        worshipDate={formattedWorshipDate}
      />

      <FlatList
        data={sankalpamRows}
        keyExtractor={(row) => row.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 120 + insets.bottom },
        ]}
        ListHeaderComponent={
          <View>
            <CartSummaryCard />
            <FamilyProfileList
              selectedProfileId={selectedProfile?.id ?? null}
              onSelectProfile={setSelectedProfile}
              onAddFamily={() => {
                setFamilyModalRowId(null);
                setFamilyModalVisible(true);
              }}
              loading={devoteesLoading}
            />

            {selectedProfile && sankalpamRows.length > 0 && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  // Apply selected profile to ALL sankalpam rows.
                  sankalpamRows.forEach((r) =>
                    applyProfileToRow(selectedProfile, r.id),
                  );
                }}
                style={[
                  styles.applyAllButton,
                  { backgroundColor: theme.colors.accentMuted },
                ]}
              >
                <View
                  style={[
                    styles.applyAllIcon,
                    { backgroundColor: theme.colors.card },
                  ]}
                >
                  <Ionicons
                    name="people-outline"
                    size={17}
                    color={theme.colors.accent}
                  />
                </View>
                <View style={styles.applyAllText}>
                  <Text
                    variant="label"
                    style={[
                      styles.applyAllTitle,
                      { color: theme.colors.textPrimary },
                    ]}
                  >
                    {t("sankalpamScreen.applyToAllTickets")}
                  </Text>
                  <Text
                    variant="label"
                    numberOfLines={1}
                    style={[
                      styles.applyAllSubtitle,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {t("sankalpamScreen.assignToAllSevas", {
                      name: selectedProfile.fullName,
                    })}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={theme.colors.accent}
                />
              </TouchableOpacity>
            )}

            <View style={styles.sectionHeader}>
              <View style={styles.sectionText}>
                <Text
                  variant="heading"
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  {t("sankalpamScreen.devoteeDetails")}
                </Text>
                <Text
                  variant="body"
                  style={[
                    styles.sectionDescription,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {t("sankalpamScreen.assignFamilyMember")}
                </Text>
              </View>

              <View
                style={[
                  styles.sectionCount,
                  { backgroundColor: theme.colors.accentMuted },
                ]}
              >
                <Text
                  variant="label"
                  style={[
                    styles.sectionCountText,
                    { color: theme.colors.accent },
                  ]}
                >
                  {sankalpamRows.length}
                </Text>
              </View>
            </View>
          </View>
        }
        renderItem={({ item, index }) => (
          <TicketCard
            row={item}
            sevaName={
              display[item.itMastID]?.sevaName ?? t("sankalpamScreen.seva")
            }
            slotName={
              display[item.itMastID]?.slotNameById?.[item.SevaSlotID] ?? ""
            }
            ticketNumber={index + 1}
            profiles={profiles}
            onSelectProfile={(profile) => applyProfileToRow(profile, item.id)}
            onAddFamily={() => {
              setFamilyModalRowId(item.id);
              setFamilyModalVisible(true);
            }}
            onClearAssignment={() =>
              setDevotee(item.id, {
                devoteeName: "",
                nak: "",
                ras: "",
                got: "",
              })
            }
          />
        )}
      />

      <SankalpamFooter
        onPaymentResult={(result) => {
          router.back();
          setTimeout(() => {
            showPaymentResult(result);
          }, 300);
        }}
        onPaymentPending={() => {
          router.back();
        }}
      />

      <FamilyMemberModal
        visible={familyModalVisible}
        onClose={() => setFamilyModalVisible(false)}
        onSave={async (data) => {
          if (!user?.id) {
            console.error(
              "[Sankalpam] Cannot create devotee: user not available",
            );
            return;
          }

          try {
            const devotee = await postPartyDevotee({
              AspNetPartyDevotee: {
                id: "",

                aspNetPartyId: user.id,

                name: data.fullName,

                mobileNo: user.phone,

                email: user.email ?? null,

                ras: data.rashi,

                nak: data.nakshatra,

                got: data.gotra,
              },
            });

            const profile = mapDevoteeToFamilyProfile(devotee);

            addProfile(profile);

            setSelectedProfile(profile);

            if (familyModalRowId) {
              applyProfileToRow(profile, familyModalRowId);
            }

            setFamilyModalRowId(null);
            setFamilyModalVisible(false);
          } catch (error) {
            console.error("[Sankalpam] Failed to create devotee:", error);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 120 },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    gap: 12,
  },
  emptyText: { textAlign: "center", fontSize: 14, lineHeight: 20 },

  applyAllButton: {
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  applyAllIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  applyAllText: { flex: 1, minWidth: 0 },
  applyAllTitle: { fontSize: 13, fontFamily: "Roboto_700Bold" },
  applyAllSubtitle: { fontSize: 11.5, marginTop: 2 },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionText: { flex: 1 },
  sectionTitle: { fontSize: 17, fontFamily: "Roboto_700Bold" },
  sectionDescription: { fontSize: 12.5, lineHeight: 18, marginTop: 2 },
  sectionCount: {
    minWidth: 28,
    height: 28,
    paddingHorizontal: 8,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  sectionCountText: { fontSize: 13, fontFamily: "Roboto_700Bold" },
});
