import React from "react";
import { FlatList } from "react-native";

import { Seva } from "../types/seva.types";
import SevaCard from "./SevaCard";
import SevaCardsSkeleton from "./SevaCardsSkeleton";
import SevaEmpty from "./SevaEmpty";
import SevaFooterLoader from "./SevaFooterLoader";

type Props = {
  data: Seva[];
  selectedDate: string;
  loadingMore: boolean;
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onEndReached: () => void;
  listHeader?: React.ReactElement;
};

function SevaList({
  data,
  selectedDate,
  loadingMore,
  refreshing,
  loading,
  onRefresh,
  onEndReached,
  listHeader,
}: Props) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.itMastId}
      renderItem={({ item }) => (
        <SevaCard item={item} selectedDate={selectedDate} />
      )}
      ListHeaderComponent={listHeader}
      ListEmptyComponent={
        loading ? <SevaCardsSkeleton /> : <SevaEmpty onRefresh={onRefresh} />
      }
      ListFooterComponent={loadingMore ? <SevaFooterLoader /> : null}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="none"
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 0,
        paddingBottom: 120,
        flexGrow: data.length === 0 ? 1 : 0,
      }}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.3}
      removeClippedSubviews={false}
    />
  );
}

export default React.memo(SevaList);
