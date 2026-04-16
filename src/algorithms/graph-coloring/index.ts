import { GraphSnapshot } from "@/types/algorithm";

const CODE = `function graphColoring(graph, m) {
  const { nodes, edges } = graph;
  const n = nodes.length;
  const result = {};

  function isSafe(v, c) {
    for (const edge of edges) {
      if (edge.from === v && result[edge.to] === c) return false;
      if (edge.to === v && result[edge.from] === c) return false;
    }
    return true;
  }

  function backtrack(vIdx) {
    if (vIdx === n) return true;
    const v = nodes[vIdx];
    for (let c = 1; c <= m; c++) {
      if (isSafe(v, c)) {
        result[v] = c;
        if (backtrack(vIdx + 1)) return true;
        delete result[v];
      }
    }
    return false;
  }

  return backtrack(0);
}`;

export function generateGraphColoringSnapshots(input: { nodes: string[], edges: any[], m: number }): GraphSnapshot[] {
  const { nodes, edges, m } = input;
  const snapshots: GraphSnapshot[] = [];
  const nodeColors: Record<string, number> = {};
  const visited: string[] = [];

  function isSafe(v: string, c: number) {
    for (const edge of edges) {
      if (edge.from === v && nodeColors[edge.to] === c) return false;
      if (edge.to === v && nodeColors[edge.from] === c) return false;
    }
    return true;
  }

  function backtrack(vIdx: number): boolean {
    if (vIdx === nodes.length) {
      snapshots.push({
        currentNode: "",
        distances: {},
        visited: [...nodes],
        relaxingEdge: null,
        previous: {},
        nodeColors: { ...nodeColors },
        message: "Found a valid coloring for all vertices!",
        codeLine: 18,
      });
      return true;
    }

    const v = nodes[vIdx];
    for (let c = 1; c <= m; c++) {
      snapshots.push({
        currentNode: v,
        distances: {},
        visited: [...visited],
        relaxingEdge: null,
        previous: {},
        nodeColors: { ...nodeColors },
        message: `Trying color ${c} for vertex ${v}...`,
        codeLine: 21,
      });

      if (isSafe(v, c)) {
        nodeColors[v] = c;
        visited.push(v);
        snapshots.push({
          currentNode: v,
          distances: {},
          visited: [...visited],
          relaxingEdge: null,
          previous: {},
          nodeColors: { ...nodeColors },
          message: `Color ${c} is safe for ${v}.`,
          codeLine: 23,
        });

        if (backtrack(vIdx + 1)) return true;

        nodeColors[v] = 0;
        visited.pop();
        snapshots.push({
          currentNode: v,
          distances: {},
          visited: [...visited],
          relaxingEdge: null,
          previous: {},
          nodeColors: { ...nodeColors },
          message: `Backtracking: Removing color from vertex ${v}.`,
          codeLine: 25,
        });
      }
    }
    return false;
  }

  backtrack(0);
  return snapshots;
}

export const graphColoringMeta = {
  id: "graph-coloring",
  name: "Graph Coloring",
  category: "backtracking" as const,
  difficulty: "Hard" as const,
  timeComplexity: "O(m^V)",
  spaceComplexity: "O(V)",
  description: "Assign colors to each vertex of a graph such that no two adjacent vertices share the same color, using at most M colors.",
  analogy: "Like coloring a map so that countries sharing a border don't have the same color.",
  approach: [
    "Start with the first vertex",
    "Try m possible colors",
    "Check if current color is safe (no neighbor has it)",
    "If safe, assign color and recur for next vertex",
    "If solution found, return true",
    "If not, backtrack (un-color) and try next color"
  ],
  pseudocode: `solve(v):
  if v == V: return true
  for c from 1 to m:
    if isSafe(v, c):
      color[v] = c
      if solve(v + 1): return true
      color[v] = 0
  return false`,
  cppCode: `bool solve(int v, int m, int V, vector<int>& colors, vector<vector<int>>& adj) {
    if (v == V) return true;
    for (int c = 1; c <= m; c++) {
        if (isSafe(v, c, colors, adj)) {
            colors[v] = c;
            if (solve(v + 1, m, V, colors, adj)) return true;
            colors[v] = 0;
        }
    }
    return false;
}`,
  pythonCode: `def solve(v, m, V, colors, adj):
    if v == V:
        return True
    for c in range(1, m + 1):
        if isSafe(v, c, colors, adj):
            colors[v] = c
            if solve(v + 1, m, V, colors, adj):
                return True
            colors[v] = 0
    return False`,
  javaCode: `boolean solve(int v, int m, int V, int[] colors, int[][] adj) {
    if (v == V) return true;
    for (int c = 1; c <= m; c++) {
        if (isSafe(v, c, colors, adj)) {
            colors[v] = c;
            if (solve(v + 1, m, V, colors, adj)) return true;
            colors[v] = 0;
        }
    }
    return false;
}`,
  code: CODE,
  defaultInput: {
    nodes: ["A", "B", "C", "D"],
    edges: [
      { from: "A", to: "B" },
      { from: "A", to: "C" },
      { from: "B", to: "C" },
      { from: "C", to: "D" },
    ],
    m: 3,
  },
};
