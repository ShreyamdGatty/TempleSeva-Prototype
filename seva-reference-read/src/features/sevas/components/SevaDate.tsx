import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Pressable,
  Text as RNText,
  StyleSheet,
  View,
} from "react-native";

import { Card, Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";

import { CalendarItem } from "../types/seva.types";

type Props = {
  item?: CalendarItem;
  selected?: boolean;
  onPress?: () => void;
  isCalendarCard?: boolean;
};

// Tithi marquee tuning
const CHAR_WIDTH = 4.3; // approx px per char at fontSize 8, bold
const CLIP_WIDTH = 80; // tithi visible width (card 100 − paddings)

function TithiMarquee({
  text,
  color,
  active,
}: {
  text: string;
  color: string;
  active: boolean;
}) {
  
  
  const translateX = useRef(new Animated.Value(0)).current;

  
  const estimatedWidth = text.length * CHAR_WIDTH;
  const overflow = Math.max(0, estimatedWidth - CLIP_WIDTH);
 
  useEffect(() => {
    translateX.stopAnimation();
    translateX.setValue(0);

    if (!active || !text || overflow <= 0) {
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(800),
        Animated.timing(translateX, {
          toValue: -overflow,
          duration: Math.max(1800, overflow * 55),
          useNativeDriver: true,
        }),
        Animated.delay(1200),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.delay(800),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
      translateX.stopAnimation();
    };
  }, [active, text, overflow, translateX]);

  return (
    <View style={styles.tithiClip}>
      <Animated.View
        style={[
          styles.tithiAnimated,
          { width: estimatedWidth + 4 },
          { transform: [{ translateX }] },
        ]}
      >
        <RNText style={[styles.tithi, { color }]} numberOfLines={1}>
          {text}
        </RNText>
      </Animated.View>
    </View>
  );
}

function SevaDate({
  item,
  selected = false,
  onPress,
  isCalendarCard = false,
}: Props) {
  const { theme } = useTheme();
const { i18n, t } = useTranslation();
  const locale = i18n.language === "kn" ? "kn-IN" : "en-IN";
  if (isCalendarCard) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      >
        <Card
          style={[
            styles.card,
            styles.calendarCard,
            {
              backgroundColor: selected
                ? theme.colors.accent
                : theme.colors.card,
              borderColor: selected ? theme.colors.accent : theme.colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.calendarIconContainer,
              {
                borderColor: selected ? "#FFFFFF" : theme.colors.accent,
              },
            ]}
          >
            <View style={styles.calendarRings}>
              <View
                style={[
                  styles.calendarRing,
                  {
                    backgroundColor: selected ? "#FFFFFF" : theme.colors.accent,
                  },
                ]}
              />

              <View
                style={[
                  styles.calendarRing,
                  {
                    backgroundColor: selected ? "#FFFFFF" : theme.colors.accent,
                  },
                ]}
              />
            </View>

            <View
              style={[
                styles.calendarHeader,
                {
                  backgroundColor: selected ? "#FFFFFF" : theme.colors.accent,
                },
              ]}
            />

            <View style={styles.calendarBody}>
              <View
                style={[
                  styles.calendarDot,
                  {
                    backgroundColor: selected ? "#FFFFFF" : theme.colors.accent,
                  },
                ]}
              />

              <View
                style={[
                  styles.calendarDot,
                  {
                    backgroundColor: selected ? "#FFFFFF" : theme.colors.accent,
                  },
                ]}
              />

              <View
                style={[
                  styles.calendarDot,
                  {
                    backgroundColor: selected ? "#FFFFFF" : theme.colors.accent,
                  },
                ]}
              />
            </View>
          </View>

          <Text
            style={[
              styles.calendarText,
              {
                color: selected ? "#FFFFFF" : theme.colors.textPrimary,
              },
            ]}
          >
            {t("sevaCalendar.selectDate")}
          </Text>
        </Card>
      </Pressable>
    );
  }

  if (!item) {
    return null;
  }

  const dateParts = item.dt.substring(0, 10).split("-").map(Number);

  const year = dateParts[0];
  const month = dateParts[1];
  const dayNumber = dateParts[2];

  if (
    year === undefined ||
    month === undefined ||
    dayNumber === undefined ||
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(dayNumber)
  ) {
    return null;
  }

  const date = new Date(year, month - 1, dayNumber, 0, 0, 0, 0);

  const day = new Intl.DateTimeFormat(locale, {
  weekday: "short",
}).format(date);

  const formattedDate = new Intl.DateTimeFormat(locale, {
  month: "short",
  day: "2-digit",
}).format(date);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <Card
        style={[
          styles.card,
          {
            backgroundColor: selected ? theme.colors.accent : theme.colors.card,
            borderColor: selected ? theme.colors.accent : theme.colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.day,
            { color: selected ? "#FFFFFF" : theme.colors.textPrimary },
          ]}
          numberOfLines={1}
        >
          {day}
        </Text>

        <Text
          style={[
            styles.date,
            { color: selected ? "#FFFFFF" : theme.colors.textPrimary },
          ]}
          numberOfLines={1}
        >
          {formattedDate}
        </Text>

        <View
          style={[
            styles.tithiContainer,
            { backgroundColor: theme.colors.page },
          ]}
        >
          <TithiMarquee
            text={item.tithi ?? ""}
            color={theme.colors.textPrimary}
            active={selected}
          />
        </View>

        {item.note ? (
          <View
            style={[
              styles.festivalContainer,
              {
                backgroundColor: selected
                  ? theme.colors.page
                  : theme.colors.accent + "25",
              },
            ]}
          >
            <Text
              style={[styles.festival, { color: theme.colors.accent }]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.note}
            </Text>
          </View>
        ) : null}
      </Card>
    </Pressable>
  );
}

