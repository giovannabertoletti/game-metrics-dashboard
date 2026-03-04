import { Card } from "@/components/ui/card";
import type { PlayerStats } from "@/lib/metricsAggregator";

interface Props {
  data: PlayerStats[];
}

const PlayerStatsTable = ({ data }: Props) => {
  return (
    <Card className="border-border/50 bg-card p-6">
      <h3 className="mb-1 font-display text-lg font-bold text-foreground">Tabela de Acoes</h3>
      <p className="mb-6 text-xs text-muted-foreground">Estatisticas individuais por categoria</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="pb-3 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">Jogador</th>
              <th className="pb-3 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">Tatica</th>
              <th className="pb-3 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">Play Ind.</th>
              <th className="pb-3 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">Refrag</th>
              <th className="pb-3 text-right text-xs font-medium uppercase tracking-widest text-muted-foreground">Troll</th>
              <th className="pb-3 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">Hold</th>
              <th className="pb-3 text-right text-xs font-medium uppercase tracking-widest text-muted-foreground">Score</th>
            </tr>
          </thead>
          <tbody>
            {data.map((player) => (
              <tr key={player.player} className="border-b border-border/30 transition-colors hover:bg-muted/30">
                <td className="py-3 font-display font-semibold text-foreground">{player.player}</td>
                <td className="py-3 text-center font-mono text-emerald-400">{player.tatica}</td>
                <td className={`py-3 text-center font-mono ${player.playIndividual > 0 ? "text-emerald-400" : "text-muted-foreground"}`}>
                  {player.playIndividual}
                </td>
                <td className="py-3 text-center font-mono text-destructive">{player.refrag}</td>
                <td className={`py-3 text-right font-display text-lg font-bold ${player.troll > 0 ? "text-destructive" : "text-muted-foreground"}`}>
                  {player.troll}
                </td>
                <td className="py-3 text-center font-mono text-destructive">{player.holdPositao}</td>
                <td className={`py-3 text-right font-display text-lg font-bold ${player.score > 0 ? "text-emerald-400" : player.score < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                  {player.score > 0 ? `+${player.score}` : player.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default PlayerStatsTable;
