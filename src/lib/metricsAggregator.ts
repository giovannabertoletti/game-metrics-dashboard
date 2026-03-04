import type { MapWinrate, OverallStats } from "@/data/mockData";
import type { MetricsData } from "@/hooks/useMetricsData";

// ─── Firestore raw types ─────────────────────────────────────────────────────

export interface FirestorePlayerStat {
  attack: number;
  defense: number;
}

export interface FirestorePlayer {
  name: string;
  stats: Record<string, FirestorePlayerStat>;
}

export interface FirestoreMatch {
  isDeleted?: boolean;
  // Date: string "YYYY-MM-DD"
  scrimDate?: string;
  // Opponent
  opponentName?: string;
  // Map: field is "selectedMap" in Firestore
  selectedMap?: string;
  // Scores (rounds won per side by the team)
  attackScore?: number;
  defenseScore?: number;
  // Players
  players?: FirestorePlayer[];
}

// ─── Exported player stats type ───────────────────────────────────────────────

export interface PlayerStats {
  player: string;
  tatica: number;
  holdPositao: number;
  refrag: number;
  playIndividual: number;
  troll: number;
}

export interface MapActionStats {
  map: string;
  positivos: number; // TÁTICA + HOLD + REFRAG
  negativos: number; // TROLL + PLAY INDIVIDUAL
}

// ─── Filters ─────────────────────────────────────────────────────────────────

