import { useFavorites } from "@/hooks/useFavorites";
import { FavoriteCard } from "@/components/favorites/FavoriteCard";
import { SectorGrid } from "@/components/sectors/SectorGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Heart } from "lucide-react";

function FavoritesStrip() {
  const { data: favorites, isLoading } = useFavorites();

  if (isLoading) {
    return (
      <div className="flex gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-36 shrink-0 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-3 px-1">
        <Heart className="h-4 w-4 opacity-40" />
        <span>No favorites yet — add stocks from the sectors below</span>
      </div>
    );
  }

  return (
    <ScrollArea className="w-full">
      <div className="flex gap-3 pb-2">
        {favorites.map((fav) => (
          <div key={fav.id} className="w-40 shrink-0">
            <FavoriteCard favorite={fav} />
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-8 max-w-6xl">
      {/* Favorites strip */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          My Favorites
        </h2>
        <FavoritesStrip />
      </section>

      {/* Sector explorer */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Sector Explorer
        </h2>
        <SectorGrid />
      </section>
    </div>
  );
}
