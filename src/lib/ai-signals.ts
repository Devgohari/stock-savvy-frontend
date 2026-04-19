import { StockData } from "@/data/stocks";

export type AiSignal = "buy" | "sell" | "neutral";

export function computeAiSignal(stock: StockData): AiSignal {
  const hist = stock.historicalData;
  if (hist.length < 5) return "neutral";

  const recent = hist.slice(-5);

  // Simple Moving Average trend
  const shortMA = recent.slice(-3).reduce((s, d) => s + d.close, 0) / 3;
  const longMA = recent.reduce((s, d) => s + d.close, 0) / 5;

  // Trend strength: count positive changes
  const positiveChanges = recent.filter(d => d.change > 0).length;

  // Volume trend (increasing volume = conviction)
  const avgVolumeRecent = recent.slice(-2).reduce((s, d) => s + d.volume, 0) / 2;
  const avgVolumeOlder = recent.slice(0, 3).reduce((s, d) => s + d.volume, 0) / 3;
  const volumeIncreasing = avgVolumeRecent > avgVolumeOlder;

  // Simple RSI approximation
  const gains = recent.filter(d => d.change > 0).reduce((s, d) => s + d.change, 0);
  const losses = Math.abs(recent.filter(d => d.change < 0).reduce((s, d) => s + d.change, 0));
  const rs = losses === 0 ? 100 : gains / losses;
  const rsi = 100 - 100 / (1 + rs);

  let score = 0;

  // MA crossover signal
  if (shortMA > longMA) score += 2;
  else score -= 2;

  // Trend strength
  if (positiveChanges >= 4) score += 2;
  else if (positiveChanges >= 3) score += 1;
  else if (positiveChanges <= 1) score -= 2;

  // Volume confirmation
  if (volumeIncreasing && shortMA > longMA) score += 1;

  // RSI
  if (rsi > 70) score -= 1; // overbought
  else if (rsi < 30) score += 1; // oversold

  // Current day momentum
  if (stock.changePercent > 1) score += 1;
  else if (stock.changePercent < -1) score -= 1;

  if (score >= 3) return "buy";
  if (score <= -2) return "sell";
  return "neutral";
}
