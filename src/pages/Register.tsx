import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { BarChart2, TrendingUp, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useRegister } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import type { TradingMode } from "@/api/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function riskLabel(v: number) {
  if (v <= 30) return { text: "Conservative", className: "text-emerald-400" };
  if (v <= 60) return { text: "Moderate", className: "text-amber-400" };
  return { text: "Aggressive", className: "text-red-400" };
}

export default function Register() {
  const token = useAuthStore((s) => s.token);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [risk, setRisk] = useState(50);
  const [tradingMode, setTradingMode] = useState<TradingMode>("SWING");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const reg = useRegister();

  if (token) return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Password must be at least 8 characters";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    reg.mutate({ email, password, riskPercentage: risk, tradingMode }, {
      onError: (err: any) => {
        const msg = err?.response?.data?.message;
        toast.error(msg || "Registration failed");
      },
    });
  };

  const label = riskLabel(risk);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      </div>
      <div className="w-full max-w-sm space-y-6 relative">
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mx-auto">
            <BarChart2 className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Stock Savvy</h1>
          <p className="text-muted-foreground text-sm">Create your account</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="trader@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label>Trading Style</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTradingMode("SWING")}
                  className={cn(
                    "rounded-lg border p-3 text-left transition-colors",
                    tradingMode === "SWING"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">Swing</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    Days–weeks holds<br />Daily candles
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setTradingMode("POSITIONAL")}
                  className={cn(
                    "rounded-lg border p-3 text-left transition-colors",
                    tradingMode === "POSITIONAL"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <LineChart className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">Positional</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    Months holds<br />Weekly candles
                  </p>
                </button>
              </div>
            </div>

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
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Controls alert thresholds — higher = more alerts
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={reg.isPending}>
              {reg.isPending ? (
                <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : "Create account"}
            </Button>
          </form>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
}
