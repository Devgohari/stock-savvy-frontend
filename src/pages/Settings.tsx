import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/authStore";
import { updateMe } from "@/api/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function riskLabel(v: number) {
  if (v <= 30) return { text: "Conservative", className: "text-emerald-400" };
  if (v <= 60) return { text: "Moderate", className: "text-amber-400" };
  return { text: "Aggressive", className: "text-red-400" };
}

export default function Settings() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [risk, setRisk] = useState(user?.riskPercentage ?? 50);
  const [telegramId, setTelegramId] = useState(user?.telegramChatId ?? "");

  useEffect(() => {
    setRisk(user?.riskPercentage ?? 50);
    setTelegramId(user?.telegramChatId ?? "");
  }, [user]);

  const saveRisk = useMutation({
    mutationFn: () => updateMe({ riskPercentage: risk }),
    onSuccess: (updated) => {
      setUser({ id: updated.id, email: updated.email, riskPercentage: updated.riskPercentage, telegramChatId: updated.telegramChatId });
      toast.success("Risk profile saved");
    },
    onError: () => toast.error("Failed to save"),
  });

  const saveTelegram = useMutation({
    mutationFn: () => updateMe({ telegramChatId: telegramId || undefined }),
    onSuccess: (updated) => {
      setUser({ id: updated.id, email: updated.email, riskPercentage: updated.riskPercentage, telegramChatId: updated.telegramChatId });
      toast.success("Telegram settings saved");
    },
    onError: () => toast.error("Failed to save"),
  });

  const label = riskLabel(risk);

  return (
    <div className="space-y-8 max-w-lg">
      <h1 className="text-2xl font-bold">Settings</h1>

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
