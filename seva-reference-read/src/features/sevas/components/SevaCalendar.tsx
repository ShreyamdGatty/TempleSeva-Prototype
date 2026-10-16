import { Card, Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, StyleSheet, View } from "react-native";

type Props = {
  visible: boolean;
  startDate: Date | null;
  disabledDates?: string[];
  selectedDates?: string[];
  onClose: () => void;
  onDateSelect?: (date: Date) => void;
};

function startOfDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0,
  );
}

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function SevaCalendar({
  visible,
  startDate,
  disabledDates = [],
  selectedDates = [],
  onClose,
  onDateSelect,
}: Props) {
  const { theme } = useTheme();
   const { i18n, t } = useTranslation();
    const locale = i18n.language === "kn"   ? "kn-IN" : "en-IN";
  const today = useMemo(
    () => startOfDay(new Date()),
    [],
  );

  const currentMonthStart = useMemo(
    () =>
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      ),
    [today],
  );

  const nextMonthStart = useMemo(
    () =>
      new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        1,
      ),
    [today],
  );

  const [currentMonth, setCurrentMonth] =
    useState<Date>(
      startDate ?? currentMonthStart,
    );

  useEffect(() => {
    if (!visible) {
      return;
    }

    const date =
      startDate ?? currentMonthStart;

    setCurrentMonth(
      new Date(
        date.getFullYear(),
        date.getMonth(),
        1,
      ),
    );
  }, [
    visible,
    startDate,
    currentMonthStart,
  ]);

  const monthInfo = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(
      year,
      month,
      1,
    );

    const lastDay = new Date(
      year,
      month + 1,
      0,
    );

    return {
      year,
      month,
      daysInMonth: lastDay.getDate(),
      startingWeekday: firstDay.getDay(),
    };
  }, [currentMonth]);

  const weekdayNames = useMemo(() => {
  const baseDate = new Date(2023, 0, 1);

  return Array.from(
    { length: 7 },
    (_, index) => {
      const date = new Date(baseDate);

      date.setDate(
        baseDate.getDate() + index,
      );

      return new Intl.DateTimeFormat(
        locale,
        {
          weekday: "short",
        },
      ).format(date);
    },
  );
}, [locale]);

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];

    for (
      let i = 0;
      i < monthInfo.startingWeekday;
      i++
    ) {
      days.push(null);
    }

    for (
      let day = 1;
      day <= monthInfo.daysInMonth;
      day++
    ) {
      days.push(day);
    }

    return days;
  }, [monthInfo]);

  const normalizedDisabledDates =
    useMemo(
      () =>
        new Set(
          disabledDates
            .filter(Boolean)
            .map((date) =>
              date.substring(0, 10),
            ),
        ),
      [disabledDates],
    );

  const normalizedSelectedDates =
    useMemo(
      () =>
        new Set(
          selectedDates
            .filter(Boolean)
            .map((date) =>
              date.substring(0, 10),
            ),
        ),
      [selectedDates],
    );

  const isSameMonth = (
    first: Date,
    second: Date,
  ) => {
    return (
      first.getFullYear() ===
        second.getFullYear() &&
      first.getMonth() ===
        second.getMonth()
    );
  };

  const isCurrentMonth =
    isSameMonth(
      currentMonth,
      currentMonthStart,
    );

  const isNextMonth =
    isSameMonth(
      currentMonth,
      nextMonthStart,
    );

  const goToPreviousMonth = () => {
    if (isCurrentMonth) {
      return;
    }

    setCurrentMonth(
      new Date(
        currentMonthStart.getFullYear(),
        currentMonthStart.getMonth(),
        1,
      ),
    );
  };

  const goToNextMonth = () => {
    if (isNextMonth) {
      return;
    }

    setCurrentMonth(
      new Date(
        nextMonthStart.getFullYear(),
        nextMonthStart.getMonth(),
        1,
      ),
    );
  };

  const handleDatePress = (
    day: number,
  ) => {
    const selectedDate =
      new Date(
        monthInfo.year,
        monthInfo.month,
        day,
        0,
        0,
        0,
        0,
      );

    const dateString =
      formatLocalDate(selectedDate);

    const isSelected =
      normalizedSelectedDates.has(
        dateString,
      );

    const isDisabled =
      normalizedDisabledDates.has(
        dateString,
      );

    const isBeforeToday =
      selectedDate < today;

    if (
      !isSelected &&
      (isBeforeToday || isDisabled)
    ) {
      return;
    }

    onDateSelect?.(selectedDate);
    onClose();
  };

  const monthName = useMemo(() => {
  return new Intl.DateTimeFormat(
    locale,
    {
      month: "long",
      year: "numeric",
    },
  ).format(currentMonth);
}, [currentMonth, locale]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Card
          style={[
            styles.calendarCard,
            {
              backgroundColor:
                theme.colors.card,
            },
          ]}
        >
          <View style={styles.header}>
            <Pressable
              onPress={goToPreviousMonth}
              disabled={isCurrentMonth}
              style={[
                styles.arrowButton,
                isCurrentMonth &&
                  styles.disabledArrow,
              ]}
            >
              <Text
                style={[
                  styles.arrowText,
                  {
                    color:
                      isCurrentMonth
                        ? "#BDBDBD"
                        : theme.colors.textPrimary,
                  },
                ]}
              >
                ‹
              </Text>
            </Pressable>

            <Text
              style={[
                styles.monthTitle,
                {
                  color:
                    theme.colors.textPrimary,
                },
              ]}
            >
              {monthName}
            </Text>

            <Pressable
              onPress={goToNextMonth}
              disabled={isNextMonth}
              style={[
                styles.arrowButton,
                isNextMonth &&
                  styles.disabledArrow,
              ]}
            >
              <Text
                style={[
                  styles.arrowText,
                  {
                    color:
                      isNextMonth
                        ? "#BDBDBD"
                        : theme.colors.textPrimary,
                  },
                ]}
              >
                ›
              </Text>
            </Pressable>

            <Pressable
              onPress={onClose}
              style={styles.closeButton}
            >
              <Text
                style={[
                  styles.closeText,
                  {
                    color:
                      theme.colors.textPrimary,
                  },
                ]}
              >
                ✕
              </Text>
            </Pressable>
          </View>

          <View style={styles.weekRow}>
           {weekdayNames.map((day) => (
              <View
                key={day}
                style={styles.weekCell}
              >
                <Text
                  style={[
                    styles.weekText,
                    {
                      color:
                        theme.colors.textSecondary ??
                        theme.colors.textPrimary,
                    },
                  ]}
                >
                  {day}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.daysContainer}>
            {calendarDays.map(
              (day, index) => {
                if (day === null) {
                  return (
                    <View
                      key={`empty-${index}`}
                      style={styles.dayCell}
                    />
                  );
                }

                const date = new Date(
                  monthInfo.year,
                  monthInfo.month,
                  day,
                  0,
                  0,
                  0,
                  0,
                );

                const dateString =
                  formatLocalDate(date);

                const isSelected =
                  normalizedSelectedDates.has(
                    dateString,
                  );

                const isDisabled =
                  normalizedDisabledDates.has(
                    dateString,
                  );

                const isBeforeToday =
                  date < today;

                const disabled =
                  !isSelected &&
                  (isBeforeToday ||
                    isDisabled);

                return (
                  <Pressable
                    key={`day-${day}`}
                    disabled={disabled}
                    onPress={() =>
                      handleDatePress(day)
                    }
                    style={[
                      styles.dayCell,
                      disabled &&
                        styles.disabledDay,
                    ]}
                  >
                    <View
                      style={[
                        styles.dayCircle,
                        isSelected && {
                          backgroundColor:
                            theme.colors.accent,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          {
                            color:
                              isSelected
                                ? "#FFFFFF"
                                : disabled
                                  ? theme.colors
                                      .textSecondary ??
                                    "#999"
                                  : theme.colors
                                      .textPrimary,
                          },
                        ]}
                      >
                        {day}
                      </Text>
                    </View>
                  </Pressable>
                );
              },
            )}
          </View>

          <Text
            style={[
              styles.infoText,
              {
                color:
                  theme.colors.textSecondary ??
                  theme.colors.textPrimary,
              },
            ]}
          >
            {t("sevaCalendar.pastDatesUnavailable")}
          </Text>
        </Card>
      </View>
    </Modal>
  );
}

export default React.memo(SevaCalendar);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  calendarCard: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 18,
    padding: 18,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  arrowButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  disabledArrow: {
    opacity: 0.5,
  },

  arrowText: {
    fontSize: 32,
    lineHeight: 34,
    
  },

  monthTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Roboto_700Bold"
    
  },

  closeButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },

  closeText: {
    fontSize: 20,
  },

  weekRow: {
    flexDirection: "row",
    marginBottom: 8,
  },

  weekCell: {
    width: "14.2857%",
    alignItems: "center",
    justifyContent: "center",
  },

  weekText: {
    fontSize: 11,
    
  },

  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  dayCell: {
    width: "14.2857%",
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },

  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  dayText: {
    fontSize: 14,
   
  },

  disabledDay: {
    opacity: 0.35,
  },

  infoText: {
    marginTop: 15,
    textAlign: "center",
    fontSize: 11,
  },
});