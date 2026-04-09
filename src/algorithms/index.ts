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
};

export const ALGORITHM_LIST = Object.values(ALGORITHMS);

export const CATEGORIES = [
  { id: "sorting", label: "Sorting", level: 1, icon: "BarChart3" },
  { id: "greedy", label: "Greedy", level: 2, icon: "GitBranch" },
  { id: "dp", label: "Dynamic Programming", level: 3, icon: "Grid3X3" },
] as const;

