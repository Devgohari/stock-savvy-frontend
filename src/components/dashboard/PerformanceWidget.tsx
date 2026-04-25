import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Activity, TrendingUp, TrendingDown, Target, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getSignalStats } from "@/api/signals";

export function PerformanceWidget() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["signal-stats", 30],
    queryFn: () => getSignalStats(30),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="text-sm text-muted-foreground">
        Unable to load performance stats.
      </p>
    );
  }

  if (data.totalSignals === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 flex items-center gap-3 text-sm text-muted-foreground">
          <Activity className="h-4 w-4 opacity-40" />
          <span>
            No signals in the last {data.windowDays} days. Add stocks to your{" "}
            <Link to="/watchlist" className="text-primary underline-offset-2 hover:underline">
              watchlist
            </Link>{" "}
            to start tracking.
          </span>
        </CardContent>
      </Card>
    );
  }

  const winClass =
    data.winRate >= 60
      ? "text-green-600"
      : data.winRate >= 40
      ? "text-foreground"
      : "text-red-600";
  const returnClass =
    data.avgReturnPct > 0
      ? "text-green-600"
      : data.avgReturnPct < 0
      ? "text-red-600"
      : "text-muted-foreground";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatTile
        icon={<Target className="h-4 w-4" />}
        label="Win rate (30d)"
        value={data.closedSignals > 0 ? `${data.winRate.toFixed(1)}%` : "—"}
        sub={`${data.wins}W / ${data.losses}L`}
        valueClass={winClass}
      />
      <StatTile
        icon={
          data.avgReturnPct >= 0 ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )
        }
        label="Avg return"
        value={
          data.closedSignals > 0
            ? `${data.avgReturnPct >= 0 ? "+" : ""}${data.avgReturnPct.toFixed(2)}%`
            : "—"
        }
        sub={`${data.closedSignals} closed`}
        valueClass={returnClass}
      />
      <StatTile
        icon={<Activity className="h-4 w-4" />}
        label="Open signals"
        value={String(data.openSignals)}
        sub="Awaiting target/stop"
      />
      <StatTile
        icon={<Minus className="h-4 w-4" />}
        label="Alerts sent"
        value={String(data.alertsSent)}
        sub={`of ${data.totalSignals} total`}
      />
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  sub,
  valueClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  valueClass?: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {icon}
          <span>{label}</span>
        </div>
        <p className={`text-2xl font-bold mt-1 ${valueClass ?? ""}`}>{value}</p>
        {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
  );
}
