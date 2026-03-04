import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { PlayerStats } from "@/lib/metricsAggregator";

interface Props {
  data: PlayerStats[];
}

const PlayerOpenDuelsChart = ({ data }: Props) => {
  const chartData = data.map((p) => ({
    player: p.player,
    "Positivos": p.tatica + p.holdPositao + p.refrag,
    "Negativos": p.troll + p.playIndividual,
  }));

  return (
    <Card className="border-border/50 bg-card p-6">
      <h3 className="mb-1 font-display text-lg font-bold text-foreground">Ações por Jogador</h3>
      <p className="mb-6 text-xs text-muted-foreground">Táticas + Holds + Refrags vs Trolls + Plays Individuais</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 14%)" vertical={false} />
          <XAxis
            dataKey="player"
            tick={{ fill: "hsl(0 0% 55%)", fontSize: 12, fontFamily: "Rajdhani" }}
            axisLine={{ stroke: "hsl(0 0% 14%)" }}
            tickLine={false}
          />
          <YAxis tick={{ fill: "hsl(0 0% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 14%)", borderRadius: "8px", fontSize: 13 }}
            labelStyle={{ color: "hsl(0 0% 75%)" }}
            itemStyle={{ color: "hsl(0 0% 95%)" }}
          />
          <Legend wrapperStyle={{ fontSize: 12, fontFamily: "Rajdhani" }} />
          <Bar dataKey="Positivos" fill="hsl(155 100% 50%)" radius={[4, 4, 0, 0]} maxBarSize={32} />
          <Bar dataKey="Negativos" fill="hsl(0 70% 50%)" radius={[4, 4, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default PlayerOpenDuelsChart;
