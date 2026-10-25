// Generates a full step-by-step trace of Merge Sort for a given input array.
//
// Merge Sort doesn't swap adjacent elements like Bubble/Selection/Insertion
// Sort -- it copies elements out of two sorted halves into a merged result.
// To keep every element's { id, value } identity unique at all times (so the
// visualizer never renders two boxes with the same id), each merge step's
// displayed array is built as:
//   [ untouched elements before this range ]
//   ++ [ already-merged elements, in sorted order ]
//   ++ [ remaining not-yet-merged elements from the left half ]
//   ++ [ remaining not-yet-merged elements from the right half ]
//   ++ [ untouched elements after this range ]
// which always contains each id exactly once, and visibly shows the merged
// prefix growing while the two source "queues" shrink.
export function generateMergeSortSteps(inputArray) {
  let arr = inputArray.map((value, i) => ({ id: `el-${i}-${Date.now()}-${Math.random()}`, value }));
  const n = arr.length;
  const steps = [];

  steps.push({
    type: "start",
    array: [...arr],
    compareIndices: [],
    sortedIndices: [],
    pointers: [],
    line: 1,
    description:
      "Start of algorithm. Merge Sort recursively splits the array in half, sorts each half, then merges the two sorted halves back together.",
  });

  function merge(start, mid, end) {
    const left = arr.slice(start, mid + 1);
    const right = arr.slice(mid + 1, end + 1);
    let i = 0;
    let j = 0;
    const merged = [];

    const snapshot = () =>
      arr.slice(0, start).concat(merged, left.slice(i), right.slice(j), arr.slice(end + 1));

    steps.push({
      type: "mergeStart",
      array: snapshot(),
      compareIndices: [],
      sortedIndices: [],
      pointers: [
        { index: start, label: "L" },
        { index: end, label: "R" },
      ],
      line: 12,
      description: `Merge the sorted halves arr[${start}..${mid}] and arr[${mid + 1}..${end}].`,
    });

    while (i < left.length && j < right.length) {
      const leftPtrIdx = start + merged.length;
      const rightPtrIdx = start + merged.length + (left.length - i);

      steps.push({
        type: "compare",
        array: snapshot(),
        compareIndices: [leftPtrIdx, rightPtrIdx],
        sortedIndices: [],
        pointers: [
          { index: leftPtrIdx, label: "L" },
          { index: rightPtrIdx, label: "R" },
        ],
        line: 16,
        description: `Compare ${left[i].value} (left) with ${right[j].value} (right).`,
      });

      let placedValue;
      let placeLine;
      if (left[i].value <= right[j].value) {
        placedValue = left[i].value;
        merged.push(left[i]);
        i++;
        placeLine = 17;
      } else {
        placedValue = right[j].value;
        merged.push(right[j]);
        j++;
        placeLine = 19;
      }

      const placedIdx = start + merged.length - 1;
      steps.push({
        type: "swap",
        array: snapshot(),
        compareIndices: [placedIdx],
        sortedIndices: [],
        pointers: [{ index: placedIdx, label: "placed" }],
        line: placeLine,
        description: `${placedValue} is smaller, so place it at index ${placedIdx}.`,
      });
    }

    while (i < left.length) {
      merged.push(left[i]);
      i++;
      const placedIdx = start + merged.length - 1;
      steps.push({
        type: "swap",
        array: snapshot(),
        compareIndices: [placedIdx],
        sortedIndices: [],
        pointers: [{ index: placedIdx, label: "placed" }],
        line: 22,
        description: `Copy the remaining left value ${merged[merged.length - 1].value} into index ${placedIdx}.`,
      });
    }

    while (j < right.length) {
      merged.push(right[j]);
      j++;
      const placedIdx = start + merged.length - 1;
      steps.push({
        type: "swap",
        array: snapshot(),
        compareIndices: [placedIdx],
        sortedIndices: [],
        pointers: [{ index: placedIdx, label: "placed" }],
        line: 23,
        description: `Copy the remaining right value ${merged[merged.length - 1].value} into index ${placedIdx}.`,
      });
    }

    for (let k = 0; k < merged.length; k++) arr[start + k] = merged[k];
  }

  function mergeSortRange(start, end) {
    if (start >= end) return;
    const mid = Math.floor((start + end) / 2);

    steps.push({
      type: "divide",
      array: [...arr],
      compareIndices: [],
      sortedIndices: [],
      pointers: [
        { index: start, label: "L" },
        { index: end, label: "R" },
      ],
      line: 5,
      description: `Split arr[${start}..${end}] into arr[${start}..${mid}] and arr[${mid + 1}..${end}].`,
    });

    mergeSortRange(start, mid);
    mergeSortRange(mid + 1, end);
    merge(start, mid, end);

    const isTopLevel = start === 0 && end === n - 1;
    steps.push({
      type: isTopLevel ? "done" : "passComplete",
      array: [...arr],
      compareIndices: [],
      sortedIndices: isTopLevel ? Array.from({ length: n }, (_, k) => k) : [],
      pointers: [],
      line: 9,
      description: isTopLevel
        ? "Merge Sort complete! Every element is now in its correct sorted position."
        : `arr[${start}..${end}] is now fully merged and sorted.`,
    });
  }

  mergeSortRange(0, n - 1);

  return steps;
}

export const mergeSortJavaCode = `public void mergeSort(int[] arr, int left, int right) {
    if (left >= right) {
        return;
    }
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}

private void merge(int[] arr, int left, int mid, int right) {
    int[] leftArr = Arrays.copyOfRange(arr, left, mid + 1);
    int[] rightArr = Arrays.copyOfRange(arr, mid + 1, right + 1);
    int i = 0, j = 0, k = left;
    while (i < leftArr.length && j < rightArr.length) {
        if (leftArr[i] <= rightArr[j]) {
            arr[k++] = leftArr[i++];
        } else {
            arr[k++] = rightArr[j++];
        }
    }
    while (i < leftArr.length) arr[k++] = leftArr[i++];
    while (j < rightArr.length) arr[k++] = rightArr[j++];
}`;