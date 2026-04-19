import api from "./client";

export interface Condition {
  field: "price" | "volume" | "change_pct";
  operator: ">" | "<" | ">=" | "<=" | "==";
  value: number;
}

export interface ScreenerRequest {
  sector: string;
  conditions: Condition[];
  probability_threshold: number;
  telegram_chat_id?: string;
}

export interface SignalResult {
  symbol: string;
  price?: number;
  vwap?: number;
  proximity_pct?: number;
  probability?: number;
  direction?: "BULLISH" | "BEARISH";
  signal_sent: boolean;
  llm_analysis?: string;
  error?: string;
}

export interface ScreenerResponse {
  sector: string;
  total_screened: number;
  passed_conditions: number;
  signals_generated: number;
  results: SignalResult[];
}

export const runScreener = async (req: ScreenerRequest): Promise<ScreenerResponse> => {
  const { data } = await api.post<ScreenerResponse>("/screener/run", req);
  return data;
};
