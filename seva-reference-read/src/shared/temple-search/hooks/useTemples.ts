import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { searchDigiOrgs } from "../services/TempleService";

const PAGE_SIZE = 10;

/**
 * Fetches the paginated temple (digiorg) list.
 * `enabled` lets the modal only fetch when it's open.
 */
export function useTemples(
  searchKeyword: string,
  shrine: string,
  enabled: boolean,
) {
  return useInfiniteQuery({
    queryKey: ["temples", searchKeyword.trim(), shrine],

    queryFn: ({
      pageParam,
      signal,
    }: {
      pageParam: string | null;
      signal: AbortSignal;
    }) =>
      searchDigiOrgs(
        {
          lastId: pageParam,
          pageSize: PAGE_SIZE,
          orgName: searchKeyword,
          shrine: shrine === "All" ? "" : shrine,
        },
        signal,
      ),

    initialPageParam: null as string | null,

    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,

    placeholderData: keepPreviousData,

    // Only fetch when the modal is open.
    enabled,

    // Flatten pages into one deduped array.
    select: (result) => {
      const all = result.pages.flatMap((p) => p.digiOrgSearchItems);
      const map = new Map(all.map((item) => [item.id, item]));
      return Array.from(map.values());
    },
  });
}
