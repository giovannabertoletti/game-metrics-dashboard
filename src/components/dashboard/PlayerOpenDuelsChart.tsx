import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { playerOpenDuelsData } from "@/data/mockData";

const data = playerOpenDuelsData.map((p) => ({
  player: p.player,
  "Open Kills": p.openKills,
  "Open Deaths": p.openDeaths,
}));

const PlayerOpenDuelsChart = () => {
  return (
    <Card className="border-border/50 bg-card p-6">
      <h3 className="mb-1 font-display text-lg font-bold text-foreground">Open Kills / Deaths por Jogador</h3>
      <p className="mb-6 text-xs text-muted-foreground">Desempenho individual nos primeiros duelos</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 14%)" vertical={false} />
          <XAxis
            dataKey="player"
            tick={{ fill: "hsl(0 0% 55%)", fontSize: 12, fontFamily: "Rajdhani" }}
            axisLine={{ stroke: "hsl(0 0% 14%)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "hsl(0 0% 55%)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(0 0% 7%)",
              border: "1px solid hsl(0 0% 14%)",
              borderRadius: "8px",
              color: "hsl(0 0% 95%)",
              fontSize: 13,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12, fontFamily: "Rajdhani" }} />
          <Bar dataKey="Open Kills" fill="hsl(155 100% 50%)" radius={[4, 4, 0, 0]} maxBarSize={32} />
          <Bar dataKey="Open Deaths" fill="hsl(0 70% 50%)" radius={[4, 4, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default PlayerOpenDuelsChart;
