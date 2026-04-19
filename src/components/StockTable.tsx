import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, BarChart2, Zap } from "lucide-react";
import type { StockQuote } from "@/api/sectors";
import type { SignalResult } from "@/api/screener";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface StockTableProps {
  stocks: StockQuote[];
  signals?: SignalResult[];
  isLoading?: boolean;
  onAnalyze?: (stock: StockQuote) => void;
  onChartClick?: (stock: StockQuote) => void;
}

function formatVolume(v: number | null) {
  if (v == null) return "—";
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1000).toFixed(0)}K`;
  return v.toString();
}

function ProbBadge({ prob }: { prob?: number }) {
  if (prob == null) return null;
  const pct = (prob * 100).toFixed(0);
  const color =
    prob >= 0.8 ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    : prob >= 0.7 ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    : "bg-muted text-muted-foreground";
  return (
    <span className={cn("rounded-full border px-2 py-0.5 text-xs font-mono font-bold", color)}>
      {pct}%
    </span>
  );
}

export function StockTable({ stocks, signals, isLoading, onAnalyze, onChartClick }: StockTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 w-full animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
        <BarChart2 className="h-10 w-10 opacity-30" />
        <p>Select a sector to view stocks</p>
      </div>
    );
  }

  const signalMap = new Map(signals?.map((s) => [s.symbol, s]) ?? []);

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Symbol</th>
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden sm:table-cell">Name</th>
            <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Price</th>
            <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Change%</th>
            <th className="px-4 py-3 text-right font-semibold text-muted-foreground hidden md:table-cell">Volume</th>
            <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Signal</th>
            <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Action</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => {
            const sig = signalMap.get(stock.symbol);
            const changeUp = (stock.change_pct ?? 0) >= 0;

            return (
              <tr
                key={stock.symbol}
                className="border-b border-border/50 hover:bg-accent/30 transition-colors cursor-pointer"
                onClick={() => onChartClick?.(stock)}
              >
                <td className="px-4 py-3">
                  <div className="font-mono font-bold text-foreground">{stock.symbol}</div>
                  <div className="text-xs text-muted-foreground">{stock.market_cap}</div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                  {stock.name}
                </td>
                <td className="px-4 py-3 text-right font-mono font-semibold">
                  {stock.ltp != null ? `₹${stock.ltp.toFixed(2)}` : "—"}
                </td>
                <td className={cn("px-4 py-3 text-right font-mono font-medium", changeUp ? "text-emerald-400" : "text-red-400")}>
                  <div className="flex items-center justify-end gap-1">
                    {changeUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                    {stock.change_pct != null ? `${stock.change_pct > 0 ? "+" : ""}${stock.change_pct.toFixed(2)}%` : "—"}
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-mono hidden md:table-cell text-muted-foreground">
                  {formatVolume(stock.volume)}
                </td>
                <td className="px-4 py-3 text-center">
                  {sig ? (
                    <div className="flex items-center justify-center gap-1.5">
                      <ProbBadge prob={sig.probability} />
                      {sig.signal_sent && (
                        <span title="Telegram alert sent" className="text-blue-400">📨</span>
                      )}
                      {sig.direction && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            sig.direction === "BULLISH"
                              ? "border-emerald-500/40 text-emerald-400"
                              : "border-red-500/40 text-red-400"
                          )}
                        >
                          {sig.direction === "BULLISH" ? "🟢" : "🔴"} {sig.direction}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <Button
                    id={`analyze-btn-${stock.symbol}`}
                    size="sm"
                    variant="outline"
                    className="gap-1.5 h-7 px-3 text-xs hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                    onClick={() => onAnalyze?.(stock)}
                  >
                    <Zap className="h-3.5 w-3.5" />
                    Analyze
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
