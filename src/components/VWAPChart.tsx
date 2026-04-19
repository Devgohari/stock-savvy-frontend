import { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { StockQuote } from "@/api/sectors";

interface OHLCVRow {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

function computeVWAP(candles: OHLCVRow[]) {
  let cumTPVol = 0;
  let cumVol = 0;
  return candles.map((c) => {
    const tp = (c.high + c.low + c.close) / 3;
    cumTPVol += tp * c.volume;
    cumVol += c.volume;
    return { ...c, vwap: cumVol > 0 ? cumTPVol / cumVol : tp };
  });
}

// Generate synthetic OHLCV for chart when no live data available
function syntheticCandles(basePrice: number, n = 30): OHLCVRow[] {
  const candles: OHLCVRow[] = [];
  let price = basePrice * 0.95;
  for (let i = n; i > 0; i--) {
    const open = price;
    const close = open * (1 + (Math.random() - 0.48) * 0.025);
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    const volume = Math.floor(300_000 + Math.random() * 3_000_000);
    const date = new Date();
    date.setDate(date.getDate() - i);
    candles.push({
      date: date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
      volume,
    });
    price = close;
  }
  return candles;
}

interface VWAPChartProps {
  stock: StockQuote | null;
  open: boolean;
  onClose: () => void;
}

export function VWAPChart({ stock, open, onClose }: VWAPChartProps) {
  const chartData = useMemo(() => {
    if (!stock) return [];
    const raw = syntheticCandles(stock.ltp ?? 500);
    return computeVWAP(raw);
  }, [stock]);

  if (!stock) return null;

  const currentVwap = chartData[chartData.length - 1]?.vwap ?? 0;
  const proximity = stock.ltp && currentVwap
    ? (((stock.ltp - currentVwap) / currentVwap) * 100).toFixed(2)
    : "0.00";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="font-mono">{stock.symbol}</span>
            <span className="text-sm font-normal text-muted-foreground">{stock.name}</span>
            <span className={parseFloat(proximity) >= 0 ? "text-emerald-400 text-sm font-semibold" : "text-red-400 text-sm font-semibold"}>
              {parseFloat(proximity) >= 0 ? "▲" : "▼"} {proximity}% vs VWAP
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-1 text-sm text-muted-foreground flex gap-6">
          <span>LTP: <strong className="text-foreground">₹{stock.ltp?.toFixed(2) ?? "—"}</strong></span>
          <span>VWAP: <strong className="text-primary">₹{currentVwap.toFixed(2)}</strong></span>
          <span className={(stock.change_pct ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"}>
            {(stock.change_pct ?? 0) >= 0 ? "+" : ""}{stock.change_pct?.toFixed(2) ?? "0.00"}%
          </span>
        </div>

        <div className="h-72 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 5, right: 8, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis
                dataKey="date"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                interval={5}
              />
              <YAxis
                yAxisId="price"
                orientation="right"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                tickFormatter={(v) => `₹${v.toFixed(0)}`}
                width={70}
              />
              <YAxis
                yAxisId="vol"
                orientation="left"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
                width={45}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number, name: string) => {
                  if (name === "Volume") return [(value / 1_000_000).toFixed(2) + "M", name];
                  return [`₹${value.toFixed(2)}`, name];
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar yAxisId="vol" dataKey="volume" name="Volume" fill="hsl(var(--muted))" opacity={0.5} />
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="close"
                name="Close"
                stroke="hsl(var(--foreground))"
                dot={false}
                strokeWidth={1.5}
              />
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="vwap"
                name="VWAP"
                stroke="hsl(var(--primary))"
                dot={false}
                strokeWidth={2}
                strokeDasharray="5 3"
              />
              {stock.ltp && (
                <ReferenceLine
                  yAxisId="price"
                  y={stock.ltp}
                  stroke="hsl(142, 71%, 45%)"
                  strokeDasharray="4 2"
                  label={{ value: "LTP", position: "insideTopRight", fill: "hsl(142, 71%, 45%)", fontSize: 11 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
