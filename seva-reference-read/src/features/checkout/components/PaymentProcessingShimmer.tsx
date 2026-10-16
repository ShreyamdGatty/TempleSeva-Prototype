import { useEffect, useRef } from "react";
import { Animated, Easing, Modal, StyleSheet, Text, View } from "react-native";

type Props = {
  visible: boolean;
};

export default function PaymentProcessingShimmer({ visible }: Props) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      shimmer.stopAnimation();
      shimmer.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => animation.stop();
  }, [visible, shimmer]);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-260, 260],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconPlaceholder}>
            <Animated.View
              style={[styles.shimmer, { transform: [{ translateX }] }]}
            />
          </View>

          <View style={styles.titlePlaceholder}>
            <Animated.View
              style={[styles.shimmer, { transform: [{ translateX }] }]}
            />
          </View>

          <View style={styles.linePlaceholder}>
            <Animated.View
              style={[styles.shimmer, { transform: [{ translateX }] }]}
            />
          </View>

          <Text style={styles.title}>Processing your payment</Text>

          <Text style={styles.subtitle}>We are processing your payment</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    overflow: "hidden",
  },
  iconPlaceholder: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#E8EAF0",
    overflow: "hidden",
    marginBottom: 24,
  },
  titlePlaceholder: {
    width: "75%",
    height: 18,
    borderRadius: 8,
    backgroundColor: "#E8EAF0",
    overflow: "hidden",
    marginBottom: 14,
  },
  linePlaceholder: {
    width: "55%",
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E8EAF0",
    overflow: "hidden",
    marginBottom: 24,
  },
  shimmer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 100,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#202124",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
    textAlign: "center",
  },
});
