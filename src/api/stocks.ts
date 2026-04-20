import api from "@/lib/axios";

export interface StockValidation {
  symbol: string;
  companyName: string;
  sector: string;
  industry: string;
  currency: string;
  exchange: string;
  currentPrice: number;
}

export const validateStock = async (
  symbol: string,
): Promise<StockValidation> => {
  const { data } = await api.get<StockValidation>(
    `/stocks/validate/${encodeURIComponent(symbol)}`,
  );
  return data;
};
