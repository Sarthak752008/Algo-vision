import { DPSnapshot } from "@/types/algorithm";

const CODE = `function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(n + 1).fill(null)
    .map(() => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i-1] <= w) {
        // Can include item i
        const include = values[i-1] + dp[i-1][w - weights[i-1]];
        const exclude = dp[i-1][w];
        dp[i][w] = Math.max(include, exclude);
      } else {
        // Cannot include item i
        dp[i][w] = dp[i-1][w];
      }
    }
  }
  return dp[n][capacity];
}`;

export interface KnapsackInput {
  weights: number[];
  values: number[];
  capacity: number;
}

export function generateKnapsackSnapshots(input: KnapsackInput): DPSnapshot[] {
  const { weights, values, capacity } = input;
  const n = weights.length;
  const snapshots: DPSnapshot[] = [];

  const dp: number[][] = Array(n + 1)
    .fill(null)
    .map(() => Array(capacity + 1).fill(0));

  snapshots.push({
    table: dp.map((r) => [...r]),
    i: 0,
    w: 0,
    action: "init",
    message: `Initialize ${n + 1} × ${capacity + 1} DP table with zeros. Items: ${weights.map((w, i) => `(w=${w}, v=${values[i]})`).join(", ")}.`,
    codeLine: 3,
  });

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        const include = values[i - 1] + dp[i - 1][w - weights[i - 1]];
        const exclude = dp[i - 1][w];

        if (include > exclude) {
          dp[i][w] = include;
          snapshots.push({
            table: dp.map((r) => [...r]),
            i,
            w,
            action: "include",
            message: `Item ${i} (w=${weights[i - 1]}, v=${values[i - 1]}): include (${include}) > exclude (${exclude}). dp[${i}][${w}] = ${include}.`,
            codeLine: 11,
          });
        } else {
          dp[i][w] = exclude;
          snapshots.push({
            table: dp.map((r) => [...r]),
            i,
            w,
            action: "exclude",
            message: `Item ${i} (w=${weights[i - 1]}, v=${values[i - 1]}): exclude (${exclude}) ≥ include (${include}). dp[${i}][${w}] = ${exclude}.`,
            codeLine: 13,
          });
        }
      } else {
        dp[i][w] = dp[i - 1][w];
        snapshots.push({
          table: dp.map((r) => [...r]),
          i,
          w,
          action: "exclude",
          message: `Item ${i} too heavy (w=${weights[i - 1]} > ${w}). dp[${i}][${w}] = dp[${i - 1}][${w}] = ${dp[i - 1][w]}.`,
          codeLine: 16,
        });
      }
    }
  }

  // Backtrack to find selected items
  const selected: number[] = [];
  let remW = capacity;
  for (let i = n; i > 0; i--) {
    if (dp[i][remW] !== dp[i - 1][remW]) {
      selected.push(i);
      remW -= weights[i - 1];
    }
  }

  snapshots.push({
    table: dp.map((r) => [...r]),
    i: n,
    w: capacity,
    action: "done",
    selectedItems: selected.reverse(),
    message: `Knapsack complete! Maximum value = ${dp[n][capacity]}. Selected items: ${selected.join(", ")}.`,
    codeLine: 20,
  });

  return snapshots;
}

export const knapsackMeta = {
  id: "knapsack",
  name: "0-1 Knapsack",
  category: "dp" as const,
  difficulty: "Hard" as const,
  timeComplexity: "O(n × W)",
  spaceComplexity: "O(n × W)",
  description:
    "A classic dynamic programming problem: given items with weights and values, find the maximum value subset that fits within a weight capacity, where each item can be taken at most once.",
  analogy: "Imagine packing a suitcase for a trip. You have limited space and want to pack the most valuable items. For each item, you must decide: is it worth its weight? Does including it prevent you from taking even better items later?",
  approach: [
    "Create a 2D table where rows represent items and columns represent remaining capacity.",
    "For each item, decide whether to include it or exclude it.",
    "If you exclude it, the value is the same as the maximum value for the same capacity without this item.",
    "If you include it, the value is the item's value plus the maximum value for the remaining capacity without this item.",
    "Fill the table iteratively to build up to the maximum capacity."
  ],
  cppCode: `int knapsack(int W, int wt[], int val[], int n) {
    vector<vector<int>> dp(n + 1, vector<int>(W + 1));
    for (int i = 0; i <= n; i++) {
        for (int w = 0; w <= W; w++) {
            if (i == 0 || w == 0)
                dp[i][w] = 0;
            else if (wt[i - 1] <= w)
                dp[i][w] = max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
            else
                dp[i][w] = dp[i - 1][w];
        }
    }
    return dp[n][W];
}`,
  javaCode: `public int knapsack(int W, int wt[], int val[], int n) {
    int[][] dp = new int[n + 1][W + 1];
    for (int i = 0; i <= n; i++) {
        for (int w = 0; w <= W; w++) {
            if (i == 0 || w == 0)
                dp[i][w] = 0;
            else if (wt[i - 1] <= w)
                dp[i][w] = Math.max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
            else
                dp[i][w] = dp[i - 1][w];
        }
    }
    return dp[n][W];
}`,
  code: CODE,
  defaultInput: {
    weights: [2, 3, 4, 5],
    values: [3, 4, 5, 6],
    capacity: 8,
  } as KnapsackInput,
};

