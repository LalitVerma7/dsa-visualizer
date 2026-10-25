// Generates a full step-by-step trace of Bubble Sort for a given input array.
// Each step is a self-contained snapshot so the UI can scrub forward/backward
// through the animation without re-running the algorithm.
//
// Each array element is wrapped as { id, value }. The id is assigned once at
// the start and travels with the value whenever it's swapped -- this is what
// lets the visualizer key each box by identity instead of position, so
// Framer Motion can animate a box physically sliding to its new slot instead
// of just changing the number inside a static box.
//
// Step shape:
// {
//   type: 'start' | 'compare' | 'swap' | 'noSwap' | 'passComplete' | 'done',
//   array: { id, value }[]   -> element order AFTER this step is applied
//   compareIndices: number[] -> positions currently being compared/highlighted
//   sortedIndices: number[]  -> positions already locked into final sorted spot
//   pointers: { index, label }[] -> labeled tags rendered above a box (e.g. "j", "j+1")
//   line: number              -> java code line to highlight for this step
//   description: string       -> human readable explanation shown under the visualizer
// }
export function generateBubbleSortSteps(inputArray) {
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
      "Start of algorithm. Bubble Sort repeatedly walks through the array, compares each pair of neighbours, and swaps them if they're out of order.",
  });

  for (let i = 0; i < n - 1; i++) {
    let swappedInPass = false;

    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        type: "compare",
        array: [...arr],
        compareIndices: [j, j + 1],
        sortedIndices: [...sortedIndices],
        pointers: [
          { index: j, label: "j" },
          { index: j + 1, label: "j+1" },
        ],
        line: 6,
        description: `Compare index ${j} (${arr[j].value}) with index ${j + 1} (${arr[j + 1].value}).`,
      });

      if (arr[j].value > arr[j + 1].value) {
        const left = arr[j].value;
        const right = arr[j + 1].value;
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swappedInPass = true;

        steps.push({
          type: "swap",
          array: [...arr],
          compareIndices: [j, j + 1],
          sortedIndices: [...sortedIndices],
          pointers: [
            { index: j, label: "j" },
            { index: j + 1, label: "j+1" },
          ],
          line: 9,
          description: `${left} > ${right}, so swap index ${j} and ${j + 1}.`,
        });
      } else {
        steps.push({
          type: "noSwap",
          array: [...arr],
          compareIndices: [j, j + 1],
          sortedIndices: [...sortedIndices],
          pointers: [
            { index: j, label: "j" },
            { index: j + 1, label: "j+1" },
          ],
          line: 6,
          description: `${arr[j].value} \u2264 ${arr[j + 1].value}, already in order \u2014 no swap needed.`,
        });
      }
    }

    sortedIndices.add(n - 1 - i);

    steps.push({
      type: "passComplete",
      array: [...arr],
      compareIndices: [],
      sortedIndices: [...sortedIndices],
      pointers: [],
      line: 13,
      description: `Pass ${i + 1} complete. The largest remaining value (${
        arr[n - 1 - i].value
      }) has bubbled to index ${n - 1 - i}.`,
    });

    if (!swappedInPass) {
      for (let k = 0; k < n - i - 1; k++) sortedIndices.add(k);
      steps.push({
        type: "done",
        array: [...arr],
        compareIndices: [],
        sortedIndices: Array.from({ length: n }, (_, k) => k),
        pointers: [],
        line: 14,
        description: "No swaps happened in the last pass, so the array is already sorted. Exiting early.",
      });
      return steps;
    }
  }

  steps.push({
    type: "done",
    array: [...arr],
    compareIndices: [],
    sortedIndices: Array.from({ length: n }, (_, k) => k),
    pointers: [],
    line: 15,
    description: "Bubble Sort complete! Every element is now in its correct sorted position.",
  });

  return steps;
}

export const bubbleSortJavaCode = `public void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`;