import { useState } from "react";
import { Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { SignalCard } from "@/components/signals/SignalCard";
import { useSignals } from "@/hooks/useSignals";

const PAGE_LIMIT = 15;

export default function Signals() {
  const [page, setPage] = useState(1);
  const [symbolFilter, setSymbolFilter] = useState("");
  const [decisionFilter, setDecisionFilter] = useState("ALL");

  const { data, isLoading, isError, isFetching } = useSignals({
    page,
    limit: PAGE_LIMIT,
    symbol: symbolFilter || undefined,
    decision: decisionFilter !== "ALL" ? decisionFilter : undefined,
  });

  const totalPages = data ? Math.ceil(data.total / PAGE_LIMIT) : 0;

  const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSymbolFilter(e.target.value.toUpperCase());
    setPage(1);
  };

  const handleDecisionChange = (val: string) => {
    setDecisionFilter(val);
    setPage(1);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold">Signal History</h1>

      {/* Filter bar */}
      <div className="flex gap-3 flex-wrap">
        <Input
          placeholder="Search by symbol…"
          value={symbolFilter}
          onChange={handleSymbolChange}
          className="w-44"
        />
        <Select value={decisionFilter} onValueChange={handleDecisionChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All decisions</SelectItem>
            <SelectItem value="POSITIVE">Positive</SelectItem>
            <SelectItem value="NEGATIVE">Negative</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-sm text-destructive">Failed to load signal history.</p>
      )}

      {!isLoading && !isError && data?.items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <Bell className="h-12 w-12 opacity-20" />
          <p className="text-sm">No signals yet. Add stocks to your watchlist to start receiving signals.</p>
        </div>
      )}

      {!isLoading && data && data.items.length > 0 && (
        <>
          <div className={`space-y-3 transition-opacity ${isFetching ? "opacity-60" : ""}`}>
            {data.items.map((item) => (
              <SignalCard key={item.id} item={item} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {data.total} signals · Page {page} / {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isFetching}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || isFetching}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
