// Mock data for the dashboard — replace with your Python/Firebase data

export interface MapWinrate {
  map: string;
  winrate: number;
  wins: number;
  losses: number;
  attackWinrate: number;
  defenseWinrate: number;
}

export interface PlayerOpenDuels {
  player: string;
  openKills: number;
  openDeaths: number;
  okRatio: number;
}

export interface OverallStats {
  totalMatches: number;
  totalWins: number;
  totalLosses: number;
  overallWinrate: number;
  attackWinrate: number;
  defenseWinrate: number;
  attackRoundsWon: number;
  attackRoundsPlayed: number;
  defenseRoundsWon: number;
  defenseRoundsPlayed: number;
}

export const mapWinrateData: MapWinrate[] = [
  { map: "Mirage", winrate: 68, wins: 34, losses: 16, attackWinrate: 72, defenseWinrate: 64 },
  { map: "Inferno", winrate: 55, wins: 22, losses: 18, attackWinrate: 50, defenseWinrate: 60 },
  { map: "Dust2", winrate: 47, wins: 14, losses: 16, attackWinrate: 40, defenseWinrate: 54 },
  { map: "Anubis", winrate: 62, wins: 31, losses: 19, attackWinrate: 58, defenseWinrate: 66 },
  { map: "Nuke", winrate: 73, wins: 22, losses: 8, attackWinrate: 65, defenseWinrate: 80 },
  { map: "Ancient", winrate: 41, wins: 12, losses: 17, attackWinrate: 38, defenseWinrate: 44 },
  { map: "Vertigo", winrate: 58, wins: 18, losses: 13, attackWinrate: 55, defenseWinrate: 61 },
];

export const playerOpenDuelsData: PlayerOpenDuels[] = [
  { player: "FalleN", openKills: 87, openDeaths: 54, okRatio: 1.61 },
  { player: "KSCERATO", openKills: 102, openDeaths: 68, okRatio: 1.50 },
  { player: "yuurih", openKills: 76, openDeaths: 71, okRatio: 1.07 },
  { player: "chelo", openKills: 63, openDeaths: 80, okRatio: 0.79 },
  { player: "drop", openKills: 58, openDeaths: 62, okRatio: 0.94 },
];

export const openDuelsByMapData = [
  { map: "Mirage", openKills: 45, openDeaths: 32 },
  { map: "Inferno", openKills: 38, openDeaths: 41 },
  { map: "Dust2", openKills: 29, openDeaths: 35 },
  { map: "Anubis", openKills: 42, openDeaths: 28 },
  { map: "Nuke", openKills: 36, openDeaths: 22 },
  { map: "Ancient", openKills: 24, openDeaths: 30 },
  { map: "Vertigo", openKills: 33, openDeaths: 27 },
];

export const openDuelsBySideData = [
  { side: "Ataque", openKills: 128, openDeaths: 112 },
  { side: "Defesa", openKills: 119, openDeaths: 103 },
];

export const overallStats: OverallStats = {
  totalMatches: 195,
  totalWins: 121,
  totalLosses: 74,
  overallWinrate: 62.1,
  attackWinrate: 56.8,
  defenseWinrate: 67.3,
  attackRoundsWon: 1245,
  attackRoundsPlayed: 2191,
  defenseRoundsWon: 1482,
  defenseRoundsPlayed: 2202,
};
