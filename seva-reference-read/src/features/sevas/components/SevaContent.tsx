import { Text } from "@/src/framework/components";
import { useDebouncedValue } from "@/src/framework/hooks/useDebouncedValue";
import { useTheme } from "@/src/framework/theme";
import { useTempleStore } from "@/src/shared/temple/templeStore";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import SevaCalendar from "../components/SevaCalendar";
import SevaCarousel from "../components/SevaCarousel";
import SevaDateSkeliton from "../components/SevaDateSkeliton";
import SevaGroupFilter from "../components/SevaGroupFilter";
import SevaList from "../components/SevaList";
import SevaSearchBar from "../components/SevaSearchBar";

import { useSevaCalendar } from "../hooks/useSevaCalendar";
import { useSevaGroups } from "../hooks/useSevaGroups";
import { useSevas } from "../hooks/useSevas";

import { CalendarItem } from "../types/seva.types";

import {
  useOrderReady,
  useOrderStore,
} from "@/src/features/checkout/store/orderStore";

const INITIAL_CALENDAR_COUNT = 4;
const SELECTED_CALENDAR_COUNT = 1;

const formatLocalDate = (date: Date) => {
  const y = date.getFullYear();

  const m = String(date.getMonth() + 1).padStart(2, "0");

  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
};

const normalizeDate = (value?: string | null) =>
  value ? value.substring(0, 10) : "";

const isSameDate = (a?: string | null, b?: string | null) =>
  !!a && !!b && normalizeDate(a) === normalizeDate(b);

const parseLocalDate = (value: string) => {
  const [y, m, d] = value.split("-").map(Number);

  if (!y || !m || !d) {
    return null;
  }

  return new Date(y, m - 1, d);
};

const getNextDate = (value: string) => {
  const date = parseLocalDate(value) ?? new Date();

  date.setDate(date.getDate() + 1);

  return date;
};

