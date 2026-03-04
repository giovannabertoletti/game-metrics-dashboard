# Game Metrics Dashboard

## Data Source
- Raw data comes from Firebase collection `partidas_r6s` in `useMetricsData`.
- Metric calculations are done on frontend in `aggregateMetrics` (`src/lib/metricsAggregator.ts`).

## Filters
Dashboard filters are applied before aggregation:
- Start date
- End date
- Opponent

Rules:
- Matches with `isDeleted = true` are ignored.
- Date filter uses `scrimDate`.

## Player Scope
Player metrics include only:
- `live`
- `resetz`
- `flastry`
- `gabu`
- `stemp`

Order is fixed in this exact sequence across player charts and table.

## Base Calculation Rules

### Match Win
- `roundsWon = attackScore + defenseScore`
- `win = roundsWon > 6`

### Rounds Played by Side
Per match:
- `attackRoundsPlayed += attackWon + max(0, 6 - attackWon)`
- `defenseRoundsPlayed += defenseWon + max(0, 6 - defenseWon)`

## Top Stat Cards

### Matches
- `totalMatches = number of active matches after filters`

### Wins
- `totalWins = matches where (attackScore + defenseScore) > 6`

### Losses
- `totalLosses = totalMatches - totalWins`

### Winrate
- `overallWinrate = (totalWins / totalMatches) * 100`

### Attack WR
- `attackWinrate = (attackRoundsWon / attackRoundsPlayed) * 100`

### Defense WR
- `defenseWinrate = (defenseRoundsWon / defenseRoundsPlayed) * 100`

## Charts

### 1) Winrate by Map (`MapWinrateChart`)
Per map:
- `wins = won matches on map`
- `losses = lost matches on map`
- `winrate = wins / (wins + losses) * 100`
- `attackWinrate = attackWonOnMap / attackPlayedOnMap * 100`
- `defenseWinrate = defenseWonOnMap / defensePlayedOnMap * 100`

Notes:
- `Desconhecido` map is removed.
- Sorted by `winrate` desc.

### 2) Attack vs Defense by Map (`AttackDefenseMapChart`)
Uses map winrate dataset:
- `Ataque` bar = map `attackWinrate`
- `Defesa` bar = map `defenseWinrate`

### 3) Overall Side Winrate (`OverallSidesChart`)
Shows:
- `attackWinrate` and `attackRoundsWon/attackRoundsPlayed`
- `defenseWinrate` and `defenseRoundsWon/defenseRoundsPlayed`

### 4) Player Actions (OPK x OPD) (`PlayerOpenDuelsChart`)
Requested rule:
- `OPK (green) = Tatica + Play Individual`
- `OPD (red) = Refrag + Troll + Hold`

### 5) Map Actions (OPK x OPD) (`OpenDuelsByMapChart`)
Collective totals by map with same rule:
- `OPK (positivos) = Tatica + Play Individual`
- `OPD (negativos) = Refrag + Troll + Hold`

### 6) OPD Type x Players (Attack/Defense) (`PlayerOpdTypeBySideCharts`)
Split by side using each stat `attack` and `defense` values:
- Series: `troll`, `refrag`, `holdPosicao`
- `[ATAQUE]` panel uses only attack values
- `[DEFESA]` panel uses only defense values

## Player Action Table (`PlayerStatsTable`)
Columns:
- `Tatica`
- `Play Ind.`
- `Refrag`
- `Troll`
- `Hold`
- `Score`

### Score
Requested metric:
- `OPK = Tatica + Play Individual`
- `OPD = Refrag + Troll + Hold`
- `Score = OPK - OPD`

Example:
- `50 OPK - 30 OPD = +20`

## Firebase Key Mapping
Normalization for `player.stats` keys:
- remove accents
- uppercase

Mapped keys:
- `TATICA` -> tatica
- contains `HOLD` -> hold
- `REFRAG` -> refrag
- contains `INDIVIDUAL` -> play individual
- `TROLL` -> troll
- `OPK` or contains `OPEN KILL`/`OPENING KILL`/`ENTRY KILL`
- `OPD` or contains `OPEN DEATH`/`OPENING DEATH`/`ENTRY DEATH`

In development console:
- detected keys
- unmapped keys

This helps adjust parsing if Firebase keys differ.
