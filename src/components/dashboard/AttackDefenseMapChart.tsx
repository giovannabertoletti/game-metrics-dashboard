import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { MapWinrate } from "@/data/mockData";
import { TruncatedTick, getMaxChars } from "./ChartTick";

interface Props {
  data: MapWinrate[];
}

const AttackDefenseMapChart = ({ data }: Props) => {
  const maxChars = getMaxChars(data.length);
  const chartData = data.map((m) => ({
    map: m.map,
    Ataque: m.attackWinrate,
    Defesa: m.defenseWinrate,
  }));

  return (
    <Card className="border-border/50 bg-card p-6">
      <h3 className="mb-1 font-display text-lg font-bold text-foreground">Ataque vs Defesa por Mapa</h3>
      <p className="mb-6 text-xs text-muted-foreground">Winrate de rounds por lado em cada mapa</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 14%)" vertical={false} />
          <XAxis
            dataKey="map"
            tick={(props: object) => <TruncatedTick {...props} maxChars={maxChars} />}
            axisLine={{ stroke: "hsl(0 0% 14%)" }}
            tickLine={false}
            interval={0}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "hsl(0 0% 55%)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{ background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 14%)", borderRadius: "8px", fontSize: 13 }}
            labelStyle={{ color: "hsl(0 0% 75%)" }}
            itemStyle={{ color: "hsl(0 0% 95%)" }}
            formatter={(value: number) => `${value}%`}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, fontFamily: "Rajdhani", color: "hsl(0 0% 55%)" }}
          />
          <Bar dataKey="Ataque" fill="hsl(45 90% 55%)" radius={[4, 4, 0, 0]} maxBarSize={32} />
          <Bar dataKey="Defesa" fill="hsl(200 80% 55%)" radius={[4, 4, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default AttackDefenseMapChart;
