import api from "@/lib/axios";

export interface Sector {
  name: string;
  stockCount: number;
}

export interface StockItem {
  symbol: string;
  sector: string;
}

export const getSectors = async (): Promise<Sector[]> => {
  const { data } = await api.get<Sector[]>("/sectors");
  return data;
};

export const getStocksBySector = async (sector: string): Promise<StockItem[]> => {
  const { data } = await api.get<StockItem[]>(`/sectors/${sector}/stocks`);
  return data;
};
