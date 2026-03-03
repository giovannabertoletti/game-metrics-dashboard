import { Card } from "@/components/ui/card";
import { playerOpenDuelsData } from "@/data/mockData";

const PlayerStatsTable = () => {
  return (
    <Card className="border-border/50 bg-card p-6">
      <h3 className="mb-1 font-display text-lg font-bold text-foreground">Tabela de Open Duels</h3>
      <p className="mb-6 text-xs text-muted-foreground">Estatísticas individuais detalhadas</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="pb-3 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">Jogador</th>
              <th className="pb-3 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">OK</th>
              <th className="pb-3 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">OD</th>
              <th className="pb-3 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">Diferença</th>
              <th className="pb-3 text-right text-xs font-medium uppercase tracking-widest text-muted-foreground">Ratio</th>
            </tr>
          </thead>
          <tbody>
            {playerOpenDuelsData
              .sort((a, b) => b.okRatio - a.okRatio)
              .map((player) => {
                const diff = player.openKills - player.openDeaths;
                return (
                  <tr key={player.player} className="border-b border-border/30 transition-colors hover:bg-muted/30">
                    <td className="py-3 font-display font-semibold text-foreground">{player.player}</td>
                    <td className="py-3 text-center font-mono text-primary">{player.openKills}</td>
                    <td className="py-3 text-center font-mono text-destructive">{player.openDeaths}</td>
                    <td className={`py-3 text-center font-mono font-semibold ${diff >= 0 ? "text-primary" : "text-destructive"}`}>
                      {diff >= 0 ? `+${diff}` : diff}
                    </td>
                    <td className={`py-3 text-right font-display text-lg font-bold ${player.okRatio >= 1 ? "text-primary" : "text-destructive"}`}>
                      {player.okRatio.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default PlayerStatsTable;
