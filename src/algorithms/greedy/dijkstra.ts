import { GraphSnapshot } from "@/types/algorithm";

const CODE = `function dijkstra(graph, source) {
  const dist = {};
  const prev = {};
  const visited = new Set();
  const pq = new MinPriorityQueue();

  // Initialize distances
  for (const node of graph.nodes) {
    dist[node] = Infinity;
    prev[node] = null;
  }
  dist[source] = 0;
  pq.enqueue(source, 0);

  while (!pq.isEmpty()) {
    const u = pq.dequeue();
    if (visited.has(u)) continue;
    visited.add(u);

    for (const [v, weight] of graph.adj[u]) {
      const alt = dist[u] + weight;
      if (alt < dist[v]) {
        dist[v] = alt;
        prev[v] = u;
        pq.enqueue(v, alt);
      }
    }
  }
  return { dist, prev };
}`;

export interface GraphInput {
  nodes: string[];
  edges: { from: string; to: string; weight: number }[];
  source: string;
}

export function generateDijkstraSnapshots(input: GraphInput): GraphSnapshot[] {
  const { nodes, edges, source } = input;
  const snapshots: GraphSnapshot[] = [];

  // Build adjacency list
  const adj: Record<string, [string, number][]> = {};
  for (const n of nodes) adj[n] = [];
  for (const e of edges) {
    adj[e.from].push([e.to, e.weight]);
    adj[e.to].push([e.from, e.weight]); // undirected
  }

  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const visited: string[] = [];

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
    message: `Initialize: set distance of source "${source}" to 0, all others to ∞.`,
    codeLine: 9,
  });

  // Simple priority queue using an array
  const pq: { node: string; dist: number }[] = [{ node: source, dist: 0 }];

  while (pq.length > 0) {
    pq.sort((a, b) => a.dist - b.dist);
    const { node: u } = pq.shift()!;

    if (visited.includes(u)) continue;
    visited.push(u);

    snapshots.push({
      currentNode: u,
      distances: { ...dist },
      visited: [...visited],
      relaxingEdge: null,
      previous: { ...prev },
      message: `Visit node "${u}" with distance ${dist[u]}.`,
      codeLine: 17,
    });

    for (const [v, weight] of adj[u]) {
      const alt = dist[u] + weight;

      snapshots.push({
        currentNode: u,
        distances: { ...dist },
        visited: [...visited],
        relaxingEdge: [u, v],
        previous: { ...prev },
        message: `Examining edge ${u} → ${v} (weight ${weight}). Current dist[${v}] = ${dist[v] === Infinity ? "∞" : dist[v]}, new = ${alt}.`,
        codeLine: 21,
      });

      if (alt < dist[v]) {
        dist[v] = alt;
        prev[v] = u;
        pq.push({ node: v, dist: alt });

        snapshots.push({
          currentNode: u,
          distances: { ...dist },
          visited: [...visited],
          relaxingEdge: [u, v],
          previous: { ...prev },
          message: `Relaxed: dist[${v}] updated to ${alt} via ${u}.`,
          codeLine: 24,
        });
      }
    }
  }

  snapshots.push({
    currentNode: "",
    distances: { ...dist },
    visited: [...visited],
    relaxingEdge: null,
    previous: { ...prev },
    message: "Dijkstra's algorithm complete! All shortest paths found.",
    codeLine: 29,
  });

  return snapshots;
}

export const dijkstraMeta = {
  id: "dijkstra",
  name: "Dijkstra's Algorithm",
  category: "greedy" as const,
  difficulty: "Medium" as const,
  timeComplexity: "O((V + E) log V)",
  spaceComplexity: "O(V + E)",
  description:
    "A greedy algorithm that finds the shortest path from a source node to all other nodes in a weighted graph with non-negative edge weights.",
  analogy: "Think of finding the quickest route on a map. You explore outward from your starting point, always choosing the nearest untraveled intersection first, updating your estimated time to reach further points as you find shortcuts.",
  approach: [
    "Initialize all distances as infinity and source distance as 0.",
    "Place all nodes in a priority queue sorted by distance.",
    "While the queue is not empty, extract the node with the minimum distance.",
    "For each neighbor of the current node, calculate the distance through the current node.",
    "If the new distance is smaller than the current known distance, update the distance and previous node."
  ],
  cppCode: `void dijkstra(int n, vector<pair<int, int>> adj[], int source) {
    vector<int> dist(n, INT_MAX);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;

    dist[source] = 0;
    pq.push({0, source});

    while (!pq.empty()) {
        int d = pq.top().first;
        int u = pq.top().second;
        pq.pop();

        if (d > dist[u]) continue;

        for (auto edge : adj[u]) {
            int v = edge.first;
            int weight = edge.second;
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
}`,
  javaCode: `public void dijkstra(int n, List<List<Node>> adj, int source) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    PriorityQueue<Node> pq = new PriorityQueue<>(n, (a, b) -> a.weight - b.weight);

    dist[source] = 0;
    pq.add(new Node(source, 0));

    while (!pq.isEmpty()) {
        int u = pq.poll().node;

        for (Node neighbor : adj.get(u)) {
            if (dist[u] + neighbor.weight < dist[neighbor.node]) {
                dist[neighbor.node] = dist[u] + neighbor.weight;
                pq.add(new Node(neighbor.node, dist[neighbor.node]));
            }
        }
    }
}`,
  code: CODE,
  defaultInput: {
    nodes: ["A", "B", "C", "D", "E"],
    edges: [
      { from: "A", to: "B", weight: 4 },
      { from: "A", to: "C", weight: 2 },
      { from: "B", to: "D", weight: 3 },
      { from: "B", to: "C", weight: 1 },
      { from: "C", to: "D", weight: 8 },
      { from: "C", to: "E", weight: 5 },
      { from: "D", to: "E", weight: 2 },
    ],
    source: "A",
  } as GraphInput,
};

