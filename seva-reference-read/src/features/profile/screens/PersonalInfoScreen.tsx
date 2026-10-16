import { getAllPartyDevotees } from "@/src/features/profile/services/devotee.service";
import { useAuth } from "@/src/framework/auth";
import { getPartyData, postPartyData } from "@/src/framework/auth/partyService";
import { Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";
import { router, useFocusEffect } from "expo-router";
import {
  ArrowLeft,
  Edit3,
  Mail,
  Phone,
  Save,
  UserRound,
  Users,
} from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type PersonalInformation = {
  name: string;
  email: string;
  phoneNumber: string;
};

export default function PersonalInfoScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { user, updateUser } = useAuth();
  const insets = useSafeAreaInsets();
  const colors = theme.colors;

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [personalInfo, setPersonalInfo] = useState<PersonalInformation>({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const [devoteeCount, setDevoteeCount] = useState(0);

  // --------------------------------------------------
  // LOAD PERSONAL INFORMATION
  // --------------------------------------------------

  useEffect(() => {
    let isMounted = true;

    const loadPersonalInfo = async () => {
      if (!user?.phone) return;

      try {
        const response = await getPartyData(user.phone);

        if (isMounted) {
          const email = response.eMail || response.email || "";

          setPersonalInfo({
            name: response.name || "",
            email: email.toLowerCase(),
            phoneNumber: response.mobileNo || user.phone || "",
          });
        }
      } catch {
        // Profile loading failed
      }
    };

    void loadPersonalInfo();

    return () => {
      isMounted = false;
    };
  }, [user?.phone]);

  // --------------------------------------------------
  // LOAD DEVOTEE COUNT
  // --------------------------------------------------

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const loadDevoteeCount = async () => {
        if (!user?.id) {
          if (isMounted) {
            setDevoteeCount(0);
          }
          return;
        }

        try {
          const response = await getAllPartyDevotees(user.id);

          if (isMounted) {
            setDevoteeCount(response.length);
          }
        } catch {
          if (isMounted) {
            setDevoteeCount(0);
          }
        }
      };

      void loadDevoteeCount();

      return () => {
        isMounted = false;
      };
    }, [user?.id]),
  );

  // --------------------------------------------------
  // SAVE PERSONAL INFORMATION
  // --------------------------------------------------

  const handleSave = async () => {
    if (!user?.id) return;

    const name = personalInfo.name.trim();

    // Always convert email to lowercase
    const email = personalInfo.email.trim().toLowerCase();

    if (!name) return;

    try {
      setIsSaving(true);

      const response = await postPartyData({
        AspNetParty: {
          Id: user.id,
          Name: name,
          Email: email || null,
          MobileNo: personalInfo.phoneNumber,
        },
      });

      const updatedName = response.name || name;

      const updatedEmail = (
        response.eMail ||
        response.email ||
        email
      ).toLowerCase();

      const updatedPhone = response.mobileNo || personalInfo.phoneNumber;

      // Update Personal Information screen
      setPersonalInfo((previous) => ({
        ...previous,
        name: updatedName,
        email: updatedEmail,
        phoneNumber: updatedPhone,
      }));

      // Update AuthProvider global user
      await updateUser({
        name: updatedName,
        email: updatedEmail || undefined,
        phone: updatedPhone,
      });

      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.page,
        },
      ]}
    >
      {/* HEADER */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top,

            backgroundColor: colors.page,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.headerContent}>
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            disabled={isSaving}
          >
            <ArrowLeft size={22} color="#E87516" strokeWidth={2.3} />
          </TouchableOpacity>

          {/* Page Title */}
          <Text style={styles.headerTitle}>{t("personalInfo.title")}</Text>

          {/* Edit Button */}
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => setIsEditing((value) => !value)}
              style={styles.editButton}
              disabled={isSaving}
            >
              <Edit3 size={19} color="#E87516" strokeWidth={2.2} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: insets.bottom + 30,
          },
        ]}
      >
        {/* PROFILE */}
        <View style={styles.profileSection}>
          <View
            style={[
              styles.profileCircle,
              {
                backgroundColor: colors.accentMuted,
                borderColor: colors.accent,
              },
            ]}
          >
            <UserRound size={48} color={colors.accent} />
          </View>

          <Text
            style={[
              styles.profileName,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            {personalInfo.name || t("personalInfo.devotee")}
          </Text>

          <Text
            style={[
              styles.profileSubtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {t("personalInfo.devotee")}
          </Text>
        </View>

        {/* PERSONAL DETAILS */}
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: theme.radii.card,
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.accent,
              },
            ]}
          >
            {t("personalInfo.personalDetails")}
          </Text>

          {/* FULL NAME */}
          <InfoField
            icon={<UserRound size={20} color={colors.accent} />}
            label={t("personalInfo.fullName")}
            value={personalInfo.name}
            editable={isEditing}
            placeholder={t("personalInfo.namePlaceholder")}
            colors={colors}
            onChangeText={(text) =>
              setPersonalInfo((previous) => ({
                ...previous,
                name: text,
              }))
            }
          />

          {/* EMAIL */}
          <InfoField
            icon={<Mail size={20} color={colors.accent} />}
            label={t("personalInfo.emailAddress")}
            value={personalInfo.email}
            editable={isEditing}
            placeholder={t("personalInfo.emailPlaceholder")}
            keyboardType="email-address"
            colors={colors}
            onChangeText={(text) =>
              setPersonalInfo((previous) => ({
                ...previous,

                // Always keep email lowercase
                email: text.toLowerCase(),
              }))
            }
          />

          {/* PHONE */}
          <InfoField
            icon={<Phone size={20} color={colors.accent} />}
            label={t("personalInfo.phoneNumber")}
            value={personalInfo.phoneNumber}
            editable={false}
            placeholder=""
            keyboardType="phone-pad"
            colors={colors}
            onChangeText={() => {}}
            showEditIcon={false}
          />

          {/* DEVOTEE COUNT */}
          <InfoField
            icon={<Users size={20} color={colors.accent} />}
            label={t("personalInfo.devoteesAdded")}
            value={`${devoteeCount} ${
              devoteeCount === 1
                ? t("personalInfo.devoteeSingular")
                : t("personalInfo.devoteePlural")
            }`}
            editable={false}
            placeholder=""
            colors={colors}
            onChangeText={() => {}}
            showEditIcon={false}
          />
        </View>

        {/* SAVE BUTTON */}
        {isEditing && (
          <TouchableOpacity
            style={[
              styles.saveButton,
              {
                backgroundColor: colors.accent,
                opacity: isSaving ? 0.6 : 1,
              },
            ]}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Save size={20} color={colors.onAccent} />

            <Text
              style={[
                styles.saveButtonText,
                {
                  color: colors.onAccent,
                },
              ]}
            >
              {isSaving
                ? t("personalInfo.saving")
                : t("personalInfo.saveChanges")}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

// --------------------------------------------------
// INFO FIELD
// --------------------------------------------------

type InfoFieldProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  editable: boolean;
  placeholder: string;
  onChangeText: (text: string) => void;
  colors: ReturnType<typeof useTheme>["theme"]["colors"];
  keyboardType?: "default" | "phone-pad" | "email-address";
  showEditIcon?: boolean;
};

function InfoField({
  icon,
  label,
  value,
  editable,
  placeholder,
  onChangeText,
  colors,
  keyboardType = "default",
  showEditIcon = true,
}: InfoFieldProps) {
  const { t } = useTranslation();
  return (
    <View
      style={[
        styles.fieldContainer,
        {
          borderBottomColor: colors.border,
        },
      ]}
    >
      {/* FIELD ICON */}
      <View
        style={[
          styles.fieldIcon,
          {
            backgroundColor: colors.accentMuted,
          },
        ]}
      >
        {icon}
      </View>

      {/* FIELD CONTENT */}
      <View style={styles.fieldContent}>
        <Text
          style={[
            styles.fieldLabel,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          {label}
        </Text>

        {editable ? (
          <TextInput
            value={value}
            onChangeText={onChangeText}
            style={[
              styles.input,
              {
                color: colors.textPrimary,
                borderBottomColor: colors.accent,
              },
            ]}
            placeholder={placeholder}
            placeholderTextColor={colors.textMuted}
            keyboardType={keyboardType}
            autoCapitalize={keyboardType === "email-address" ? "none" : "words"}
            autoCorrect={false}
          />
        ) : (
          <Text
            style={[
              styles.fieldValue,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            {value || t("personalInfo.notAvailable")}
          </Text>
        )}
      </View>

      {/* EDIT ICON */}
      {editable && showEditIcon && (
        <Edit3 size={17} color={colors.textSecondary} />
      )}
    </View>
  );
}

// --------------------------------------------------
// STYLES
// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  /* HEADER */
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
    paddingBottom: 10,
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

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  editButton: {
    width: 32,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  /* CONTENT */
  scrollContent: {
    paddingHorizontal: 16,
  },

  profileSection: {
    alignItems: "center",
    paddingVertical: 24,
  },

  profileCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  profileName: {
    marginTop: 12,
    fontSize: 18,
    fontFamily: "Roboto_500Medium",
  },

  profileSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },

  /* PERSONAL DETAILS */
  infoCard: {
    borderWidth: 1,
    padding: 16,
  },

  sectionTitle: {
    textAlign: "center",
    fontFamily: "Roboto_500Medium",
    marginBottom: 10,
  },

  fieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 70,
    borderBottomWidth: 1,
  },

  fieldIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  fieldContent: {
    flex: 1,
  },

  fieldLabel: {
    fontSize: 14,
  },

  fieldValue: {
    fontSize: 15,
    marginTop: 2,
  },

  input: {
    borderBottomWidth: 1,
    fontSize: 14,
    fontFamily: "Roboto_400Regular",
    paddingVertical: 3,
  },

  /* SAVE */
  saveButton: {
    height: 52,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
  },

  saveButtonText: {
    fontFamily: "Roboto_700Bold",
  },
});
