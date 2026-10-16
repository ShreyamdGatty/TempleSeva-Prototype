import { useLocalSearchParams, useRouter } from "expo-router";

import { useState } from "react";

import { Button, Screen, Text } from "../src/framework/components";

import { postPartyData, useAuth } from "../src/framework/auth";

import { StyleSheet, TextInput, View } from "react-native";

export default function ProfileSetup() {
  const router = useRouter();

  const { phone, otpRef } = useLocalSearchParams<{
    phone?: string;
    otpRef?: string;
  }>();

  const { signInWithPhone } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [error, setError] = useState<string | undefined>();

  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // CONTINUE
  // --------------------------------------------------

  const handleContinue = async () => {
    setError(undefined);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    // Name is mandatory
    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }

    // Email is optional, but validate if entered
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    // Phone is required
    if (!phone) {
      setError("Mobile number is missing. Please sign in again.");
      return;
    }

    setLoading(true);

    try {
      // ------------------------------------------------
      // CREATE PARTY
      // DO NOT CHANGE THIS BACKEND REQUEST
      // ------------------------------------------------

      await postPartyData({
        AspNetParty: {
          Id: null,
          Name: trimmedName,
          MobileNo: phone,
          Email: trimmedEmail || null,
        },
      });

      // ------------------------------------------------
      // STORE LOCAL USER
      // ------------------------------------------------

      await signInWithPhone(phone, trimmedName, trimmedEmail || undefined);

      // ------------------------------------------------
      // GO TO HOME
      // ------------------------------------------------

      router.replace("/(tabs)");
    } catch (error) {
      console.error("Unable to save profile:", error);

      setError("Unable to save your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        {/* -------------------------------- */}
        {/* Header */}
        {/* -------------------------------- */}

        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Profile</Text>

          <Text style={styles.subtitle}>
            Help us personalize your experience
          </Text>
        </View>

        {/* -------------------------------- */}
        {/* Profile Placeholder */}
        {/* -------------------------------- */}

        {/* -------------------------------- */}
        {/* Form */}
        {/* -------------------------------- */}

        <View style={styles.form}>
          {/* Full Name */}

          <View style={styles.field}>
            <Text style={styles.label}>Full Name</Text>

            <TextInput
              value={name}
              onChangeText={(value) => {
                setName(value);
                setError(undefined);
              }}
              placeholder="Enter your name"
              placeholderTextColor="#A0A0A0"
              autoComplete="name"
              textContentType="name"
              autoCapitalize="words"
              style={styles.textInput}
            />
          </View>

          {/* Email */}

          <View style={styles.field}>
            <Text style={styles.label}>Email (Optional)</Text>

            <TextInput
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setError(undefined);
              }}
              placeholder="Enter your email"
              placeholderTextColor="#A0A0A0"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              style={styles.textInput}
            />
          </View>

          {/* Error */}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {/* Continue */}

          <Button
            title="Continue"
            onPress={handleContinue}
            loading={loading}
            style={styles.continueButton}
          />
        </View>

        {/* -------------------------------- */}
        {/* Footer */}
        {/* -------------------------------- */}

        <View style={styles.footer}>
          <Text style={styles.footerText}>You can change this later</Text>

          <Text style={styles.footerText}>in Profile Settings</Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  // --------------------------------
  // Screen
  // --------------------------------

  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // --------------------------------
  // Main Container
  // --------------------------------

  container: {
    flex: 1,

    justifyContent: "center",

    width: "100%",

    maxWidth: 420,

    alignSelf: "center",

    paddingHorizontal: 16,

    paddingBottom: 20,
  },

  // --------------------------------
  // Header
  // --------------------------------

  header: {
    width: "100%",

    marginBottom: 18,
  },

  title: {
    fontSize: 24,

    lineHeight: 30,

    fontFamily: "Roboto_700Bold",

    color: "#222222",
  },

  subtitle: {
    marginTop: 4,

    fontSize: 14,

    lineHeight: 20,

    color: "#777777",
  },

  // --------------------------------
  // Avatar
  // --------------------------------

  avatarContainer: {
    alignItems: "center",

    justifyContent: "center",

    marginBottom: 22,
  },

  avatar: {
    width: 88,
    height: 88,

    borderRadius: 44,

    backgroundColor: "#E8E8E8",

    justifyContent: "flex-end",

    alignItems: "center",

    overflow: "hidden",
  },

  avatarHead: {
    width: 28,
    height: 28,

    borderRadius: 14,

    backgroundColor: "#C9C9C9",

    marginBottom: 5,
  },

  avatarBody: {
    width: 58,
    height: 34,

    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,

    backgroundColor: "#C9C9C9",
  },

  // --------------------------------
  // Form
  // --------------------------------

  form: {
    width: "100%",
  },

  field: {
    marginBottom: 16,
  },

  label: {
    fontSize: 12,

    lineHeight: 16,

    

    color: "#444444",

    marginBottom: 6,
  },

  textInput: {
    width: "100%",
    height: 48,

    borderWidth: 1,
    borderColor: "#D8D8D8",

    borderRadius: 7,

    backgroundColor: "#FFFFFF",

    paddingHorizontal: 12,
    paddingVertical: 0,

    fontSize: 13,
    lineHeight: 18,

    color: "#222222",

    textAlignVertical: "center",
  },

  // --------------------------------
  // Error
  // --------------------------------

  error: {
    fontSize: 12,

    lineHeight: 17,

    color: "#D32F2F",

    marginTop: -4,

    marginBottom: 4,
  },

  // --------------------------------
  // Continue
  // --------------------------------

  continueButton: {
    width: "100%",

    height: 50,

    marginTop: 4,

    borderRadius: 8,
  },

  // --------------------------------
  // Footer
  // --------------------------------

  footer: {
    alignItems: "center",

    justifyContent: "center",

    marginTop: 22,
  },

  footerText: {
    fontSize: 11,

    lineHeight: 16,

    color: "#777777",

    textAlign: "center",
  },
});