export default React.memo(SevaDate);

const styles = StyleSheet.create({
  pressable: {
    marginRight: 7,
  },

  pressed: {
    opacity: 0.8,
  },

  card: {
    width: 100,
    height: 100,
    borderRadius: 13,
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "flex-start",
    overflow: "hidden",
  },

  calendarCard: {
    justifyContent: "center",
    alignItems: "center",
  },

  calendarIconContainer: {
    width: 32,
    height: 28,
    borderWidth: 2,
    borderRadius: 5,
    position: "relative",
    marginBottom: 6,
    overflow: "visible",
  },

  calendarRings: {
    position: "absolute",
    top: -5,
    left: 5,
    right: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  calendarRing: {
    width: 4,
    height: 9,
    borderRadius: 2,
  },

  calendarHeader: {
    position: "absolute",
    top: 4,
    left: 0,
    right: 0,
    height: 4,
  },

  calendarBody: {
    position: "absolute",
    left: 6,
    right: 6,
    bottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  calendarDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },

  calendarText: {
    fontSize: 12,
    fontFamily: "Roboto_700Bold",
    textAlign: "center",
    lineHeight: 14,
  },

  day: {
    fontSize: 12,
    fontFamily: "Roboto_500Medium",
    marginBottom: 1,
  },

  date: {
    fontSize: 12,
    fontFamily: "Roboto_700Bold",
    marginBottom: 4,
  },

  tithiContainer: {
    width: "100%",
    minHeight: 20,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 6,
    justifyContent: "center",
    marginBottom: 3,
    overflow: "hidden",
  },

  tithiClip: {
    width: "100%",
    height: 12,
    overflow: "hidden",
    justifyContent: "center",
  },

  tithiAnimated: {
    alignSelf: "flex-start",
    flexDirection: "row",
  },

  tithi: {
    fontSize: 8,
    fontFamily: "Roboto_700Bold",
    textAlign: "left",
    includeFontPadding: false,
  },

  festivalContainer: {
    width: "100%",
    minHeight: 24,
    paddingHorizontal: 3,
    paddingVertical: 3,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },

  festival: {
    fontSize: 8,
    fontFamily: "Roboto_700Bold",
    textAlign: "center",
    lineHeight: 10,
  },
});