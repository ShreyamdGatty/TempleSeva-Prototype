import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { getSevas } from "../services/seva.service";

const PAGE_SIZE = 5;

/**
 * Paginated seva list for a search keyword + group filter.
 * digiOrgId + sdId are in the queryKey (tenant headers) so cache is per temple.
 * selectedGroup is in the queryKey too, so switching group starts a fresh
 * query from page 1 (which re-requests the total count).
 *
 * `enabled` gates this behind calendar + model init (calendar → GetModel → sevas).
 */
export function useSevas(
  searchKeyword: string,
  selectedGroup: string,
  digiOrgId: string,
  sdId: string,
  enabled: boolean,
) {
  // "All" means no group filter.
  const groupFilter = selectedGroup === "All" ? "" : selectedGroup;

  const query = useInfiniteQuery({
    queryKey: ["sevas", digiOrgId, sdId, searchKeyword.trim(), groupFilter],

    queryFn: async ({
      pageParam,
      signal,
    }: {
      pageParam: string | null;
      signal: AbortSignal;
    }) => {
      const response = await getSevas(
        {
          SevaName: searchKeyword.trim(),
          SevaGroup: groupFilter,
          LastId: pageParam,
          PageSize: PAGE_SIZE,
          // First page (pageParam null) → ask for the total count.
          IsCountNeed: pageParam === null,
        },
        signal,
      );

      return response;
    },

    initialPageParam: null as string | null,

    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,

    placeholderData: keepPreviousData,

    enabled: enabled && digiOrgId.length > 0,
  });

  // Flatten + dedup the pages into the seva list.
  const sevas = (() => {
    const all = (query.data?.pages ?? []).flatMap((p) => p.sevaSearchItems);
    const map = new Map(all.map((item) => [item.itMastId, item]));
    return Array.from(map.values());
  })();

  // Total comes from the first page (the one that sent IsCountNeed).
  const totalCount = query.data?.pages?.[0]?.totalCount ?? null;

  return { ...query, sevas, totalCount };
}