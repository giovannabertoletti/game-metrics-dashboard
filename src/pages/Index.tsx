import { Trophy, Target, Shield, Swords, Crosshair, Skull } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import MapWinrateChart from "@/components/dashboard/MapWinrateChart";
import AttackDefenseMapChart from "@/components/dashboard/AttackDefenseMapChart";
import OverallSidesChart from "@/components/dashboard/OverallSidesChart";
import PlayerOpenDuelsChart from "@/components/dashboard/PlayerOpenDuelsChart";
import OpenDuelsByMapChart from "@/components/dashboard/OpenDuelsByMapChart";
import PlayerStatsTable from "@/components/dashboard/PlayerStatsTable";
import { overallStats } from "@/data/mockData";

const Index = () => {
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
        {/* Stat Cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <StatCard title="Partidas" value={overallStats.totalMatches} icon={Target} />
          <StatCard title="Vitórias" value={overallStats.totalWins} icon={Trophy} trend="up" />
          <StatCard title="Derrotas" value={overallStats.totalLosses} icon={Skull} trend="down" />
          <StatCard title="Winrate" value={`${overallStats.overallWinrate}%`} icon={Target} trend="up" />
          <StatCard title="WR Ataque" value={`${overallStats.attackWinrate}%`} icon={Swords} />
          <StatCard title="WR Defesa" value={`${overallStats.defenseWinrate}%`} icon={Shield} />
        </div>

        {/* Charts Row 1 */}
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <MapWinrateChart />
          <AttackDefenseMapChart />
        </div>

        {/* Charts Row 2 */}
        <div className="mb-6 grid gap-6 lg:grid-cols-3">
          <OverallSidesChart />
          <div className="lg:col-span-2">
            <PlayerOpenDuelsChart />
          </div>
        </div>

        {/* Charts Row 3 */}
        <div className="grid gap-6 lg:grid-cols-2">
          <OpenDuelsByMapChart />
          <PlayerStatsTable />
        </div>
      </main>
    </div>
  );
};

export default Index;
