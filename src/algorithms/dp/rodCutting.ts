import { DPSnapshot } from "@/types/algorithm";

const CODE = `function cutRod(price, n) {
  const dp = new Array(n + 1).fill(0);
  
  for (let i = 1; i <= n; i++) {
    let maxVal = -Infinity;
    for (let j = 0; j < i; j++) {
      maxVal = Math.max(maxVal, price[j] + dp[i - j - 1]);
    }
    dp[i] = maxVal;
  }
  return dp[n];
}`;

export function generateRodCuttingSnapshots(input: { prices: number[], n: number }): DPSnapshot[] {
  const { prices, n } = input;
  const snapshots: DPSnapshot[] = [];
  const dp: number[] = new Array(n + 1).fill(0);

  snapshots.push({
    table: [[...dp]],
    i: 0,
    w: 0,
    action: "init",
    message: `Initialize DP array for rod of length ${n}. dp[0] = 0.`,
    codeLine: 1,
  });

  for (let i = 1; i <= n; i++) {
    let currentMax = -Infinity;
    
    snapshots.push({
      table: [[...dp]],
      i: 0,
      w: i,
      action: "init",
      message: `Solving for rod of length ${i}.`,
      codeLine: 4,
    });

    for (let j = 0; j < i; j++) {
      const val = prices[j] + dp[i - j - 1];
      
      snapshots.push({
        table: [[...dp]],
        i: 0,
        w: i,
        action: "init",
        message: `Checking cut of length ${j+1} (price ${prices[j]}) + remainder ${i-j-1} (profit ${dp[i-j-1]}). Total: ${val}.`,
        codeLine: 7,
      });

      if (val > currentMax) {
        currentMax = val;
        dp[i] = currentMax;
        
        snapshots.push({
          table: [[...dp]],
          i: 0,
          w: i,
          action: "include",
          message: `New maximum profit for length ${i} is ${currentMax}.`,
          codeLine: 7,
        });
      }
    }
  }

  snapshots.push({
    table: [[...dp]],
    i: 0,
    w: n,
    action: "done",
    message: `Rod Cutting complete! Maximum profit for length ${n} is ${dp[n]}.`,
    codeLine: 11,
  });

  return snapshots;
}

export const rodCuttingMeta = {
  id: "rod-cutting",
  name: "Rod Cutting",
  category: "dp" as const,
  difficulty: "Medium" as const,
  timeComplexity: "O(n²)",
  spaceComplexity: "O(n)",
  description:
    "Given a rod of length n and a list of prices for each length i < n, find the maximum profit that can be obtained by cutting up the rod and selling the pieces.",
  analogy: "Like having a long piece of fabric and a price list for different lengths. You want to cut the fabric into pieces that together give you the most money.",
  approach: [
    "Define dp[i] as the maximum profit for a rod of length i.",
    "For each length i from 1 to n, try all possible first cuts of length j.",
    "The profit for a cut of length j is price[j] + dp[i - j].",
    "Keep the maximum profit found across all possible first cuts."
  ],
  pseudocode: `dp[0] = 0
for i from 1 to n:
  max_val = -infinity
  for j from 0 to i-1:
    max_val = max(max_val, price[j] + dp[i-j-1])
  dp[i] = max_val`,
  cppCode: `int cutRod(int price[], int n) {
    int dp[n + 1];
    dp[0] = 0;
    for (int i = 1; i <= n; i++) {
        int max_val = INT_MIN;
        for (int j = 0; j < i; j++)
            max_val = max(max_val, price[j] + dp[i - j - 1]);
        dp[i] = max_val;
    }
    return dp[n];
}`,
  javaCode: `public int cutRod(int price[], int n) {
    int dp[] = new int[n + 1];
    dp[0] = 0;
    for (int i = 1; i <= n; i++) {
        int max_val = Integer.MIN_VALUE;
        for (int j = 0; j < i; j++)
            max_val = Math.max(max_val, price[j] + dp[i - j - 1]);
        dp[i] = max_val;
    }
    return dp[n];
}`,
  code: CODE,
  defaultInput: {
    prices: [1, 5, 8, 9, 10, 17, 17, 20],
    n: 8,
  },
};
