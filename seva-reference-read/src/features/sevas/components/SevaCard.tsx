import { Image } from "expo-image";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInLeft,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { Card, Text, useToast } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";

import {
  useOrderStore,
  useSevaQuantity,
} from "@/src/features/checkout/store/orderStore";
import { availabilityMessage } from "@/src/features/checkout/utils/availabilityMessage";
import { Info } from "lucide-react-native";
import { Seva } from "../types/seva.types";
import SevaSlotCarousel from "./SevaSlotCarousel";

type Props = {
  item: Seva;
  selectedDate: string;
};

function SevaCard({ item, selectedDate }: Props) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const toast = useToast();

  
  const hasImage = Boolean(item.itImg);

  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(
    item.sevaSlots?.length === 1 ? (item.sevaSlots.at(0)?.id ?? null) : null,
  );
  const [slotSelectionError, setSlotSelectionError] = useState(false);
  const [adding, setAdding] = useState(false); // in-flight availability check
  const slotShake = useSharedValue(0);

  const slotShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slotShake.value }],
  }));

  const slotIdForStore = selectedSlotId ?? "";

  const hasMultipleSlots = (item.sevaSlots?.length ?? 0) > 1;
  // const slotRequired = item.reqSlot === 1;

  // Quantity for this seva + selected slot (sums rows for needs-sankalpam sevas).
  const quantity = useSevaQuantity(item.itMastId, slotIdForStore);
  const maxQtyReached = quantity >= item.maxQtyPerBill;

  const addItem = useOrderStore((s) => s.addItem);
  const decrementRow = useOrderStore((s) => s.decrementRow);

  // Find the most recent row id for this seva+slot (for the − button).
  const lastRowId = useOrderStore((s) => {
    if (!s.model) return null;
    const rows = s.model.posTr.posTrDets.filter(
      (d) => d.itMastID === item.itMastId && d.SevaSlotID === slotIdForStore,
    );
    return rows.at(-1)?.id ?? null;
  });

  const shakeSlot = () => {
    setSlotSelectionError(true);
    slotShake.value = withSequence(
      withTiming(-8, { duration: 60 }),
      withTiming(8, { duration: 60 }),
      withTiming(-6, { duration: 50 }),
      withTiming(6, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    );
  };

  const runAdd = async () => {
    if (adding) return;

    // Slot required but not chosen → shake, don't call the API.
    if (hasMultipleSlots && !selectedSlotId) {
  shakeSlot();
  return;
}
    setSlotSelectionError(false);

    if (maxQtyReached) return;

    setAdding(true);
    // const result = await addItem(item, slotIdForStore, slotRequired);

    const result = await addItem(item, slotIdForStore, hasMultipleSlots);

    setAdding(false);
    
    if (!result.ok) {
      if (result.reason === "unavailable") {
        toast.show(availabilityMessage(result.status));
      } else if (result.reason === "slot-required") {
        shakeSlot();
      } else if (result.reason === "max-qty") {
        toast.show(t("sevaCard.maximumQuantityReached"));
      } else if (result.reason === "no-model") {
       toast.show(t("sevaCard.selectTempleAndDate"));
      } else {
        toast.show(t("sevaCard.couldntAdd"));
      }
    }
  };

  const handleDecrement = () => {
    if (lastRowId) decrementRow(lastRowId);
  };

  return (
    <Card
      elevated
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
          borderRadius: theme.radii.card,
          ...theme.shadows.card,
        },
      ]}
    >
      <View style={styles.container}>
        <View style={styles.leftSection}>
          {!!item.sevaGroup && (
            <View
              style={[
                styles.groupChip,
                {
                  backgroundColor: theme.colors.accentMuted,
                  borderColor: theme.colors.accent,
                },
              ]}
            >
              <Text
                variant="label"
                numberOfLines={1}
                style={[styles.groupChipText, { color: theme.colors.accent }]}
              >
                {item.sevaGroup}
              </Text>
            </View>
          )}

          <Text
            variant="title"
            numberOfLines={2}
            style={[styles.title, { color: theme.colors.textPrimary }]}
          >
            {item.sevaName}
          </Text>

          <Text
            variant="heading"
            style={[styles.price, { color: theme.colors.textPrimary }]}
          >
            ₹ {item.rate.toFixed(2)}
          </Text>

          <View
            style={[
              styles.reminderContainer,
              {
                backgroundColor: theme.colors.error + "10",
                borderColor: theme.colors.error + "25",
              },
            ]}
          >
            <Text
              variant="body"
              numberOfLines={2}
              style={[styles.infoText, { color: theme.colors.error }]}
            >
              {item.rem != null ? (
                <>
                  <Info size={10} /> {item.rem}
                </>
              ) : (
                t("sevaCard.noReminder")
              )}
            </Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <View style={styles.imageContainer}>
            {hasImage && (
              <Image
                source={{ uri: `data:image/jpeg;base64,${item.itImg}` }}
                style={[
                  styles.image,
                  {
                    borderRadius: theme.radii.card,
                    backgroundColor: theme.colors.border,
                  },
                ]}
                contentFit="cover"
                transition={250}
                cachePolicy="memory-disk"
              />
            )}
          </View>

          <View
            style={[
              styles.control,
              hasImage ? styles.controlWithImage : styles.controlWithoutImage,
            ]}
          >
            {quantity === 0 ? (
              <Animated.View
                key="add"
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(150)}
                style={[styles.addWrap, { backgroundColor: theme.colors.accent }]}
              >
                <Pressable
                  onPress={runAdd}
                  disabled={adding}
                  style={styles.addPressable}
                  hitSlop={6}
                >
                  <Text style={[styles.addText, { color: theme.colors.onAccent }]}>
                   {adding ? "..." : t("sevaCard.add")}
                  </Text>
                </Pressable>
              </Animated.View>
            ) : (
              <Animated.View
                key="stepper"
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(150)}
                style={[styles.stepperRow, { backgroundColor: theme.colors.accent }]}
              >
                <Animated.View entering={SlideInLeft.duration(220)}>
                  <Pressable
                    onPress={handleDecrement}
                    style={styles.stepBtn}
                    hitSlop={8}
                  >
                    <Text style={[styles.stepSymbol, { color: theme.colors.onAccent }]}>
                      -
                    </Text>
                  </Pressable>
                </Animated.View>

                <Text style={[styles.count, { color: theme.colors.onAccent }]}>
                  {adding ? "…" : quantity}
                </Text>

                <Animated.View entering={SlideInRight.duration(220)}>
                  <Pressable
                    onPress={runAdd}
                    disabled={maxQtyReached || adding}
                    style={[
                      styles.stepBtn,
                      (maxQtyReached || adding) && styles.stepBtnDisabled,
                    ]}
                    hitSlop={8}
                  >
                    <Text
                      style={[
                        styles.stepSymbol,
                        {
                          color:
                            maxQtyReached || adding
                              ? theme.colors.textSecondary
                              : theme.colors.onAccent,
                        },
                      ]}
                    >
                      +
                    </Text>
                  </Pressable>
                </Animated.View>
              </Animated.View>
            )}
          </View>
        </View>
      </View>

      <Animated.View style={slotShakeStyle}>
        <SevaSlotCarousel
          slots={item.sevaSlots}
          selectedSlotId={selectedSlotId}
          selectionError={slotSelectionError}
          onSelectSlot={(slot) => {
            setSelectedSlotId(slot.id);
            setSlotSelectionError(false);
          }}
        />
      </Animated.View>
    </Card>
  );
}

