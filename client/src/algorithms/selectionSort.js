// Generates a full step-by-step trace of Selection Sort for a given input array.
// Same { id, value } element pattern as bubbleSort.js so the visualizer can
// animate boxes sliding to their new slot on every swap.
//
// Step shape adds a `pointers` field on top of the shared step shape:
// {
//   type: 'start' | 'selectMin' | 'compare' | 'newMin' | 'swap' | 'noSwap' | 'passComplete' | 'done',
//   array: { id, value }[]
//   compareIndices: number[]           -> positions to highlight (compare/swap colour)
//   sortedIndices: number[]            -> positions locked into final sorted spot
//   pointers: { index, label }[]       -> labeled tags rendered above/below a box (e.g. "min", "j", "i")
//   line: number
//   description: string
// }
export function generateSelectionSortSteps(inputArray) {
  let arr = inputArray.map((value, i) => ({ id: `el-${i}-${Date.now()}-${Math.random()}`, value }));
  const n = arr.length;
  const steps = [];
  const sortedIndices = new Set();

  steps.push({
    type: "start",
    array: [...arr],
    compareIndices: [],
    sortedIndices: [],
    pointers: [],
    line: 2,
    description:
      "Start of algorithm. Selection Sort repeatedly finds the minimum value in the unsorted portion and swaps it to the front.",
  });

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    steps.push({
      type: "selectMin",
      array: [...arr],
      compareIndices: [i],
      sortedIndices: [...sortedIndices],
      pointers: [{ index: i, label: "min" }],
      line: 4,
      description: `Assume index ${i} (${arr[i].value}) is the minimum of the unsorted portion.`,
    });

    for (let j = i + 1; j < n; j++) {
      steps.push({
        type: "compare",
        array: [...arr],
        compareIndices: [minIndex, j],
        sortedIndices: [...sortedIndices],
        pointers: [
          { index: minIndex, label: "min" },
          { index: j, label: "j" },
        ],
        line: 6,
        description: `Compare current min, arr[${minIndex}] = ${arr[minIndex].value}, with arr[${j}] = ${arr[j].value}.`,
      });

      if (arr[j].value < arr[minIndex].value) {
        minIndex = j;
        steps.push({
          type: "newMin",
          array: [...arr],
          compareIndices: [minIndex],
          sortedIndices: [...sortedIndices],
          pointers: [{ index: minIndex, label: "min" }],
          line: 7,
          description: `New minimum found: arr[${minIndex}] = ${arr[minIndex].value}.`,
        });
      }
    }

    if (minIndex !== i) {
      const left = arr[i].value;
      const right = arr[minIndex].value;
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];

      steps.push({
        type: "swap",
        array: [...arr],
        compareIndices: [i, minIndex],
        sortedIndices: [...sortedIndices],
        pointers: [
          { index: i, label: "i" },
          { index: minIndex, label: "min" },
        ],
        line: 13,
        description: `${right} is the smallest remaining value, so swap index ${i} and ${minIndex}.`,
      });
    } else {
      steps.push({
        type: "noSwap",
        array: [...arr],
        compareIndices: [i],
        sortedIndices: [...sortedIndices],
        pointers: [{ index: i, label: "i" }],
        line: 10,
        description: `arr[${i}] was already the minimum, so no swap is needed.`,
      });
    }

    sortedIndices.add(i);

    steps.push({
      type: "passComplete",
      array: [...arr],
      compareIndices: [],
      sortedIndices: [...sortedIndices],
      pointers: [],
      line: 15,
      description: `Index ${i} is locked in with value ${arr[i].value}.`,
    });
  }

  sortedIndices.add(n - 1);

  steps.push({
    type: "done",
    array: [...arr],
    compareIndices: [],
    sortedIndices: Array.from({ length: n }, (_, k) => k),
    pointers: [],
    line: 16,
    description: "Selection Sort complete! Every element is now in its correct sorted position.",
  });

  return steps;
}

export const selectionSortJavaCode = `public void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int minIndex = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex != i) {
            int temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
        }
    }
}`;