export default function SevaContent() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState("");

  const [selectedGroup, setSelectedGroup] = useState("All");

  const [calendarStartDate, setCalendarStartDate] = useState<Date | null>(null);

  const [calendarVisible, setCalendarVisible] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string>();

  const [selectedCalendarDate, setSelectedCalendarDate] =
    useState<CalendarItem | null>(null);

  const [selectedRequestDate, setSelectedRequestDate] = useState<string>();

  const debouncedKeyword = useDebouncedValue(searchInput, 400);

  const selectedTemple = useTempleStore((state) => state.selected);

  const initModel = useOrderStore((s) => s.initModel);

  const orderReady = useOrderReady();

  const loadingModel = useOrderStore((s) => s.loadingModel);

  const digiOrgId = selectedTemple?.id;

  const sdId = selectedTemple?.sdId;

  const initialStartDate = useMemo(
    () => formatLocalDate(new Date()),
    [digiOrgId],
  );

  const {
    data: initialCalendarResponse,
    isLoading: initialCalendarLoading,
    error: initialCalendarError,
  } = useSevaCalendar(
    digiOrgId,
    initialStartDate,
    INITIAL_CALENDAR_COUNT,
    Boolean(digiOrgId),
  );

  const calendarItems = initialCalendarResponse?.calendarItems ?? [];

  /*
   * Default selection:
   * When the calendar loads, today's worship date is selected.
   */
  useEffect(() => {
    if (!calendarItems.length || selectedDate) {
      return;
    }

    const today = formatLocalDate(new Date());

    const todayItem =
      calendarItems.find((item) => isSameDate(item.dt, today)) ??
      calendarItems[0];

    if (todayItem?.dt) {
      setSelectedDate(normalizeDate(todayItem.dt));
    }
  }, [calendarItems, selectedDate]);

  const effectiveSelectedDate =
    selectedDate ??
    normalizeDate(selectedCalendarDate?.dt ?? calendarItems[0]?.dt);

  const {
    data: selectedCalendarResponse,
    isFetching: selectedCalendarLoading,
    error: selectedCalendarError,
  } = useSevaCalendar(
    digiOrgId,
    selectedRequestDate,
    SELECTED_CALENDAR_COUNT,
    Boolean(digiOrgId && selectedRequestDate),
  );

  const {
    sevas,
    totalCount,
    isLoading,
    isFetchingNextPage,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useSevas(
    debouncedKeyword,
    selectedGroup,
    digiOrgId ?? "",
    sdId ?? "",
    Boolean(digiOrgId && effectiveSelectedDate && orderReady),
  );

  const {
    data: sevaGroups = [],
    refetch: refetchSevaGroups,
    isRefetching: isSevaGroupsRefetching,
  } = useSevaGroups(digiOrgId ?? "");
  const handleRefresh = async () => {
    await Promise.all([refetch(), refetchSevaGroups()]);
  };
  const groups = ["All", ...sevaGroups.filter((group) => group?.trim())];

  const availableCount = totalCount ?? sevas.length;

  useEffect(() => {
    setSelectedDate(undefined);

    setSelectedRequestDate(undefined);

    setSelectedCalendarDate(null);

    setCalendarStartDate(null);

    setCalendarVisible(false);
  }, [digiOrgId]);

  useEffect(() => {
    const items = selectedCalendarResponse?.calendarItems ?? [];

    if (!selectedRequestDate || !items.length) {
      return;
    }

    const item = items.find((x) => isSameDate(x.dt, selectedRequestDate));

    if (item?.dt) {
      setSelectedCalendarDate(item);

      setSelectedDate(normalizeDate(item.dt));

      setSelectedRequestDate(undefined);
    }
  }, [selectedCalendarResponse, selectedRequestDate]);

  // Re-init on temple / date change.
  useEffect(() => {
    if (digiOrgId && effectiveSelectedDate) {
      void initModel(effectiveSelectedDate);
    }
  }, [digiOrgId, effectiveSelectedDate, initModel]);

  // Re-init after the order is cleared (e.g. post place-order) when the temple
  // and date are unchanged — so the next order gets a fresh posTr.id.
  useEffect(() => {
    if (digiOrgId && effectiveSelectedDate && !orderReady && !loadingModel) {
      void initModel(effectiveSelectedDate);
    }
  }, [orderReady, loadingModel, digiOrgId, effectiveSelectedDate, initModel]);

  const calendarNextDate = useMemo(() => {
    const last = calendarItems.at(-1)?.dt;

    return last ? getNextDate(normalizeDate(last)) : new Date();
  }, [calendarItems]);

  const handleCalendarPress = (startDate?: Date) => {
    setCalendarStartDate(startDate ?? calendarNextDate);

    setCalendarVisible(true);
  };

  const handleCalendarDateSelect = (date: Date) => {
    const dt = formatLocalDate(date);

    if (calendarItems.some((item) => isSameDate(item.dt, dt))) {
      setSelectedDate(dt);

      setSelectedRequestDate(undefined);
    } else if (
      selectedCalendarDate &&
      isSameDate(selectedCalendarDate.dt, dt)
    ) {
      setSelectedDate(dt);

      setSelectedRequestDate(undefined);
    } else {
      setSelectedDate(dt);

      setSelectedRequestDate(dt);
    }

    setCalendarVisible(false);
  };

  /*
   * Only the card clicked by the user becomes selected.
   */
  const handleCarouselDateSelect = (item: CalendarItem) => {
    if (!item?.dt) {
      return;
    }

    const dt = normalizeDate(item.dt);

    setSelectedDate(dt);

    setSelectedRequestDate(undefined);

    if (selectedCalendarDate && isSameDate(selectedCalendarDate.dt, dt)) {
      setCalendarStartDate(calendarNextDate);

      setCalendarVisible(true);
    }
  };

  const disabledCalendarDates = useMemo(() => {
    const dates = calendarItems
      .map((item) => normalizeDate(item.dt))
      .filter(Boolean);

    if (selectedCalendarDate?.dt) {
      dates.push(normalizeDate(selectedCalendarDate.dt));
    }

    return [...new Set(dates)];
  }, [calendarItems, selectedCalendarDate]);

  const carouselDates = useMemo(() => {
    const dates = [...calendarItems];

    if (
      selectedCalendarDate?.dt &&
      !dates.some((item) => isSameDate(item.dt, selectedCalendarDate.dt))
    ) {
      dates.push(selectedCalendarDate);
    }

    return dates;
  }, [calendarItems, selectedCalendarDate]);

  const listHeader = (
    <View>
      <View style={styles.dateSection}>
        {initialCalendarLoading ? (
          <SevaDateSkeliton />
        ) : (
          <SevaCarousel
            dates={carouselDates}
            selectedDate={effectiveSelectedDate}
            onDateSelect={handleCarouselDateSelect}
            onCalendarPress={handleCalendarPress}
          />
        )}

        {selectedCalendarLoading && (
          <Text
            style={[
              styles.status,
              {
                color: theme.colors.textSecondary,
              },
            ]}
          >
            {t("sevaContent.loadingSelectedDate")}
          </Text>
        )}

        {initialCalendarError && (
          <Text
            style={[
              styles.error,
              {
                color: theme.colors.textPrimary,
              },
            ]}
          >
            {t("sevaContent.unableToLoadWorshipDates")}
          </Text>
        )}

        {selectedCalendarError && (
          <Text
            style={[
              styles.error,
              {
                color: theme.colors.textPrimary,
              },
            ]}
          >
            Unable to load selected date.
          </Text>
        )}
      </View>

      <SevaSearchBar onSearch={setSearchInput} />

      <View style={styles.groupSection}>
        <View style={styles.sectionHeader}>
          <Text
            variant="title"
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.textPrimary,
              },
            ]}
          >
            {t("sevaContent.sevaCategory")}
          </Text>
        </View>

        <SevaGroupFilter
          groups={groups}
          selectedGroup={selectedGroup}
          onSelectGroup={setSelectedGroup}
        />
      </View>

      <View style={styles.resultsHeader}>
        <Text
          variant="title"
          style={[
            styles.resultsTitle,
            {
              color: theme.colors.textPrimary,
            },
          ]}
        >
          {t("sevaContent.availableSevas")}
        </Text>

        <Text
          variant="label"
          style={[
            styles.resultCount,
            {
              color: theme.colors.textSecondary,
            },
          ]}
        >
          {availableCount} {t("sevaContent.available")}
        </Text>
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.page,
        },
      ]}
    >
      <SevaList
        data={sevas}
        loading={
          initialCalendarLoading || loadingModel || !orderReady || isLoading
        }
        loadingMore={isFetchingNextPage}
        selectedDate={effectiveSelectedDate}
        refreshing={isRefetching || isSevaGroupsRefetching}
        onRefresh={handleRefresh}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        listHeader={listHeader}
      />

      <SevaCalendar
        visible={calendarVisible}
        startDate={calendarStartDate}
        disabledDates={disabledCalendarDates}
        selectedDates={selectedDate ? [selectedDate] : []}
        onClose={() => setCalendarVisible(false)}
        onDateSelect={handleCalendarDateSelect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  dateSection: {
    marginTop: 4,
  },

  status: {
    fontSize: 11,
    marginHorizontal: 20,
    marginTop: 2,
    marginBottom: 4,
  },

  error: {
    fontSize: 11,
    marginHorizontal: 20,
    marginTop: 2,
    marginBottom: 4,
  },

  groupSection: {
    marginTop: 2,
  },

  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 2,
  },

  sectionTitle: {
    fontSize: 14,
  },

  resultsHeader: {
    paddingHorizontal: 16,
    marginTop: 2,
    marginBottom: 4,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  resultsTitle: {
    fontSize: 13,
  },

  resultCount: {
    fontSize: 11,
  },
});
