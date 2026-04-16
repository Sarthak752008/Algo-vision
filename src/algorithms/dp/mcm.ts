import { DPSnapshot } from "@/types/algorithm";

const CODE = `function matrixChainOrder(p) {
  const n = p.length - 1;
  const m = Array(n + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let L = 2; L <= n; L++) {
    for (let i = 1; i <= n - L + 1; i++) {
      let j = i + L - 1;
      m[i][j] = Infinity;
      for (let k = i; k <= j - 1; k++) {
        let q = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j];
        if (q < m[i][j]) {
          m[i][j] = q;
        }
      }
    }
  }
  return m[1][n];
}`;

export function generateMCMSnapshots(input: { p: number[] }): DPSnapshot[] {
  const { p } = input;
  const n = p.length - 1;
  const snapshots: DPSnapshot[] = [];

  const m: number[][] = Array(n + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  snapshots.push({
    table: m.map((r) => [...r]),
    i: 0,
    w: 0,
    action: "init",
    message: `Initialize DP table. m[i][i] = 0 as costs for single matrices.`,
    codeLine: 1,
  });

  for (let L = 2; L <= n; L++) {
    for (let i = 1; i <= n - L + 1; i++) {
      const j = i + L - 1;
      m[i][j] = Infinity;

      snapshots.push({
        table: m.map((r) => [...r]),
        i,
        w: j,
        action: "init",
        message: `Calculating cost for chain of length ${L}: A[${i}] to A[${j}].`,
        codeLine: 7,
      });

      for (let k = i; k <= j - 1; k++) {
        const q = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j];
        
        snapshots.push({
          table: m.map((r) => [...r]),
          i,
          w: j,
          action: "init",
          message: `Splitting at k=${k}: (A${i}...A${k}) and (A${k+1}...A${j}). Potential cost: ${q}.`,
          codeLine: 11,
        });

        if (q < m[i][j]) {
          m[i][j] = q;
          snapshots.push({
            table: m.map((r) => [...r]),
            i,
            w: j,
            action: "include",
            message: `New minimum cost for A[${i}..${j}] found: ${q}.`,
            codeLine: 13,
          });
        }
      }
    }
  }

  snapshots.push({
    table: m.map((r) => [...r]),
    i: 1,
    w: n,
    action: "done",
    message: `Matrix Chain Multiplication complete! Min cost = ${m[1][n]}.`,
    codeLine: 18,
  });

  return snapshots;
}

export const mcmMeta = {
  id: "mcm",
  name: "Matrix Chain Multiplication",
  category: "dp" as const,
  difficulty: "Hard" as const,
  timeComplexity: "O(n³)",
  spaceComplexity: "O(n²)",
  description:
    "Find the most efficient way to multiply a given sequence of matrices. The problem is not actually to perform the multiplications, but merely to decide the order of multiplications.",
  analogy: "Think of multiplying (A × B) × C vs A × (B × C). If A is 10×100, B is 100×5, and C is 5×50, the number of operations changes drastically depending on where you put the parentheses.",
  approach: [
    "Define a DP table m[i][j] as the minimum cost to multiply matrices from index i to j.",
    "For chains of length 1, the cost is 0.",
    "For chains of length L > 1, try all possible split points k between i and j.",
    "The cost for a split at k is m[i][k] + m[k+1][j] + cost of multiplying the two resulting matrices."
  ],
  pseudocode: `for L from 2 to n:
  for i from 1 to n-L+1:
    j = i + L - 1
    m[i][j] = Infinity
    for k from i to j-1:
      q = m[i][k] + m[k+1][j] + p[i-1]*p[k]*p[j]
      if q < m[i][j]: m[i][j] = q`,
  cppCode: `int matrixChainOrder(int p[], int n) {
    int m[n][n];
    for (int i = 1; i < n; i++) m[i][i] = 0;
    for (int L = 2; L < n; L++) {
        for (int i = 1; i < n - L + 1; i++) {
            int j = i + L - 1;
            m[i][j] = INT_MAX;
            for (int k = i; k <= j - 1; k++) {
                int q = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j];
                if (q < m[i][j]) m[i][j] = q;
            }
        }
    }
    return m[1][n - 1];
}`,
  javaCode: `static int matrixChainOrder(int p[], int n) {
    int m[][] = new int[n][n];
    for (int i = 1; i < n; i++) m[i][i] = 0;
    for (int L = 2; L < n; L++) {
        for (int i = 1; i < n - L + 1; i++) {
            int j = i + L - 1;
            m[i][j] = Integer.MAX_VALUE;
            for (int k = i; k <= j - 1; k++) {
                int q = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j];
                if (q < m[i][j]) m[i][j] = q;
            }
        }
    }
    return m[1][n - 1];
}`,
  code: CODE,
  defaultInput: {
    p: [40, 20, 30, 10, 30],
  },
};
