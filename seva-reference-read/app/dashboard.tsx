import { useRouter } from "expo-router";
import { Alert, View } from "react-native";
import { ProtectedRoute, useAuth } from "../src/framework/auth";
import { Button, Card, Screen, Text } from "../src/framework/components";

export default function Dashboard() {
  const { status, user, signOut, requireAuth } = useAuth();
  const router = useRouter();
  const isGuest = status === "guest";

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const handleProtectedAction = () => {
    requireAuth(() => {
      Alert.alert("Success", "Protected action ran — you are signed in.");
    });
  };

  return (
    <ProtectedRoute>
      <Screen scroll>
        <Text variant="heading">Dashboard</Text>
        <Text variant="body" color="textSecondary">
          {isGuest ? "Browsing as guest" : `Signed in as ${user?.email}`}
        </Text>

        <Card elevated style={{ gap: 2, margin: 10 }}>
          <Text variant="label" color="textSecondary">
            Open Card
          </Text>
          <Text variant="title">Always visible</Text>
          <Text variant="body" color="textSecondary">
            Everyone can see this content.
          </Text>
        </Card>

        <Card style={{ gap: 8, opacity: isGuest ? 0.6 : 1, margin: 10 }}>
          <Text variant="label" color="textSecondary">
            Premium Card
          </Text>
          <Text variant="title">{isGuest ? "🔒 Locked" : "Unlocked"}</Text>
          {isGuest ? (
            <Button
              title="Sign in to unlock"
              variant="secondary"
              onPress={() => router.push("/login")}
            />
          ) : (
            <Text variant="body" color="textSecondary">
              Full access granted.
            </Text>
          )}
        </Card>

        {/* Action gated by requireAuth — visible to all, runs only if signed in */}
        <Card style={{ gap: 8, margin: 10 }}>
          <Text variant="label" color="textSecondary">
            Gated Action
          </Text>
          <Text variant="body" color="textSecondary">
            Guests are sent to login; signed-in users run it.
          </Text>
          <Button title="Do protected thing" onPress={handleProtectedAction} />
        </Card>

        <View style={{ height: 8, margin: 10 }} />
        {isGuest ? (
          <Button title="Sign In" onPress={() => router.push("/login")} />
        ) : (
          <Button
            title="Sign Out"
            variant="secondary"
            onPress={handleSignOut}
          />
        )}
      </Screen>
    </ProtectedRoute>
  );
}
