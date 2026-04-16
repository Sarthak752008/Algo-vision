import { radixSortMeta } from "./sorting/radixSort";
import { shellSortMeta } from "./sorting/shellSort";
import { countingSortMeta } from "./sorting/countingSort";
import { bucketSortMeta } from "./sorting/bucketSort";
import { dijkstraMeta } from "./greedy/dijkstra";
import { primMeta } from "./greedy/prim";
import { bellmanFordMeta } from "./greedy/bellmanFord";
import { knapsackMeta } from "./dp/knapsack";
import { coinChangeMeta } from "./dp/coinChange";
import { lcsMeta } from "./dp/lcs";
import { wordBreakMeta } from "./dp/wordBreak";
import { mcmMeta } from "./dp/mcm";
import { rodCuttingMeta } from "./dp/rodCutting";
import { floydWarshallMeta } from "./dp/floydWarshall";
import { warshallMeta } from "./dp/warshall";
import { resourceAllocationMeta } from "./dp/resourceAllocation";
import { nQueensMeta } from "./n-queens";
import { subsetSumMeta } from "./dp/subsetSum";
import { graphColoringMeta } from "./graph-coloring";
import { AlgorithmMeta } from "@/types/algorithm";

export const ALGORITHMS: Record<string, AlgorithmMeta> = {
  "radix-sort": radixSortMeta,
  "shell-sort": shellSortMeta,
  "counting-sort": countingSortMeta,
  "bucket-sort": bucketSortMeta,
  dijkstra: dijkstraMeta,
  prim: primMeta,
  "bellman-ford": bellmanFordMeta,
  knapsack: knapsackMeta,
  "coin-change": coinChangeMeta,
  lcs: lcsMeta,
  "word-break": wordBreakMeta,
  mcm: mcmMeta,
  "rod-cutting": rodCuttingMeta,
  "floyd-warshall": floydWarshallMeta,
  warshall: warshallMeta,
  "resource-allocation": resourceAllocationMeta,
  "n-queens": nQueensMeta,
  "subset-sum": subsetSumMeta,
  "graph-coloring": graphColoringMeta,
};

export const ALGORITHM_LIST = Object.values(ALGORITHMS);

export const CATEGORIES = [
  { id: "sorting", label: "Sorting", level: 1, icon: "BarChart3" },
  { id: "greedy", label: "Greedy", level: 2, icon: "GitBranch" },
  { id: "dp", label: "Dynamic Programming", level: 3, icon: "Grid3X3" },
  { id: "backtracking", label: "Backtracking", level: 4, icon: "RotateCcw" },
] as const;

