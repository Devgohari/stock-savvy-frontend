import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";
import { useToggleWatchlist, useRemoveFromWatchlist } from "@/hooks/useWatchlist";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { WatchlistItem } from "@/api/watchlist";
import type { UserSignalItem } from "@/api/signals";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor(diff / 60_000);
  if (h >= 24) return `${Math.floor(h / 24)}d ago`;
  if (h >= 1) return `${h}h ago`;
  return `${m}m ago`;
}

interface WatchlistRowProps {
  item: WatchlistItem;
  lastSignal?: UserSignalItem;
}

export function WatchlistRow({ item, lastSignal }: WatchlistRowProps) {
  const toggle = useToggleWatchlist();
  const remove = useRemoveFromWatchlist();

  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-mono font-bold text-sm">{item.symbol}</span>
          {item.companyName && (
            <span className="text-xs text-muted-foreground line-clamp-1">
              {item.companyName}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground hidden sm:table-cell">
        <div className="flex flex-col">
          <span className="text-sm">{item.sector}</span>
          {item.industry && (
            <span className="text-xs opacity-70 line-clamp-1">{item.industry}</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={cn(
            "text-xs",
            item.isActive
              ? "border-emerald-500/40 text-emerald-400"
              : "border-muted-foreground/30 text-muted-foreground"
          )}
        >
          {item.isActive ? "Active" : "Paused"}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {lastSignal ? (
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                lastSignal.signal.decision === "POSITIVE"
                  ? "border-emerald-500/40 text-emerald-400"
                  : "border-red-500/40 text-red-400"
              )}
            >
              {lastSignal.signal.decision}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {(lastSignal.signal.probability * 100).toFixed(0)}%
            </span>
            <span className="text-xs text-muted-foreground">{timeAgo(lastSignal.createdAt)}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">No signals yet</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 justify-end">
          <Switch
            checked={item.isActive}
            disabled={toggle.isPending}
            onCheckedChange={(checked) =>
              toggle.mutate({ symbol: item.symbol, isActive: checked }, {
                onSuccess: () => toast.success(`${item.symbol} ${checked ? "resumed" : "paused"}`),
                onError: () => toast.error("Failed to update"),
              })
            }
          />
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
            disabled={remove.isPending}
            onClick={() =>
              remove.mutate(item.symbol, {
                onSuccess: () => toast.success(`${item.symbol} removed`),
                onError: () => toast.error("Failed to remove"),
              })
            }
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
