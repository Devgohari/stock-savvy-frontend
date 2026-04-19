import { Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useStocks } from "@/hooks/useStocks";
import { useFavorites, useAddFavorite, useRemoveFavorite } from "@/hooks/useFavorites";
import { useWatchlist, useAddToWatchlist, useRemoveFromWatchlist } from "@/hooks/useWatchlist";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface StockListProps {
  sector: string;
}

export function StockList({ sector }: StockListProps) {
  const { data: stocks, isLoading } = useStocks(sector);
  const { data: favorites } = useFavorites();
  const { data: watchlist } = useWatchlist();
  const addFav = useAddFavorite();
  const removeFav = useRemoveFavorite();
  const addWatch = useAddToWatchlist();
  const removeWatch = useRemoveFromWatchlist();

  const favSet = new Set(favorites?.map((f) => f.symbol) ?? []);
  const watchSet = new Set(watchlist?.map((w) => w.symbol) ?? []);

  if (isLoading) {
    return (
      <div className="space-y-2 px-4 pb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!stocks || stocks.length === 0) {
    return <p className="px-4 pb-4 text-sm text-muted-foreground">No stocks found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Symbol</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground hidden sm:table-cell">Sector</th>
            <th className="px-4 py-2 text-right text-xs font-semibold text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => {
            const isFav = favSet.has(stock.symbol);
            const isWatch = watchSet.has(stock.symbol);
            const favPending = addFav.isPending || removeFav.isPending;
            const watchPending = addWatch.isPending || removeWatch.isPending;

            return (
              <tr key={stock.symbol} className="border-b border-border/40 hover:bg-accent/20 transition-colors">
                <td className="px-4 py-2.5 font-mono font-bold text-foreground">{stock.symbol}</td>
                <td className="px-4 py-2.5 text-muted-foreground hidden sm:table-cell">{stock.sector}</td>
                <td className="px-4 py-2.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn("h-8 w-8 p-0", isFav && "text-red-400")}
                      disabled={favPending}
                      onClick={() => {
                        if (isFav) {
                          removeFav.mutate(stock.symbol, {
                            onSuccess: () => toast.success(`${stock.symbol} removed from favorites`),
                            onError: () => toast.error("Failed to remove favorite"),
                          });
                        } else {
                          addFav.mutate({ symbol: stock.symbol, sector: stock.sector }, {
                            onSuccess: () => toast.success(`${stock.symbol} added to favorites`),
                            onError: (e: any) => toast.error(e?.response?.data?.message || "Already in favorites"),
                          });
                        }
                      }}
                    >
                      <Heart className={cn("h-4 w-4", isFav && "fill-current")} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn("h-8 w-8 p-0", isWatch && "text-primary")}
                      disabled={watchPending}
                      onClick={() => {
                        if (isWatch) {
                          removeWatch.mutate(stock.symbol, {
                            onSuccess: () => toast.success(`${stock.symbol} removed from watchlist`),
                            onError: () => toast.error("Failed to remove from watchlist"),
                          });
                        } else {
                          addWatch.mutate({ symbol: stock.symbol, sector: stock.sector }, {
                            onSuccess: () => toast.success(`${stock.symbol} added to watchlist`),
                            onError: (e: any) => toast.error(e?.response?.data?.message || "Already in watchlist"),
                          });
                        }
                      }}
                    >
                      <Eye className={cn("h-4 w-4", isWatch && "fill-current")} />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
