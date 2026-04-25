import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Target,
  Loader2,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Minus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  runAccuracyTest,
  getAccuracyResults,
  type AccuracyRunResult,
  type PredictionResult,
  type SavedPrediction,
} from "@/api/accuracy";

type Mode = "SWING" | "POSITIONAL";

export default function AccuracyTest() {
  const { toast } = useToast();

  const [symbol, setSymbol] = useState("");
  const [sector, setSector] = useState("Unknown");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [mode, setMode] = useState<Mode>("SWING");
  const [riskAppetite, setRiskAppetite] = useState(50);
  const [activeResult, setActiveResult] = useState<AccuracyRunResult | null>(null);

  const historyQuery = useQuery({
    queryKey: ["accuracy-results"],
    queryFn: () => getAccuracyResults(undefined, 100),
  });

  const runMutation = useMutation({
    mutationFn: runAccuracyTest,
    onSuccess: (data) => {
      setActiveResult(data);
      historyQuery.refetch();
      const traded = data.totalPredictions;
      toast({
        title: `${data.symbol} — test complete`,
        description: traded
          ? `${traded} trades · ${data.winRate}% win rate · avg ${data.avgReturn >= 0 ? "+" : ""}${data.avgReturn}%`
          : `${data.daysScanned} days scanned — no trades triggered`,
      });
    },
    onError: (err: any) => {
      toast({
        title: "Accuracy test failed",
        description: err?.response?.data?.message ?? err?.message ?? "Unknown error",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim() || !startDate || !endDate) return;
    runMutation.mutate({ symbol, sector, startDate, endDate, tradingMode: mode, riskAppetite });
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Target className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">LLM Accuracy Test</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Walk-forward test: for each trading day in the range, the AI sees only past candles,
          makes a call, then we verify what actually happened after the hold period.
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configure test</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Symbol</label>
                <Input
                  placeholder="e.g. TCS"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase().replace(/\.NS$/, ""))}
                  className="w-36"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Sector</label>
                <Input
                  placeholder="e.g. IT"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-32"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Start date</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-40"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">End date</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-40"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Mode</label>
                <Select value={mode} onValueChange={(v) => setMode(v as Mode)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SWING">SWING (days–weeks)</SelectItem>
                    <SelectItem value="POSITIONAL">POSITIONAL (weeks–months)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-2 max-w-sm">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">Risk appetite</label>
                <span className="text-xs font-semibold text-primary">{riskAppetite}/100</span>
              </div>
              <Slider
                min={0} max={100} step={5}
                value={[riskAppetite]}
                onValueChange={([v]) => setRiskAppetite(v)}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Cautious</span>
                <span>Aggressive</span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={runMutation.isPending || !symbol.trim() || !startDate || !endDate}
            >
              {runMutation.isPending ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analysing…</>
              ) : (
                "Run accuracy test"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Result */}
      {activeResult && <AccuracyResultView result={activeResult} />}

      {/* Saved history */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Saved trade predictions</CardTitle>
        </CardHeader>
        <CardContent>
          {historyQuery.isLoading && (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 rounded-md" />
              ))}
            </div>
          )}
          {!historyQuery.isLoading && (historyQuery.data?.predictions?.length ?? 0) === 0 && (
            <p className="text-sm text-muted-foreground">No saved predictions yet.</p>
          )}
          {!historyQuery.isLoading && (historyQuery.data?.predictions?.length ?? 0) > 0 && (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                <StatPill label="Total trades" value={String(historyQuery.data!.total)} />
                <StatPill label="Win rate" value={`${historyQuery.data!.winRate?.toFixed(1) ?? "—"}%`} color="green" />
                <StatPill
                  label="Avg return"
                  value={`${(historyQuery.data!.avgReturn ?? 0) >= 0 ? "+" : ""}${historyQuery.data!.avgReturn?.toFixed(2) ?? "—"}%`}
                  color={(historyQuery.data!.avgReturn ?? 0) >= 0 ? "green" : "red"}
                />
                <StatPill label="Wins" value={String(historyQuery.data!.wins ?? 0)} color="green" />
                <StatPill label="Losses" value={String(historyQuery.data!.losses ?? 0)} color="red" />
                <StatPill label="Expired" value={String(historyQuery.data!.expired ?? 0)} />
                <StatPill label="Pending" value={String(historyQuery.data!.pending ?? 0)} />
              </div>
              <div className="max-h-96 overflow-y-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead>Symbol</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Signal</TableHead>
                      <TableHead className="text-right">Entry</TableHead>
                      <TableHead className="text-right">Target</TableHead>
                      <TableHead className="text-right">Stop</TableHead>
                      <TableHead className="text-right">Actual exit</TableHead>
                      <TableHead className="text-right">Return</TableHead>
                      <TableHead>Outcome</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyQuery.data!.predictions.map((p) => (
                      <HistoryRow key={p.id} row={p} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AccuracyResultView — shows every scanned day, one row per day
// ─────────────────────────────────────────────────────────────────────────────

function AccuracyResultView({ result }: { result: AccuracyRunResult }) {
  const traded = result.predictions.filter((p) => p.decision !== "NOTHING");
  const nothing = result.predictions.filter((p) => p.decision === "NOTHING");

  return (
    <div className="space-y-4">
      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <StatCard label="Days scanned" value={String(result.daysScanned)} />
        <StatCard label="Trades taken" value={String(traded.length)} />
        <StatCard label="Skipped (NOTHING)" value={String(nothing.length)} />
        <StatCard
          label="Win rate"
          value={traded.length ? `${result.winRate.toFixed(1)}%` : "—"}
          valueClassName={result.winRate >= 50 ? "text-green-600" : "text-red-600"}
        />
        <StatCard
          label="Avg return"
          value={traded.length ? `${result.avgReturn >= 0 ? "+" : ""}${result.avgReturn.toFixed(2)}%` : "—"}
          valueClassName={result.avgReturn >= 0 ? "text-green-600" : "text-red-600"}
        />
        <StatCard label="Wins" value={String(result.wins)} valueClassName="text-green-600" />
        <StatCard label="Losses" value={String(result.losses)} valueClassName="text-red-600" />
      </div>

      {/* Main table — one row per trading day */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              {result.symbol} &nbsp;·&nbsp; {result.startDate} → {result.endDate}
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              {result.daysScanned} trading days
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  {/* Day info */}
                  <TableHead className="pl-4 w-[90px]">Date</TableHead>
                  <TableHead className="w-[80px]">Signal</TableHead>
                  <TableHead className="text-right w-[90px]">Price</TableHead>
                  {/* Trade details — only relevant for BUY/SELL */}
                  <TableHead className="text-right w-[90px]">Target</TableHead>
                  <TableHead className="text-right w-[80px]">Stop</TableHead>
                  <TableHead className="text-right w-[80px]">Hold</TableHead>
                  <TableHead className="text-right w-[90px]">Exit date</TableHead>
                  <TableHead className="text-right w-[90px]">Exit price</TableHead>
                  <TableHead className="text-right w-[80px]">Return</TableHead>
                  {/* Outcome */}
                  <TableHead className="w-[100px]">Result</TableHead>
                  {/* AI reasoning */}
                  <TableHead className="w-[200px] pr-4">AI reasoning</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.predictions.map((p, i) => (
                  <DayRow key={i} p={p} />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DayRow({ p }: { p: PredictionResult }) {
  const isNothing = p.decision === "NOTHING";

  return (
    <TableRow
      className={
        isNothing
          ? "opacity-50 bg-transparent"
          : p.result === "WIN"
          ? "bg-green-50/40 dark:bg-green-950/20"
          : p.result === "LOSS"
          ? "bg-red-50/40 dark:bg-red-950/20"
          : ""
      }
    >
      {/* Date */}
      <TableCell className="pl-4 font-mono text-xs font-medium">
        {p.predictedAt}
      </TableCell>

      {/* Signal badge */}
      <TableCell>
        <DecisionBadge decision={p.decision} probability={p.probability} />
      </TableCell>

      {/* Entry price — always shown */}
      <TableCell className="text-right font-medium text-sm">
        {p.entryPrice > 0 ? `₹${p.entryPrice.toFixed(0)}` : "—"}
      </TableCell>

      {/* Target */}
      <TableCell className="text-right text-xs">
        {!isNothing && p.targetPrice > 0 ? (
          <span className="text-green-700 font-medium">₹{p.targetPrice.toFixed(0)}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>

      {/* Stop */}
      <TableCell className="text-right text-xs">
        {!isNothing && p.stopPrice > 0 ? (
          <span className="text-red-600 font-medium">₹{p.stopPrice.toFixed(0)}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>

      {/* Hold days */}
      <TableCell className="text-right text-xs text-muted-foreground">
        {!isNothing && p.holdDays > 0 ? `${p.holdDays}d` : "—"}
      </TableCell>

      {/* Exit date */}
      <TableCell className="text-right font-mono text-xs">
        {p.outcomeDate ?? "—"}
      </TableCell>

      {/* Exit price */}
      <TableCell className="text-right text-sm">
        {p.actualOutcomePrice != null ? (
          <span className="font-medium">₹{p.actualOutcomePrice.toFixed(0)}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>

      {/* Return % */}
      <TableCell className="text-right">
        {p.returnPct != null ? (
          <span
            className={`text-sm font-bold ${p.returnPct >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {p.returnPct >= 0 ? "+" : ""}{p.returnPct.toFixed(2)}%
          </span>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        )}
      </TableCell>

      {/* Result */}
      <TableCell>
        <ResultBadge result={p.result} targetHit={p.targetHit} stopHit={p.stopHit} />
      </TableCell>

      {/* AI reasoning */}
      <TableCell
        className="pr-4 text-xs text-muted-foreground max-w-[200px] truncate"
        title={p.rationale}
      >
        {p.rationale || "—"}
      </TableCell>
    </TableRow>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// History row (saved predictions from DB)
// ─────────────────────────────────────────────────────────────────────────────

function HistoryRow({ row }: { row: SavedPrediction }) {
  return (
    <TableRow>
      <TableCell className="font-semibold text-xs">{row.symbol}</TableCell>
      <TableCell className="font-mono text-xs">{row.predictedAt ?? "—"}</TableCell>
      <TableCell>
        <DecisionBadge decision={row.decision} probability={row.probability} />
      </TableCell>
      <TableCell className="text-right text-sm">
        {row.entryPrice != null ? `₹${row.entryPrice.toFixed(0)}` : "—"}
      </TableCell>
      <TableCell className="text-right text-xs text-green-700">
        {row.targetPrice != null ? `₹${row.targetPrice.toFixed(0)}` : "—"}
      </TableCell>
      <TableCell className="text-right text-xs text-red-600">
        {row.stopPrice != null ? `₹${row.stopPrice.toFixed(0)}` : "—"}
      </TableCell>
      <TableCell className="text-right text-sm">
        {row.actualOutcomePrice != null ? `₹${row.actualOutcomePrice.toFixed(0)}` : "—"}
      </TableCell>
      <TableCell className="text-right">
        {row.returnPct != null ? (
          <span className={`text-sm font-bold ${row.returnPct >= 0 ? "text-green-600" : "text-red-600"}`}>
            {row.returnPct >= 0 ? "+" : ""}{row.returnPct.toFixed(2)}%
          </span>
        ) : "—"}
      </TableCell>
      <TableCell>
        <ResultBadge result={row.result ?? "—"} targetHit={row.targetHit} stopHit={row.stopHit} />
      </TableCell>
    </TableRow>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Small components
// ─────────────────────────────────────────────────────────────────────────────

function DecisionBadge({ decision, probability }: { decision: string; probability?: number }) {
  if (decision === "BUY") {
    return (
      <Badge className="bg-blue-600/15 text-blue-700 border-blue-600/30 gap-1">
        <TrendingUp className="h-3 w-3" />
        BUY {probability ? <span className="opacity-70 text-[10px]">{probability}%</span> : null}
      </Badge>
    );
  }
  if (decision === "SELL") {
    return (
      <Badge className="bg-orange-600/15 text-orange-700 border-orange-600/30 gap-1">
        <TrendingDown className="h-3 w-3" />
        SELL {probability ? <span className="opacity-70 text-[10px]">{probability}%</span> : null}
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-muted-foreground gap-1">
      <Minus className="h-3 w-3" />
      SKIP
    </Badge>
  );
}

function ResultBadge({
  result,
  targetHit,
  stopHit,
}: {
  result: string;
  targetHit?: boolean;
  stopHit?: boolean;
}) {
  if (result === "WIN") {
    return (
      <Badge className="bg-green-600/15 text-green-700 border-green-600/30 gap-1">
        <CheckCircle2 className="h-3 w-3" />
        WIN {targetHit ? <span className="opacity-60 text-[10px]">T</span> : null}
      </Badge>
    );
  }
  if (result === "LOSS") {
    return (
      <Badge className="bg-red-600/15 text-red-700 border-red-600/30 gap-1">
        <XCircle className="h-3 w-3" />
        LOSS {stopHit ? <span className="opacity-60 text-[10px]">SL</span> : null}
      </Badge>
    );
  }
  if (result === "EXPIRED") {
    return (
      <Badge variant="outline" className="text-muted-foreground gap-1">
        <Clock className="h-3 w-3" />
        EXPIRED
      </Badge>
    );
  }
  if (result === "PENDING") {
    return (
      <Badge className="bg-yellow-600/15 text-yellow-700 border-yellow-600/30 gap-1">
        <AlertCircle className="h-3 w-3" />
        PENDING
      </Badge>
    );
  }
  if (result === "NOTHING") {
    return (
      <Badge variant="outline" className="text-muted-foreground/50 gap-1">
        <Minus className="h-3 w-3" />
        SKIPPED
      </Badge>
    );
  }
  return <Badge variant="outline">{result}</Badge>;
}

function StatCard({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-[11px] text-muted-foreground leading-tight mb-1">{label}</p>
        <p className={`text-xl font-bold leading-none ${valueClassName ?? ""}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function StatPill({ label, value, color }: { label: string; value: string; color?: "green" | "red" }) {
  return (
    <div className="flex items-center gap-1.5 text-xs border rounded-md px-2.5 py-1.5 bg-card">
      <span className="text-muted-foreground">{label}:</span>
      <span className={`font-semibold ${color === "green" ? "text-green-600" : color === "red" ? "text-red-600" : ""}`}>
        {value}
      </span>
    </div>
  );
}
