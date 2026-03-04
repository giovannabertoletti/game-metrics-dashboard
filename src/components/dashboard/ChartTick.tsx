interface TickProps {
  x?: number;
  y?: number;
  payload?: { value: string };
  maxChars?: number;
}

export function getMaxChars(itemCount: number): number {
  if (itemCount >= 10) return 4;
  if (itemCount >= 7)  return 6;
  return 9;
}

export const TruncatedTick = ({ x = 0, y = 0, payload, maxChars = 9 }: TickProps) => {
  const label = payload?.value ?? "";
  const display = label.length > maxChars ? label.slice(0, maxChars) + "…" : label;
  return (
    <g transform={`translate(${x},${y})`}>
      <title>{label}</title>
      <text
        x={0}
        y={0}
        dy={14}
        textAnchor="middle"
        fill="hsl(0 0% 55%)"
        fontSize={12}
        fontFamily="Rajdhani"
      >
        {display}
      </text>
    </g>
  );
};