export interface MetricsFilters {
  startDate?: Date;
  endDate?: Date;
  opponent?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isDeleted(match: FirestoreMatch): boolean {
  return match.isDeleted ?? false;
}

function getOpponent(match: FirestoreMatch): string {
  return match.opponentName ?? "Desconhecido";
}

function getMap(match: FirestoreMatch): string {
  return match.selectedMap ?? "Desconhecido";
}

function getDate(match: FirestoreMatch): Date | null {
  if (!match.scrimDate) return null;
  // scrimDate is "YYYY-MM-DD"
  return new Date(match.scrimDate + "T12:00:00");
}

// Win condition: in a standard R6S match (6 rounds per half = 12 total),
// the team wins if they won more than half (> 6) of all rounds.
function isWin(match: FirestoreMatch): boolean {
  const won = (match.attackScore ?? 0) + (match.defenseScore ?? 0);
  return won > 6;
}

// ─── Main aggregation ─────────────────────────────────────────────────────────

export function aggregateMetrics(matches: FirestoreMatch[]): MetricsData {
  const active = matches.filter((m) => !isDeleted(m));

  const emptyStats: OverallStats = {
    totalMatches: 0, totalWins: 0, totalLosses: 0,
    overallWinrate: 0, attackWinrate: 0, defenseWinrate: 0,
    attackRoundsWon: 0, attackRoundsPlayed: 0,
    defenseRoundsWon: 0, defenseRoundsPlayed: 0,
  };

  if (active.length === 0) {
    return { mapWinrate: [], playerStats: [], mapActionStats: [], overallStats: emptyStats };
  }

  interface MapAcc {
    wins: number; losses: number;
    attackWon: number; attackPlayed: number;
    defenseWon: number; defensePlayed: number;
    positivos: number; negativos: number;
  }

  const mapAcc: Record<string, MapAcc> = {};
  const playerAcc: Record<string, Omit<PlayerStats, "player">> = {};

  let totalWins = 0;
  let totalAttackWon = 0, totalAttackPlayed = 0;
  let totalDefenseWon = 0, totalDefensePlayed = 0;

  for (const match of active) {
    const map = getMap(match);
    const atkWon = match.attackScore ?? 0;
    const defWon = match.defenseScore ?? 0;
    // In a 12-round match, rounds lost = 6 - rounds won (per side)
    const atkLost = Math.max(0, 6 - atkWon);
    const defLost = Math.max(0, 6 - defWon);
    const win = isWin(match);

    if (!mapAcc[map]) {
      mapAcc[map] = { wins: 0, losses: 0, attackWon: 0, attackPlayed: 0, defenseWon: 0, defensePlayed: 0, positivos: 0, negativos: 0 };
    }

    mapAcc[map].wins += win ? 1 : 0;
    mapAcc[map].losses += win ? 0 : 1;
    mapAcc[map].attackWon += atkWon;
    mapAcc[map].attackPlayed += atkWon + atkLost;
    mapAcc[map].defenseWon += defWon;
    mapAcc[map].defensePlayed += defWon + defLost;

    totalWins += win ? 1 : 0;
    totalAttackWon += atkWon;
    totalAttackPlayed += atkWon + atkLost;
    totalDefenseWon += defWon;
    totalDefensePlayed += defWon + defLost;

    // Player stats
    for (const player of match.players ?? []) {
      const name = player.name;
      if (!playerAcc[name]) {
        playerAcc[name] = { tatica: 0, holdPositao: 0, refrag: 0, playIndividual: 0, troll: 0 };
      }

      for (const [key, val] of Object.entries(player.stats ?? {})) {
        const total = (val?.attack ?? 0) + (val?.defense ?? 0);
        const k = key.toUpperCase();

        if (k === "TÁTICA" || k === "TATICA") {
          playerAcc[name].tatica += total;
          mapAcc[map].positivos += total;
        } else if (k.includes("HOLD")) {
          playerAcc[name].holdPositao += total;
          mapAcc[map].positivos += total;
        } else if (k === "REFRAG") {
          playerAcc[name].refrag += total;
          mapAcc[map].positivos += total;
        } else if (k.includes("INDIVIDUAL")) {
          playerAcc[name].playIndividual += total;
          mapAcc[map].negativos += total;
        } else if (k === "TROLL") {
          playerAcc[name].troll += total;
          mapAcc[map].negativos += total;
        }
      }
    }
  }

  const totalMatches = active.length;
  const totalLosses = totalMatches - totalWins;
  const overallWinrate = totalMatches > 0 ? +((totalWins / totalMatches) * 100).toFixed(1) : 0;
  const attackWinrate = totalAttackPlayed > 0 ? +((totalAttackWon / totalAttackPlayed) * 100).toFixed(1) : 0;
  const defenseWinrate = totalDefensePlayed > 0 ? +((totalDefenseWon / totalDefensePlayed) * 100).toFixed(1) : 0;

  const mapWinrate: MapWinrate[] = Object.entries(mapAcc).map(([map, s]) => ({
    map,
    wins: s.wins,
    losses: s.losses,
    winrate: s.wins + s.losses > 0 ? Math.round((s.wins / (s.wins + s.losses)) * 100) : 0,
    attackWinrate: s.attackPlayed > 0 ? Math.round((s.attackWon / s.attackPlayed) * 100) : 0,
    defenseWinrate: s.defensePlayed > 0 ? Math.round((s.defenseWon / s.defensePlayed) * 100) : 0,
  })).filter(m => m.map !== "Desconhecido").sort((a, b) => b.winrate - a.winrate);

  const playerStats: PlayerStats[] = Object.entries(playerAcc)
    .map(([player, s]) => ({ player, ...s }))
    .sort((a, b) => (b.tatica + b.holdPositao + b.refrag) - (a.tatica + a.holdPositao + a.refrag));

  const mapActionStats: MapActionStats[] = Object.entries(mapAcc)
    .filter(([map]) => map !== "Desconhecido")
    .map(([map, s]) => ({ map, positivos: s.positivos, negativos: s.negativos }));

  const overallStats: OverallStats = {
    totalMatches, totalWins, totalLosses, overallWinrate,
    attackWinrate, defenseWinrate,
    attackRoundsWon: totalAttackWon,
    attackRoundsPlayed: totalAttackPlayed,
    defenseRoundsWon: totalDefenseWon,
    defenseRoundsPlayed: totalDefensePlayed,
  };

  return { mapWinrate, playerStats, mapActionStats, overallStats };
}

// ─── Client-side filtering ────────────────────────────────────────────────────

export function filterMatches(matches: FirestoreMatch[], filters: MetricsFilters): FirestoreMatch[] {
  return matches.filter((match) => {
    if (filters.opponent && getOpponent(match).toLowerCase() !== filters.opponent.toLowerCase()) {
      return false;
    }
    if (filters.startDate || filters.endDate) {
      const d = getDate(match);
      if (!d) return false;
      if (filters.startDate && d < filters.startDate) return false;
      if (filters.endDate) {
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999);
        if (d > end) return false;
      }
    }
    return true;
  });
}

export function extractOpponents(matches: FirestoreMatch[]): string[] {
  const set = new Set(
    matches.filter((m) => !isDeleted(m)).map(getOpponent)
  );
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}
