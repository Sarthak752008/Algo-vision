import { DPSnapshot } from "@/types/algorithm";

const CODE = `function resourceAllocation(n, m, profits) {
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 0; j <= m; j++) {
      let maxProfit = 0;
      for (let k = 0; k <= j; k++) {
        maxProfit = Math.max(maxProfit, profits[i - 1][k] + dp[i - 1][j - k]);
      }
      dp[i][j] = maxProfit;
    }
  }
  return dp[n][m];
}`;

export function generateResourceAllocationSnapshots(input: { n: number, m: number, profits: number[][] }): DPSnapshot[] {
  const { n, m, profits } = input;
  const snapshots: DPSnapshot[] = [];

  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

  snapshots.push({
    table: dp.map(r => [...r]),
    i: 0,
    w: 0,
    action: "init",
    message: `Initialize DP table for ${n} stages and ${m} resource units.`,
    codeLine: 1,
  });

  for (let i = 1; i <= n; i++) {
    for (let j = 0; j <= m; j++) {
      snapshots.push({
        table: dp.map(r => [...r]),
        i,
        w: j,
        action: "init",
        message: `Calculating max profit for stage ${i} with ${j} units total.`,
        codeLine: 5,
      });

      let currentMax = 0;
      for (let k = 0; k <= j; k++) {
        const p = profits[i - 1][k] + dp[i - 1][j - k];
        
        snapshots.push({
          table: dp.map(r => [...r]),
          i,
          w: j,
          action: "init",
          message: `Allocating ${k} units to stage ${i} (profit ${profits[i-1][k]}) and ${j-k} units to previous stages (profit ${dp[i-1][j-k]}). Total: ${p}.`,
          codeLine: 8,
        });

        if (p > currentMax) {
          currentMax = p;
          dp[i][j] = currentMax;
          snapshots.push({
            table: dp.map(r => [...r]),
            i,
            w: j,
            action: "include",
            message: `New max profit for ${j} units at stage ${i}: ${currentMax}.`,
            codeLine: 8,
          });
        }
      }
    }
  }

  snapshots.push({
    table: dp.map(r => [...r]),
    i: n,
    w: m,
    action: "done",
    message: `Resource Allocation complete! Maximum total profit = ${dp[n][m]}.`,
    codeLine: 13,
  });

  return snapshots;
}

export const resourceAllocationMeta = {
  id: "resource-allocation",
  name: "Resource Allocation",
  category: "dp" as const,
  difficulty: "Hard" as const,
  timeComplexity: "O(n × m²)",
  spaceComplexity: "O(n × m)",
  description:
    "Distribute a fixed amount of resources (like money, time, or manpower) among several projects or stages to maximize the total return (profit, efficiency, etc.).",
  analogy: "Imagine you have 5 hours to study for 3 exams. You have a table showing how much your score improves for each hour spent on each subject. You want to allocate your 5 hours across subjects to get the highest total score.",
  approach: [
    "Define dp[i][j] as the maximum profit from allocating j units of resource to the first i projects.",
    "For each project i and each total resource j, try allocating k units (0 ≤ k ≤ j) to project i.",
    "The total profit is then profit_of_project_i(k) + dp[i-1][j-k].",
    "Keep the maximum profit across all possible k values."
  ],
  pseudocode: `for i from 1 to n:
  for j from 0 to m:
    dp[i][j] = max(profits[i][k] + dp[i-1][j-k]) for k in 0...j`,
  cppCode: `int resourceAllocation(int n, int m, vector<vector<int>>& profits) {
    vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j <= m; j++) {
            for (int k = 0; k <= j; k++) {
                dp[i][j] = max(dp[i][j], profits[i-1][k] + dp[i-1][j-k]);
            }
        }
    }
    return dp[n][m];
}`,
  javaCode: `public int resourceAllocation(int n, int m, int[][] profits) {
    int[][] dp = new int[n + 1][m + 1];
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j <= m; j++) {
            for (int k = 0; k <= j; k++) {
                dp[i][j] = Math.max(dp[i][j], profits[i-1][k] + dp[i-1][j-k]);
            }
        }
    }
    return dp[n][m];
}`,
  code: CODE,
  defaultInput: {
    n: 3,
    m: 4,
    profits: [
      [0, 10, 15, 20, 22], // Activity 1 profits for 0, 1, 2, 3, 4 units
      [0, 12, 18, 20, 21], // Activity 2
      [0, 8, 14, 16, 17],  // Activity 3
    ],
  },
};
