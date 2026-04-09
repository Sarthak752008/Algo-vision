import { SortingSnapshot } from "@/types/algorithm";

const CODE = `function countingSort(arr) {
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;
  const count = new Array(range).fill(0);
  const output = new Array(arr.length);

  for (let i = 0; i < arr.length; i++) {
    count[arr[i] - min]++;
  }

  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
  }

  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[arr[i] - min] - 1] = arr[i];
    count[arr[i] - min]--;
  }

  return output;
}`;

export function generateCountingSortSnapshots(input: number[]): SortingSnapshot[] {
  const arr = [...input];
  const snapshots: SortingSnapshot[] = [];
  const n = arr.length;

  if (n === 0) return snapshots;

  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;
  const count = new Array(range).fill(0);
  const output = new Array(n).fill(null);

  snapshots.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: [],
    message: `Starting Counting Sort. Range: [${min}, ${max}].`,
    codeLine: 1,
  });

  // Count occurrences
  for (let i = 0; i < n; i++) {
    count[arr[i] - min]++;
    snapshots.push({
      array: [...arr],
      comparing: [i],
      swapped: [],
      sorted: [],
      buckets: [ [...count] ], // reusing buckets field to show count array
      message: `Counting ${arr[i]}. Current count of ${arr[i]} is ${count[arr[i] - min]}.`,
      codeLine: 9,
    });
  }

  // Cumulative count
  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
    snapshots.push({
      array: [...arr],
      comparing: [],
      swapped: [],
      sorted: [],
      buckets: [ [...count] ],
      message: `Cumulative count: there are ${count[i]} elements ≤ ${i + min}.`,
      codeLine: 13,
    });
  }

  // Build output
  for (let i = n - 1; i >= 0; i--) {
    const val = arr[i];
    const pos = count[val - min] - 1;
    output[pos] = val;
    count[val - min]--;

    snapshots.push({
      array: output.map(v => v === null ? 0 : v),
      comparing: [i],
      swapped: [pos],
      sorted: [],
      buckets: [ [...count] ],
      message: `Placing ${val} at index ${pos} in output array.`,
      codeLine: 17,
    });
  }

  snapshots.push({
    array: [...output],
    comparing: [],
    swapped: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    message: "Counting Sort complete!",
    codeLine: 22,
  });

  return snapshots;
}

export const countingSortMeta = {
  id: "counting-sort",
  name: "Counting Sort",
  category: "sorting" as const,
  difficulty: "Medium" as const,
  timeComplexity: "O(n + k)",
  spaceComplexity: "O(k)",
  description:
    "An integer sorting algorithm that operates by counting the number of objects that have each distinct key value, then doing some arithmetic to calculate the position of each object in the output sequence.",
  analogy: "Imagine you have a bunch of mail to sort into boxes by Zip Code. You first count how many letters go into each box, then you know exactly where to start putting the letters for each Zip Code in a long row.",
  approach: [
    "Find the maximum and minimum elements in the array to determine the range.",
    "Create a count array to store the frequency of each element.",
    "Modify the count array to store the cumulative sum of frequencies.",
    "Iterate through the original array in reverse order to place elements into their correct positions in the output array, maintaining stability.",
    "Copy the output array back to the original array."
  ],
  cppCode: `void countingSort(int arr[], int n) {
    int max = *max_element(arr, arr + n);
    int min = *min_element(arr, arr + n);
    int range = max - min + 1;
    vector<int> count(range), output(n);
    for (int i = 0; i < n; i++)
        count[arr[i] - min]++;
    for (int i = 1; i < range; i++)
        count[i] += count[i - 1];
    for (int i = n - 1; i >= 0; i--) {
        output[count[arr[i] - min] - 1] = arr[i];
        count[arr[i] - min]--;
    }
    for (int i = 0; i < n; i++)
        arr[i] = output[i];
}`,
  javaCode: `public void countingSort(int[] arr) {
    int max = Arrays.stream(arr).max().getAsInt();
    int min = Arrays.stream(arr).min().getAsInt();
    int range = max - min + 1;
    int[] count = new int[range];
    int[] output = new int[arr.length];
    for (int i = 0; i < arr.length; i++)
        count[arr[i] - min]++;
    for (int i = 1; i < range; i++)
        count[i] += count[i - 1];
    for (int i = arr.length - 1; i >= 0; i--) {
        output[count[arr[i] - min] - 1] = arr[i];
        count[arr[i] - min]--;
    }
    for (int i = 0; i < arr.length; i++)
        arr[i] = output[i];
}`,
  code: CODE,
  defaultInput: [4, 2, 2, 8, 3, 3, 1],
};
