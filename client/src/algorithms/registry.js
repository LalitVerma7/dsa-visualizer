import { generateBubbleSortSteps, bubbleSortJavaCode } from "./bubbleSort.js";
import { generateSelectionSortSteps, selectionSortJavaCode } from "./selectionSort.js";
import { generateInsertionSortSteps, insertionSortJavaCode } from "./insertionSort.js";
import { generateMergeSortSteps, mergeSortJavaCode } from "./mergeSort.js";

// To add a new algorithm in the future:
// 1. Create algorithms/yourAlgorithm.js exporting a generateSteps(array) function + the Java code string.
// 2. Add one entry below. That's it -- Topics grid, routing, and the algorithm page all read from here.
export const CATEGORIES = [
  {
    id: "sorting",
    name: "Sorting",
    tagline: "Put things in order, one comparison at a time",
    icon: "bars",
  },
  {
    id: "searching",
    name: "Searching",
    tagline: "Find a needle in the array haystack",
    icon: "search",
  },
  {
    id: "trees",
    name: "Trees",
    tagline: "Branch out into hierarchical structures",
    icon: "tree",
  },
  {
    id: "graphs",
    name: "Graphs",
    tagline: "Model networks and traverse connections",
    icon: "graph",
  },
  {
    id: "dp",
    name: "Dynamic Programming",
    tagline: "Break problems down, remember the answers",
    icon: "layers",
  },
];

