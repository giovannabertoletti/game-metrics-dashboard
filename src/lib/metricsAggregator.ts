import type { MapWinrate, OverallStats } from "@/data/mockData";
import type { MetricsData } from "@/hooks/useMetricsData";

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
  scrimDate?: string;
  opponentName?: string;
  selectedMap?: string;
  attackScore?: number;
  defenseScore?: number;
  players?: FirestorePlayer[];
}

export interface PlayerStats {
  player: string;
  tatica: number;
  holdPositao: number;
  refrag: number;
  playIndividual: number;
  troll: number;
  opk: number;
  opd: number;
  score: number;
}

export interface PlayerOpdTypeBySide {
  player: string;
  troll: number;
  refrag: number;
  holdPosicao: number;
}

export interface PlayerOpenEventsBySide {
  player: string;
  opk: number;
  opd: number;
  opkPct: number;
  opdPct: number;
}

export interface MapActionStats {
  map: string;
  positivos: number; // OPK: TATICA + INDIVIDUAL
  negativos: number; // OPD: REFRAG + TROLL + HOLD
}

export interface MetricsFilters {
  startDate?: Date;
  endDate?: Date;
  opponent?: string;
}

const FIXED_PLAYERS = ["live", "resetz", "flastry", "gabu", "stemp"] as const;
const ALLOWED_PLAYERS = new Set(FIXED_PLAYERS);

function isAllowedPlayer(name: string): boolean {
  return ALLOWED_PLAYERS.has(name.trim().toLowerCase());
}

function toPlayerKey(name: string): string {
  return name.trim().toLowerCase();
}

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
  return new Date(match.scrimDate + "T12:00:00");
}

function normalizeStatKey(key: string): string {
  return key
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase();
}

function isWin(match: FirestoreMatch): boolean {
  const won = (match.attackScore ?? 0) + (match.defenseScore ?? 0);
  return won > 6;
}

