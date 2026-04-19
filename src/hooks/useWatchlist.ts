import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getWatchlist, addToWatchlist, removeFromWatchlist, toggleWatchlist } from "@/api/watchlist";

export const useWatchlist = () =>
  useQuery({
    queryKey: ["watchlist"],
    queryFn: getWatchlist,
    staleTime: 5 * 60 * 1000,
  });

export const useAddToWatchlist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addToWatchlist,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["watchlist"] }),
  });
};

export const useRemoveFromWatchlist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (symbol: string) => removeFromWatchlist(symbol),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["watchlist"] }),
  });
};

export const useToggleWatchlist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ symbol, isActive }: { symbol: string; isActive: boolean }) =>
      toggleWatchlist(symbol, isActive),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["watchlist"] }),
  });
};
