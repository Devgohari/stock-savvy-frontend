import { NavLink } from "react-router-dom";
import { BarChart2, Heart, Eye, Bell, Settings, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: BarChart2 },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/watchlist", label: "Watchlist", icon: Eye },
  { to: "/signals", label: "Signals", icon: Bell },
  { to: "/accuracy", label: "Accuracy", icon: Target },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-border bg-card min-h-screen py-6 px-3 gap-1">
      <div className="flex items-center gap-2.5 px-3 mb-6">
        <BarChart2 className="h-5 w-5 text-primary" />
        <span className="font-bold text-foreground tracking-tight">Stock Savvy</span>
      </div>
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              isActive
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </aside>
  );
}
