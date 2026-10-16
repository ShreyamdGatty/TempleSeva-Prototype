import { CheckCircle2, Mail, Phone } from "lucide-react-native";

import { StyleSheet, View } from "react-native";

import type { User } from "@/src/framework/auth";

import { Avatar, Card, Text } from "@/src/framework/components";

import { useTheme } from "@/src/framework/theme";

type Props = {
  user: User;
};

export default function ProfileHeader({ user }: Props) {
  const { theme } = useTheme();

  return (
    <Card
      elevated
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.page,
        },
      ]}
    >
      <View style={styles.profileRow}>
        <Avatar name={user.name} size={72} />

        <View style={styles.info}>
          {/* NAME */}
          <Text variant="title" numberOfLines={1}>
            {user.name}
          </Text>

          {/* PHONE */}
          <View style={styles.detailRow}>
            <Phone size={14} color={theme.colors.textSecondary} />

            <Text
              variant="label"
              color="textSecondary"
              style={styles.detailText}
            >
              {user.phone}
            </Text>
          </View>

          {/* EMAIL */}
          {user.email ? (
            <View style={styles.detailRow}>
              <Mail size={14} color={theme.colors.textSecondary} />

              <Text
                variant="label"
                color="textSecondary"
                numberOfLines={1}
                style={[styles.detailText, styles.emailText]}
              >
                {user.email.toLowerCase()}
              </Text>
            </View>
          ) : null}

          {/* VERIFIED */}
          <View style={styles.verifiedRow}>
            <CheckCircle2 size={14} color={theme.colors.success} />

            <Text variant="label" color="success" style={styles.verifiedText}>
              Verified
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 20,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  info: {
    flex: 1,
    marginLeft: 16,
    gap: 5,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  detailText: {
    marginLeft: 6,
  },

  // IMPORTANT:
  // Prevent the label typography from changing
  // the email display to uppercase.
  emailText: {
    textTransform: "none",
  },

  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },

  verifiedText: {
    marginLeft: 5,
  },
});
