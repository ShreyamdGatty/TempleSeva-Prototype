import { getPartyData, ProtectedRoute, useAuth } from "@/src/framework/auth";
import { Button, Screen, Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";
import * as Application from "expo-application";
import { router, useFocusEffect } from "expo-router";
import {
  CircleHelp,
  Globe,
  Info,
  ShieldCheck,
  UserRound,
} from "lucide-react-native";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, View } from "react-native";
import ProfileHeader from "./components/ProfileHeader";
import ProfileMenuSection from "./components/ProfileMenuSection";

export default function ProfileContent() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { status, user, signOut } = useAuth();
  const [profileUser, setProfileUser] = useState(user);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const refreshProfile = async () => {
        if (!user?.phone) return;

        try {
          const party = await getPartyData(user.phone);

          if (isMounted) {
            setProfileUser({
              ...user,
              name: party.name || user.name,
              email: party.eMail || party.email || user.email,
              phone: party.mobileNo || user.phone,
            });
          }
        } catch {
          if (isMounted) {
            setProfileUser(user);
          }
        }
      };

      void refreshProfile();

      return () => {
        isMounted = false;
      };
    }, [user]),
  );

  const handleSignOut = () => {
    Alert.alert(
      t("profileContent.signOutTitle"),
      t("profileContent.signOutConfirmation"),
      [
        {
          text: t("profileContent.cancel"),
          style: "cancel",
        },
        {
          text: t("profileContent.signOut"),
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
              router.replace("/login");
            } catch {
              // Sign out failed
            }
          },
        },
      ],
    );
  };

  if (status !== "authenticated" || !user) {
    return (
      <Screen center style={{ backgroundColor: theme.colors.page }}>
        <Text variant="title"> {t("profileContent.signInToViewProfile")}</Text>

        <Button
          title={t("profileContent.signIn")}
          style={styles.signInButton}
          onPress={() => router.push("/login")}
        />
      </Screen>
    );
  }

  return (
    <ProtectedRoute>
      <Screen scroll style={{ backgroundColor: theme.colors.page }}>
        <View style={styles.container}>
          <ProfileHeader user={profileUser || user} />

          <ProfileMenuSection
            title={t("profileContent.account")}
            items={[
              {
                title: t("profileContent.personalInformation"),
                icon: UserRound,
                onPress: () => router.push("/personal-info"),
              },
              {
                title: t("profileContent.devoteeDetails"),
                subtitle: t("profileContent.manageFamilyDevoteeDetails"),
                icon: UserRound,
                onPress: () => router.push("/devotee-details"),
              },
            ]}
          />

          <ProfileMenuSection
            title={t("profileContent.app")}
            items={[
              {
                title: t("profileContent.appLanguage"),
                icon: Globe,
                onPress: () => router.push("/app-language"),
              },

              {
                title: t("profileContent.helpSupport"),
                icon: CircleHelp,
                onPress: () => router.push("/help-support"),
              },
              {
                title: t("profileContent.privacyPolicy"),
                icon: ShieldCheck,
                onPress: () => router.push("/privacy-policy"),
              },
              {
                title: t("profileContent.aboutTempleSeva"),
                icon: Info,
                onPress: () => router.push("/about-templeseva"),
              },
            ]}
          />

          <Button
            title={t("profileContent.signOut")}
            variant="secondary"
            bgColor={theme.colors.accent}
            fgColor={theme.colors.onAccent}
            onPress={handleSignOut}
            style={styles.signOutButton}
          />

          <Text variant="label" color="textMuted" style={styles.version}>
            TempleSeva_
            <Text variant="label" color="textMuted">
              V{Application.nativeApplicationVersion ?? "Unknown"}
            </Text>
          </Text>
        </View>
      </Screen>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 110,
  },
  signInButton: {
    marginTop: 20,
  },
  signOutButton: {
    marginTop: 4,
  },
  version: {
    textAlign: "center",
    marginTop: 18,
  },
});
