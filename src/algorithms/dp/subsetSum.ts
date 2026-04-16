import { DPSnapshot } from "@/types/algorithm";

const CODE = `function isSubsetSum(set, n, sum) {
  const dp = Array.from({ length: n + 1 }, () => new Array(sum + 1).fill(false));
  for (let i = 0; i <= n; i++) dp[i][0] = true;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= sum; j++) {
      if (j < set[i - 1]) {
        dp[i][j] = dp[i - 1][j];
      } else {
        dp[i][j] = dp[i - 1][j] || dp[i - 1][j - set[i - 1]];
      }
    }
  }
  return dp[n][sum];
}`;

export function generateSubsetSumSnapshots(input: { set: number[], sum: number }): DPSnapshot[] {
  const { set, sum } = input;
  const n = set.length;
  const snapshots: DPSnapshot[] = [];
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(sum + 1).fill(0));

  for (let i = 0; i <= n; i++) dp[i][0] = 1;

  snapshots.push({
    table: dp.map(r => [...r]),
    i: 0,
    w: 0,
    action: "init",
    message: "Initialize DP table. A sum of 0 is always possible with an empty subset.",
    codeLine: 4,
  });

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= sum; j++) {
      snapshots.push({
        table: dp.map(r => [...r]),
        i: i,
        w: j,
        action: "init",
        message: `Checking if sum ${j} is possible using first ${i} elements {${set.slice(0, i).join(",")}}`,
        codeLine: 7,
      });

      if (j < set[i - 1]) {
        dp[i][j] = dp[i - 1][j];
        snapshots.push({
          table: dp.map(r => [...r]),
          i: i,
          w: j,
          action: "exclude",
          message: `Sum ${j} is less than element ${set[i - 1]}. Result is same as previous row.`,
          codeLine: 9,
        });
      } else {
        dp[i][j] = (dp[i - 1][j] === 1 || dp[i - 1][j - set[i - 1]] === 1) ? 1 : 0;
        const possible = dp[i][j] === 1;
        snapshots.push({
          table: dp.map(r => [...r]),
          i: i,
          w: j,
          action: possible ? "include" : "exclude",
          message: possible 
            ? `Match! Sum ${j} is possible either excluding ${set[i - 1]} (dp[${i-1}][${j}]) or including it (dp[${i-1}][${j - set[i-1]}]).`
            : `Sum ${j} remains impossible after considering element ${set[i - 1]}.`,
          codeLine: 11,
        });
      }
    }
  }

  snapshots.push({
    table: dp.map(r => [...r]),
    i: n,
    w: sum,
    action: "done",
    message: `Subset sum complete! A subset with sum ${sum} ${dp[n][sum] ? "exists" : "does not exist"}.`,
    codeLine: 15,
  });

  return snapshots;
}

export const subsetSumMeta = {
  id: "subset-sum",
  name: "Subset Sum",
  category: "dp" as const,
  difficulty: "Medium" as const,
  timeComplexity: "O(n * sum)",
  spaceComplexity: "O(n * sum)",
  description: "Check if there is a subset of the given set with a sum equal to a given value.",
  analogy: "Like checking if you can pay exactly $15 using a specific set of bills in your wallet.",
  approach: [
    "Create a 2D DP table where dp[i][j] is true if a sum j is possible using the first i elements",
    "If j < set[i-1], dp[i][j] = dp[i-1][j] (cannot include result)",
    "Else, dp[i][j] = dp[i-1][j] || dp[i-1][j - set[i-1]] (include or exclude)"
  ],
  pseudocode: `dp[0][0] = true
for i from 1 to n:
  for j from 0 to sum:
    if j < set[i-1]: dp[i][j] = dp[i-1][j]
    else: dp[i][j] = dp[i-1][j] OR dp[i-1][j - set[i-1]]`,
  cppCode: `bool isSubsetSum(int set[], int n, int sum) {
    bool dp[n + 1][sum + 1];
    for (int i = 0; i <= n; i++) dp[i][0] = true;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= sum; j++) {
            if (j < set[i - 1]) dp[i][j] = dp[i - 1][j];
            else dp[i][j] = dp[i - 1][j] || dp[i - 1][j - set[i - 1]];
        }
    }
    return dp[n][sum];
}`,
  javaCode: `static boolean isSubsetSum(int set[], int n, int sum) {
    boolean dp[][] = new boolean[n + 1][sum + 1];
    for (int i = 0; i <= n; i++) dp[i][0] = true;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= sum; j++) {
            if (j < set[i - 1]) dp[i][j] = dp[i - 1][j];
            else dp[i][j] = dp[i - 1][j] || dp[i - 1][j - set[i - 1]];
        }
    }
    return dp[n][sum];
}`,
  code: CODE,
  defaultInput: {
    set: [3, 34, 4, 12, 5, 2],
    sum: 9,
  },
};
