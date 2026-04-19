import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useWatchlist } from "@/contexts/WatchlistContext";

export function Navbar() {
  const { watchlist } = useWatchlist();

  const links = [
    { to: "/", label: "Sectors", icon: "◫" },
    { to: "/stocks", label: "Stocks", icon: "◉" },
    { to: "/watchlist", label: "Watchlist", icon: "★" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <span className="font-bold text-foreground tracking-tight text-lg">
          Stock<span className="text-gain">Pulse</span>
        </span>
        <div className="flex items-center gap-1">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )
              }
            >
              <span className="mr-1.5">{link.icon}</span>
              {link.label}
              {link.to === "/watchlist" && watchlist.length > 0 && (
                <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {watchlist.length}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
