export const binarySearchProblems: DSAProblem[] = [
  {
    id: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    category: "Binary Search",
    description:
      "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
    examples: [
      { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" },
      { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1" },
    ],
    constraints: ["1 <= nums.length <= 10^4", "All integers in nums are unique.", "nums is sorted in ascending order."],
    starterCode: {
      javascript: "function search(nums, target) {\n  // Write your solution here\n}",
      python: "def search(nums, target):\n    # Write your solution here\n    pass",
      cpp: "#include <vector>\nusing namespace std;\n\nint search(vector<int>& nums, int target) {\n    // Write your solution here\n}",
    },
    hints: ["Use two pointers: left and right.", "Compare the middle element with the target and adjust bounds accordingly."],
  },
  {
    id: "search-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    category: "Binary Search",
    description:
      "There is an integer array `nums` sorted in ascending order (with **distinct** values).\n\nPrior to being passed to your function, `nums` is possibly **rotated** at an unknown pivot index `k`.\n\nGiven the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
    examples: [
      { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" },
      { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1" },
    ],
    constraints: ["1 <= nums.length <= 5000", "All values of nums are unique.", "nums may be rotated at some pivot."],
    starterCode: {
      javascript: "function search(nums, target) {\n  // Write your solution here\n}",
      python: "def search(nums, target):\n    # Write your solution here\n    pass",
      cpp: "#include <vector>\nusing namespace std;\n\nint search(vector<int>& nums, int target) {\n    // Write your solution here\n}",
    },
    hints: ["Modified binary search.", "Determine which half is sorted and check if target lies in that half."],
  }
];
