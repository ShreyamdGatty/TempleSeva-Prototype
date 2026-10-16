import {
  deletePartyDevotee,
  getAllPartyDevotees,
  postPartyDevotee,
} from "@/src/features/profile/services/devotee.service";
import { useAuth } from "@/src/framework/auth";
import { Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";
import { router } from "expo-router";
import {
  ArrowLeft,
  Pencil,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DevoteeForm from "../components/DevoteeForm";
import { AspNetPartyDevotee } from "../types/devotee.types";

export default function DevoteeDetailsScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const [devotees, setDevotees] = useState<AspNetPartyDevotee[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDevotee, setEditingDevotee] =
    useState<AspNetPartyDevotee | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSaveDevotee = async (data: {
    name: string;
    ras: string;
    nak: string;
    got: string;
  }) => {
    if (!user?.id) return;

    try {
      setSubmitting(true);

      const response = await postPartyDevotee({
        AspNetPartyDevotee: {
          id: editingDevotee?.id ?? "",
          aspNetPartyId: user.id,
          name: data.name,
          mobileNo: user.phone,
          email: user.email ?? null,
          ras: data.ras,
          nak: data.nak,
          got: data.got,
        },
      });

      if (editingDevotee) {
        setDevotees((current) =>
          current.map((devotee) =>
            devotee.id === editingDevotee.id ? response : devotee,
          ),
        );
      } else {
        setDevotees((current) => [...current, response]);
      }

      setEditingDevotee(null);
      setShowAddForm(false);
    } catch {
      Alert.alert(
        t("devoteeDetails.saveFailed"),
        t("devoteeDetails.unableToSave"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditDevotee = (devotee: AspNetPartyDevotee) => {
    setEditingDevotee(devotee);
    setShowAddForm(false);
  };

  const loadDevotees = useCallback(
    async (isRefresh = false) => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setError(null);

        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response = await getAllPartyDevotees(user.id);
        setDevotees(response);
      } catch {
        setError(t("devoteeDetails.unableToLoad"));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user?.id],
  );

  useEffect(() => {
    void loadDevotees();
  }, [loadDevotees]);

  const confirmDeleteDevotee = async (devotee: AspNetPartyDevotee) => {
    if (!devotee.id || !devotee.aspNetPartyId) return;

    try {
      setDeletingId(devotee.id);

      await deletePartyDevotee({
        aspNetPartyId: devotee.aspNetPartyId,
        aspNetPartyDevoteeId: devotee.id,
      });

      setDevotees((current) =>
        current.filter((item) => item.id !== devotee.id),
      );
    } catch {
      Alert.alert(
        t("devoteeDetails.deleteFailed"),
        t("devoteeDetails.unableToDelete"),
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteDevotee = (devotee: AspNetPartyDevotee) => {
    Alert.alert(
      t("devoteeDetails.deleteTitle"),
      t("devoteeDetails.deleteConfirmation", {
        name: devotee.name,
      }),
      [
        {
          text: t("devoteeDetails.cancel"),
          style: "cancel",
        },
        {
          text: t("devoteeDetails.delete"),
          style: "destructive",
          onPress: () => {
            void confirmDeleteDevotee(devotee);
          },
        },
      ],
    );
  };

  const renderDevotee = ({ item }: { item: AspNetPartyDevotee }) => {
    const isDeleting = deletingId === item.id;

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
        {/* Avatar */}
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: theme.colors.accentMuted,
            },
          ]}
        >
          <UserRound size={22} color={theme.colors.accent} />
        </View>

        {/* Devotee Details */}
        <View style={styles.cardContent}>
          <Text
            style={[
              styles.name,
              {
                color: theme.colors.textPrimary,
              },
            ]}
            numberOfLines={1}
          >
            {item.name}
          </Text>

          <Text
            style={[
              styles.details,
              {
                color: theme.colors.textSecondary,
              },
            ]}
            numberOfLines={1}
          >
            {item.nak || t("devoteeDetails.nakshatraNotAdded")}
            {" • "}
            {item.ras || t("devoteeDetails.rashiNotAdded")}
          </Text>

          <Text
            style={[
              styles.gothra,
              {
                color: theme.colors.textMuted,
              },
            ]}
            numberOfLines={1}
          >
            {t("devoteeDetails.gothra")}:{" "}
            {item.got || t("devoteeDetails.notAdded")}
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.iconButton,
              {
                backgroundColor: theme.colors.accentMuted,
              },
              pressed && styles.pressed,
            ]}
            onPress={() => handleEditDevotee(item)}
            disabled={submitting || isDeleting}
            hitSlop={8}
          >
            <Pencil size={18} color={theme.colors.accent} strokeWidth={2} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.iconButton,
              {
                backgroundColor: theme.colors.accentMuted,
              },
              pressed && styles.pressed,
            ]}
            onPress={() => handleDeleteDevotee(item)}
            disabled={submitting || isDeleting}
            hitSlop={8}
          >
            <Trash2 size={18} color={theme.colors.error} strokeWidth={2} />
          </Pressable>
        </View>
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text
            style={[
              styles.emptyTitle,
              {
                color: theme.colors.textPrimary,
              },
            ]}
          >
            {t("devoteeDetails.unableToLoadDevotees")}
          </Text>

          <Text
            style={[
              styles.emptyDescription,
              {
                color: theme.colors.textSecondary,
              },
            ]}
          >
            {t("devoteeDetails.pleaseTryAgain")}
          </Text>

          <Pressable
            style={[
              styles.retryButton,
              {
                backgroundColor: theme.colors.accent,
              },
            ]}
            onPress={() => void loadDevotees()}
          >
            <Text
              style={[
                styles.retryText,
                {
                  color: theme.colors.onAccent,
                },
              ]}
            >
              {t("devoteeDetails.tryAgain")}
            </Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <View
          style={[
            styles.emptyIcon,
            {
              backgroundColor: theme.colors.accentMuted,
            },
          ]}
        >
          <UserRound size={32} color={theme.colors.accent} />
        </View>

        <Text
          style={[
            styles.emptyTitle,
            {
              color: theme.colors.textPrimary,
            },
          ]}
        >
          {t("devoteeDetails.noDetailsYet")}
        </Text>

        <Text
          style={[
            styles.emptyDescription,
            {
              color: theme.colors.textSecondary,
            },
          ]}
        >
          {t("devoteeDetails.addFamilyDetails")}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.page,
        },
      ]}
    >
      {/* HEADER - SAME AS PRIVACY POLICY */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top,
            paddingBottom: 15,
            backgroundColor: theme.colors.page,
            borderBottomColor: theme.colors.border,
          },
        ]}
      >
        <View style={styles.headerContent}>
          {/* Back Button */}
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
            hitSlop={8}
          >
            <ArrowLeft size={22} color="#E87516" strokeWidth={2.3} />
          </Pressable>

          {/* Page Title */}
          <Text style={styles.headerTitle}>{t("devoteeDetails.title")}</Text>
        </View>
      </View>

      {/* LOADING / LIST */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.accent} />

          <Text
            style={[
              styles.loadingText,
              {
                color: theme.colors.textSecondary,
              },
            ]}
          >
            {t("devoteeDetails.loadingDetails")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={devotees}
          keyExtractor={(item) => item.id}
          renderItem={renderDevotee}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={[
            styles.listContent,
            devotees.length === 0 && styles.emptyListContent,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void loadDevotees(true)}
              tintColor={theme.colors.accent}
            />
          }
        />
      )}

      {/* ADD DEVOTEE BUTTON */}
      <Pressable
        style={[
          styles.addButton,
          {
            backgroundColor: theme.colors.accent,
            bottom: insets.bottom + 16,
          },
        ]}
        onPress={() => setShowAddForm(true)}
      >
        <Plus size={20} color={theme.colors.onAccent} />

        <Text
          style={[
            styles.addButtonText,
            {
              color: theme.colors.onAccent,
            },
          ]}
        >
          {t("devoteeDetails.addDevotee")}
        </Text>
      </Pressable>

      {/* DEVOTEE FORM MODAL */}
      <Modal
        visible={showAddForm || editingDevotee !== null}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!submitting) {
            setShowAddForm(false);
            setEditingDevotee(null);
          }
        }}
      >
        <KeyboardAvoidingView
          style={styles.modalKeyboardContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
          <View
            style={[
              styles.modalOverlay,
              {
                paddingTop: insets.top + 20,
                paddingBottom: insets.bottom + 20,
                paddingHorizontal: 16,
              },
            ]}
          >
            <View
              style={[
                styles.modalContainer,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <DevoteeForm
                devotee={editingDevotee}
                onBack={() => {
                  if (!submitting) {
                    setShowAddForm(false);
                    setEditingDevotee(null);
                  }
                }}
                onSubmit={handleSaveDevotee}
                submitting={submitting}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  /* HEADER - SAME AS PRIVACY POLICY */
  header: {
    width: "100%",
    height: 92,
    borderBottomWidth: 1,
  },

  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "#F4DDC5",
    backgroundColor: "#FFF6EC",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    marginLeft: 14,
    fontSize: 18,
    fontFamily: "Roboto_700Bold",
    color: "#3B2115",
  },

  brandContainer: {
    width: 120,
    alignItems: "flex-end",
    justifyContent: "center",
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  brandTitle: {
    fontSize: 12,

    lineHeight: 20,
    color: "#E87516",
    includeFontPadding: false,
  },

  brandTagline: {
    marginTop: 2,
    fontSize: 8,
    letterSpacing: 0.2,
    color: "#5C4034",
    includeFontPadding: false,
  },

  /* LIST */
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },

  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
    marginBottom: 14,
    borderWidth: 1,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  cardContent: {
    flex: 1,
    minWidth: 0,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    gap: 6,
  },

  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  pressed: {
    opacity: 0.7,
  },

  name: {
    fontSize: 14,
    fontFamily: "Roboto_700Bold",
  },

  details: {
    marginTop: 4,
    fontSize: 13,
  },

  gothra: {
    marginTop: 3,
    fontSize: 13,
  },

  /* LOADING */
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },

  /* EMPTY */
  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: 40,
  },

  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  emptyTitle: {
    fontSize: 18,
    textAlign: "center",
  },

  emptyDescription: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },

  retryButton: {
    marginTop: 18,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },

  retryText: {
    fontSize: 14,
  },

  /* ADD BUTTON */
  addButton: {
    position: "absolute",
    left: 20,
    right: 20,
    height: 52,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  addButtonText: {
    fontSize: 15,
    fontFamily: "Roboto_700Bold",
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },

  modalContainer: {
    width: "100%",
    minHeight: 500,
    maxHeight: "85%",
    maxWidth: 600,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },

  modalKeyboardContainer: {
    flex: 1,
  },
});
