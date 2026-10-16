import { useQuery } from "@tanstack/react-query";

import { getSevaGroups } from "../services/seva.service";

const SEVA_GROUP_CACHE_TIME = 24 * 60 * 60 * 1000;

export function useSevaGroups(digiOrgId: string) {
  return useQuery({
    // Temple in the key → groups cache per temple (they travel as tenant headers).
    queryKey: ["seva-groups", digiOrgId],

    queryFn: ({ signal }) => {
      return getSevaGroups(signal);
    },

    // Don't fetch until a temple is selected.
    enabled: digiOrgId.length > 0,

    staleTime: SEVA_GROUP_CACHE_TIME,
    gcTime: SEVA_GROUP_CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
  });
}