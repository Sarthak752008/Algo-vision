import { DPSnapshot } from "@/types/algorithm";

const CODE = `function warshall(V, graph) {
  const reach = Array.from({ length: V }, (_, i) =>
    Array.from({ length: V }, (_, j) => graph[i][j])
  );

  for (let k = 0; k < V; k++) {
    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        reach[i][j] = reach[i][j] || (reach[i][k] && reach[k][j]);
      }
    }
  }
  return reach;
}`;

export function generateWarshallSnapshots(input: { V: number, matrix: number[][] }): DPSnapshot[] {
  const { V, matrix } = input;
  const snapshots: DPSnapshot[] = [];

  const reach: number[][] = matrix.map(row => [...row]);

  snapshots.push({
    table: reach.map(r => [...r]),
    i: -1,
    w: -1,
    action: "init",
    message: "Initialize reachability matrix with direct edges (1 if exists, 0 otherwise).",
    codeLine: 1,
  });

  for (let k = 0; k < V; k++) {
    snapshots.push({
      table: reach.map(r => [...r]),
      i: -1,
      w: -1,
      action: "init",
      message: `Phase ${k}: Checking reachability via vertex ${k}.`,
      codeLine: 5,
    });

    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        const currentMessage = `Can we reach ${j} from ${i} via ${k}? reach[${i}][${k}] && reach[${k}][${j}] = ${reach[i][k]} && ${reach[k][j]}.`;
        
        snapshots.push({
          table: reach.map(r => [...r]),
          i,
          w: j,
          action: "init",
          message: currentMessage,
          codeLine: 8,
        });

        if (!reach[i][j] && reach[i][k] && reach[k][j]) {
          reach[i][j] = 1;
          snapshots.push({
            table: reach.map(r => [...r]),
            i,
            w: j,
            action: "include",
            message: `New reachability found! ${i} can now reach ${j} via ${k}.`,
            codeLine: 9,
          });
        }
      }
    }
  }

  snapshots.push({
    table: reach.map(r => [...r]),
    i: -1,
    w: -1,
    action: "done",
    message: "Warshall algorithm complete! Transitive closure computed.",
    codeLine: 14,
  });

  return snapshots;
}

export const warshallMeta = {
  id: "warshall",
  name: "Warshall (Transitive Closure)",
  category: "dp" as const,
  difficulty: "Medium" as const,
  timeComplexity: "O(V³)",
  spaceComplexity: "O(V²)",
  description:
    "An algorithm to find the transitive closure of a directed graph. It determines if there is a path between every pair of vertices.",
  analogy: "Like figuring out everyone you could possibly meet through your friends. If you know Alice and Alice knows Bob, then you can meet Bob. Warshall's systematic way checks all such connections.",
  approach: [
    "Initialize a reachability matrix where reach[i][j] is 1 if there is a direct edge, 0 otherwise.",
    "For each vertex k, update reach[i][j] to 1 if reach[i][j] is already 1, OR if both reach[i][k] and reach[k][j] are 1.",
    "Essentially, if you can go from i to k and k to j, then you can go from i to j.",
    "Repeat for all vertices to find all possible paths."
  ],
  pseudocode: `for k from 0 to V-1:
  for i from 0 to V-1:
    for j from 0 to V-1:
      reach[i][j] = reach[i][j] OR (reach[i][k] AND reach[k][j])`,
  cppCode: `void transitiveClosure(bool graph[V][V]) {
    bool reach[V][V];
    for (int i = 0; i < V; i++)
        for (int j = 0; j < V; j++)
            reach[i][j] = graph[i][j];

    for (int k = 0; k < V; k++) {
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                reach[i][j] = reach[i][j] || (reach[i][k] && reach[k][j]);
            }
        }
    }
}`,
  javaCode: `public void transitiveClosure(int graph[][], int V) {
    int reach[][] = new int[V][V];
    for (int i = 0; i < V; i++)
        for (int j = 0; j < V; j++)
            reach[i][j] = graph[i][j];

    for (int k = 0; k < V; k++) {
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                reach[i][j] = (reach[i][j] != 0) || ((reach[i][k] != 0) && (reach[k][j] != 0)) ? 1 : 0;
            }
        }
    }
}`,
  code: CODE,
  defaultInput: {
    V: 4,
    matrix: [
      [1, 1, 0, 1],
      [0, 1, 1, 0],
      [0, 0, 1, 1],
      [0, 0, 0, 1],
    ],
  },
};
