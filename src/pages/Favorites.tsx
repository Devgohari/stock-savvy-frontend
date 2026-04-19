import { Heart } from "lucide-react";
import { FavoriteCard } from "@/components/favorites/FavoriteCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useFavorites } from "@/hooks/useFavorites";

export default function Favorites() {
  const { data: favorites, isLoading, isError } = useFavorites();

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">My Favorites</h1>

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-sm text-destructive">Failed to load favorites.</p>
      )}

      {!isLoading && !isError && favorites?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <Heart className="h-12 w-12 opacity-20" />
          <p className="text-sm">No favorites yet. Add stocks from the Dashboard.</p>
        </div>
      )}

      {!isLoading && !isError && favorites && favorites.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {favorites.map((fav) => (
            <FavoriteCard key={fav.id} favorite={fav} />
          ))}
        </div>
      )}
    </div>
  );
}
