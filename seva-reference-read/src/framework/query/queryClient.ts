import { QueryClient } from "@tanstack/react-query";

// One shared QueryClient for the whole app.
// These defaults suit most screens; individual queries can override.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 3,      // 3 min: data considered "fresh", no refetch
      gcTime: 1000 * 60 * 15,        // 15 min: kept in cache after unused, then dropped
      retry: 2,                      // retry failed requests twice
      refetchOnWindowFocus: false,   // no "window focus" concept in RN
    },
  },
});