import { useInfiniteQuery } from "@tanstack/react-query";
import { getMySevas } from "../services/mySevas.service";

const PAGE_SIZE = 10;

export function useMySevas(
  userId: string,
  templeId: string,
  enabled: boolean = true,
) {
  return useInfiniteQuery({
    queryKey: ["my-sevas", userId, templeId],

    queryFn: ({ pageParam }) =>
      getMySevas({
        LastId: pageParam ?? "",
        PageSize: PAGE_SIZE,
        IsCountNeed: pageParam == null,
        ExtPartyId: userId,
      }),

    initialPageParam: null as string | null,

    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,

    enabled: enabled && !!userId && !!templeId,

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
