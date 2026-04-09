import { DPSnapshot } from "@/types/algorithm";

const CODE = `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (let coin of coins) {
      if (coin <= i) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`;

export function generateCoinChangeSnapshots(input: { coins: number[], amount: number }): DPSnapshot[] {
  const { coins, amount } = input;
  const snapshots: DPSnapshot[] = [];

  const dp: number[] = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  snapshots.push({
    table: [[...dp]],
    i: 0,
    w: 0,
    action: "init",
    message: `Initialize DP array for amount ${amount}. dp[0] = 0.`,
    codeLine: 1,
  });

  for (let i = 1; i <= amount; i++) {
    for (let c = 0; c < coins.length; c++) {
      const coin = coins[c];
      
      snapshots.push({
        table: [[...dp]],
        i: 0,
        w: i,
        action: "init",
        message: `Current amount: ${i}. Checking coin: ${coin}.`,
        codeLine: 7,
      });

      if (coin <= i) {
        const prevValue = dp[i];
        const newValue = dp[i - coin] + 1;
        dp[i] = Math.min(dp[i], newValue);

        snapshots.push({
          table: [[...dp]],
          i: 0,
          w: i,
          action: newValue <= prevValue ? "include" : "exclude",
          message: `dp[${i}] = min(${prevValue === Infinity ? "∞" : prevValue}, dp[${i - coin}] + 1 = ${newValue}). Result: ${dp[i]}.`,
          codeLine: 10,
        });
      }
    }
  }

  snapshots.push({
    table: [[...dp]],
    i: 0,
    w: amount,
    action: "done",
    message: `Coin Change complete! Minimum coins for ${amount} is ${dp[amount] === Infinity ? "not possible" : dp[amount]}.`,
    codeLine: 14,
  });


  return snapshots;
}

export const coinChangeMeta = {
  id: "coin-change",
  name: "Coin Change",
  category: "dp" as const,
  difficulty: "Medium" as const,
  timeComplexity: "O(n × amount)",
  spaceComplexity: "O(amount)",
  description:
    "Given a set of coins with different denominations and a total amount of money, find the fewest number of coins that you need to make up that amount.",
  analogy: "Like making change at a store. If you need to give $0.40 change, you want to use the fewest coins possible (e.g., 1 quarter, 1 dime, 1 nickel).",
  approach: [
    "Create a DP array of size amount + 1, initialized with infinity, and dp[0] = 0.",
    "For each amount from 1 to the target amount, iterate through all available coins.",
    "If the current coin is less than or equal to the current amount, update dp[current_amount] with min(dp[current_amount], dp[current_amount - coin] + 1).",
    "The final value at dp[target_amount] is the minimum coins needed."
  ],
  cppCode: `int coinChange(vector<int>& coins, int amount) {
    int max = amount + 1;
    vector<int> dp(amount + 1, max);
    dp[0] = 0;
    for (int i = 1; i <= amount; i++) {
        for (int j = 0; j < coins.size(); j++) {
            if (coins[j] <= i) {
                dp[i] = min(dp[i], dp[i - coins[j]] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
  javaCode: `public int coinChange(int[] coins, int amount) {
    int max = amount + 1;
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, max);
    dp[0] = 0;
    for (int i = 1; i <= amount; i++) {
        for (int j = 0; j < coins.length; j++) {
            if (coins[j] <= i) {
                dp[i] = Math.min(dp[i], dp[i - coins[j]] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
  code: CODE,
  defaultInput: {
    coins: [1, 2, 5],
    amount: 11,
  },
};
