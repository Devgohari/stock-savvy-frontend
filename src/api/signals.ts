import api from "@/lib/axios";

export interface Signal {
  id: string;
  symbol: string;
  sector: string;
  vwap: number;
  currentPrice: number;
  probability: number;
  decision: "POSITIVE" | "NEGATIVE";
  llmAnalysis: string;
  createdAt: string;
}

export interface UserSignalItem {
  id: string;
  userId: string;
  signalId: string;
  telegramSent: boolean;
  createdAt: string;
  signal: Signal;
}

export interface SignalHistoryResponse {
  total: number;
  page: number;
  limit: number;
  items: UserSignalItem[];
}

export interface SignalHistoryFilters {
  page?: number;
  limit?: number;
  symbol?: string;
  decision?: string;
}

export interface SignalStats {
  windowDays: number;
  totalSignals: number;
  openSignals: number;
  closedSignals: number;
  wins: number;
  losses: number;
  winRate: number;
  avgReturnPct: number;
  alertsSent: number;
}

export const getSignalStats = async (days = 30): Promise<SignalStats> => {
  const { data } = await api.get<SignalStats>("/signals/stats", {
    params: { days },
  });
  return data;
};

export const getSignalHistory = async (filters: SignalHistoryFilters = {}): Promise<SignalHistoryResponse> => {
  const { data } = await api.get<SignalHistoryResponse>("/signals/history", {
    params: {
      page: filters.page ?? 1,
      limit: filters.limit ?? 15,
      ...(filters.symbol ? { symbol: filters.symbol } : {}),
      ...(filters.decision && filters.decision !== "ALL" ? { decision: filters.decision } : {}),
    },
  });
  return data;
};
