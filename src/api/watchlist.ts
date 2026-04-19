import api from "@/lib/axios";

export interface WatchlistItem {
  id: string;
  userId: string;
  symbol: string;
  sector: string;
  isActive: boolean;
  createdAt: string;
}

export const getWatchlist = async (): Promise<WatchlistItem[]> => {
  const { data } = await api.get<WatchlistItem[]>("/watchlist");
  return data;
};

export const addToWatchlist = async (payload: { symbol: string; sector: string }): Promise<WatchlistItem> => {
  const { data } = await api.post<WatchlistItem>("/watchlist", payload);
  return data;
};

export const removeFromWatchlist = async (symbol: string): Promise<void> => {
  await api.delete(`/watchlist/${symbol}`);
};

export const toggleWatchlist = async (symbol: string, isActive: boolean): Promise<WatchlistItem> => {
  const { data } = await api.patch<WatchlistItem>(`/watchlist/${symbol}`, { isActive });
  return data;
};
