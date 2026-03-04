import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { MapWinrate } from "@/data/mockData";
import { TruncatedTick, getMaxChars } from "./ChartTick";

interface Props {
  data: MapWinrate[];
}

const tooltipStyle = {
  background: "hsl(0 0% 7%)",
  border: "1px solid hsl(0 0% 14%)",
  borderRadius: "8px",
  fontFamily: "Inter",
  fontSize: 13,
};
const labelStyle = { color: "hsl(0 0% 75%)" };
const itemStyle = { color: "hsl(0 0% 95%)" };

// Custom bar shape that picks color per entry — avoids Cell reconciliation issues
const ColoredBar = (props: {
  x?: number; y?: number; width?: number; height?: number; winrate?: number;
}) => {
  const { x = 0, y = 0, width = 0, height = 0, winrate = 0 } = props;
  if (!width || !height) return null;
  const fill = winrate >= 50 ? "hsl(155 100% 50%)" : "hsl(0 70% 50%)";
  const r = Math.min(6, width / 2);
  return (
    <path
      d={`M${x + r},${y} h${width - 2 * r} a${r},${r} 0 0 1 ${r},${r} v${height - r} h${-width} v${-(height - r)} a${r},${r} 0 0 1 ${r},${-r}z`}
      fill={fill}
      fillOpacity={0.85}
    />
  );
};

const MapWinrateChart = ({ data }: Props) => {
  const maxChars = getMaxChars(data.length);
  return (
    <Card className="border-border/50 bg-card p-6">
      <h3 className="mb-1 font-display text-lg font-bold text-foreground">Winrate por Mapa</h3>
      <p className="mb-6 text-xs text-muted-foreground">Taxa de vitória em cada mapa</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
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
            contentStyle={tooltipStyle}
            labelStyle={labelStyle}
            itemStyle={itemStyle}
            formatter={(value: number) => [`${value}%`, "Winrate"]}
          />
          <Bar dataKey="winrate" maxBarSize={48} shape={<ColoredBar />} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default MapWinrateChart;
