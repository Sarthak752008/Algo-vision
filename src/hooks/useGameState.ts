import { useGameState as useGlobalGameState } from "@/context/GameContext";
import { GameQuestion } from "@/types/algorithm";

/**
 * Re-export the global hook for convenience and backward compatibility.
 * This ensures all components use the same shared state.
 */
export const useGameState = useGlobalGameState;

/** Generate a challenge question for the current sorting step */
export function generateSortingQuestion(
  array: number[],
  comparing: number[],
  stepIndex: number = 0
): GameQuestion {
  // Case 1: Two elements being compared (Standard comparison sorts)
  if (comparing.length >= 2) {
    const a = array[comparing[0]];
    const b = array[comparing[1]];
    const shouldSwap = a > b;
    
    const questions = [
       {
         q: `In a standard Ascending Sort, should ${a} and ${b} be swapped?`,
         a: shouldSwap ? 0 : 1
       },
       {
         q: `Is the element ${a} greater than ${b}?`,
         a: shouldSwap ? 0 : 1
       },
       {
         q: `Which element should come first in the sorted array?`,
         a: a < b ? 0 : 1,
         opts: [`${a}`, `${b}`, "Neither", "Both"]
       }
    ];
    const type = questions[stepIndex % questions.length];

    return {
      question: type.q,
      options: type.opts || ["Yes", "No", "Skip", "Depends"],
      correctIndex: type.a,
    };
  }

  // Case 2: Single element highlighted (Radix / counting sort bucket placement)
  if (comparing.length === 1) {
    const val = array[comparing[0]];
    return {
      question: `This algorithm is currently processing ${val}. In Radix Sort, what determines its bucket?`,
      options: [
        "The current significant digit",
        "The total value of the number",
        "Its position in the array",
        "The previous element's value"
      ],
      correctIndex: 0,
    };
  }

  // Case 3: Fallback / General knowledge (Rotating based on step index)
  const generalQuestions: GameQuestion[] = [
    {
      question: "Which of these is a 'stable' sorting algorithm?",
      options: ["Quick Sort", "Merge Sort", "Heap Sort", "Selection Sort"],
      correctIndex: 1
    },
    {
      question: "What is the best-case time complexity of Bubble Sort (optimized)?",
      options: ["O(n log n)", "O(n²)", "O(n)", "O(1)"],
      correctIndex: 2
    },
    {
      question: "Counting Sort belongs to which category of sorting?",
      options: ["Comparison Based", "Non-Comparison Based", "Divide and Conquer", "Greedy"],
      correctIndex: 1
    },
    {
      question: "Which algorithm uses the 'Divide and Conquer' paradigm?",
      options: ["Insertion Sort", "Merge Sort", "Bubble Sort", "Radix Sort"],
      correctIndex: 1
    }
  ];

  return generalQuestions[stepIndex % generalQuestions.length];
}

export function generateGraphQuestion(
  currentNode: string,
  distances: Record<string, number>,
  stepIndex: number = 0
): GameQuestion {
  const neighbors = Object.entries(distances).filter(([n, d]) => d < Infinity && n !== currentNode);
  
  const generalQuestions: GameQuestion[] = [
    {
      question: "Dijkstra's is a greedy algorithm. What does it prioritize at each step?",
      options: [
        "The node with the smallest known distance", 
        "The node with the most edges", 
        "A random unvisited node", 
        "The node furthest from the start"
      ],
      correctIndex: 0,
    },
    {
      question: "Can Dijkstra's algorithm correctly handle negative edge weights?",
      options: ["Yes, always", "No, never", "Only if there are no cycles", "Only if the graph is small"],
      correctIndex: 1,
    },
    {
      question: "Which data structure is typically used to optimize Dijkstra's?",
      options: ["Stack", "Queue", "Priority Queue (Heap)", "Hash Map"],
      correctIndex: 2,
    }
  ];

  if (neighbors.length > 0) {
    const node = neighbors[0][0];
    return {
      question: `In this step, we are at node ${currentNode}. Is node ${node} a direct neighbor?`,
      options: ["Yes", "No", "Depends on weight", "Not enough info"],
      correctIndex: 0
    };
  }

  return generalQuestions[stepIndex % generalQuestions.length];
}

export function generateDPQuestion(
  i: number,
  w: number,
  weight: number,
  stepIndex: number = 0
): GameQuestion {
  const generalQuestions: GameQuestion[] = [
    {
      question: "What defines the 'Dynamic Programming' approach?",
      options: [
        "Breaking into subproblems and storing results",
        "Making the best local choice at each step",
        "Trying all combinations recursively without memory",
        "Sorting items before processing"
      ],
      correctIndex: 0,
    },
    {
      question: "In 0-1 Knapsack, can we take a fraction of an item?",
      options: ["Yes", "No", "Only if it fits", "Only for greedy approach"],
      correctIndex: 1,
    },
    {
      question: "What is the primary benefit of Memoization?",
      options: ["Saves time", "Saves space", "Improves precision", "No benefit"],
      correctIndex: 0,
    }
  ];

  if (weight <= w && i > 0) {
    return {
      question: `Current item has weight ${weight} and capacity is ${w}. Should we consider including it?`,
      options: [
        "Yes, and compare against not taking it",
        "No, it doesn't fit",
        "Always take it regardless",
        "Ignore it until the end"
      ],
      correctIndex: 0,
    };
  }

  return generalQuestions[stepIndex % generalQuestions.length];
}
