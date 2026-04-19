import { Eye } from "lucide-react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { WatchlistRow } from "@/components/watchlist/WatchlistRow";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useSignals } from "@/hooks/useSignals";
import type { UserSignalItem } from "@/api/signals";

export default function Watchlist() {
  const { data: watchlist, isLoading, isError } = useWatchlist();
  const { data: signalHistory } = useSignals({ limit: 100 });

  // Build latest signal map per symbol (items already sorted desc by NestJS)
  const latestSignalBySymbol = new Map<string, UserSignalItem>();
  if (signalHistory?.items) {
    for (const item of signalHistory.items) {
      if (!latestSignalBySymbol.has(item.signal.symbol)) {
        latestSignalBySymbol.set(item.signal.symbol, item);
      }
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">My Watchlist</h1>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-sm text-destructive">Failed to load watchlist.</p>
      )}

      {!isLoading && !isError && watchlist?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <Eye className="h-12 w-12 opacity-20" />
          <p className="text-sm">No stocks in watchlist yet. Add from the Dashboard.</p>
        </div>
      )}

      {!isLoading && !isError && watchlist && watchlist.length > 0 && (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead className="hidden sm:table-cell">Sector</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Last Signal</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {watchlist.map((item) => (
                <WatchlistRow
                  key={item.id}
                  item={item}
                  lastSignal={latestSignalBySymbol.get(item.symbol)}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
