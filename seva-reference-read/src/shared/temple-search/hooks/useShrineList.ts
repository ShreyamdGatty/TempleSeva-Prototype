import { useQuery } from "@tanstack/react-query";
import { getShrineList } from "../services/TempleService";

/**
 * Fetches the shrine list for the category chips.
 * Cached aggressively since shrines rarely change.
 */
export function useShrineList() {
  return useQuery({
    queryKey: ["shrineList"],
    queryFn: ({ signal }) => getShrineList(signal),
    staleTime: 1000 * 60 * 60,   // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}