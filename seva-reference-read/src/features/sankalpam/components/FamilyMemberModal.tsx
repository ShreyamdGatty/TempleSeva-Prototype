import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";
import { useRef, useState } from "react";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    fullName: string;
    nakshatra: string;
    rashi: string;
    gotra: string;
  }) => Promise<void>;
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

export default function FamilyMemberModal({ visible, onClose, onSave }: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [fullName, setFullName] = useState("");
  const [nakshatra, setNakshatra] = useState("");
  const [rashi, setRashi] = useState("");
  const [gotra, setGotra] = useState("");

  // Refs so tapping anywhere on a field focuses its input and opens the keyboard.
  const nameInputRef = useRef<TextInput>(null);
  const gotraInputRef = useRef<TextInput>(null);

  const [showNakshatraList, setShowNakshatraList] = useState(false);
  const [showRashiList, setShowRashiList] = useState(false);

  const resetForm = () => {
    setFullName("");
    setNakshatra("");
    setRashi("");
    setGotra("");
    setShowNakshatraList(false);
    setShowRashiList(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (saving) {
      return;
    }

    const name = fullName.trim();
    const gotraValue = gotra.trim();

    if (!name || !nakshatra || !rashi || !gotraValue) {
      return;
    }

    try {
      setSaving(true);

      await onSave({
        fullName: name,
        nakshatra,
        rashi,
        gotra: gotraValue,
      });

      resetForm();
    } catch (error) {
      console.error("[FamilyMemberModal] Save failed:", error);
    } finally {
      setSaving(false);
    }
  };

  const isValid =
    fullName.trim().length > 1 &&
    nakshatra.length > 0 &&
    rashi.length > 0 &&
    gotra.trim().length > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      onShow={() => nameInputRef.current?.focus()}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.backdrop}
          onPress={handleClose}
        />

        <View
          style={[
            styles.modalCard,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <View
                style={[
                  styles.headerIcon,
                  { backgroundColor: theme.colors.accentMuted },
                ]}
              >
                <Ionicons
                  name="person-add-outline"
                  size={20}
                  color={theme.colors.accent}
                />
              </View>

              <View style={styles.headerText}>
                <Text
                  variant="heading"
                  style={[styles.title, { color: theme.colors.textPrimary }]}
                >
                  {t("familyMember.addFamilyMember")}
                </Text>

                <Text
                  variant="label"
                  style={[
                    styles.subtitle,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {t("familyMember.saveDetailsForFutureSevaBookings")}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleClose}
              style={[
                styles.closeButton,
                { backgroundColor: theme.colors.onAccent },
              ]}
              hitSlop={8}
            >
              <Ionicons
                name="close"
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
            contentContainerStyle={styles.content}
          >
            {/* Full Name */}
            <View style={styles.field}>
              <Text
                variant="label"
                style={[styles.label, { color: theme.colors.textPrimary }]}
              >
                {t("familyMember.fullName")}
              </Text>

              <Pressable
                onPress={() => nameInputRef.current?.focus()}
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: theme.colors.onAccent,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={theme.colors.textSecondary}
                />

                <TextInput
                  ref={nameInputRef}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder={t("familyMember.enterFullName")}
                  placeholderTextColor={theme.colors.textMuted}
                  style={[
                    styles.input,
                    {
                      color: theme.colors.textPrimary,
                      fontFamily: "Roboto_400Regular",
                    },
                  ]}
                  autoCapitalize="words"
                  returnKeyType="done"
                />
              </Pressable>
            </View>

            {/* Nakshatra */}
            <View style={styles.field}>
              <Text
                variant="label"
                style={[styles.label, { color: theme.colors.textPrimary }]}
              >
                {t("familyMember.nakshatra")}
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  Keyboard.dismiss();
                  setShowNakshatraList((value) => !value);
                  setShowRashiList(false);
                }}
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: theme.colors.onAccent,
                    borderColor: showNakshatraList
                      ? theme.colors.accent
                      : theme.colors.border,
                  },
                ]}
              >
                <Ionicons
                  name="star-outline"
                  size={18}
                  color={theme.colors.accent}
                />

                <Text
                  variant="label"
                  numberOfLines={1}
                  style={[
                    styles.selectText,
                    {
                      color: nakshatra
                        ? theme.colors.textPrimary
                        : theme.colors.textMuted,
                    },
                  ]}
                >
                  {nakshatra || t("familyMember.selectNakshatra")}
                </Text>

                <Ionicons
                  name={showNakshatraList ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>

              {showNakshatraList && (
                <View
                  style={[
                    styles.optionsContainer,
                    {
                      backgroundColor: theme.colors.card,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
                    contentContainerStyle={styles.content}
                  >
                    {NAKSHATRAS.map((item) => (
                      <TouchableOpacity
                        key={item}
                        activeOpacity={0.7}
                        onPress={() => {
                          setNakshatra(item);
                          setShowNakshatraList(false);
                        }}
                        style={[
                          styles.option,
                          {
                            backgroundColor:
                              nakshatra === item
                                ? theme.colors.accentMuted
                                : "transparent",
                          },
                        ]}
                      >
                        <Text
                          variant="label"
                          style={[
                            styles.optionText,
                            { color: theme.colors.textPrimary },
                          ]}
                        >
                          {item}
                        </Text>

                        {nakshatra === item && (
                          <Ionicons
                            name="checkmark"
                            size={17}
                            color={theme.colors.accent}
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Rashi */}
            <View style={styles.field}>
              <Text
                variant="label"
                style={[styles.label, { color: theme.colors.textPrimary }]}
              >
                {t("familyMember.rashi")}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  Keyboard.dismiss();
                  setShowRashiList((value) => !value);
                  setShowNakshatraList(false);
                }}
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: theme.colors.onAccent,
                    borderColor: showRashiList
                      ? theme.colors.accent
                      : theme.colors.border,
                  },
                ]}
              >
                <Ionicons
                  name="moon-outline"
                  size={18}
                  color={theme.colors.accent}
                />

                <Text
                  variant="label"
                  numberOfLines={1}
                  style={[
                    styles.selectText,
                    {
                      color: rashi
                        ? theme.colors.textPrimary
                        : theme.colors.textMuted,
                    },
                  ]}
                >
                  {rashi || t("familyMember.selectRashi")}
                </Text>

                <Ionicons
                  name={showRashiList ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>

              {showRashiList && (
                <View
                  style={[
                    styles.optionsContainer,
                    {
                      backgroundColor: theme.colors.card,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
                    contentContainerStyle={styles.content}
                  >
                    {RASHIS.map((item) => (
                      <TouchableOpacity
                        key={item}
                        activeOpacity={0.7}
                        onPress={() => {
                          setRashi(item);
                          setShowRashiList(false);
                        }}
                        style={[
                          styles.option,
                          {
                            backgroundColor:
                              rashi === item
                                ? theme.colors.accentMuted
                                : "transparent",
                          },
                        ]}
                      >
                        <Text
                          variant="label"
                          style={[
                            styles.optionText,
                            { color: theme.colors.textPrimary },
                          ]}
                        >
                          {item}
                        </Text>

                        {rashi === item && (
                          <Ionicons
                            name="checkmark"
                            size={17}
                            color={theme.colors.accent}
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Gotra */}
            <View style={styles.field}>
              <Text
                variant="label"
                style={[styles.label, { color: theme.colors.textPrimary }]}
              >
                {t("familyMember.gotra")}
              </Text>

              <Pressable
                onPress={() => gotraInputRef.current?.focus()}
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: theme.colors.onAccent,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Ionicons
                  name="git-branch-outline"
                  size={18}
                  color={theme.colors.textSecondary}
                />

                <TextInput
                  ref={gotraInputRef}
                  value={gotra}
                  onChangeText={setGotra}
                  placeholder={t("familyMember.enterGotra")}
                  placeholderTextColor={theme.colors.textMuted}
                  style={[
                    styles.input,
                    {
                      color: theme.colors.textPrimary,
                      fontFamily: "Roboto_400Regular",
                    },
                  ]}
                  autoCapitalize="words"
                  returnKeyType="done"
                />
              </Pressable>
            </View>

            <View
              style={[
                styles.infoBox,
                { backgroundColor: theme.colors.accentMuted },
              ]}
            >
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={theme.colors.accent}
              />

              <Text
                variant="label"
                style={[styles.infoText, { color: theme.colors.accent }]}
              >
                {t("familyMember.detailsSavedInfo")}
              </Text>
            </View>
          </ScrollView>

          <View
            style={[styles.footer, { borderTopColor: theme.colors.border }]}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={!isValid || saving}
              onPress={handleSave}
              style={[
                styles.saveButton,
                {
                  backgroundColor: isValid
                    ? theme.colors.accent
                    : theme.colors.border,
                },
              ]}
            >
              <Text
                variant="label"
                style={[
                  styles.saveText,
                  {
                    color: isValid
                      ? theme.colors.onAccent
                      : theme.colors.textMuted,
                  },
                ]}
              >
                {saving
                  ? t("familyMember.saving")
                  : t("familyMember.saveFamilyMember")}
              </Text>

              <Ionicons
                name={saving ? "hourglass-outline" : "checkmark-circle-outline"}
                size={19}
                color={isValid ? theme.colors.onAccent : theme.colors.textMuted}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "center", alignItems: "center" },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  modalCard: {
    width: "90%",
    maxHeight: "82%",
    borderRadius: 22,
    borderWidth: 1,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
  },
  headerInfo: { flex: 1, flexDirection: "row", alignItems: "center" },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  headerText: { flex: 1 },
  title: { fontSize: 17, fontFamily: "Roboto_700Bold" },
  subtitle: { fontSize: 10, marginTop: 3 },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  content: { paddingHorizontal: 18, paddingBottom: 18 },
  field: { marginBottom: 16 },
  label: { fontSize: 11, marginBottom: 7 },
  inputContainer: {
    minHeight: 46,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  // Fill the full height of the field so the whole row is a tap target.
  input: {
    flex: 1,
    alignSelf: "stretch",
    fontSize: 10,
    marginLeft: 9,
    paddingVertical: 0,
  },
  selectText: { flex: 1, fontSize: 10, marginLeft: 9 },
  optionsContainer: {
    marginTop: 6,
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  optionsList: { maxHeight: 180 },
  option: {
    minHeight: 40,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionText: { fontSize: 12, flex: 1 },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 12,
    padding: 11,
    marginTop: 2,
  },
  infoText: { flex: 1, fontSize: 10, lineHeight: 15, marginLeft: 8 },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 14,
  },
  saveButton: {
    minHeight: 46,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  saveText: { fontSize: 12, fontFamily: "Roboto_700Bold" },
});
