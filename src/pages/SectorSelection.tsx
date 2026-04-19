import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SECTORS } from "@/data/stocks";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function SectorSelection() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const toggle = (sector: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(sector)) next.delete(sector);
      else next.add(sector);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Select Sectors
          </h1>
          <p className="mt-2 text-muted-foreground">
            Choose the market sectors you're interested in tracking
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SECTORS.map(sector => {
            const isSelected = selected.has(sector);
            return (
              <button
                key={sector}
                onClick={() => toggle(sector)}
                className={cn(
                  "flex items-center gap-3 rounded-lg border p-3 text-left text-sm font-medium transition-all",
                  isSelected
                    ? "border-primary/60 bg-primary/10 text-foreground glow-gain"
                    : "border-border bg-card text-muted-foreground hover:border-muted-foreground/40 hover:bg-accent"
                )}
              >
                <div className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors",
                  isSelected ? "border-primary bg-primary" : "border-muted-foreground/40"
                )}>
                  {isSelected && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground" />
                    </svg>
                  )}
                </div>
                {sector}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {selected.size} sector{selected.size !== 1 ? "s" : ""} selected
            </span>
            <button
              onClick={async () => {
                try {
                  const res = await fetch(
                    "https://api.telegram.org/bot8597974806:AAG8TfYqb2I38ey_Bli-6Ue_uE8SmccTI-w/sendMessage",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        chat_id: "991530542",
                        text: "Test notification from StockPulse 🚀",
                      }),
                    }
                  );
                  if (res.ok) toast.success("Telegram notification sent!");
                  else toast.error("Failed to send notification");
                } catch {
                  toast.error("Network error");
                }
              }}
              className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/80 transition-colors"
            >
              🔔 Test Notification
            </button>
          </div>
          <button
            disabled={selected.size === 0}
            onClick={() => navigate("/stocks", { state: { sectors: Array.from(selected) } })}
            className={cn(
              "rounded-lg px-8 py-3 font-semibold transition-all",
              selected.size > 0
                ? "bg-primary text-primary-foreground hover:opacity-90 glow-gain"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
