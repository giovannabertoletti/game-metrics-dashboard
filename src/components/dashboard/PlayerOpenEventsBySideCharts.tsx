import { Card } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PlayerOpenEventsBySide } from "@/lib/metricsAggregator";

interface Props {
  data: {
    attack: PlayerOpenEventsBySide[];
    defense: PlayerOpenEventsBySide[];
  };
}

interface SideChartProps {
  title: string;
  data: PlayerOpenEventsBySide[];
}

const SideChart = ({ title, data }: SideChartProps) => (
  <Card className="border-border/50 bg-card p-6">
    <h3 className="mb-6 font-display text-lg font-bold text-foreground">{title}</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 14%)" vertical={false} />
        <XAxis
          dataKey="player"
          tick={{ fill: "hsl(0 0% 55%)", fontSize: 12, fontFamily: "Rajdhani" }}
          axisLine={{ stroke: "hsl(0 0% 14%)" }}
          tickLine={false}
          interval={0}
        />
        <YAxis
          tick={{ fill: "hsl(0 0% 55%)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip
          formatter={(value: number, name: string, payload: { payload: PlayerOpenEventsBySide }) => {
            if (name === "OPK") {
              return [`${value}% (${payload.payload.opk})`, "OPK"];
            }
            return [`${value}% (${payload.payload.opd})`, "OPD"];
          }}
          contentStyle={{
            background: "hsl(0 0% 7%)",
            border: "1px solid hsl(0 0% 14%)",
            borderRadius: "8px",
            fontSize: 13,
          }}
          labelStyle={{ color: "hsl(0 0% 75%)" }}
          itemStyle={{ color: "hsl(0 0% 95%)" }}
        />
        <Legend wrapperStyle={{ fontSize: 12, fontFamily: "Rajdhani" }} />
        <Bar dataKey="opkPct" name="OPK" fill="#4f82d8" stackId="stack" radius={[0, 0, 0, 0]} maxBarSize={42} />
        <Bar dataKey="opdPct" name="OPD" fill="#cf2f31" stackId="stack" radius={[0, 0, 0, 0]} maxBarSize={42} />
      </BarChart>
    </ResponsiveContainer>
  </Card>
);

const PlayerOpenEventsBySideCharts = ({ data }: Props) => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <SideChart title="[ATAQUE] OPEN EVENTS x PLAYERS" data={data.attack} />
      <SideChart title="[DEFESA] OPEN EVENTS x PLAYERS" data={data.defense} />
    </div>
  );
};

export default PlayerOpenEventsBySideCharts;
