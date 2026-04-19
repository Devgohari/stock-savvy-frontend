import api from "@/lib/axios";

export interface Favorite {
  id: string;
  userId: string;
  symbol: string;
  sector: string;
  createdAt: string;
}

export const getFavorites = async (): Promise<Favorite[]> => {
  const { data } = await api.get<Favorite[]>("/favorites");
  return data;
};

export const addFavorite = async (payload: { symbol: string; sector: string }): Promise<Favorite> => {
  const { data } = await api.post<Favorite>("/favorites", payload);
  return data;
};

export const removeFavorite = async (symbol: string): Promise<void> => {
  await api.delete(`/favorites/${symbol}`);
};
