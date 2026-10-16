import { useAuth } from "@/src/framework/auth";
import { Text } from "@/src/framework/components";
import { useTheme } from "@/src/framework/theme";
import QRCodeModal, {
  type SevaRecord,
} from "@/src/shared/components/QRCodeModal";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { useMySevas } from "../hooks/useMySevas";

import { useTempleStore } from "@/src/shared/temple/templeStore";
import { useFocusEffect } from "expo-router";
import { RefreshCw } from "lucide-react-native";
import { Image } from "react-native";
import MySevaCard from "../components/MySevaCard";
import MySevasSkeleton from "../components/MySevasSkeleton";
import { cancelTransaction } from "../services/mySevas.service";
import { useMySevasRefreshStore } from "../store/mySevasRefreshStore";
import { POSTranListItem } from "../types/mySevas.types";
export default function MySevasScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const colors = theme.colors;
  const { user } = useAuth();
  const { sevaId, bookingId } = useLocalSearchParams<{
  sevaId?: string;
  bookingId?: string;
}>();
  const selectedTemple = useTempleStore((state) => state.selected);

  const [selectedQrSeva, setSelectedQrSeva] = useState<SevaRecord | null>(null);

  const [refreshing, setRefreshing] = useState(false);

  const refreshVersion = useMySevasRefreshStore(
    (state) => state.refreshVersion,
  );
  const lastLoadedKeyRef = useRef("");
  const lastRefreshVersionRef = useRef(refreshVersion);
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useMySevas(user?.id ?? "", selectedTemple?.id ?? "", false);

  const transactions =
    data?.pages.flatMap((page) => page.posTranListItems ?? []) ?? [];

  const handleViewQr = (transaction: POSTranListItem) => {
    if (transaction.paymentStatus !== 1 || !transaction.qrCodeText) {
      return;
    }

    const firstSeva = transaction.posTranDetItems?.[0];
    setSelectedQrSeva({
      sevaId: transaction.id,
      devoteeName: firstSeva?.devoteeName ?? "",
      templeName: selectedTemple?.orgName ?? "",
      sevaName: firstSeva?.sevaName ?? "Seva Booking",
      sevaDate: firstSeva?.sevaDt ?? "",
      slotName: firstSeva?.slotName ?? null,
      
      bookingId: transaction.billNo,
      qrCodeText: transaction.qrCodeText,
      amount: transaction.entryNetAmt,
      status: transaction.orderStatus === 0 ? "active" : "received",
    });
  };

  useFocusEffect(
    useCallback(() => {
      if (!user?.id || !selectedTemple?.id) return;

      const currentKey = `${user.id}:${selectedTemple.id}`;
      const needsInitialLoad = lastLoadedKeyRef.current !== currentKey;
      const needsRefresh = lastRefreshVersionRef.current !== refreshVersion;

      if (needsInitialLoad || needsRefresh) {
        lastLoadedKeyRef.current = currentKey;
        lastRefreshVersionRef.current = refreshVersion;
        void refetch();
      }
    }, [user?.id, selectedTemple?.id, refreshVersion, refetch]),
  );

  const filteredTransactions = sevaId
  ? transactions.filter(
      (item) => String(item.id) === String(sevaId),
    )
  : bookingId
    ? transactions.filter(
        (item) => String(item.billNo) === String(bookingId),
      )
    : transactions;

  
const sortedTransactions = [...filteredTransactions].sort(
  (a, b) => new Date(b.dt).getTime() - new Date(a.dt).getTime(),
);


  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const requestRefresh = useMySevasRefreshStore(
    (state) => state.requestRefresh,
  );

  const handleCancelTransaction = (item: POSTranListItem) => {
    Alert.alert(
      "Cancel Seva",
      `Are you sure you want to cancel booking ${item.billNo}?`,
      [
        {
          text: "Keep Booking",
          style: "cancel",
        },
        {
          text: "Cancel Booking",
          style: "destructive",
          onPress: async () => {
            try {
              setCancellingId(item.id);

              await cancelTransaction(item.id);

              Alert.alert(t("mySevasscreen.common.success"), t("mySevasscreen.bookingCancelledSuccess"));

              requestRefresh();
              await refetch();
            } catch (error) {
              Alert.alert(
                t("mySevasscreen.common.error"),
                t("mySevasscreen.cancelBookingError"),
              );
            } finally {
              setCancellingId(null);
            }
          },
        },
      ],
    );
  };
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.page,
        },
      ]}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.page,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.headerText}>
          <Text
            style={[
              styles.subtitle,
              {
                color: colors.accent,
              },
            ]}
          >
            {selectedTemple?.orgName
              ? selectedTemple.orgName
              : t("mySevas.selectTemple")}
          </Text>
        </View>

        <Pressable
          style={[
            styles.refreshButton,
            {
              backgroundColor: colors.accentMuted,
              borderColor: colors.border,
            },
          ]}
          onPress={handleRefresh}
          disabled={refreshing}
          hitSlop={8}
        >
          <RefreshCw size={20} color={colors.accent} />
        </Pressable>
      </View>
      {isLoading && transactions.length === 0 ? (
        <MySevasSkeleton />
     ) : filteredTransactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>  {t("mySevas.noSevasYet")}</Text>
          <Text style={styles.emptyDescription}>
            {t("mySevas.emptyDescription")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedTransactions}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              void fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MySevaCard transaction={item} onViewQr={handleViewQr} />
          )}
          contentContainerStyle={[
            styles.listContent,
            filteredTransactions.length === 0 && styles.emptyListContent
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Image
                source={require("@/assets/images/myseva_emptydesign.webp")}
                style={styles.emptyImage}
                resizeMode="contain"
              />

              <Text
                style={[
                  styles.emptyTitle,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                {t("mySevas.noSevasYet")}
              </Text>

              <Text
                style={[
                  styles.emptyText,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                {t("mySevas.emptyMessage")}
              </Text>
            </View>
          }
        />
      )}
      
      <QRCodeModal
        visible={selectedQrSeva !== null}
        onClose={() => setSelectedQrSeva(null)}
        selectedSeva={selectedQrSeva}
        sevaRecords={selectedQrSeva ? [selectedQrSeva] : []}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },

  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",

    marginLeft: 12,
  },

  title: {
    fontSize: 16,
    fontFamily: "Roboto_700Bold",
    color: "#222222",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    fontFamily: "Roboto_700Bold",
  },

  listContent: {
    padding: 16,
    paddingBottom: 100,
  },

  emptyListContent: {
    flexGrow: 1,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
  },

  emptyImage: {
    width: 180,
    height: 180,
    marginBottom: 2,
  },

  emptyText: {
    marginTop: 6,
    fontSize: 14,

    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    opacity: 0.7,
  },
});
