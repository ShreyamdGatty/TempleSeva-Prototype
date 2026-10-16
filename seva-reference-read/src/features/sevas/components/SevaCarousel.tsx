import React, { useMemo, useRef } from "react";

import {
  FlatList,
  StyleSheet,
  View,
} from "react-native";

import { Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";

import { useTranslation } from "react-i18next";
import { CalendarItem } from "../types/seva.types";
import SevaDate from "./SevaDate";

type Props = {
  dates?: CalendarItem[];

  /*
   * This is the ONLY value used to determine
   * which worship-date card is selected.
   */
  selectedDate?: string;

  /*
   * Used only to add dynamically selected dates
   * to the carousel if they are not already present.
   */
  selectedCalendarDates?: CalendarItem[];

  calendarSelected?: boolean;

  /*
   * Called ONLY when the user actually presses
   * a worship-date card.
   */
  onDateSelect?: (date: CalendarItem) => void;

  onCalendarPress?: (startDate: Date) => void;
};

export const CALENDAR_CARD_ID = "SELECT_DATE";

const normalizeDate = (
  value?: string | null,
): string => {
  if (!value) {
    return "";
  }

  return value.substring(0, 10);
};

const parseLocalDate = (
  value: string,
): Date | null => {
  const parts = normalizeDate(value).split("-");

  if (parts.length !== 3) {
    return null;
  }

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day)
  ) {
    return null;
  }

  const date = new Date(
    year,
    month - 1,
    day,
    0,
    0,
    0,
    0,
  );

  return Number.isNaN(date.getTime())
    ? null
    : date;
};

const getNextLocalDate = (
  value: string,
): Date => {
  const date = parseLocalDate(value);

  if (!date) {
    return new Date();
  }

  date.setDate(date.getDate() + 1);

  return date;
};

const getDateTime = (
  value: string,
): number => {
  return (
    parseLocalDate(value)?.getTime() ?? 0
  );
};

function SevaCarousel({
  dates = [],
  selectedDate,
  selectedCalendarDates = [],
  calendarSelected = false,
  onDateSelect,
  onCalendarPress,
}: Props) {
    const { t } = useTranslation();
  const { theme } = useTheme();

  const listRef =
    useRef<FlatList<CalendarItem>>(null);

  /*
   * Build the dates displayed in the carousel.
   *
   * selectedCalendarDates are added only when a
   * dynamically requested worship date needs to
   * appear in the carousel.
   */
  const displayDates = useMemo(() => {
    const result: CalendarItem[] = [];
    const seen = new Set<string>();

    const addItem = (
      item: CalendarItem,
    ) => {
      if (!item?.dt) {
        return;
      }

      const date = normalizeDate(item.dt);

      if (seen.has(date)) {
        return;
      }

      seen.add(date);
      result.push(item);
    };

    dates.forEach(addItem);

    selectedCalendarDates.forEach(addItem);

    return result;
  }, [
    dates,
    selectedCalendarDates,
  ]);

  /*
   * Find the date after the last displayed
   * worship date. This is used when opening
   * the calendar.
   */
  const calendarStartDate = useMemo(() => {
    if (displayDates.length === 0) {
      return new Date();
    }

    let latestDate = "";
    let latestTime = -1;

    displayDates.forEach((item) => {
      const time = getDateTime(item.dt);

      if (time > latestTime) {
        latestTime = time;
        latestDate = item.dt;
      }
    });

    return latestDate
      ? getNextLocalDate(latestDate)
      : new Date();
  }, [displayDates]);

  /*
   * IMPORTANT:
   *
   * This function is called ONLY when the user
   * presses a date card.
   *
   * Scrolling/swiping the FlatList does not call
   * this function.
   */
  const handleDatePress = (
    item: CalendarItem,
  ) => {
    if (!item?.dt) {
      return;
    }

    onDateSelect?.(item);
  };

  const handleCalendarPress = () => {
    onCalendarPress?.(
      calendarStartDate,
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme.colors.page,
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            color:
              theme.colors.textPrimary,
          },
        ]}
      >
        {t("sevaCarousel.selectWorshipDate")}
        
      </Text>

      <FlatList
        ref={listRef}
        data={displayDates}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyExtractor={(item) =>
          normalizeDate(item.dt)
        }
        renderItem={({ item }) => {
          /*
           * The card is selected ONLY when its
           * date matches selectedDate.
           *
           * Swiping the carousel does NOT modify
           * selectedDate.
           */
          const isSelected =
            !calendarSelected &&
            normalizeDate(selectedDate) ===
              normalizeDate(item.dt);

          return (
            <SevaDate
              item={item}
              selected={isSelected}
              onPress={() =>
                handleDatePress(item)
              }
            />
          );
        }}
        contentContainerStyle={
          styles.content
        }
        ListFooterComponent={
          <SevaDate
            isCalendarCard
            selected={calendarSelected}
            onPress={handleCalendarPress}
          />
        }
      />
    </View>
  );
}

export default React.memo(
  SevaCarousel,
);

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },

  title: {
    fontSize: 16,
    fontFamily: "Roboto_700Bold",
    marginHorizontal: 20,
    marginBottom: 20,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
});