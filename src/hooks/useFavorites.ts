import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFavorites, addFavorite, removeFavorite } from "@/api/favorites";

export const useFavorites = () =>
  useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    staleTime: 5 * 60 * 1000,
  });

export const useAddFavorite = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addFavorite,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites"] }),
  });
};

export const useRemoveFavorite = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (symbol: string) => removeFavorite(symbol),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites"] }),
  });
};
