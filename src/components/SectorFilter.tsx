import { cn } from "@/lib/utils";
import type { Sector } from "@/api/sectors";

interface SectorFilterProps {
  sectors: Sector[];
  selected: string | null;
  onSelect: (name: string) => void;
  isLoading?: boolean;
}

export function SectorFilter({ sectors, selected, onSelect, isLoading }: SectorFilterProps) {
  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-9 w-24 animate-pulse rounded-full bg-muted flex-shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted-foreground/20">
      {sectors.map((sector) => {
        const isActive = selected === sector.name;
        return (
          <button
            key={sector.name}
            id={`sector-pill-${sector.name}`}
            onClick={() => onSelect(sector.name)}
            className={cn(
              "flex-shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-105"
                : "bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-accent"
            )}
          >
            <span>{sector.name}</span>
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-xs",
                isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              {sector.stock_count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
