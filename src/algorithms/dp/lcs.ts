import { DPSnapshot } from "@/types/algorithm";

const CODE = `function lcs(str1, str2) {
  const n = str1.length;
  const m = str2.length;
  const dp = Array(n + 1).fill(null)
    .map(() => Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[n][m];
}`;

export function generateLCSSnapshots(input: { s1: string, s2: string }): DPSnapshot[] {
  const { s1, s2 } = input;
  const n = s1.length;
  const m = s2.length;
  const snapshots: DPSnapshot[] = [];

  const dp: number[][] = Array(n + 1)
    .fill(null)
    .map(() => Array(m + 1).fill(0));

  snapshots.push({
    table: dp.map((r) => [...r]),
    i: 0,
    w: 0,
    action: "init",
    message: `Initialize DP table for LCS of "${s1}" and "${s2}".`,
    codeLine: 1,
  });

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      snapshots.push({
        table: dp.map((r) => [...r]),
        i,
        w: j,
        action: "init",
        message: `Comparing "${s1[i - 1]}" and "${s2[j - 1]}".`,
        codeLine: 10,
      });

      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
        snapshots.push({
          table: dp.map((r) => [...r]),
          i,
          w: j,
          action: "include",
          message: `Match! "${s1[i - 1]}" === "${s2[j - 1]}". dp[${i}][${j}] = 1 + dp[${i-1}][${j-1}] = ${dp[i][j]}.`,
          codeLine: 12,
        });
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        snapshots.push({
          table: dp.map((r) => [...r]),
          i,
          w: j,
          action: "exclude",
          message: `No match. dp[${i}][${j}] = max(dp[${i-1}][${j}], dp[${i}][${j-1}]) = ${dp[i][j]}.`,
          codeLine: 14,
        });
      }
    }
  }

  // Backtrack for LCS string
  let resStr = "";
  let ri = n, rj = m;
  const selectedCells: { r: number, c: number }[] = [];
  while (ri > 0 && rj > 0) {
      selectedCells.push({ r: ri, c: rj });
      if (s1[ri-1] === s2[rj-1]) {
          resStr = s1[ri-1] + resStr;
          ri--; rj--;
      } else if (dp[ri-1][rj] > dp[ri][rj-1]) {
          ri--;
      } else {
          rj--;
      }
  }

  snapshots.push({
    table: dp.map((r) => [...r]),
    i: n,
    w: m,
    action: "done",
    message: `LCS complete! Max length = ${dp[n][m]}. Longest subsequence: "${resStr}".`,
    codeLine: 18,
    selectedCells
  });


  return snapshots;
}

export const lcsMeta = {
  id: "lcs",
  name: "LCS",
  category: "dp" as const,
  difficulty: "Hard" as const,
  timeComplexity: "O(n × m)",
  spaceComplexity: "O(n × m)",
  description:
    "Find the longest subsequence common to two sequences. Unlike substrings, subsequences are not required to occupy consecutive positions within the original sequences.",
  analogy: "Think of finding common elements in two DNA strands. They don't have to be right next to each other, but they must appear in the same relative order in both strands.",
  approach: [
    "Build a 2D matrix where rows represent characters of string 1 and columns represent characters of string 2.",
    "If characters match, the value is 1 + the value from the diagonal (top-left).",
    "If characters do not match, the value is the maximum of the value from the top cell or the left cell.",
    "The final cell in the matrix contains the length of the longest common subsequence."
  ],
  cppCode: `int lcs(string s1, string s2) {
    int n = s1.size(), m = s2.size();
    vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (s1[i - 1] == s2[j - 1])
                dp[i][j] = 1 + dp[i - 1][j - 1];
            else
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[n][m];
}`,
  javaCode: `public int lcs(String s1, String s2) {
    int n = s1.length(), m = s2.length();
    int[][] dp = new int[n + 1][m + 1];
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (s1.charAt(i - 1) == s2.charAt(j - 1))
                dp[i][j] = 1 + dp[i - 1][j - 1];
            else
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[n][m];
}`,
  code: CODE,
  defaultInput: {
    s1: "ABCBDAB",
    s2: "BDCABA",
  },
};
