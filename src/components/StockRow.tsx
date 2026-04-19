import { StockData } from "@/data/stocks";
import { AiBadge } from "./AiBadge";
import { computeAiSignal } from "@/lib/ai-signals";
import { cn } from "@/lib/utils";

interface StockRowProps {
  stock: StockData;
  selected?: boolean;
  onToggle?: (stock: StockData) => void;
  showCheckbox?: boolean;
  onRemove?: (stockId: string) => void;
}

export function StockRow({ stock, selected, onToggle, showCheckbox = true, onRemove }: StockRowProps) {
  const isUp = stock.change >= 0;
  const signal = computeAiSignal(stock);

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-lg border p-4 transition-all cursor-pointer hover:bg-accent/50",
        selected && "border-primary/50 bg-accent",
      )}
      onClick={() => onToggle?.(stock)}
    >
      {showCheckbox && (
        <div className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
          selected ? "border-primary bg-primary" : "border-muted-foreground/40"
        )}>
          {selected && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground" />
            </svg>
          )}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground truncate">{stock.name}</span>
          <span className="text-xs text-muted-foreground font-mono">{stock.symbol}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">{stock.sector}</span>
          <AiBadge signal={signal} />
        </div>
      </div>

      <div className="text-right shrink-0">
        <div className="font-mono font-semibold text-foreground">₹{stock.currentPrice.toLocaleString()}</div>
        <div className={cn("font-mono text-sm font-medium", isUp ? "text-gain" : "text-loss")}>
          {isUp ? "+" : ""}{stock.change.toFixed(2)} ({isUp ? "+" : ""}{stock.changePercent.toFixed(2)}%)
        </div>
      </div>

      <div className={cn("h-2 w-2 rounded-full shrink-0", isUp ? "bg-gain animate-pulse-gain" : "bg-loss")} />

      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(stock.id); }}
          className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:text-loss hover:bg-loss/10 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
