import { useState } from "react";
import { Plus, Search, Check, X, Loader2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { validateStock, type StockValidation } from "@/api/stocks";
import { useAddToWatchlist } from "@/hooks/useWatchlist";
import { toast } from "sonner";

export function AddStockDialog() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [match, setMatch] = useState<StockValidation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const add = useAddToWatchlist();

  const reset = () => {
    setInput("");
    setMatch(null);
    setError(null);
    setLoading(false);
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) reset();
  };

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setMatch(null);
    try {
      const result = await validateStock(input.trim().toUpperCase());
      setMatch(result);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Could not validate this symbol. Check the NSE ticker and try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!match) return;
    add.mutate(
      {
        symbol: match.symbol,
        sector: match.sector,
        companyName: match.companyName,
        industry: match.industry,
      },
      {
        onSuccess: () => {
          toast.success(`${match.companyName} added to watchlist`);
          handleOpenChange(false);
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message || "Failed to add to watchlist";
          toast.error(msg);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-1.5" />
          Add Stock
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a stock to your watchlist</DialogTitle>
          <DialogDescription>
            Enter the NSE symbol (e.g. BHARTIARTL, TCS, RELIANCE). We'll verify
            it against Yahoo Finance before adding.
          </DialogDescription>
        </DialogHeader>

        {!match && (
          <form onSubmit={handleValidate} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="symbol">NSE Symbol</Label>
              <Input
                id="symbol"
                placeholder="BHARTIARTL"
                autoFocus
                autoComplete="off"
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                disabled={loading}
              />
              {error && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <X className="h-3 w-3" /> {error}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !input.trim()}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                ) : (
                  <Search className="h-4 w-4 mr-1.5" />
                )}
                Validate
              </Button>
            </DialogFooter>
          </form>
        )}

        {match && (
          <div className="space-y-4">
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base leading-tight">
                    {match.companyName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {match.symbol} · {match.exchange}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Sector</p>
                  <p className="font-medium">{match.sector}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Industry</p>
                  <p className="font-medium">{match.industry}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Current Price</p>
                  <p className="font-medium text-base">
                    {match.currency === "INR" ? "₹" : match.currency}{" "}
                    {match.currentPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Add this stock to your watchlist?
            </p>
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setMatch(null)}
                disabled={add.isPending}
              >
                Search another
              </Button>
              <Button onClick={handleConfirm} disabled={add.isPending}>
                {add.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                ) : (
                  <Check className="h-4 w-4 mr-1.5" />
                )}
                Add to watchlist
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
