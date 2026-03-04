# Dashboard de Metricas de Jogo

## Fonte de dados
- Os dados brutos vem do Firebase, na colecao `partidas_r6s`, via `useMetricsData`.
- Todos os calculos de metricas sao feitos no frontend em `aggregateMetrics` (`src/lib/metricsAggregator.ts`).

## Filtros
A dashboard aplica os filtros antes da agregacao:
- Data inicio
- Data fim
- Time inimigo

Regras:
- Partidas com `isDeleted = true` sao ignoradas.
- O filtro de data usa o campo `scrimDate`.

## Escopo de jogadores
As metricas de jogador consideram apenas:
- `live`
- `resetz`
- `flastry`
- `gabu`
- `stemp`

A ordem e fixa nessa sequencia em tabela e graficos de jogador.

## Regras base de calculo

### Vitoria de partida
- `roundsVencidos = attackScore + defenseScore`
- `vitoria = roundsVencidos > 6`

### Rounds jogados por lado
Por partida:
- `attackRoundsPlayed += attackWon + max(0, 6 - attackWon)`
- `defenseRoundsPlayed += defenseWon + max(0, 6 - defenseWon)`

## Cards do topo

### Partidas
- `totalMatches = numero de partidas ativas apos filtros`

### Vitorias
- `totalWins = partidas onde (attackScore + defenseScore) > 6`

### Derrotas
- `totalLosses = totalMatches - totalWins`

### Winrate
- `overallWinrate = (totalWins / totalMatches) * 100`

### WR Ataque
- `attackWinrate = (attackRoundsWon / attackRoundsPlayed) * 100`

### WR Defesa
- `defenseWinrate = (defenseRoundsWon / defenseRoundsPlayed) * 100`

## Graficos

### 1) Winrate por mapa (`MapWinrateChart`)
Para cada mapa:
- `wins = partidas vencidas no mapa`
- `losses = partidas perdidas no mapa`
- `winrate = wins / (wins + losses) * 100`
- `attackWinrate = attackWonNoMapa / attackPlayedNoMapa * 100`
- `defenseWinrate = defenseWonNoMapa / defensePlayedNoMapa * 100`

Observacoes:
- O mapa `Desconhecido` e removido.
- Ordenacao por `winrate` decrescente.

### 2) Ataque vs defesa por mapa (`AttackDefenseMapChart`)
Usa os mesmos dados do grafico de winrate por mapa:
- barra `Ataque` = `attackWinrate` do mapa
- barra `Defesa` = `defenseWinrate` do mapa

### 3) Winrate geral por lado (`OverallSidesChart`)
Mostra:
- `attackWinrate` e `attackRoundsWon/attackRoundsPlayed`
- `defenseWinrate` e `defenseRoundsWon/defenseRoundsPlayed`

### 4) Acoes por jogador (OPK x OPD) (`PlayerOpenDuelsChart`)
Regra solicitada (verde/vermelho):
- `OPK (verde) = Tatica + Play Individual`
- `OPD (vermelho) = Refrag + Troll + Hold`

### 5) Acoes por mapa (OPK x OPD) (`OpenDuelsByMapChart`)
Acumulado coletivo por mapa com a mesma regra:
- `OPK (positivos) = Tatica + Play Individual`
- `OPD (negativos) = Refrag + Troll + Hold`

### 6) OPD Type x Players (Ataque/Defesa) (`PlayerOpdTypeBySideCharts`)
Separa por lado usando os campos `attack` e `defense` de cada stat:
- series: `troll`, `refrag`, `holdPosicao`
- painel `[ATAQUE]` usa somente valores de ataque
- painel `[DEFESA]` usa somente valores de defesa

## Tabela de acoes (`PlayerStatsTable`)
Colunas:
- `Tatica`
- `Play Ind.`
- `Refrag`
- `Troll`
- `Hold`
- `Score`

### Score
Metrica solicitada:
- `OPK = Tatica + Play Individual`
- `OPD = Refrag + Troll + Hold`
- `Score = OPK - OPD`

Exemplo:
- `50 OPK - 30 OPD = +20`

## Mapeamento de chaves do Firebase
Normalizacao aplicada nas chaves de `player.stats`:
- remove acentos
- converte para uppercase

Mapeamentos usados:
- `TATICA` -> tatica
- contem `HOLD` -> hold
- `REFRAG` -> refrag
- contem `INDIVIDUAL` -> play individual
- `TROLL` -> troll
- `OPK` ou contem `OPEN KILL`/`OPENING KILL`/`ENTRY KILL`
- `OPD` ou contem `OPEN DEATH`/`OPENING DEATH`/`ENTRY DEATH`

Em desenvolvimento, o console mostra:
- chaves detectadas
- chaves nao mapeadas

Isso ajuda a ajustar parsing caso o Firebase use nomes diferentes.
