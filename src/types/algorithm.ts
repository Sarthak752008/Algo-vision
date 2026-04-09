/** Base snapshot shared by all algorithm categories */
export interface BaseSnapshot {
  message: string;
  codeLine: number;
}

/** Sorting algorithm snapshot */
export interface SortingSnapshot extends BaseSnapshot {
  array: number[];
  comparing: number[];
  swapped: number[];
  sorted: number[];
  buckets?: number[][];        // used by radix sort
  currentDigit?: number;       // current digit position for radix
}

/** Graph algorithm snapshot */
export interface GraphSnapshot extends BaseSnapshot {
  currentNode: string;
  distances: Record<string, number>;
  visited: string[];
  relaxingEdge: [string, string] | null;
  previous: Record<string, string | null>;
}

/** Dynamic programming snapshot */
export interface DPSnapshot extends BaseSnapshot {
  table: number[][];
  i: number;
  w: number;
  action: "include" | "exclude" | "init" | "done";
  selectedItems?: number[];
  selectedCells?: { r: number, c: number }[];
}


export type AlgorithmSnapshot = SortingSnapshot | GraphSnapshot | DPSnapshot;

export type AlgorithmCategory = "sorting" | "greedy" | "dp";

export interface AlgorithmMeta {
  id: string;
  name: string;
  category: AlgorithmCategory;
  difficulty: "Easy" | "Medium" | "Hard";
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  analogy: string;
  approach?: string[];
  pseudocode: string;
  code: string;
  cppCode?: string;
  javaCode?: string;
  defaultInput: unknown;
}

export interface GameQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface GameState {
  score: number;
  streak: number;
  questionsAnswered: number;
  correctAnswers: number;
  achievements: string[];
  level: number;
  completedAlgorithms: string[];
}

