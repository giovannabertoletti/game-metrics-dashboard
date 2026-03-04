import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import type { MapWinrate, OverallStats } from "@/data/mockData";
import {
  aggregateMetrics,
  filterMatches,
  extractOpponents,
  type FirestoreMatch,
  type MetricsFilters,
  type PlayerStats,
  type MapActionStats,
} from "@/lib/metricsAggregator";

export interface MetricsData {
  mapWinrate: MapWinrate[];
  playerStats: PlayerStats[];
  mapActionStats: MapActionStats[];
  overallStats: OverallStats;
}

async function fetchRawMatches(): Promise<FirestoreMatch[]> {
  if (!isFirebaseConfigured || !db) {
    console.warn("[Firebase] Não configurado.");
    return [];
  }
  try {
    const snapshot = await getDocs(collection(db, "partidas_r6s"));
    const docs = snapshot.docs.map((doc) => doc.data() as FirestoreMatch);
    console.log(`[Firebase] ${docs.length} partidas carregadas.`);
    return docs;
  } catch (err) {
    console.error("[Firebase] Erro ao buscar partidas:", err);
    return [];
  }
}

export function useMetricsData(filters: MetricsFilters = {}) {
  const { data: rawMatches = [], isLoading, isError } = useQuery<FirestoreMatch[]>({
    queryKey: ["partidas_r6s"],
    queryFn: fetchRawMatches,
    staleTime: 1000 * 60 * 5,
  });

  const opponents = useMemo(() => extractOpponents(rawMatches), [rawMatches]);

  const metrics = useMemo<MetricsData>(() => {
    if (isError || rawMatches.length === 0) {
      return { mapWinrate: [], playerStats: [], mapActionStats: [], overallStats: { totalMatches: 0, totalWins: 0, totalLosses: 0, overallWinrate: 0, attackWinrate: 0, defenseWinrate: 0, attackRoundsWon: 0, attackRoundsPlayed: 0, defenseRoundsWon: 0, defenseRoundsPlayed: 0 } };
    }
    const filtered = filterMatches(rawMatches, filters);
    return aggregateMetrics(filtered);
  }, [rawMatches, filters, isError]);

  return { metrics, opponents, isLoading };
}
