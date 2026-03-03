import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { mapWinrateData } from "@/data/mockData";

const data = mapWinrateData.map((m) => ({
  map: m.map,
  Ataque: m.attackWinrate,
  Defesa: m.defenseWinrate,
}));

const AttackDefenseMapChart = () => {
  return (
    <Card className="border-border/50 bg-card p-6">
      <h3 className="mb-1 font-display text-lg font-bold text-foreground">Ataque vs Defesa por Mapa</h3>
      <p className="mb-6 text-xs text-muted-foreground">Winrate de rounds por lado em cada mapa</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 14%)" vertical={false} />
          <XAxis
            dataKey="map"
            tick={{ fill: "hsl(0 0% 55%)", fontSize: 12, fontFamily: "Rajdhani" }}
            axisLine={{ stroke: "hsl(0 0% 14%)" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "hsl(0 0% 55%)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(0 0% 7%)",
              border: "1px solid hsl(0 0% 14%)",
              borderRadius: "8px",
              color: "hsl(0 0% 95%)",
              fontSize: 13,
            }}
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