export default React.memo(SevaCard);

const styles = StyleSheet.create({
  card: { marginBottom: 10, padding: 12, borderWidth: 1 },
  container: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  leftSection: { flex: 1, paddingRight: 12 },
  title: { fontSize: 14,fontFamily: "Roboto_700Bold", marginBottom: 6 },
  price: { fontSize: 16, marginBottom: 10 },
  reminderContainer: { alignSelf: "flex-start", borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 },
  infoText: { fontSize: 10 },
  groupChip: { alignSelf: "flex-start", maxWidth: "95%", paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999, borderWidth: 1, marginBottom: 8 },
  groupChipText: { fontSize: 9 },
  rightSection: { width: 135, minHeight: 115, alignItems: "center", justifyContent: "center", position: "relative" },
  imageContainer: { width: 115, height: 115, alignItems: "center", justifyContent: "center" },
  image: { width: 135, height: 115 },
  imagePlaceholder: { width: 135, height: 115 },
  control: { width: 110, height: 40, alignItems: "center", justifyContent: "center", zIndex: 20 },
  controlWithImage: { position: "absolute", top: 95 },
  controlWithoutImage: { position: "absolute", top: 58 },
  addWrap: { width: 110, height: 40, borderRadius: 8, elevation: 6, overflow: "hidden" },
  addPressable: { flex: 1, alignItems: "center", justifyContent: "center" },
  addText: { fontFamily: "Roboto_700Bold", fontSize: 14, letterSpacing: 1 },
  stepperRow: { width: 110, height: 40, borderRadius: 8, elevation: 6, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 4 },
  stepBtn: { width: 36, height: 40, alignItems: "center", justifyContent: "center" },
  stepSymbol: {fontSize: 22, lineHeight: 26 },
  count: { fontSize: 15 },
  stepBtnDisabled: { opacity: 0.45 },
});