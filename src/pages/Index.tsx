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
import PlayerOpdTypeBySideCharts from "@/components/dashboard/PlayerOpdTypeBySideCharts";
import { useMetricsData } from "@/hooks/useMetricsData";
import type { MetricsFilters } from "@/lib/metricsAggregator";
import { Link } from "react-router-dom";

const Index = () => {
  const [filters, setFilters] = useState<MetricsFilters>({});
  const { metrics, opponents, isLoading } = useMetricsData(filters);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="font-display animate-pulse text-muted-foreground">Carregando metricas...</p>
      </div>
    );
  }

  const stats = metrics.overallStats;

  return (
    <div className="min-h-screen bg-background bg-grid">
      <header className="border-b border-border/50 px-6 py-5">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Crosshair className="h-7 w-7 text-primary" />
              <div>
                <h1 className="text-glow font-display text-2xl font-bold text-foreground">TEAM DASHBOARD</h1>
                <p className="text-xs text-muted-foreground">Metricas de performance competitiva</p>
              </div>
            </div>
            <Link to="/readme" className="text-xs text-primary underline underline-offset-4">
              Ver README
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <FilterBar filters={filters} opponents={opponents} onChange={setFilters} />

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <StatCard title="Partidas" value={stats.totalMatches} icon={Target} />
          <StatCard title="Vitorias" value={stats.totalWins} icon={Trophy} trend="up" />
          <StatCard title="Derrotas" value={stats.totalLosses} icon={Skull} trend="down" />
          <StatCard title="Winrate" value={`${stats.overallWinrate}%`} icon={Target} trend="up" />
          <StatCard title="WR Ataque" value={`${stats.attackWinrate}%`} icon={Swords} />
          <StatCard title="WR Defesa" value={`${stats.defenseWinrate}%`} icon={Shield} />
        </div>

        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <MapWinrateChart data={metrics.mapWinrate} />
          <AttackDefenseMapChart data={metrics.mapWinrate} />
        </div>

        <div className="mb-6 grid gap-6 lg:grid-cols-3">
          <OverallSidesChart data={metrics.overallStats} />
          <div className="lg:col-span-2">
            <PlayerOpenDuelsChart data={metrics.playerStats} />
          </div>
        </div>

        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <OpenDuelsByMapChart data={metrics.mapActionStats} />
          <PlayerStatsTable data={metrics.playerStats} />
        </div>

        <div className="mb-6">
          <PlayerOpdTypeBySideCharts data={metrics.playerOpdTypeBySide} />
        </div>

      </main>
    </div>
  );
};

export default Index;
