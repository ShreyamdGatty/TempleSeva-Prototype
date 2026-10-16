import { useQuery } from "@tanstack/react-query";
import { getSevaCalendar } from "../services/seva.service";

export function useSevaCalendar(
  digiOrgId?: string,
  startDate?: string,
  count?: number,
  enabled = true,
) {
  const isEnabled =
    enabled &&
    Boolean(digiOrgId) &&
    Boolean(startDate) &&
    typeof count === "number" &&
    count > 0;

  return useQuery({
    queryKey: [
      "sevaCalendar",
      digiOrgId,
      startDate,
      count,
    ],

    queryFn: ({ signal }) => {
      if (!digiOrgId) {
        throw new Error("DigiOrgId is missing");
      }

      if (!startDate) {
        throw new Error("StartDate is missing");
      }

      if (
        typeof count !== "number" ||
        count <= 0
      ) {
        throw new Error(
          "Calendar Count must be greater than 0",
        );
      }

      return getSevaCalendar(
        {
          DigiOrgId: digiOrgId,
          StartDate: startDate,
          Count: count,
        },
        signal,
      );
    },

    enabled: isEnabled,

    staleTime: 5 * 60 * 1000,

    retry: 2,

    refetchOnWindowFocus: false,
  });
}