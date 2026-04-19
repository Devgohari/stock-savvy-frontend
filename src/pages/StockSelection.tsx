import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getStocksBySectors, ALL_STOCKS, StockData } from "@/data/stocks";
import { StockRow } from "@/components/StockRow";
import { useWatchlist } from "@/contexts/WatchlistContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function StockSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const sectors: string[] = location.state?.sectors || [];
  const stocks = sectors.length > 0 ? getStocksBySectors(sectors) : ALL_STOCKS;
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { addToWatchlist } = useWatchlist();

  const toggle = (stock: StockData) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(stock.id)) next.delete(stock.id);
      else next.add(stock.id);
      return next;
    });
  };

  const handleAdd = () => {
    const selectedStocks = stocks.filter(s => selected.has(s.id));
    addToWatchlist(selectedStocks);
    toast.success(`${selectedStocks.length} stock${selectedStocks.length > 1 ? "s" : ""} added to watchlist`);
    navigate("/watchlist");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Select Stocks</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {sectors.length > 0
                ? `Showing stocks from ${sectors.length} sector${sectors.length > 1 ? "s" : ""}`
                : `Showing all ${stocks.length} stocks`}
            </p>
          </div>
          <button onClick={() => navigate("/")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back
          </button>
        </div>

        <div className="space-y-2">
          {stocks.map(stock => (
            <StockRow
              key={stock.id}
              stock={stock}
              selected={selected.has(stock.id)}
              onToggle={toggle}
            />
          ))}
        </div>

        {selected.size > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <button
              onClick={handleAdd}
              className={cn(
                "rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground shadow-lg transition-all hover:opacity-90 glow-gain",
                "flex items-center gap-2"
              )}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 3V15M3 9H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Add {selected.size} to Watchlist
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
