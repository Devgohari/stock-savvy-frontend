import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSectors } from "@/hooks/useSectors";
import { StockList } from "./StockList";
import { cn } from "@/lib/utils";

export function SectorGrid() {
  const { data: sectors, isLoading, isError } = useSectors();
  const [openSector, setOpenSector] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive py-8 text-center">
        Failed to load sectors. Make sure the backend is running.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {(sectors ?? []).map((sector) => {
        const isOpen = openSector === sector.name;
        return (
          <div key={sector.name} className={cn("col-span-1", isOpen && "sm:col-span-2 lg:col-span-3")}>
            <Card
              className={cn(
                "cursor-pointer transition-all border",
                isOpen ? "border-primary/40 shadow-sm" : "hover:border-border/80"
              )}
            >
              <CardHeader
                className="py-4 px-4 flex flex-row items-center justify-between select-none"
                onClick={() => setOpenSector(isOpen ? null : sector.name)}
              >
                <div>
                  <p className="font-semibold text-foreground">{sector.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{sector.stockCount} stocks</p>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </CardHeader>
              {isOpen && (
                <CardContent className="p-0 border-t border-border">
                  <StockList sector={sector.name} />
                </CardContent>
              )}
            </Card>
          </div>
        );
      })}
    </div>
  );
}
