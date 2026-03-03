import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { mapWinrateData } from "@/data/mockData";

const MapWinrateChart = () => {
  return (
    <Card className="border-border/50 bg-card p-6">
      <h3 className="mb-1 font-display text-lg font-bold text-foreground">Winrate por Mapa</h3>
      <p className="mb-6 text-xs text-muted-foreground">Taxa de vitória em cada mapa</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={mapWinrateData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
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
              fontFamily: "Inter",
              fontSize: 13,
            }}
            formatter={(value: number) => [`${value}%`, "Winrate"]}
          />
          <Bar dataKey="winrate" radius={[6, 6, 0, 0]} maxBarSize={48}>
            {mapWinrateData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.winrate >= 50 ? "hsl(155 100% 50%)" : "hsl(0 70% 50%)"}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default MapWinrateChart;
