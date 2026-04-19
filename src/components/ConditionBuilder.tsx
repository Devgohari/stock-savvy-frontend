import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import type { Condition } from "@/api/screener";

const FIELDS = [
  { value: "price", label: "Price (₹)" },
  { value: "volume", label: "Volume" },
  { value: "change_pct", label: "Change %" },
] as const;

const OPERATORS = [">", "<", ">=", "<=", "=="] as const;

interface ConditionBuilderProps {
  conditions: Condition[];
  onChange: (conditions: Condition[]) => void;
  threshold: number;
  onThresholdChange: (v: number) => void;
  onRun: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export function ConditionBuilder({
  conditions,
  onChange,
  threshold,
  onThresholdChange,
  onRun,
  isLoading,
  disabled,
}: ConditionBuilderProps) {
  const addCondition = () => {
    onChange([...conditions, { field: "price", operator: ">", value: 0 }]);
  };

  const removeCondition = (i: number) => {
    onChange(conditions.filter((_, idx) => idx !== i));
  };

  const updateCondition = (i: number, updates: Partial<Condition>) => {
    onChange(conditions.map((c, idx) => (idx === i ? { ...c, ...updates } : c)));
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Conditions</h3>
        <Button variant="outline" size="sm" onClick={addCondition} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      {conditions.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-2">
          No conditions — all stocks in sector will be screened
        </p>
      )}

      <div className="space-y-2">
        {conditions.map((cond, i) => (
          <div key={i} className="flex items-center gap-2">
            <Select
              value={cond.field}
              onValueChange={(v) => updateCondition(i, { field: v as Condition["field"] })}
            >
              <SelectTrigger id={`cond-field-${i}`} className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FIELDS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={cond.operator}
              onValueChange={(v) => updateCondition(i, { operator: v as Condition["operator"] })}
            >
              <SelectTrigger id={`cond-op-${i}`} className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OPERATORS.map((op) => (
                  <SelectItem key={op} value={op}>{op}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              id={`cond-val-${i}`}
              type="number"
              value={cond.value}
              onChange={(e) => updateCondition(i, { value: parseFloat(e.target.value) || 0 })}
              className="w-32"
            />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeCondition(i)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Probability threshold */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Min. Probability</span>
          <span className="font-mono font-semibold text-primary">{(threshold * 100).toFixed(0)}%</span>
        </div>
        <Slider
          id="probability-threshold"
          min={0}
          max={100}
          step={5}
          value={[Math.round(threshold * 100)]}
          onValueChange={([v]) => onThresholdChange(v / 100)}
          className="w-full"
        />
      </div>

      <Button
        id="run-screener-btn"
        onClick={onRun}
        disabled={disabled || isLoading}
        className="w-full gap-2 bg-primary hover:bg-primary/90"
      >
        {isLoading ? (
          <>
            <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            Running…
          </>
        ) : (
          "⚡ Run Screener"
        )}
      </Button>
    </div>
  );
}
