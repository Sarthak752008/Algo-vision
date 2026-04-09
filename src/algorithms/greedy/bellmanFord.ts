import { GraphSnapshot } from "@/types/algorithm";
import { GraphInput } from "./dijkstra";

const CODE = `function bellmanFord(nodes, edges, source) {
  const dist = {};
  for (const node of nodes) dist[node] = Infinity;
  dist[source] = 0;

  for (let i = 0; i < nodes.length - 1; i++) {
    for (const { from, to, weight } of edges) {
      if (dist[from] + weight < dist[to]) {
        dist[to] = dist[from] + weight;
      }
    }
  }
  
  // Check for negative cycles
  for (const { from, to, weight } of edges) {
    if (dist[from] + weight < dist[to]) {
       throw new Error("Negative cycle detected");
    }
  }
  return dist;
}`;

export function generateBellmanFordSnapshots(input: GraphInput): GraphSnapshot[] {
  const { nodes, edges, source } = input;
  const snapshots: GraphSnapshot[] = [];

  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};

  for (const n of nodes) {
    dist[n] = Infinity;
    prev[n] = null;
  }
  dist[source] = 0;

  snapshots.push({
    currentNode: source,
    distances: { ...dist },
    visited: [],
    relaxingEdge: null,
    previous: { ...prev },
    message: `Initialize distances. Source "${source}" at 0, others at ∞.`,
    codeLine: 1,
  });

  // Main iterations
  for (let i = 1; i < nodes.length; i++) {
    let changed = false;
    for (const edge of edges) {
      const { from, to, weight } = edge;

      snapshots.push({
        currentNode: "",
        distances: { ...dist },
        visited: [],
        relaxingEdge: [from, to],
        previous: { ...prev },
        message: `Iteration ${i}: Relaxing edge ${from} → ${to} (weight ${weight}).`,
        codeLine: 10,
      });

      if (dist[from] !== Infinity && dist[from] + weight < dist[to]) {
        dist[to] = dist[from] + weight;
        prev[to] = from;
        changed = true;

        snapshots.push({
          currentNode: "",
          distances: { ...dist },
          visited: [],
          relaxingEdge: [from, to],
          previous: { ...prev },
          message: `Updated dist[${to}] to ${dist[to]} via ${from}.`,
          codeLine: 11,
        });
      }
    }
    if (!changed) break; // Optimization
  }

  // Check negative cycles (optional for visualization, but part of algorithm)
  for (const edge of edges) {
      const { from, to, weight } = edge;
      if (dist[from] !== Infinity && dist[from] + weight < dist[to]) {
          snapshots.push({
              currentNode: "",
              distances: { ...dist },
              visited: [],
              relaxingEdge: [from, to],
              previous: { ...prev },
              message: "Negative weight cycle detected!",
              codeLine: 18,
          });
          break;
      }
  }

  snapshots.push({
    currentNode: "",
    distances: { ...dist },
    visited: [],
    relaxingEdge: null,
    previous: { ...prev },
    message: "Bellman-Ford complete!",
    codeLine: 22,
  });

  return snapshots;
}

export const bellmanFordMeta = {
  id: "bellman-ford",
  name: "Bellman-Ford",
  category: "greedy" as const,
  difficulty: "Hard" as const,
  timeComplexity: "O(V × E)",
  spaceComplexity: "O(V)",
  description:
    "An algorithm that computes shortest paths from a single source vertex to all other vertices in a weighted digraph. Unlike Dijkstra, it can handle negative edge weights.",
  analogy: "Imagine gossip spreading. People keep telling each other how far they are from the source. After V-1 rounds of everyone talking to their neighbors, everyone must have heard the final shortest distance.",
  approach: [
    "Initialize distances from source to all vertices as infinite and distance to self as 0.",
    "Iterate V-1 times (where V is the number of vertices).",
    "In each iteration, relax all edges u → v by checking if dist[u] + weight < dist[v].",
    "After V-1 iterations, perform one final check on all edges.",
    "If an edge can still be relaxed, a negative weight cycle exists."
  ],
  cppCode: `void bellmanFord(int V, int E, vector<Edge>& edges, int src) {
    vector<int> dist(V, INT_MAX);
    dist[src] = 0;

    for (int i = 1; i <= V - 1; i++) {
        for (auto& edge : edges) {
            if (dist[edge.u] != INT_MAX && dist[edge.u] + edge.w < dist[edge.v])
                dist[edge.v] = dist[edge.u] + edge.w;
        }
    }

    for (auto& edge : edges) {
        if (dist[edge.u] != INT_MAX && dist[edge.u] + edge.w < dist[edge.v])
            cout << "Graph contains negative weight cycle";
    }
}`,
  javaCode: `public void bellmanFord(int V, int E, Edge[] edges, int src) {
    int[] dist = new int[V];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;

    for (int i = 1; i < V; ++i) {
        for (Edge edge : edges) {
            if (dist[edge.u] != Integer.MAX_VALUE && dist[edge.u] + edge.w < dist[edge.v])
                dist[edge.v] = dist[edge.u] + edge.w;
        }
    }

    for (Edge edge : edges) {
        if (dist[edge.u] != Integer.MAX_VALUE && dist[edge.u] + edge.w < dist[edge.v]) {
            System.out.println("Graph contains negative weight cycle");
        }
    }
}`,
  code: CODE,
  defaultInput: {
    nodes: ["A", "B", "C", "D", "E"],
    edges: [
      { from: "A", to: "B", weight: -1 },
      { from: "A", to: "C", weight: 4 },
      { from: "B", to: "C", weight: 3 },
      { from: "B", to: "D", weight: 2 },
      { from: "B", to: "E", weight: 2 },
      { from: "E", to: "D", weight: -3 },
      { from: "D", to: "C", weight: 5 },
      { from: "D", to: "B", weight: 1 },
    ],
    source: "A",
  } as GraphInput,
};
