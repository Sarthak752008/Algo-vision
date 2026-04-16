import { DPSnapshot } from "@/types/algorithm";

const CODE = `function wordBreak(s, wordDict) {
  const n = s.length;
  const dp = new Array(n + 1).fill(false);
  dp[0] = true;

  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && wordDict.includes(s.substring(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[n];
}`;

export function generateWordBreakSnapshots(input: { s: string, wordDict: string[] }): DPSnapshot[] {
  const { s, wordDict } = input;
  const n = s.length;
  const snapshots: DPSnapshot[] = [];

  const dp: number[] = new Array(n + 1).fill(0); // Using 0 for false, 1 for true
  dp[0] = 1;

  snapshots.push({
    table: [[...dp]],
    i: 0,
    w: 0,
    action: "init",
    message: `Initialize DP array. dp[0] = true (empty string).`,
    codeLine: 1,
  });

  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < i; j++) {
      const sub = s.substring(j, i);
      const isWord = wordDict.includes(sub);
      
      snapshots.push({
        table: [[...dp]],
        i: 0,
        w: i,
        action: "init",
        message: `Checking substring "${sub}" (from index ${j} to ${i}). dp[${j}] is ${dp[j] ? "true" : "false"}.`,
        codeLine: 8,
      });

      if (dp[j] === 1 && isWord) {
        dp[i] = 1;
        snapshots.push({
          table: [[...dp]],
          i: 0,
          w: i,
          action: "include",
          message: `Match! "${sub}" is in dictionary and dp[${j}] is true. Setting dp[${i}] = true.`,
          codeLine: 10,
        });
        break;
      }
    }
  }

  snapshots.push({
    table: [[...dp]],
    i: 0,
    w: n,
    action: "done",
    message: `Word Break complete! String can ${dp[n] ? "" : "not "}be segmented.`,
    codeLine: 15,
  });

  return snapshots;
}

export const wordBreakMeta = {
  id: "word-break",
  name: "Word Break",
  category: "dp" as const,
  difficulty: "Medium" as const,
  timeComplexity: "O(n²)",
  spaceComplexity: "O(n)",
  description:
    "Given a string and a dictionary of words, determine if the string can be segmented into a space-separated sequence of one or more dictionary words.",
  analogy: "Like reading a long string of letters without spaces (e.g., 'leetcode') and trying to see if it makes sense using known words ('leet' + 'code').",
  approach: [
    "Use a DP array where dp[i] is true if the prefix of length i can be segmented.",
    "Initialize dp[0] as true.",
    "For each position i, check all previous positions j.",
    "If dp[j] is true and the substring from j to i is in the dictionary, then dp[i] is true."
  ],
  pseudocode: `dp[0] = true
for i from 1 to n:
  for j from 0 to i-1:
    if dp[j] is true AND s[j...i] in dictionary:
      dp[i] = true
      break`,
  cppCode: `bool wordBreak(string s, vector<string>& wordDict) {
    int n = s.size();
    vector<bool> dp(n + 1, false);
    dp[0] = true;
    unordered_set<string> dict(wordDict.begin(), wordDict.end());
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j < i; j++) {
            if (dp[j] && dict.count(s.substr(j, i - j))) {
                dp[i] = true;
                break;
            }
        }
    }
    return dp[n];
}`,
  javaCode: `public boolean wordBreak(String s, List<String> wordDict) {
    int n = s.length();
    boolean[] dp = new boolean[n + 1];
    dp[0] = true;
    Set<String> dict = new HashSet<>(wordDict);
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j < i; j++) {
            if (dp[j] && dict.contains(s.substring(j, i))) {
                dp[i] = true;
                break;
            }
        }
    }
    return dp[n];
}`,
  code: CODE,
  defaultInput: {
    s: "leetcode",
    wordDict: ["leet", "code"],
  },
};
