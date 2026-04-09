import { GraphSnapshot } from "@/types/algorithm";
import { GraphInput } from "./dijkstra";

const CODE = `function prim(graph) {
  const parent = {};
  const key = {};
  const inMST = new Set();
  const pq = new MinPriorityQueue();

  for (const node of graph.nodes) {
    key[node] = Infinity;
  }
  
  const start = graph.nodes[0];
  key[start] = 0;
  pq.enqueue(start, 0);

  while (!pq.isEmpty()) {
    const u = pq.dequeue();
    inMST.add(u);

    for (const [v, weight] of graph.adj[u]) {
      if (!inMST.has(v) && weight < key[v]) {
        parent[v] = u;
        key[v] = weight;
        pq.enqueue(v, weight);
      }
    }
  }
  return parent;
}`;

export function generatePrimSnapshots(input: GraphInput): GraphSnapshot[] {
  const { nodes, edges } = input;
  const snapshots: GraphSnapshot[] = [];

  const adj: Record<string, [string, number][]> = {};
  for (const n of nodes) adj[n] = [];
  for (const e of edges) {
    adj[e.from].push([e.to, e.weight]);
    adj[e.to].push([e.from, e.weight]);
  }

  const key: Record<string, number> = {};
  const parent: Record<string, string | null> = {};
  const inMST: string[] = [];

  for (const n of nodes) {
    key[n] = Infinity;
    parent[n] = null;
  }

  const start = nodes[0];
  key[start] = 0;

  snapshots.push({
    currentNode: start,
    distances: { ...key },
    visited: [],
    relaxingEdge: null,
    previous: { ...parent },
    message: `Initialize Prim's at node "${start}". set key to 0, all others to ∞.`,
    codeLine: 9,
  });

  const pq: { node: string; key: number }[] = [{ node: start, key: 0 }];

  while (pq.length > 0) {
    pq.sort((a, b) => a.key - b.key);
    const { node: u } = pq.shift()!;

    if (inMST.includes(u)) continue;
    inMST.push(u);

    snapshots.push({
      currentNode: u,
      distances: { ...key },
      visited: [...inMST],
      relaxingEdge: null,
      previous: { ...parent },
      message: `Extract min node "${u}" and add to Minimum Spanning Tree (MST).`,
      codeLine: 17,
    });

    for (const [v, weight] of adj[u]) {
      if (!inMST.includes(v)) {
        snapshots.push({
          currentNode: u,
          distances: { ...key },
          visited: [...inMST],
          relaxingEdge: [u, v],
          previous: { ...parent },
          message: `Checking edge ${u} → ${v} (weight ${weight}). Current key[${v}] = ${key[v] === Infinity ? "∞" : key[v]}.`,
          codeLine: 20,
        });

        if (weight < key[v]) {
          key[v] = weight;
          parent[v] = u;
          pq.push({ node: v, key: weight });

          snapshots.push({
            currentNode: u,
            distances: { ...key },
            visited: [...inMST],
            relaxingEdge: [u, v],
            previous: { ...parent },
            message: `Updating key of "${v}" to ${weight} (better edge found via ${u}).`,
            codeLine: 23,
          });
        }
      }
    }
  }

  snapshots.push({
    currentNode: "",
    distances: { ...key },
    visited: [...inMST],
    relaxingEdge: null,
    previous: { ...parent },
    message: "Prim's Algorithm complete! MST constructed.",
    codeLine: 29,
  });

  return snapshots;
}

export const primMeta = {
  id: "prim",
  name: "Prim's Algorithm",
  category: "greedy" as const,
  difficulty: "Hard" as const,
  timeComplexity: "O(E log V)",
  spaceComplexity: "O(V + E)",
  description:
    "A greedy algorithm that finds a minimum spanning tree for a weighted undirected graph. It builds the tree one vertex at a time, from an arbitrary starting vertex.",
  analogy: "Like connecting building to a power grid. You start at one building and always connect the next nearest building that isn't already powered up.",
  approach: [
    "Initialize a tree with a single vertex, chosen arbitrarily from the graph.",
    "Grow the tree by one edge: of the edges that connect the tree to vertices not yet in the tree, find the minimum-weight edge, and transfer it to the tree.",
    "Repeat step 2 until all vertices are in the tree."
  ],
  cppCode: `void prim(int V, vector<pair<int, int>> adj[]) {
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    vector<int> key(V, INT_MAX);
    vector<int> parent(V, -1);
    vector<bool> inMST(V, false);

    pq.push({0, 0});
    key[0] = 0;

    while (!pq.empty()) {
        int u = pq.top().second;
        pq.pop();
        inMST[u] = true;

        for (auto x : adj[u]) {
            int v = x.first;
            int weight = x.second;
            if (inMST[v] == false && key[v] > weight) {
                key[v] = weight;
                pq.push({key[v], v});
                parent[v] = u;
            }
        }
    }
}`,
  javaCode: `public void prim(int V, List<List<Node>> adj) {
    int[] key = new int[V];
    int[] parent = new int[V];
    boolean[] inMST = new boolean[V];
    Arrays.fill(key, Integer.MAX_VALUE);
    PriorityQueue<Node> pq = new PriorityQueue<>(V, (a, b) -> a.weight - b.weight);

    key[0] = 0;
    pq.add(new Node(0, 0));
    parent[0] = -1;

    while (!pq.isEmpty()) {
        int u = pq.poll().node;
        inMST[u] = true;

        for (Node neighbor : adj.get(u)) {
            if (!inMST[neighbor.node] && neighbor.weight < key[neighbor.node]) {
                parent[neighbor.node] = u;
                key[neighbor.node] = neighbor.weight;
                pq.add(new Node(neighbor.node, key[neighbor.node]));
            }
        }
    }
}`,
  code: CODE,
  defaultInput: {
    nodes: ["A", "B", "C", "D", "E"],
    edges: [
      { from: "A", to: "B", weight: 2 },
      { from: "A", to: "C", weight: 3 },
      { from: "B", to: "C", weight: 1 },
      { from: "B", to: "D", weight: 1 },
      { from: "C", to: "E", weight: 5 },
      { from: "D", to: "E", weight: 1 },
    ],
    source: "A",
  } as GraphInput,
};
