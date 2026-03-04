import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MetricsFilters } from "@/lib/metricsAggregator";

interface FilterBarProps {
  filters: MetricsFilters;
  opponents: string[];
  onChange: (filters: MetricsFilters) => void;
}

const FilterBar = ({ filters, opponents, onChange }: FilterBarProps) => {
  const hasFilters = !!filters.startDate || !!filters.endDate || !!filters.opponent;

  function toInputValue(date?: Date): string {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  }

  return (
    <div className="mb-8 flex flex-wrap items-end gap-3">
      {/* Start date */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Data início
        </label>
        <input
          type="date"
          value={toInputValue(filters.startDate)}
          max={toInputValue(filters.endDate)}
          onChange={(e) =>
            onChange({ ...filters, startDate: e.target.value ? new Date(e.target.value + "T00:00:00") : undefined })
          }
          className="h-9 rounded-md border border-border/50 bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary [color-scheme:dark]"
        />
      </div>

      {/* End date */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Data fim
        </label>
        <input
          type="date"
          value={toInputValue(filters.endDate)}
          min={toInputValue(filters.startDate)}
          onChange={(e) =>
            onChange({ ...filters, endDate: e.target.value ? new Date(e.target.value + "T00:00:00") : undefined })
          }
          className="h-9 rounded-md border border-border/50 bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary [color-scheme:dark]"
        />
      </div>

      {/* Opponent */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Time inimigo
        </label>
        <select
          value={filters.opponent ?? ""}
          onChange={(e) => onChange({ ...filters, opponent: e.target.value || undefined })}
          className="h-9 min-w-[160px] rounded-md border border-border/50 bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Todos</option>
          {opponents.map((opp) => (
            <option key={opp} value={opp}>
              {opp}
            </option>
          ))}
        </select>
      </div>

      {/* Clear */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-1.5 text-muted-foreground hover:text-foreground"
          onClick={() => onChange({})}
        >
          <X className="h-3.5 w-3.5" />
          Limpar filtros
        </Button>
      )}
    </div>
  );
};

export default FilterBar;
