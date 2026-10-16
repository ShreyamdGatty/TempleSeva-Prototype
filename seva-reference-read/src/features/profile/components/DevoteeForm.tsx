import { Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";
import { X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { AspNetPartyDevotee } from "../types/devotee.types";

type Props = {
  devotee?: AspNetPartyDevotee | null;
  onBack: () => void;
  onSubmit: (data: {
    name: string;
    ras: string;
    nak: string;
    got: string;
  }) => Promise<void>;
  submitting?: boolean;
};

const NAKSHATRAS = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
];

const RASHIS = [
  "Mesha (Aries)",
  "Vrishabha (Taurus)",
  "Mithuna (Gemini)",
  "Karka (Cancer)",
  "Simha (Leo)",
  "Kanya (Virgo)",
  "Tula (Libra)",
  "Vrishchika (Scorpio)",
  "Dhanu (Sagittarius)",
  "Makara (Capricorn)",
  "Kumbha (Aquarius)",
  "Meena (Pisces)",
];

export default function DevoteeForm({
  devotee,
  onBack,
  onSubmit,
  submitting = false,
}: Props) {
    const { t } = useTranslation();
  const { theme } = useTheme();

  const [name, setName] = useState("");
  const [ras, setRas] = useState("");
  const [nak, setNak] = useState("");
  const [got, setGot] = useState("");

  const [dropdown, setDropdown] = useState<
    "rashi" | "nakshatra" | null
  >(null);

  // --------------------------------------------------
  // LOAD EXISTING DEVOTEE WHEN EDITING
  // --------------------------------------------------

  useEffect(() => {
    if (devotee) {
      setName(devotee.name ?? "");
      setRas(devotee.ras ?? "");
      setNak(devotee.nak ?? "");
      setGot(devotee.got ?? "");
    } else {
      setName("");
      setRas("");
      setNak("");
      setGot("");
    }
  }, [devotee]);

  const isEditMode = !!devotee;

  const handleSubmit = async () => {
    if (!name.trim() || submitting) {
      return;
    }

    await onSubmit({
      name: name.trim(),
      ras: ras.trim(),
      nak: nak.trim(),
      got: got.trim(),
    });
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
        },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.textPrimary,
              },
            ]}
          >
            {isEditMode   ? t("devoteeForm.editTitle")  : t("devoteeForm.addTitle")}
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: theme.colors.textSecondary,
              },
            ]}
          >
            {isEditMode
                ? t("devoteeForm.updateSubtitle")
             : t("devoteeForm.addSubtitle")}
          </Text>
        </View>

        <Pressable
          onPress={onBack}
          style={({ pressed }) => [
            styles.closeButton,
            {
              backgroundColor: theme.colors.accentMuted,
            },
            pressed && {
              opacity: 0.75,
            },
          ]}
          hitSlop={10}
          disabled={submitting}
        >
          <X
            size={21}
            color={theme.colors.textPrimary}
            strokeWidth={2}
          />
        </Pressable>
      </View>

      {/* Divider */}
      <View
        style={[
          styles.divider,
          {
            backgroundColor: theme.colors.border,
          },
        ]}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={
          Platform.OS === "ios" ? "interactive" : "on-drag"
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Name */}
        <View style={styles.field}>
          <Text
            style={[
              styles.label,
              {
                color: theme.colors.textPrimary,
              },
            ]}
          >
            {t("devoteeForm.name")}
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
           placeholder={t("devoteeForm.namePlaceholder")}
            placeholderTextColor={theme.colors.textMuted}
            style={[
              styles.input,
              {
                borderColor: theme.colors.border,
                color: theme.colors.textPrimary,
                backgroundColor: theme.colors.page,
              },
            ]}
            editable={!submitting}
            autoCapitalize="words"
            autoCorrect
            keyboardType="default"
            returnKeyType="next"
          />
        </View>

        {/* Rashi */}
        <View style={styles.field}>
          <Text
            style={[
              styles.label,
              {
                color: theme.colors.textPrimary,
              },
            ]}
          >
            {t("devoteeForm.rashi")}
          </Text>
          <Pressable
            disabled={submitting}
            onPress={() => setDropdown("rashi")}
            style={({ pressed }) => [
              styles.dropdown,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.page,
              },
              pressed && {
                backgroundColor: theme.colors.accentMuted,
              },
            ]}
          >
            <Text
              style={[
                styles.dropdownText,
                {
                  color: ras
                    ? theme.colors.textPrimary
                    : theme.colors.textMuted,
                },
              ]}
              numberOfLines={1}
            >
              {ras
              ? t(`devoteeForm.rashiOptions.${ras}`)
               : t("devoteeForm.selectRashi")}
            </Text>

            <Text
              style={[
                styles.dropdownArrow,
                {
                  color: theme.colors.textSecondary,
                },
              ]}
            >
              ⌄
            </Text>
          </Pressable>
        </View>

        {/* Nakshatra */}
        <View style={styles.field}>
          <Text
            style={[
              styles.label,
              {
                color: theme.colors.textPrimary,
              },
            ]}
          >
            {t("devoteeForm.nakshatra")}
          </Text>

          <Pressable
            disabled={submitting}
            onPress={() => setDropdown("nakshatra")}
            style={({ pressed }) => [
              styles.dropdown,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.page,
              },
              pressed && {
                backgroundColor: theme.colors.accentMuted,
              },
            ]}
          >
            <Text
              style={[
                styles.dropdownText,
                {
                  color: nak
                    ? theme.colors.textPrimary
                    : theme.colors.textMuted,
                },
              ]}
              numberOfLines={1}
            >
             {nak || t("devoteeForm.selectNakshatra")}
            </Text>

            <Text
              style={[
                styles.dropdownArrow,
                {
                  color: theme.colors.textSecondary,
                },
              ]}
            >
              ⌄
            </Text>
          </Pressable>
        </View>

        {/* Gothra */}
        <View style={styles.field}>
          <Text
            style={[
              styles.label,
              {
                color: theme.colors.textPrimary,
              },
            ]}
          >
            {t("devoteeForm.gothra")}
          </Text>

          <TextInput
            value={got}
            onChangeText={setGot}
            placeholder={t("devoteeForm.gothraPlaceholder")}
            placeholderTextColor={theme.colors.textMuted}
            style={[
              styles.input,
              {
                borderColor: theme.colors.border,
                color: theme.colors.textPrimary,
                backgroundColor: theme.colors.page,
              },
            ]}
            editable={!submitting}
            autoCapitalize="words"
            autoCorrect
            keyboardType="default"
            returnKeyType="done"
            onSubmitEditing={() => void handleSubmit()}
          />
        </View>

        {/* Save / Update */}
        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            {
              backgroundColor: theme.colors.accent,
            },

            (!name.trim() || submitting) && styles.disabledButton,

            pressed &&
              !!name.trim() &&
              !submitting && {
                opacity: 0.85,
              },
          ]}
          disabled={!name.trim() || submitting}
          onPress={() => void handleSubmit()}
        >
          <Text
            style={[
              styles.saveButtonText,
              {
                color: theme.colors.onAccent,
              },
            ]}
          >
            {submitting
              ? isEditMode
                   ? t("devoteeForm.updating")
                : t("devoteeForm.saving")
              : isEditMode
                  ? t("devoteeForm.updateDevotee")
                    : t("devoteeForm.saveDevotee")}
          </Text>
        </Pressable>
      </ScrollView>

      {/* Rashi / Nakshatra Modal */}
      <Modal
        visible={dropdown !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdown(null)}
      >
        <Pressable
          style={[
            styles.dropdownOverlay,
            {
              backgroundColor: "rgba(0, 0, 0, 0.45)",
            },
          ]}
          onPress={() => setDropdown(null)}
        >
          <Pressable
            style={[
              styles.dropdownModal,
              {
                backgroundColor: theme.colors.card,
              },
            ]}
            onPress={(event) => event.stopPropagation()}
          >
            {/* Modal Header */}
            <View
              style={[
                styles.dropdownModalHeader,
                {
                  borderBottomColor: theme.colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.dropdownModalTitle,
                  {
                    color: theme.colors.textPrimary,
                  },
                ]}
              >
                {dropdown === "rashi"
                   ? t("devoteeForm.selectRashiTitle")
                  : t("devoteeForm.selectNakshatraTitle")}
              </Text>

              <Pressable
                onPress={() => setDropdown(null)}
                hitSlop={10}
                style={[
                  styles.dropdownCloseButton,
                  {
                    backgroundColor: theme.colors.accentMuted,
                  },
                ]}
              >
                <X
                  size={19}
                  color={theme.colors.textPrimary}
                />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {(dropdown === "rashi"
                ? RASHIS
                : NAKSHATRAS
              ).map((item) => {
                const selected =
                  dropdown === "rashi"
                    ? ras === item
                    : nak === item;

                return (
                  <Pressable
                    key={item}
                    style={({ pressed }) => [
                      styles.option,
                      {
                        borderBottomColor: theme.colors.border,
                      },

                      selected && {
                        backgroundColor: theme.colors.accentMuted,
                      },

                      pressed && {
                        opacity: 0.75,
                      },
                    ]}
                    onPress={() => {
                      if (dropdown === "rashi") {
                        setRas(item);
                      } else {
                        setNak(item);
                      }

                      setDropdown(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color: selected
                            ? theme.colors.accent
                            : theme.colors.textPrimary,
                          fontWeight: selected ? "700" : "400",
                        },
                      ]}
                    >
                      {item}
                    </Text>

                    {selected && (
                      <Text
                        style={[
                          styles.checkMark,
                          {
                            color: theme.colors.accent,
                          },
                        ]}
                      >
                        ✓
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // --------------------------------------------------
  // HEADER
  // --------------------------------------------------

  header: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 4,
  },

  headerTitleContainer: {
    flex: 1,
    paddingRight: 12,
  },

  title: {
    fontSize: 18,
    fontFamily: "Roboto_700Bold",
  },

  subtitle: {
    marginTop: 3,
    fontSize: 12,
    fontFamily: "Roboto_500Medium",
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },

  divider: {
    height: 1,
  },

  // --------------------------------------------------
  // FORM
  // --------------------------------------------------

  content: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 40,
  },

  field: {
    marginTop: 12,
  },

  label: {
    fontSize: 14,
    
    marginBottom: 6,
  },

  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 11,
    paddingHorizontal: 13,
    fontSize: 12,
    fontFamily: "Roboto_400Regular",
  },

  // --------------------------------------------------
  // BUTTON
  // --------------------------------------------------

  saveButton: {
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  disabledButton: {
    opacity: 0.45,
  },

  saveButtonText: {
    fontSize: 14,
    fontFamily: "Roboto_700Bold",
    
    
  },

  // --------------------------------------------------
  // DROPDOWN
  // --------------------------------------------------

  dropdown: {
    height: 44,
    borderWidth: 1,
    borderRadius: 11,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dropdownText: {
    flex: 1,
    fontSize: 13,
  },

  dropdownArrow: {
    fontSize: 20,
    marginLeft: 8,
    marginTop: -4,
  },

  // --------------------------------------------------
  // DROPDOWN MODAL
  // --------------------------------------------------

  dropdownOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },

  dropdownModal: {
    width: "100%",
    maxWidth: 420,
    maxHeight: "80%",
    borderRadius: 18,
    overflow: "hidden",
  },

  dropdownModalHeader: {
    minHeight: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },

  dropdownModalTitle: {
    fontSize: 17,
    

  },

  dropdownCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  option: {
    minHeight: 48,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },

  optionText: {
    flex: 1,
    fontSize: 14,
  },

  checkMark: {
    fontSize: 18,
    
    marginLeft: 10,
  },
});