export const ALGORITHMS = [
  {
    slug: "bubble-sort",
    name: "Bubble Sort",
    category: "sorting",
    difficulty: "Beginner",
    implemented: true,
    summary: "Repeatedly swap adjacent out-of-order elements until the array is sorted.",
    explanation: [
      "Bubble Sort is the classic first-sorting-algorithm every DSA journey starts with. It gets its name from the way larger elements \u2018bubble up\u2019 to the end of the array with every pass.",
      "The algorithm walks through the array comparing each pair of neighbouring elements. If the left element is bigger than the right one, they get swapped. One full walk through the array is called a \u2018pass\u2019 \u2014 and after each pass, the next-largest unsorted element is guaranteed to land in its correct final position.",
      "This repeats for up to n-1 passes. A simple but important optimization: if an entire pass completes with zero swaps, the array is already sorted and the algorithm can stop early.",
    ],
    complexity: {
      time: {
        best: "O(n)",
        average: "O(n\u00b2)",
        worst: "O(n\u00b2)",
      },
      space: "O(1)",
      stable: true,
      inPlace: true,
    },
    complexityNotes:
      "The best case O(n) happens on an already-sorted array thanks to the early-exit optimization \u2014 a single pass finds no swaps and stops. Without that optimization, Bubble Sort is always O(n\u00b2), which is why it's rarely used in production for large datasets, but it's an excellent starting point for learning how comparison-based sorting works.",
    javaCode: bubbleSortJavaCode,
    generateSteps: generateBubbleSortSteps,
    defaultArray: [64, 34, 25, 12, 22, 11, 90],
  },
  {
    slug: "selection-sort",
    name: "Selection Sort",
    category: "sorting",
    difficulty: "Beginner",
    implemented: true,
    summary: "Repeatedly find the minimum of the unsorted portion and move it to the front.",
    explanation: [
      "Selection Sort splits the array into a sorted portion (at the front) and an unsorted portion (the rest). On every pass, it scans the entire unsorted portion to find the smallest value.",
      "Once found, that minimum is swapped with the first element of the unsorted portion \u2014 growing the sorted portion by one and shrinking the unsorted portion by one.",
      "This repeats until only one element is left, which is automatically in its correct place. Unlike Bubble Sort, Selection Sort always does exactly one swap per pass, no matter how unsorted the input is.",
    ],
    complexity: {
      time: {
        best: "O(n\u00b2)",
        average: "O(n\u00b2)",
        worst: "O(n\u00b2)",
      },
      space: "O(1)",
      stable: false,
      inPlace: true,
    },
    complexityNotes:
      "Selection Sort always scans the full remaining unsorted portion to find the minimum, so its runtime is O(n\u00b2) in every case \u2014 best, average, and worst \u2014 unlike Bubble Sort which can finish early on nearly-sorted input. Its one advantage: it performs at most n-1 swaps total, which makes it useful when writes are expensive (e.g. flash memory) even though comparisons are still O(n\u00b2).",
    javaCode: selectionSortJavaCode,
    generateSteps: generateSelectionSortSteps,
    defaultArray: [29, 10, 14, 37, 13],
  },
  {
    slug: "insertion-sort",
    name: "Insertion Sort",
    category: "sorting",
    difficulty: "Beginner",
    implemented: true,
    summary: "Grow a sorted portion at the front, inserting each new element into its correct place.",
    explanation: [
      "Insertion Sort works the way most people sort a hand of playing cards: keep the cards you've already looked at sorted, then take the next card and slide it into the correct spot among them.",
      "It starts by treating the first element as a trivially-sorted portion of size one. Then, for each following element (the \u2018key\u2019), it shifts it leftward \u2014 one comparison and swap at a time \u2014 past every element in the sorted portion that's bigger than it, until it lands in the right place.",
      "It's efficient for small or nearly-sorted datasets: if the array is already sorted, each key only needs a single comparison and no shifting at all.",
    ],
    complexity: {
      time: {
        best: "O(n)",
        average: "O(n\u00b2)",
        worst: "O(n\u00b2)",
      },
      space: "O(1)",
      stable: true,
      inPlace: true,
    },
    complexityNotes:
      "The best case O(n) happens on an already-sorted array \u2014 every key is immediately \u2265 its left neighbour, so no shifting ever happens. The worst case (a reverse-sorted array) forces every key to shift all the way to the front, giving O(n\u00b2). This makes Insertion Sort a great choice for small arrays or data that's already mostly sorted, which is why it's often used as the final step inside faster hybrid sorts like Timsort.",
    javaCode: insertionSortJavaCode,
    generateSteps: generateInsertionSortSteps,
    defaultArray: [12, 11, 13, 5, 6],
  },
  {
    slug: "merge-sort",
    name: "Merge Sort",
    category: "sorting",
    difficulty: "Intermediate",
    implemented: true,
    summary: "Divide the array in half recursively, then merge the sorted halves back together.",
    explanation: [
      "Merge Sort is a divide-and-conquer algorithm: it splits the array in half, recursively sorts each half, and then merges the two sorted halves back into one sorted array.",
      "The base case is an array of a single element, which is trivially already sorted. The real work happens in the merge step \u2014 walking two sorted halves side by side, always picking the smaller of the two current elements to place next into the result.",
      "Because every split is roughly in half, the recursion is only log\u2082(n) levels deep, and each level does O(n) work merging \u2014 giving Merge Sort its reliable O(n log n) performance no matter how the input is ordered.",
    ],
    complexity: {
      time: {
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n log n)",
      },
      space: "O(n)",
      stable: true,
      inPlace: false,
    },
    complexityNotes:
      "Unlike Bubble, Selection, and Insertion Sort, Merge Sort's runtime doesn't depend on the input's initial order \u2014 it's always O(n log n), which is why it scales far better to large datasets. The trade-off is space: merging needs a temporary array to hold each half being merged, so it uses O(n) extra memory instead of sorting in place.",
    javaCode: mergeSortJavaCode,
    generateSteps: generateMergeSortSteps,
    defaultArray: [38, 27, 43, 3, 9, 82, 10],
  },
  // ---- Coming soon (visible in the UI as locked/placeholder cards) ----
  { slug: "quick-sort", name: "Quick Sort", category: "sorting", implemented: false, difficulty: "Intermediate" },
  { slug: "linear-search", name: "Linear Search", category: "searching", implemented: false, difficulty: "Beginner" },
  { slug: "binary-search", name: "Binary Search", category: "searching", implemented: false, difficulty: "Beginner" },
  { slug: "bst-traversal", name: "BST Traversal", category: "trees", implemented: false, difficulty: "Intermediate" },
  { slug: "bfs", name: "Breadth-First Search", category: "graphs", implemented: false, difficulty: "Intermediate" },
  { slug: "dfs", name: "Depth-First Search", category: "graphs", implemented: false, difficulty: "Intermediate" },
  { slug: "knapsack", name: "0/1 Knapsack", category: "dp", implemented: false, difficulty: "Advanced" },
];

export const getAlgorithmBySlug = (slug) => ALGORITHMS.find((a) => a.slug === slug);
export const getAlgorithmsByCategory = (categoryId) =>
  ALGORITHMS.filter((a) => a.category === categoryId);