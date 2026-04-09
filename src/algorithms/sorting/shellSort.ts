import { SortingSnapshot } from "@/types/algorithm";

const CODE = `function shellSort(arr) {
  let n = arr.length;
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      let temp = arr[i];
      let j;
      for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
        arr[j] = arr[j - gap];
      }
      arr[j] = temp;
    }
  }
  return arr;
}`;

export function generateShellSortSnapshots(input: number[]): SortingSnapshot[] {
  const arr = [...input];
  const snapshots: SortingSnapshot[] = [];
  const n = arr.length;

  snapshots.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: [],
    message: "Starting Shell Sort — an optimization over Insertion Sort using gaps.",
    codeLine: 1,
  });

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    snapshots.push({
      array: [...arr],
      comparing: [],
      swapped: [],
      sorted: [],
      message: `Current gap size: ${gap}. Sorting elements at this interval.`,
      codeLine: 3,
    });

    for (let i = gap; i < n; i++) {
      let temp = arr[i];
      let j = i;

      snapshots.push({
        array: [...arr],
        comparing: [i, j - gap],
        swapped: [],
        sorted: [],
        message: `Comparing arr[${i}] (${temp}) with arr[${j - gap}] (${arr[j - gap]}) with gap ${gap}.`,
        codeLine: 5,
      });

      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        
        snapshots.push({
          array: [...arr],
          comparing: [j, j - gap],
          swapped: [j],
          sorted: [],
          message: `${arr[j - gap]} is greater than ${temp}, shifting it forward by ${gap}.`,
          codeLine: 8,
        });
        
        j -= gap;
      }
      
      const oldVal = arr[j];
      arr[j] = temp;

      if (oldVal !== temp) {
        snapshots.push({
          array: [...arr],
          comparing: [],
          swapped: [j],
          sorted: [],
          message: `Placed ${temp} at its correct position for current gap.`,
          codeLine: 10,
        });
      }
    }
  }

  snapshots.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    message: "Shell Sort complete!",
    codeLine: 14,
  });

  return snapshots;
}

export const shellSortMeta = {
  id: "shell-sort",
  name: "Shell Sort",
  category: "sorting" as const,
  difficulty: "Medium" as const,
  timeComplexity: "O(n log n) to O(n²)",
  spaceComplexity: "O(1)",
  description:
    "Shell sort is a highly efficient sorting algorithm and is based on insertion sort algorithm. This algorithm avoids large shifts as in case of insertion sort, if the smaller value is to the far right and has to be moved to the far left.",
  analogy: "Think of it as sorting several smaller sub-lists of elements separated by a gap, then gradually reducing the gap until it becomes 1 (which is just Insertion Sort but on a mostly-sorted list).",
  approach: [
    "Start with a large gap and perform insertion sort on sub-lists of elements separated by this gap.",
    "Gradually reduce the gap size (e.g., n/2, n/4, ..., 1).",
    "On every iteration, ensure that elements at the current gap distance are sorted relative to each other.",
    "The final pass with a gap of 1 is a standard insertion sort, which is very fast on the now nearly-sorted array."
  ],
  cppCode: `void shellSort(int arr[], int n) {
    for (int gap = n / 2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i += 1) {
            int temp = arr[i];
            int j;
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap)
                arr[j] = arr[j - gap];
            arr[j] = temp;
        }
    }
}`,
  javaCode: `public void shellSort(int arr[]) {
    int n = arr.length;
    for (int gap = n / 2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i += 1) {
            int temp = arr[i];
            int j;
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap)
                arr[j] = arr[j - gap];
            arr[j] = temp;
        }
    }
}`,
  code: CODE,
  defaultInput: [35, 33, 42, 10, 14, 19, 27, 44],
};
