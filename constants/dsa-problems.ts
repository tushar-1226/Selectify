import { arraysProblems } from "./problems/arrays";
import { stringsProblems } from "./problems/strings";
import { linkedListsProblems } from "./problems/linked-lists";
import { treesProblems } from "./problems/trees";
import { dpProblems } from "./problems/dp";
import { graphsProblems } from "./problems/graphs";
import { stackProblems } from "./problems/stack";
import { binarySearchProblems } from "./problems/binary-search";

export const dsaProblems: DSAProblem[] = [
  ...arraysProblems,
  ...stringsProblems,
  ...linkedListsProblems,
  ...treesProblems,
  ...dpProblems,
  ...graphsProblems,
  ...stackProblems,
  ...binarySearchProblems,
];

export const dsaCategories = [
  "Arrays", // Legacy, to support current arrays.ts category
  "Strings", // Legacy
  "Linked Lists",
  "Trees",
  "Dynamic Programming", // Legacy
  "Graphs",
  "Stack",
  "Binary Search",
  "Arrays & Hashing",
  "Two Pointers",
  "Sliding Window",
  "Heaps / Priority Queue",
  "Backtracking",
  "Advanced Graphs",
  "1-D Dynamic Programming",
  "2-D Dynamic Programming",
  "Greedy Algorithms",
  "Intervals",
  "Math & Geometry",
  "Bit Manipulation",
];
