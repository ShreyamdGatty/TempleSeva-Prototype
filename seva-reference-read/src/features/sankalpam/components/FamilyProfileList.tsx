import { Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { useFamilyProfileStore } from "../store/familyProfileStore";
import { FamilyProfile } from "../types/sankalpam.types";

type Props = {
  selectedProfileId?: string | null;

  onSelectProfile: (profile: FamilyProfile) => void;

  onAddFamily: () => void;

  loading?: boolean;
};

export default function FamilyProfileList({
  selectedProfileId,
  onSelectProfile,
  onAddFamily,
  loading = false,
}: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const profiles = useFamilyProfileStore((state) => state.profiles);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text
            variant="heading"
            style={[styles.title, { color: theme.colors.textPrimary }]}
          >
            {t("familyProfile.savedFamilyMembers")}
          </Text>

          <Text
            variant="label"
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            {t("familyProfile.selectFamilyMember")}
          </Text>
        </View>

        {profiles.length > 0 && (
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
              {profiles.length}
            </Text>
          </View>
        )}
      </View>

      {loading ? (
        <View
          style={[
            styles.loadingContainer,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <ActivityIndicator size="small" color={theme.colors.accent} />

          <View style={styles.loadingText}>
            <Text
              variant="label"
              style={[styles.loadingTitle, { color: theme.colors.textPrimary }]}
            >
              {t("familyProfile.loadingFamilyMembers")}
            </Text>

            <Text
              variant="label"
              style={[
                styles.loadingDescription,
                { color: theme.colors.textSecondary },
              ]}
            >
              {t("familyProfile.checkingSavedFamilyMembers")}
            </Text>
          </View>
        </View>
      ) : (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {profiles.map((profile) => {
              const selected = profile.id === selectedProfileId;

              return (
                <TouchableOpacity
                  key={profile.id}
                  activeOpacity={0.8}
                  onPress={() => onSelectProfile(profile)}
                  style={[
                    styles.profileCard,
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
                  <View
                    style={[
                      styles.avatar,
                      {
                        backgroundColor: selected
                          ? theme.colors.accent
                          : theme.colors.accentMuted,
                      },
                    ]}
                  >
                    <Text
                      variant="heading"
                      style={[
                        styles.avatarText,
                        {
                          color: selected
                            ? theme.colors.onAccent
                            : theme.colors.accent,
                        },
                      ]}
                    >
                      {getInitials(profile.fullName)}
                    </Text>
                  </View>

                  <View style={styles.profileInfo}>
                    <Text
                      variant="title"
                      numberOfLines={1}
                      style={[styles.name, { color: theme.colors.textPrimary }]}
                    >
                      {profile.fullName}
                    </Text>

                    <Text
                      variant="label"
                      numberOfLines={1}
                      style={[
                        styles.details,
                        { color: theme.colors.textSecondary },
                      ]}
                    >
                      {profile.nakshatra}
                      {" · "}
                      {profile.rashi}
                    </Text>
                  </View>

                  {selected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={theme.colors.accent}
                    />
                  )}
                </TouchableOpacity>
              );
            })}

            {/* Add family member */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onAddFamily}
              style={[
                styles.addCard,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.addIcon,
                  { backgroundColor: theme.colors.accentMuted },
                ]}
              >
                <Ionicons name="add" size={20} color={theme.colors.accent} />
              </View>

              <Text
                variant="label"
                numberOfLines={2}
                style={[styles.addText, { color: theme.colors.accent }]}
              >
                {t("familyProfile.addFamilyMember")}
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {profiles.length === 0 && (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="people-outline"
                size={20}
                color={theme.colors.textMuted}
              />

              <View style={styles.emptyText}>
                <Text
                  variant="label"
                  style={[
                    styles.emptyTitle,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  {t("familyProfile.noFamilyMembersSaved")}
                </Text>

                <Text
                  variant="label"
                  style={[
                    styles.emptyDescription,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {t("familyProfile.reuseFamilyMemberDetails")}
                </Text>
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

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

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontFamily: "Roboto_700Bold",
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  countBadge: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: 7,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  countText: {
    fontSize: 12,
    fontFamily: "Roboto_700Bold",
  },

  scrollContent: {
    gap: 10,
    paddingRight: 4,
  },

  profileCard: {
    width: 208,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarText: {
    fontSize: 13,
    fontFamily: "Roboto_700Bold",
  },
  profileInfo: {
    flex: 1,
    minWidth: 0,
    marginRight: 6,
  },
  name: {
    fontSize: 14,
    fontFamily: "Roboto_500Medium",
  },
  details: {
    fontSize: 11.5,
    marginTop: 2,
  },

  addCard: {
    width: 132,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  addIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  addText: {
    flex: 1,
    fontSize: 12.5,
    fontFamily: "Roboto_500Medium",
  },

  loadingContainer: {
    minHeight: 64,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  loadingText: {
    flex: 1,
    marginLeft: 12,
  },
  loadingTitle: {
    fontSize: 13,
    fontFamily: "Roboto_500Medium",
  },
  loadingDescription: {
    fontSize: 11.5,
    marginTop: 2,
  },

  emptyContainer: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  emptyText: {
    flex: 1,
    marginLeft: 10,
  },
  emptyTitle: {
    fontSize: 13,
    fontFamily: "Roboto_500Medium",
  },
  emptyDescription: {
    fontSize: 11.5,
    marginTop: 2,
  },
});
