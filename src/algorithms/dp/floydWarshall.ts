import { DPSnapshot } from "@/types/algorithm";

const CODE = `function floydWarshall(V, graph) {
  const dist = Array.from({ length: V }, (_, i) =>
    Array.from({ length: V }, (_, j) => graph[i][j])
  );

  for (let k = 0; k < V; k++) {
    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }
  return dist;
}`;

export function generateFloydWarshallSnapshots(input: { V: number, matrix: number[][] }): DPSnapshot[] {
  const { V, matrix } = input;
  const snapshots: DPSnapshot[] = [];

  const dist: number[][] = matrix.map(row => [...row]);

  snapshots.push({
    table: dist.map(r => [...r]),
    i: -1,
    w: -1,
    action: "init",
    message: "Initialize distance matrix with direct edge weights.",
    codeLine: 1,
  });

  for (let k = 0; k < V; k++) {
    snapshots.push({
      table: dist.map(r => [...r]),
      i: -1,
      w: -1,
      action: "init",
      message: `Phase ${k}: Considering vertex ${k} as an intermediate point.`,
      codeLine: 5,
    });

    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        const dIK = dist[i]?.[k] !== undefined ? dist[i][k] : Infinity;
        const dKJ = dist[k]?.[j] !== undefined ? dist[k][j] : Infinity;
        const currentMessage = `Checking path ${i} → ${k} → ${j}. dist[${i}][${k}] + dist[${k}][${j}] = ${dIK === Infinity ? "∞" : dIK} + ${dKJ === Infinity ? "∞" : dKJ}.`;
        
        snapshots.push({
          table: dist.map(r => [...r]),
          i,
          w: j,
          action: "init",
          message: currentMessage,
          codeLine: 8,
        });

        if (dist[i][k] !== Infinity && dist[k][j] !== Infinity && dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          snapshots.push({
            table: dist.map(r => [...r]),
            i,
            w: j,
            action: "include",
            message: `Found shorter path from ${i} to ${j} via ${k}! New distance: ${dist[i][j]}.`,
            codeLine: 9,
          });
        }
      }
    }
  }

  snapshots.push({
    table: dist.map(r => [...r]),
    i: -1,
    w: -1,
    action: "done",
    message: "Floyd-Warshall complete! All-pairs shortest paths computed.",
    codeLine: 14,
  });

  return snapshots;
}

export const floydWarshallMeta = {
  id: "floyd-warshall",
  name: "Floyd-Warshall",
  category: "dp" as const,
  difficulty: "Hard" as const,
  timeComplexity: "O(V³)",
  spaceComplexity: "O(V²)",
  description:
    "An algorithm for finding shortest paths in a weighted graph with positive or negative edge weights (but with no negative cycles). It finds shortest paths between all pairs of vertices.",
  analogy: "Think of finding the quickest way between every two cities in a country. You check if going through a third city like 'Chicago' makes the trip between 'New York' and 'Los Angeles' any shorter. You repeat this for every city.",
  approach: [
    "Initialize a distance matrix with edge weights. If no edge exists, weight is infinity.",
    "For each vertex k, update the distance between all pairs (i, j) if going through k is shorter.",
    "The new distance is min(dist[i][j], dist[i][k] + dist[k][j]).",
    "After checking all possible intermediate vertices, the matrix contains the shortest path between all pairs."
  ],
  pseudocode: `for k from 0 to V-1:
  for i from 0 to V-1:
    for j from 0 to V-1:
      dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`,
  cppCode: `void floydWarshall(int graph[V][V]) {
    int dist[V][V];
    for (int i = 0; i < V; i++)
        for (int j = 0; j < V; j++)
            dist[i][j] = graph[i][j];

    for (int k = 0; k < V; k++) {
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j])
                    dist[i][j] = dist[i][k] + dist[k][j];
            }
        }
    }
}`,
  javaCode: `public void floydWarshall(int graph[][], int V) {
    int dist[][] = new int[V][V];
    for (int i = 0; i < V; i++)
        for (int j = 0; j < V; j++)
            dist[i][j] = graph[i][j];

    for (int k = 0; k < V; k++) {
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j])
                    dist[i][j] = dist[i][k] + dist[k][j];
            }
        }
    }
}`,
  code: CODE,
  defaultInput: {
    V: 4,
    matrix: [
      [0, 3, Infinity, 7],
      [8, 0, 2, Infinity],
      [5, Infinity, 0, 1],
      [2, Infinity, Infinity, 0],
    ],
  },
};
