import { useState } from "react";
import { Trophy, Target, Shield, Swords, Crosshair, Skull } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import MapWinrateChart from "@/components/dashboard/MapWinrateChart";
import AttackDefenseMapChart from "@/components/dashboard/AttackDefenseMapChart";
import OverallSidesChart from "@/components/dashboard/OverallSidesChart";
import PlayerOpenDuelsChart from "@/components/dashboard/PlayerOpenDuelsChart";
import OpenDuelsByMapChart from "@/components/dashboard/OpenDuelsByMapChart";
import PlayerStatsTable from "@/components/dashboard/PlayerStatsTable";
import FilterBar from "@/components/dashboard/FilterBar";
import { useMetricsData } from "@/hooks/useMetricsData";
import type { MetricsFilters } from "@/lib/metricsAggregator";

const Index = () => {
  const [filters, setFilters] = useState<MetricsFilters>({});
  const { metrics, opponents, isLoading } = useMetricsData(filters);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="font-display text-muted-foreground animate-pulse">Carregando métricas...</p>
      </div>
    );
  }

  const stats = metrics.overallStats;

  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Header */}
      <header className="border-b border-border/50 px-6 py-5">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            <Crosshair className="h-7 w-7 text-primary" />
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground text-glow">
                TEAM DASHBOARD
              </h1>
              <p className="text-xs text-muted-foreground">Métricas de performance competitiva</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Filters */}
        <FilterBar filters={filters} opponents={opponents} onChange={setFilters} />

        {/* Stat Cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <StatCard title="Partidas" value={stats.totalMatches} icon={Target} />
          <StatCard title="Vitórias" value={stats.totalWins} icon={Trophy} trend="up" />
          <StatCard title="Derrotas" value={stats.totalLosses} icon={Skull} trend="down" />
          <StatCard title="Winrate" value={`${stats.overallWinrate}%`} icon={Target} trend="up" />
          <StatCard title="WR Ataque" value={`${stats.attackWinrate}%`} icon={Swords} />
          <StatCard title="WR Defesa" value={`${stats.defenseWinrate}%`} icon={Shield} />
        </div>

        {/* Charts Row 1 */}
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <MapWinrateChart data={metrics.mapWinrate} />
          <AttackDefenseMapChart data={metrics.mapWinrate} />
        </div>

        {/* Charts Row 2 */}
        <div className="mb-6 grid gap-6 lg:grid-cols-3">
          <OverallSidesChart data={metrics.overallStats} />
          <div className="lg:col-span-2">
            <PlayerOpenDuelsChart data={metrics.playerStats} />
          </div>
        </div>

        {/* Charts Row 3 */}
        <div className="grid gap-6 lg:grid-cols-2">
          <OpenDuelsByMapChart data={metrics.mapActionStats} />
          <PlayerStatsTable data={metrics.playerStats} />
        </div>
      </main>
    </div>
  );
};

export default Index;
