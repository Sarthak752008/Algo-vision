import { SortingSnapshot } from "@/types/algorithm";

const CODE = `function bucketSort(arr, bucketSize = 5) {
  if (arr.length === 0) return arr;

  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const bucketCount = Math.floor((max - min) / bucketSize) + 1;
  const buckets = Array.from({ length: bucketCount }, () => []);

  for (let i = 0; i < arr.length; i++) {
    const bucketIndex = Math.floor((arr[i] - min) / bucketSize);
    buckets[bucketIndex].push(arr[i]);
  }

  arr.length = 0;
  for (let i = 0; i < buckets.length; i++) {
    insertionSort(buckets[i]);
    for (let j = 0; j < buckets[i].length; j++) {
      arr.push(buckets[i][j]);
    }
  }
  return arr;
}`;

export function generateBucketSortSnapshots(input: number[]): SortingSnapshot[] {
  const arr = [...input];
  const snapshots: SortingSnapshot[] = [];
  const n = arr.length;

  if (n === 0) return snapshots;

  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const bucketSize = 10;
  const bucketCount = Math.floor((max - min) / bucketSize) + 1;
  const buckets: number[][] = Array.from({ length: bucketCount }, () => []);

  snapshots.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: [],
    buckets: buckets.map(b => [...b]),
    message: `Starting Bucket Sort with ${bucketCount} buckets (size ${bucketSize}).`,
    codeLine: 1,
  });

  // Distribute
  for (let i = 0; i < n; i++) {
    const bIdx = Math.floor((arr[i] - min) / bucketSize);
    buckets[bIdx].push(arr[i]);

    snapshots.push({
      array: [...arr],
      comparing: [i],
      swapped: [],
      sorted: [],
      buckets: buckets.map(b => [...b]),
      message: `Placing ${arr[i]} into bucket ${bIdx}.`,
      codeLine: 10,
    });
  }

  // Clear array for reconstruction
  const result: number[] = [];
  let currentIdx = 0;

  for (let b = 0; b < buckets.length; b++) {
    if (buckets[b].length === 0) continue;

    snapshots.push({
      array: [...result, ...new Array(n - result.length).fill(0)],
      comparing: [],
      swapped: [],
      sorted: [],
      buckets: buckets.map(bk => [...bk]),
      message: `Sorting bucket ${b} and merging into result.`,
      codeLine: 16,
    });

    // Insertion sort on bucket
    buckets[b].sort((x, y) => x - y);

    for (const val of buckets[b]) {
        result.push(val);
        snapshots.push({
            array: [...result, ...new Array(n - result.length).fill(0)],
            comparing: [],
            swapped: [result.length - 1],
            sorted: [],
            buckets: buckets.map(bk => [...bk]),
            message: `Added ${val} from bucket ${b} to output.`,
            codeLine: 18,
        });
    }
  }

  snapshots.push({
    array: [...result],
    comparing: [],
    swapped: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    buckets: buckets.map(bk => [...bk]),
    message: "Bucket Sort complete!",
    codeLine: 22,
  });

  return snapshots;
}

export const bucketSortMeta = {
  id: "bucket-sort",
  name: "Bucket Sort",
  category: "sorting" as const,
  difficulty: "Medium" as const,
  timeComplexity: "O(n + k)",
  spaceComplexity: "O(n + k)",
  description:
    "A distribution-based sorting algorithm that works by partitioning an array into a number of buckets. Each bucket is then sorted individually, either using a different sorting algorithm, or by recursively applying the bucket sorting algorithm.",
  analogy: "Like sorting laundry! You might first separate clothes by color into different baskets (buckets), then you sort each basket individually.",
  approach: [
    "Determine the range of the input data to calculate the number of buckets.",
    "Distribute each element from the original array into its corresponding bucket based on a value range.",
    "Sort each non-empty bucket individually (usually with Insertion Sort).",
    "Concatenate the sorted buckets back into a single array to get the final result."
  ],
  cppCode: `void bucketSort(float arr[], int n) {
    vector<float> b[n];
    for (int i = 0; i < n; i++) {
        int bi = n * arr[i];
        b[bi].push_back(arr[i]);
    }
    for (int i = 0; i < n; i++)
        sort(b[i].begin(), b[i].end());
    int index = 0;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < b[i].size(); j++)
            arr[index++] = b[i][j];
}`,
  javaCode: `public void bucketSort(float[] arr, int n) {
    if (n <= 0) return;
    ArrayList<Float>[] buckets = new ArrayList[n];
    for (int i = 0; i < n; i++) buckets[i] = new ArrayList<Float>();
    for (int i = 0; i < n; i++) {
        float idx = arr[i] * n;
        buckets[(int)idx].add(arr[i]);
    }
    for (int i = 0; i < n; i++) Collections.sort(buckets[i]);
    int index = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < buckets[i].size(); j++) {
            arr[index++] = buckets[i].get(j);
        }
    }
}`,
  code: CODE,
  defaultInput: [22, 45, 12, 8, 10, 6, 72, 81, 33, 18, 50, 14],
};