export function aggregateMetrics(matches: FirestoreMatch[]): MetricsData {
  const active = matches.filter((m) => !isDeleted(m));

  const emptyStats: OverallStats = {
    totalMatches: 0,
    totalWins: 0,
    totalLosses: 0,
    overallWinrate: 0,
    attackWinrate: 0,
    defenseWinrate: 0,
    attackRoundsWon: 0,
    attackRoundsPlayed: 0,
    defenseRoundsWon: 0,
    defenseRoundsPlayed: 0,
  };

  if (active.length === 0) {
    return {
      mapWinrate: [],
      playerStats: [],
      mapActionStats: [],
      playerOpdTypeBySide: { attack: [], defense: [] },
      playerOpenEventsBySide: { attack: [], defense: [] },
      overallStats: emptyStats,
    };
  }

  interface MapAcc {
    wins: number;
    losses: number;
    attackWon: number;
    attackPlayed: number;
    defenseWon: number;
    defensePlayed: number;
    positivos: number;
    negativos: number;
  }

  interface SideAcc {
    troll: number;
    refrag: number;
    holdPosicao: number;
    opk: number;
    opd: number;
  }

  const mapAcc: Record<string, MapAcc> = {};
  const playerAcc: Record<string, Omit<PlayerStats, "player">> = {};
  const playerSideAcc: Record<string, { attack: SideAcc; defense: SideAcc }> = {};
  const seenStatKeys = new Set<string>();
  const unknownStatKeys = new Set<string>();

  let totalWins = 0;
  let totalAttackWon = 0;
  let totalAttackPlayed = 0;
  let totalDefenseWon = 0;
  let totalDefensePlayed = 0;

  for (const match of active) {
    const map = getMap(match);
    const atkWon = match.attackScore ?? 0;
    const defWon = match.defenseScore ?? 0;
    const atkLost = Math.max(0, 6 - atkWon);
    const defLost = Math.max(0, 6 - defWon);
    const win = isWin(match);

    if (!mapAcc[map]) {
      mapAcc[map] = {
        wins: 0,
        losses: 0,
        attackWon: 0,
        attackPlayed: 0,
        defenseWon: 0,
        defensePlayed: 0,
        positivos: 0,
        negativos: 0,
      };
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

    for (const player of match.players ?? []) {
      const name = toPlayerKey(player.name);
      if (!isAllowedPlayer(name)) continue;

      if (!playerAcc[name]) {
        playerAcc[name] = {
          tatica: 0,
          holdPositao: 0,
          refrag: 0,
          playIndividual: 0,
          troll: 0,
          opk: 0,
          opd: 0,
          score: 0,
        };
      }

      if (!playerSideAcc[name]) {
        playerSideAcc[name] = {
          attack: { troll: 0, refrag: 0, holdPosicao: 0, opk: 0, opd: 0 },
          defense: { troll: 0, refrag: 0, holdPosicao: 0, opk: 0, opd: 0 },
        };
      }

      for (const [key, val] of Object.entries(player.stats ?? {})) {
        const attack = val?.attack ?? 0;
        const defense = val?.defense ?? 0;
        const total = attack + defense;
        const k = normalizeStatKey(key);
        seenStatKeys.add(k);

        if (k === "TATICA") {
          playerAcc[name].tatica += total;
          mapAcc[map].positivos += total;
        } else if (k.includes("HOLD")) {
          playerAcc[name].holdPositao += total;
          mapAcc[map].negativos += total;
          playerSideAcc[name].attack.holdPosicao += attack;
          playerSideAcc[name].defense.holdPosicao += defense;
        } else if (k === "REFRAG") {
          playerAcc[name].refrag += total;
          mapAcc[map].negativos += total;
          playerSideAcc[name].attack.refrag += attack;
          playerSideAcc[name].defense.refrag += defense;
        } else if (k.includes("INDIVIDUAL")) {
          playerAcc[name].playIndividual += total;
          mapAcc[map].positivos += total;
        } else if (k === "TROLL") {
          playerAcc[name].troll += total;
          mapAcc[map].negativos += total;
          playerSideAcc[name].attack.troll += attack;
          playerSideAcc[name].defense.troll += defense;
        } else if (
          k === "OPK" ||
          k.includes("OPEN KILL") ||
          k.includes("OPENING KILL") ||
          k.includes("ENTRY KILL")
        ) {
          playerSideAcc[name].attack.opk += attack;
          playerSideAcc[name].defense.opk += defense;
        } else if (
          k === "OPD" ||
          k.includes("OPEN DEATH") ||
          k.includes("OPENING DEATH") ||
          k.includes("ENTRY DEATH")
        ) {
          playerSideAcc[name].attack.opd += attack;
          playerSideAcc[name].defense.opd += defense;
        } else {
          unknownStatKeys.add(k);
        }
      }
    }
  }

  const totalMatches = active.length;
  const totalLosses = totalMatches - totalWins;
  const overallWinrate = totalMatches > 0 ? +((totalWins / totalMatches) * 100).toFixed(1) : 0;
  const attackWinrate = totalAttackPlayed > 0 ? +((totalAttackWon / totalAttackPlayed) * 100).toFixed(1) : 0;
  const defenseWinrate = totalDefensePlayed > 0 ? +((totalDefenseWon / totalDefensePlayed) * 100).toFixed(1) : 0;

  const mapWinrate: MapWinrate[] = Object.entries(mapAcc)
    .map(([map, s]) => ({
      map,
      wins: s.wins,
      losses: s.losses,
      winrate: s.wins + s.losses > 0 ? Math.round((s.wins / (s.wins + s.losses)) * 100) : 0,
      attackWinrate: s.attackPlayed > 0 ? Math.round((s.attackWon / s.attackPlayed) * 100) : 0,
      defenseWinrate: s.defensePlayed > 0 ? Math.round((s.defenseWon / s.defensePlayed) * 100) : 0,
    }))
    .filter((m) => m.map !== "Desconhecido")
    .sort((a, b) => b.winrate - a.winrate);

  const playerStats: PlayerStats[] = FIXED_PLAYERS.map((player) => {
    const tatica = playerAcc[player]?.tatica ?? 0;
    const holdPositao = playerAcc[player]?.holdPositao ?? 0;
    const refrag = playerAcc[player]?.refrag ?? 0;
    const playIndividual = playerAcc[player]?.playIndividual ?? 0;
    const troll = playerAcc[player]?.troll ?? 0;
    const opk = tatica + playIndividual;
    const opd = refrag + troll + holdPositao;

    return {
      player,
      tatica,
      holdPositao,
      refrag,
      playIndividual,
      troll,
      opk,
      opd,
      score: opk - opd,
    };
  });

  const mapActionStats: MapActionStats[] = Object.entries(mapAcc)
    .filter(([map]) => map !== "Desconhecido")
    .map(([map, s]) => ({ map, positivos: s.positivos, negativos: s.negativos }));

  const toOpenEvents = (player: string, side: SideAcc): PlayerOpenEventsBySide => {
    const total = side.opk + side.opd;
    return {
      player,
      opk: side.opk,
      opd: side.opd,
      opkPct: total > 0 ? +((side.opk / total) * 100).toFixed(1) : 0,
      opdPct: total > 0 ? +((side.opd / total) * 100).toFixed(1) : 0,
    };
  };

  const playerOpdTypeBySide = {
    attack: FIXED_PLAYERS.map((player) => {
      const s = playerSideAcc[player];
      return {
        player,
        troll: s?.attack.troll ?? 0,
        refrag: s?.attack.refrag ?? 0,
        holdPosicao: s?.attack.holdPosicao ?? 0,
      };
    }),
    defense: FIXED_PLAYERS.map((player) => {
      const s = playerSideAcc[player];
      return {
        player,
        troll: s?.defense.troll ?? 0,
        refrag: s?.defense.refrag ?? 0,
        holdPosicao: s?.defense.holdPosicao ?? 0,
      };
    }),
  };

  const playerOpenEventsBySide = {
    attack: FIXED_PLAYERS.map((player) => {
      const s = playerSideAcc[player];
      return toOpenEvents(player, s?.attack ?? { troll: 0, refrag: 0, holdPosicao: 0, opk: 0, opd: 0 });
    }),
    defense: FIXED_PLAYERS.map((player) => {
      const s = playerSideAcc[player];
      return toOpenEvents(player, s?.defense ?? { troll: 0, refrag: 0, holdPosicao: 0, opk: 0, opd: 0 });
    }),
  };

  const overallStats: OverallStats = {
    totalMatches,
    totalWins,
    totalLosses,
    overallWinrate,
    attackWinrate,
    defenseWinrate,
    attackRoundsWon: totalAttackWon,
    attackRoundsPlayed: totalAttackPlayed,
    defenseRoundsWon: totalDefenseWon,
    defenseRoundsPlayed: totalDefensePlayed,
  };

  if (import.meta.env.DEV) {
    console.log("[Metrics] Chaves de stats detectadas:", Array.from(seenStatKeys).sort());
    if (unknownStatKeys.size > 0) {
      console.warn("[Metrics] Chaves nao mapeadas:", Array.from(unknownStatKeys).sort());
    }
  }

  return {
    mapWinrate,
    playerStats,
    mapActionStats,
    playerOpdTypeBySide,
    playerOpenEventsBySide,
    overallStats,
  };
}

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
  const set = new Set(matches.filter((m) => !isDeleted(m)).map(getOpponent));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}
