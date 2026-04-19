import { AiSignal } from "@/lib/ai-signals";
import { cn } from "@/lib/utils";

const signalConfig: Record<AiSignal, { label: string; className: string }> = {
  buy: { label: "AI: Buy", className: "bg-gain\/10 text-gain border-gain/30" },
  sell: { label: "AI: Sell", className: "bg-loss\/10 text-loss border-loss/30" },
  neutral: { label: "AI: Hold", className: "bg-neutral-signal\/10 text-neutral-signal border-neutral-signal/30" },
};

export function AiBadge({ signal }: { signal: AiSignal }) {
  const config = signalConfig[signal];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium font-mono", config.className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", signal === "buy" ? "bg-gain" : signal === "sell" ? "bg-loss" : "bg-neutral-signal")} />
      {config.label}
    </span>
  );
}
