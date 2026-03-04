import { Card } from "@/components/ui/card";
import type { OverallStats } from "@/data/mockData";

interface Props {
  data: OverallStats;
}

const OverallSidesChart = ({ data }: Props) => {
  const { attackWinrate, defenseWinrate, attackRoundsWon, attackRoundsPlayed, defenseRoundsWon, defenseRoundsPlayed } = data;

  return (
    <Card className="border-border/50 bg-card p-6">
      <h3 className="mb-1 font-display text-lg font-bold text-foreground">Winrate Geral por Lado</h3>
      <p className="mb-6 text-xs text-muted-foreground">Performance geral em ataque e defesa</p>
      <div className="grid grid-cols-2 gap-6">
        {/* Attack */}
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Ataque</p>
          <p className="mt-2 font-display text-5xl font-bold text-chart-4">{attackWinrate}%</p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-chart-4 transition-all"
              style={{ width: `${attackWinrate}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {attackRoundsWon}/{attackRoundsPlayed} rounds
          </p>
        </div>
        {/* Defense */}
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Defesa</p>
          <p className="mt-2 font-display text-5xl font-bold text-chart-5">{defenseWinrate}%</p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-chart-5 transition-all"
              style={{ width: `${defenseWinrate}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {defenseRoundsWon}/{defenseRoundsPlayed} rounds
          </p>
        </div>
      </div>
    </Card>
  );
};

export default OverallSidesChart;
