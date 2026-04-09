import { SortingSnapshot } from "@/types/algorithm";

const CODE = `function radixSort(arr) {
  const max = Math.max(...arr);
  let exp = 1;
  
  while (Math.floor(max / exp) > 0) {
    countingSortByDigit(arr, exp);
    exp *= 10;
  }
  return arr;
}

function countingSortByDigit(arr, exp) {
  const output = new Array(arr.length);
  const count = new Array(10).fill(0);
  
  // Count occurrences of each digit
  for (let i = 0; i < arr.length; i++) {
    const digit = Math.floor(arr[i] / exp) % 10;
    count[digit]++;
  }
  
  // Cumulative count
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }
  
  // Build output array (stable)
  for (let i = arr.length - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / exp) % 10;
    output[count[digit] - 1] = arr[i];
    count[digit]--;
  }
  
  // Copy output to arr
  for (let i = 0; i < arr.length; i++) {
    arr[i] = output[i];
  }
}`;

export function generateRadixSortSnapshots(input: number[]): SortingSnapshot[] {
  const arr = [...input];
  const snapshots: SortingSnapshot[] = [];
  const sorted: number[] = [];

  snapshots.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: [],
    message: "Starting Radix Sort — we process digits from least to most significant.",
    codeLine: 1,
  });

  if (arr.length === 0) return snapshots;

  const max = Math.max(...arr);
  let exp = 1;
  let digitPos = 0;

  while (Math.floor(max / exp) > 0) {
    // Create buckets view
    const buckets: number[][] = Array.from({ length: 10 }, () => []);

    snapshots.push({
      array: [...arr],
      comparing: [],
      swapped: [],
      sorted: [],
      buckets: buckets.map((b) => [...b]),
      currentDigit: digitPos,
      message: `Processing digit position ${digitPos} (×${exp}).`,
      codeLine: 5,
    });

    // Distribute into buckets
    for (let i = 0; i < arr.length; i++) {
      const digit = Math.floor(arr[i] / exp) % 10;
      buckets[digit].push(arr[i]);

      snapshots.push({
        array: [...arr],
        comparing: [i],
        swapped: [],
        sorted: [],
        buckets: buckets.map((b) => [...b]),
        currentDigit: digitPos,
        message: `Placing ${arr[i]} into bucket ${digit} (digit at position ${digitPos}).`,
        codeLine: 18,
      });
    }

    // Collect from buckets back into array
    let idx = 0;
    for (let b = 0; b < 10; b++) {
      for (const val of buckets[b]) {
        arr[idx] = val;
        snapshots.push({
          array: [...arr],
          comparing: [],
          swapped: [idx],
          sorted: [],
          buckets: buckets.map((bk) => [...bk]),
          currentDigit: digitPos,
          message: `Collecting ${val} from bucket ${b} into position ${idx}.`,
          codeLine: 34,
        });
        idx++;
      }
    }

    exp *= 10;
    digitPos++;
  }

  // Mark all sorted
  for (let i = 0; i < arr.length; i++) sorted.push(i);

  snapshots.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted,
    message: "Radix Sort complete!",
    codeLine: 8,
  });

  return snapshots;
}

export const radixSortMeta = {
  id: "radix-sort",
  name: "Radix Sort",
  category: "sorting" as const,
  difficulty: "Medium" as const,
  timeComplexity: "O(d × (n + k))",
  spaceComplexity: "O(n + k)",
  description:
    "Radix Sort is a non-comparative sorting algorithm that sorts data with integer keys by grouping keys by the individual digits which share the same significant position and value. It processes digits from least significant to most significant.",
  analogy: "Think of sorting a deck of cards first by their face value, then gathering them up and sorting them by their suit. By doing it digit by digit, the final deck comes out perfectly ordered.",
  approach: [
    "Process digits from least significant (rightmost) to most significant (leftmost).",
    "Place numbers into buckets (0-9) based on the current digit.",
    "Collect numbers back into the array from the buckets.",
    "Repeat the process for the next significant digit."
  ],
  pseudocode: `for each digit position d (from least to most significant):
  apply a stable sort (like Counting Sort) to the array based on the d-th digit`,
  cppCode: `void radixSort(vector<int>& arr) {
    if (arr.empty()) return;
    int maxVal = *max_element(arr.begin(), arr.end());
    for (int exp = 1; maxVal / exp > 0; exp *= 10) {
        vector<int> output(arr.size());
        vector<int> count(10, 0);
        for (int i = 0; i < arr.size(); i++)
            count[(arr[i] / exp) % 10]++;
        for (int i = 1; i < 10; i++)
            count[i] += count[i - 1];
        for (int i = arr.size() - 1; i >= 0; i--) {
            output[count[(arr[i] / exp) % 10] - 1] = arr[i];
            count[(arr[i] / exp) % 10]--;
        }
        for (int i = 0; i < arr.size(); i++)
            arr[i] = output[i];
    }
}`,
  javaCode: `public void radixSort(int[] arr) {
    if (arr.length == 0) return;
    int maxVal = Arrays.stream(arr).max().getAsInt();
    for (int exp = 1; maxVal / exp > 0; exp *= 10) {
        int[] output = new int[arr.length];
        int[] count = new int[10];
        for (int i = 0; i < arr.length; i++)
            count[(arr[i] / exp) % 10]++;
        for (int i = 1; i < 10; i++)
            count[i] += count[i - 1];
        for (int i = arr.length - 1; i >= 0; i--) {
            output[count[(arr[i] / exp) % 10] - 1] = arr[i];
            count[(arr[i] / exp) % 10]--;
        }
        for (int i = 0; i < arr.length; i++)
            arr[i] = output[i];
    }
}`,
  code: CODE,
  defaultInput: [170, 45, 75, 90, 802, 24, 2, 66],
};

