import { useQuery } from "@tanstack/react-query";
import { getSignalHistory, type SignalHistoryFilters } from "@/api/signals";

export const useSignals = (filters: SignalHistoryFilters = {}) =>
  useQuery({
    queryKey: ["signals", filters],
    queryFn: () => getSignalHistory(filters),
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  });
