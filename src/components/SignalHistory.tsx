import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSignalHistory, type SignalHistoryItem } from "@/api/signals";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

export function SignalHistory() {
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["signal-history", page],
    queryFn: () => fetchSignalHistory(page, PAGE_SIZE),
    staleTime: 30_000,
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 w-full animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p>Could not load signal history. Make sure the backend is running.</p>
      </div>
    );
  }

  const { items, total } = data;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <Send className="h-10 w-10 mx-auto opacity-30 mb-2" />
        <p>No signals yet. Run the screener to generate signals.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-muted-foreground font-semibold">Symbol</th>
              <th className="px-4 py-3 text-left text-muted-foreground font-semibold hidden sm:table-cell">Sector</th>
              <th className="px-4 py-3 text-right text-muted-foreground font-semibold">Price</th>
              <th className="px-4 py-3 text-right text-muted-foreground font-semibold">VWAP</th>
              <th className="px-4 py-3 text-right text-muted-foreground font-semibold hidden md:table-cell">Prox%</th>
              <th className="px-4 py-3 text-center text-muted-foreground font-semibold">Direction</th>
              <th className="px-4 py-3 text-center text-muted-foreground font-semibold">Prob</th>
              <th className="px-4 py-3 text-center text-muted-foreground font-semibold hidden lg:table-cell">TG</th>
              <th className="px-4 py-3 text-right text-muted-foreground font-semibold hidden xl:table-cell">Time</th>
            </tr>
          </thead>
          <tbody>
            {items.map((sig: SignalHistoryItem) => (
              <tr key={sig.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-foreground">{sig.symbol}</td>
                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{sig.sector}</td>
                <td className="px-4 py-3 text-right font-mono">₹{sig.current_price.toFixed(2)}</td>
                <td className="px-4 py-3 text-right font-mono text-primary">₹{sig.vwap.toFixed(2)}</td>
                <td className={cn(
                  "px-4 py-3 text-right font-mono hidden md:table-cell",
                  sig.proximity_pct >= 0 ? "text-emerald-400" : "text-red-400"
                )}>
                  {sig.proximity_pct >= 0 ? "+" : ""}{sig.proximity_pct.toFixed(2)}%
                </td>
                <td className="px-4 py-3 text-center">
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
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-mono font-bold border",
                    sig.probability >= 0.8
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                  )}>
                    {(sig.probability * 100).toFixed(0)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-center hidden lg:table-cell">
                  {sig.telegram_sent ? (
                    <span title="Telegram alert sent" className="text-blue-400">📨</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-xs text-muted-foreground hidden xl:table-cell">
                  {formatDate(sig.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {total} signals · Page {page} / {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
