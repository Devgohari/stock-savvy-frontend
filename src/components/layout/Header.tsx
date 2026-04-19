import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

function riskLabel(pct: number): { label: string; className: string } {
  if (pct <= 30) return { label: "Conservative", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" };
  if (pct <= 60) return { label: "Moderate", className: "bg-amber-500/20 text-amber-400 border-amber-500/30" };
  return { label: "Aggressive", className: "bg-red-500/20 text-red-400 border-red-500/30" };
}

export function Header() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "??";
  const risk = riskLabel(user?.riskPercentage ?? 50);

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-border h-14 flex items-center px-4 justify-between">
      <span className="font-bold text-foreground tracking-tight lg:hidden">Stock Savvy</span>
      <div className="flex-1 lg:flex-none" />
      <div className="flex items-center gap-3">
        <Badge variant="outline" className={cn("text-xs hidden sm:inline-flex", risk.className)}>
          {risk.label} · {user?.riskPercentage}%
        </Badge>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs bg-primary/10 text-primary">{initials}</AvatarFallback>
        </Avatar>
        <span className="text-sm text-muted-foreground hidden md:block">{user?.email}</span>
        <Button variant="ghost" size="sm" onClick={logout} className="gap-1.5 text-muted-foreground">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign out</span>
        </Button>
      </div>
    </header>
  );
}
