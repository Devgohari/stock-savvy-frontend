import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { TrendingUp, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/authStore";
import { updateMe } from "@/api/auth";
import type { TradingMode } from "@/api/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function riskLabel(v: number) {
  if (v <= 30) return { text: "Conservative", className: "text-emerald-400" };
  if (v <= 60) return { text: "Moderate", className: "text-amber-400" };
  return { text: "Aggressive", className: "text-red-400" };
}

function userPayload(u: any) {
  return {
    id: u.id,
    email: u.email,
    riskPercentage: u.riskPercentage,
    tradingMode: u.tradingMode,
    telegramChatId: u.telegramChatId,
  };
}

export default function Settings() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [risk, setRisk] = useState(user?.riskPercentage ?? 50);
  const [telegramId, setTelegramId] = useState(user?.telegramChatId ?? "");
  const [tradingMode, setTradingMode] = useState<TradingMode>(
    user?.tradingMode ?? "SWING",
  );

  useEffect(() => {
    setRisk(user?.riskPercentage ?? 50);
    setTelegramId(user?.telegramChatId ?? "");
    setTradingMode(user?.tradingMode ?? "SWING");
  }, [user]);

  const saveRisk = useMutation({
    mutationFn: () => updateMe({ riskPercentage: risk }),
    onSuccess: (updated) => {
      setUser(userPayload(updated));
      toast.success("Risk profile saved");
    },
    onError: () => toast.error("Failed to save"),
  });

  const saveTelegram = useMutation({
    mutationFn: () => updateMe({ telegramChatId: telegramId || undefined }),
    onSuccess: (updated) => {
      setUser(userPayload(updated));
      toast.success("Telegram settings saved");
    },
    onError: () => toast.error("Failed to save"),
  });

  const saveTradingMode = useMutation({
    mutationFn: (mode: TradingMode) => updateMe({ tradingMode: mode }),
    onSuccess: (updated) => {
      setUser(userPayload(updated));
      toast.success("Trading style updated");
    },
    onError: () => toast.error("Failed to save"),
  });

  const label = riskLabel(risk);

  return (
    <div className="space-y-8 max-w-lg">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Trading Style */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">Trading Style</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Determines signal timeframe and hold duration
          </p>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setTradingMode("SWING")}
            className={cn(
              "rounded-lg border p-4 text-left transition-colors",
              tradingMode === "SWING"
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50",
            )}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Swing</span>
            </div>
            <p className="text-xs text-muted-foreground leading-snug">
              Days to weeks · Daily candles
            </p>
          </button>
          <button
            type="button"
            onClick={() => setTradingMode("POSITIONAL")}
            className={cn(
              "rounded-lg border p-4 text-left transition-colors",
              tradingMode === "POSITIONAL"
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50",
            )}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <LineChart className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Positional</span>
            </div>
            <p className="text-xs text-muted-foreground leading-snug">
              Months · Weekly candles
            </p>
          </button>
        </div>
        <Button
          onClick={() => saveTradingMode.mutate(tradingMode)}
          disabled={
            saveTradingMode.isPending || tradingMode === user?.tradingMode
          }
        >
          {saveTradingMode.isPending ? "Saving…" : "Save trading style"}
        </Button>
      </section>

      {/* Risk Profile */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">Risk Profile</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Controls minimum probability threshold for Telegram alerts
          </p>
        </div>
        <Separator />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Risk Appetite</Label>
            <span className={cn("text-sm font-medium", label.className)}>
              {label.text} · {risk}%
            </span>
          </div>
          <Slider
            min={1}
            max={100}
            step={1}
            value={[risk]}
            onValueChange={([v]) => setRisk(v)}
          />
          <p className="text-xs text-muted-foreground">
            Alert threshold = {100 - risk}% probability · higher risk = more alerts
          </p>
        </div>
        <Button onClick={() => saveRisk.mutate()} disabled={saveRisk.isPending}>
          {saveRisk.isPending ? "Saving…" : "Save risk profile"}
        </Button>
      </section>

      {/* Telegram Alerts */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">Telegram Alerts</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Receive signal alerts on Telegram</p>
        </div>
        <Separator />
        <div className="space-y-1.5">
          <Label htmlFor="telegram">Telegram Chat ID</Label>
          <Input
            id="telegram"
            placeholder="e.g. 991530542"
            value={telegramId}
            onChange={(e) => setTelegramId(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Send /start to your bot on Telegram to get your Chat ID
          </p>
        </div>
        <Button onClick={() => saveTelegram.mutate()} disabled={saveTelegram.isPending}>
          {saveTelegram.isPending ? "Saving…" : "Save Telegram settings"}
        </Button>
      </section>

      {/* Account */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">Account</h2>
        </div>
        <Separator />
        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input value={user?.email ?? ""} readOnly className="bg-muted cursor-default" />
        </div>
      </section>
    </div>
  );
}
