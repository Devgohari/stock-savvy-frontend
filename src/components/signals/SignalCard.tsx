import { Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { UserSignalItem } from "@/api/signals";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor(diff / 60_000);
  if (h >= 24) return `${Math.floor(h / 24)}d ago`;
  if (h >= 1) return `${h}h ago`;
  return `${m}m ago`;
}

interface SignalCardProps {
  item: UserSignalItem;
}

export function SignalCard({ item }: SignalCardProps) {
  const { signal, telegramSent, createdAt } = item;
  const isPositive = signal.decision === "POSITIVE";
  const probPct = Math.round(signal.probability * 100);

  return (
    <Card className="relative">
      {telegramSent && (
        <div className="absolute top-3 right-3 text-blue-400" title="Telegram alert sent">
          <Send className="h-3.5 w-3.5" />
        </div>
      )}
      <CardContent className="p-4 space-y-3">
        {/* Top row */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="font-mono font-bold">
            {signal.symbol}
          </Badge>
          <span className="text-sm text-muted-foreground">{signal.sector}</span>
          <Badge
            variant="outline"
            className={cn(
              "text-xs ml-auto",
              isPositive
                ? "border-emerald-500/40 text-emerald-400"
                : "border-red-500/40 text-red-400"
            )}
          >
            {isPositive ? "🟢" : "🔴"} {signal.decision}
          </Badge>
        </div>

        {/* Probability bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Probability</span>
            <span className="font-mono font-bold">{probPct}%</span>
          </div>
          <Progress value={probPct} className="h-1.5" />
        </div>

        {/* LLM Analysis */}
        {signal.llmAnalysis && (
          <p className="text-sm text-muted-foreground italic line-clamp-2">{signal.llmAnalysis}</p>
        )}

        {/* Bottom row */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
          <div className="flex gap-3">
            <span>VWAP: <span className="font-mono text-primary">₹{signal.vwap.toFixed(2)}</span></span>
            <span>Price: <span className="font-mono text-foreground">₹{signal.currentPrice.toFixed(2)}</span></span>
          </div>
          <span>{timeAgo(createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
