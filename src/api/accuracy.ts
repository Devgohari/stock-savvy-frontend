import api from "@/lib/axios";

export interface RunAccuracyParams {
  symbol: string;
  sector?: string;
  startDate: string;   // YYYY-MM-DD
  endDate: string;     // YYYY-MM-DD
  tradingMode?: "SWING" | "POSITIONAL";
  riskAppetite?: number;
}

export interface PredictionResult {
  predictedAt: string;
  outcomeDate: string | null;  // null for NOTHING rows
  decision: string;            // BUY | SELL | NOTHING
  probability: number;
  risky: number;
  entryPrice: number;
  targetPrice: number;
  stopPrice: number;
  buyRangeLow: number;
  buyRangeHigh: number;
  holdDays: number;
  result: string;              // WIN | LOSS | EXPIRED | PENDING | NOTHING
  returnPct: number | null;
  targetHit: boolean;
  stopHit: boolean;
  targetHitOn: string | null;
  stopHitOn: string | null;
  actualOutcomePrice: number | null;
  actualHighInRange: number | null;
  actualLowInRange: number | null;
  rationale: string;
}

export interface AccuracyRunResult {
  symbol: string;
  sector: string;
  startDate: string;
  endDate: string;
  tradingMode: string;
  riskAppetite: number;
  daysScanned: number;
  totalPredictions: number;
  completed: number;
  pending: number;
  wins: number;
  losses: number;
  expired: number;
  winRate: number;
  avgReturn: number;
  predictions: PredictionResult[];
}

// Matches the Prisma LlmPrediction model (camelCase from NestJS)
export interface SavedPrediction {
  id: string;
  userId: string;
  symbol: string;
  sector: string;
  tradingMode: string;
  riskAppetite: number;
  predictedAt: string;
  outcomeDate: string;
  decision: string;
  probability: number;
  risky: number;
  entryPrice: number;
  targetPrice: number;
  stopPrice: number;
  buyRangeLow: number;
  buyRangeHigh: number;
  holdDays: number;
  actualOutcomePrice: number | null;
  actualHighInRange: number | null;
  actualLowInRange: number | null;
  targetHit: boolean;
  stopHit: boolean;
  targetHitOn: string | null;
  stopHitOn: string | null;
  result: string;
  returnPct: number | null;
  rationale: string;
  createdAt: string;
}

export interface AccuracyResultsResponse {
  total: number;
  wins: number;
  losses: number;
  expired: number;
  pending: number;
  winRate: number;
  avgReturn: number;
  predictions: SavedPrediction[];
}

export async function runAccuracyTest(params: RunAccuracyParams): Promise<AccuracyRunResult> {
  const res = await api.post<AccuracyRunResult>("/accuracy/run", {
    ...params,
    symbol: params.symbol.trim().toUpperCase().replace(/\.NS$/, ""),
  });
  return res.data;
}

export async function getAccuracyResults(
  symbol?: string,
  limit = 100,
  offset = 0,
): Promise<AccuracyResultsResponse> {
  const res = await api.get<AccuracyResultsResponse>("/accuracy/results", {
    params: { ...(symbol ? { symbol } : {}), limit, offset },
  });
  return res.data;
}
