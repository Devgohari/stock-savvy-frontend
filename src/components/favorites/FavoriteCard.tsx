import { X, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRemoveFavorite } from "@/hooks/useFavorites";
import { useWatchlist, useAddToWatchlist, useRemoveFromWatchlist } from "@/hooks/useWatchlist";
import { toast } from "sonner";
import type { Favorite } from "@/api/favorites";

interface FavoriteCardProps {
  favorite: Favorite;
}

export function FavoriteCard({ favorite }: FavoriteCardProps) {
  const { data: watchlist } = useWatchlist();
  const removeFav = useRemoveFavorite();
  const addWatch = useAddToWatchlist();
  const removeWatch = useRemoveFromWatchlist();

  const isWatched = watchlist?.some((w) => w.symbol === favorite.symbol) ?? false;

  return (
    <Card className="relative group">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
        disabled={removeFav.isPending}
        onClick={() =>
          removeFav.mutate(favorite.symbol, {
            onSuccess: () => toast.success(`${favorite.symbol} removed from favorites`),
            onError: () => toast.error("Failed to remove"),
          })
        }
      >
        <X className="h-3.5 w-3.5" />
      </Button>
      <CardContent className="pt-5 pb-4 px-4 space-y-3">
        <div>
          <p className="font-mono font-bold text-foreground text-lg">{favorite.symbol}</p>
          <Badge variant="outline" className="text-xs mt-1">{favorite.sector}</Badge>
        </div>
        <Button
          variant={isWatched ? "secondary" : "outline"}
          size="sm"
          className="w-full gap-1.5"
          disabled={addWatch.isPending || removeWatch.isPending}
          onClick={() => {
            if (isWatched) {
              removeWatch.mutate(favorite.symbol, {
                onSuccess: () => toast.success(`${favorite.symbol} removed from watchlist`),
                onError: () => toast.error("Failed to remove from watchlist"),
              });
            } else {
              addWatch.mutate({ symbol: favorite.symbol, sector: favorite.sector }, {
                onSuccess: () => toast.success(`${favorite.symbol} added to watchlist`),
                onError: () => toast.error("Already in watchlist"),
              });
            }
          }}
        >
          <Eye className="h-3.5 w-3.5" />
          {isWatched ? "In Watchlist" : "Add to Watchlist"}
        </Button>
      </CardContent>
    </Card>
  );
}
