// Generates a full step-by-step trace of Insertion Sort for a given input array.
// Uses the same { id, value } element pattern as bubbleSort.js / selectionSort.js.
//
// Implemented as the adjacent-swap variant of Insertion Sort (functionally
// identical result and complexity to the classic "shift + insert" version,
// but it moves the key one adjacent swap at a time -- which keeps every
// element's identity attached to a single array slot at all times, so the
// visualizer can animate it sliding left with the same swap mechanism used
// by Bubble Sort and Selection Sort).
export function generateInsertionSortSteps(inputArray) {
  let arr = inputArray.map((value, i) => ({ id: `el-${i}-${Date.now()}-${Math.random()}`, value }));
  const n = arr.length;
  const steps = [];

  steps.push({
    type: "start",
    array: [...arr],
    compareIndices: [],
    sortedIndices: [0],
    pointers: [],
    line: 2,
    description:
      "Start of algorithm. Insertion Sort builds the sorted portion one element at a time, inserting each new element into its correct place \u2014 like sorting playing cards in your hand.",
  });

  for (let i = 1; i < n; i++) {
    let j = i;
    const sortedBefore = Array.from({ length: i }, (_, k) => k);

    steps.push({
      type: "selectKey",
      array: [...arr],
      compareIndices: [i],
      sortedIndices: sortedBefore,
      pointers: [{ index: i, label: "key" }],
      line: 4,
      description: `Take index ${i} (${arr[i].value}) as the next key to insert into the sorted portion.`,
    });

    let didShift = false;

    while (j > 0 && arr[j - 1].value > arr[j].value) {
      didShift = true;

      steps.push({
        type: "compare",
        array: [...arr],
        compareIndices: [j - 1, j],
        sortedIndices: sortedBefore,
        pointers: [
          { index: j - 1, label: "j-1" },
          { index: j, label: "key" },
        ],
        line: 5,
        description: `Compare arr[${j - 1}] = ${arr[j - 1].value} with the key ${arr[j].value}.`,
      });

      const left = arr[j - 1].value;
      const right = arr[j].value;
      [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];

      steps.push({
        type: "swap",
        array: [...arr],
        compareIndices: [j - 1, j],
        sortedIndices: sortedBefore,
        pointers: [
          { index: j - 1, label: "key" },
          { index: j, label: "j" },
        ],
        line: 8,
        description: `${right} < ${left}, so shift ${left} right and move the key into index ${j - 1}.`,
      });

      j--;
    }

    if (!didShift) {
      steps.push({
        type: "noSwap",
        array: [...arr],
        compareIndices: [i],
        sortedIndices: sortedBefore,
        pointers: [{ index: i, label: "key" }],
        line: 5,
        description: `arr[${i}] = ${arr[i].value} is already \u2265 arr[${i - 1}] = ${arr[i - 1].value}, so it stays put.`,
      });
    }

    const sortedAfter = Array.from({ length: i + 1 }, (_, k) => k);
    steps.push({
      type: "passComplete",
      array: [...arr],
      compareIndices: [],
      sortedIndices: sortedAfter,
      pointers: [],
      line: 11,
      description: `Indices 0 to ${i} are now sorted relative to each other.`,
    });
  }

  steps.push({
    type: "done",
    array: [...arr],
    compareIndices: [],
    sortedIndices: Array.from({ length: n }, (_, k) => k),
    pointers: [],
    line: 12,
    description: "Insertion Sort complete! Every element is now in its correct sorted position.",
  });

  return steps;
}

export const insertionSortJavaCode = `public void insertionSort(int[] arr) {
    int n = arr.length;
    for (int i = 1; i < n; i++) {
        int j = i;
        while (j > 0 && arr[j - 1] > arr[j]) {
            int temp = arr[j];
            arr[j] = arr[j - 1];
            arr[j - 1] = temp;
            j--;
        }
    }
}`;