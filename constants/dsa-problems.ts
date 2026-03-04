export const dsaProblems: DSAProblem[] = [
  // ── Arrays ──
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays",
    description:
      "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    ],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "Only one valid answer exists."],
    starterCode: {
      javascript: "function twoSum(nums, target) {\n  // Write your solution here\n}",
      python: "def two_sum(nums, target):\n    # Write your solution here\n    pass",
      cpp: "#include <vector>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Write your solution here\n}",
    },
    hints: ["Try using a hash map to store numbers you've seen.", "For each number, check if target - number exists in the map."],
  },
  {
    id: "best-time-buy-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    category: "Arrays",
    description:
      "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day.\n\nYou want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.",
    examples: [
      { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5." },
      { input: "prices = [7,6,4,3,1]", output: "0", explanation: "No profitable transaction is possible." },
    ],
    constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
    starterCode: {
      javascript: "function maxProfit(prices) {\n  // Write your solution here\n}",
      python: "def max_profit(prices):\n    # Write your solution here\n    pass",
      cpp: "#include <vector>\nusing namespace std;\n\nint maxProfit(vector<int>& prices) {\n    // Write your solution here\n}",
    },
    hints: ["Track the minimum price seen so far.", "At each step, calculate profit if you sell at the current price."],
  },
  {
    id: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "Easy",
    category: "Arrays",
    description:
      "Given an integer array `nums`, return `true` if any value appears **at least twice** in the array, and return `false` if every element is distinct.",
    examples: [
      { input: "nums = [1,2,3,1]", output: "true" },
      { input: "nums = [1,2,3,4]", output: "false" },
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
    starterCode: {
      javascript: "function containsDuplicate(nums) {\n  // Write your solution here\n}",
      python: "def contains_duplicate(nums):\n    # Write your solution here\n    pass",
      cpp: "#include <vector>\nusing namespace std;\n\nbool containsDuplicate(vector<int>& nums) {\n    // Write your solution here\n}",
    },
    hints: ["Use a Set to track seen elements.", "If the Set size differs from array length, there are duplicates."],
  },
  {
    id: "product-except-self",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    category: "Arrays",
    description:
      "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.\n\nThe product of any prefix or suffix of `nums` is **guaranteed** to fit in a 32-bit integer.\n\nYou must write an algorithm that runs in `O(n)` time and without using the division operation.",
    examples: [
      { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" },
      { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]" },
    ],
    constraints: ["2 <= nums.length <= 10^5", "-30 <= nums[i] <= 30", "Product fits in 32-bit integer"],
    starterCode: {
      javascript: "function productExceptSelf(nums) {\n  // Write your solution here\n}",
      python: "def product_except_self(nums):\n    # Write your solution here\n    pass",
      cpp: "#include <vector>\nusing namespace std;\n\nvector<int> productExceptSelf(vector<int>& nums) {\n    // Write your solution here\n}",
    },
    hints: ["Use prefix and suffix products.", "First pass: compute prefix products. Second pass: multiply by suffix products."],
  },
  {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Arrays",
    description:
      "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
      { input: "nums = [1]", output: "1" },
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    starterCode: {
      javascript: "function maxSubArray(nums) {\n  // Write your solution here\n}",
      python: "def max_sub_array(nums):\n    # Write your solution here\n    pass",
      cpp: "#include <vector>\nusing namespace std;\n\nint maxSubArray(vector<int>& nums) {\n    // Write your solution here\n}",
    },
    hints: ["Kadane's Algorithm: track current sum and max sum.", "Reset current sum to 0 whenever it becomes negative."],
  },

  // ── Strings ──
  {
    id: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "Easy",
    category: "Strings",
    description:
      "A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.",
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: "true", explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 's = "race a car"', output: "false" },
    ],
    constraints: ["1 <= s.length <= 2 * 10^5", "s consists only of printable ASCII characters."],
    starterCode: {
      javascript: "function isPalindrome(s) {\n  // Write your solution here\n}",
      python: "def is_palindrome(s):\n    # Write your solution here\n    pass",
      cpp: "#include <string>\nusing namespace std;\n\nbool isPalindrome(string s) {\n    // Write your solution here\n}",
    },
    hints: ["Use two pointers from both ends.", "Skip non-alphanumeric characters and compare lowercase versions."],
  },
  {
    id: "longest-substring-no-repeat",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "Strings",
    description:
      "Given a string `s`, find the length of the **longest substring** without repeating characters.",
    examples: [
      { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: "1" },
      { input: 's = "pwwkew"', output: "3" },
    ],
    constraints: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."],
    starterCode: {
      javascript: "function lengthOfLongestSubstring(s) {\n  // Write your solution here\n}",
      python: "def length_of_longest_substring(s):\n    # Write your solution here\n    pass",
      cpp: "#include <string>\nusing namespace std;\n\nint lengthOfLongestSubstring(string s) {\n    // Write your solution here\n}",
    },
    hints: ["Use a sliding window technique.", "Use a Set or Map to track characters in the current window."],
  },

  // ── Linked Lists ──
  {
    id: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "Easy",
    category: "Linked Lists",
    description:
      "Given the `head` of a singly linked list, reverse the list, and return the reversed list.",
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
      { input: "head = [1,2]", output: "[2,1]" },
    ],
    constraints: ["The number of nodes is in the range [0, 5000].", "-5000 <= Node.val <= 5000"],
    starterCode: {
      javascript: "function reverseList(head) {\n  // Write your solution here\n}",
      python: "def reverse_list(head):\n    # Write your solution here\n    pass",
      cpp: "struct ListNode {\n    int val;\n    ListNode *next;\n    ListNode() : val(0), next(nullptr) {}\n    ListNode(int x) : val(x), next(nullptr) {}\n};\n\nListNode* reverseList(ListNode* head) {\n    // Write your solution here\n}",
    },
    hints: ["Use three pointers: prev, current, next.", "Iterate through the list, reversing the next pointer at each step."],
  },
  {
    id: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    category: "Linked Lists",
    description:
      "You are given the heads of two sorted linked lists `list1` and `list2`.\n\nMerge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.",
    examples: [
      { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" },
      { input: "list1 = [], list2 = []", output: "[]" },
    ],
    constraints: ["Both lists are sorted in non-decreasing order.", "The number of nodes is in the range [0, 50]."],
    starterCode: {
      javascript: "function mergeTwoLists(list1, list2) {\n  // Write your solution here\n}",
      python: "def merge_two_lists(list1, list2):\n    # Write your solution here\n    pass",
      cpp: "ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n    // Write your solution here\n}",
    },
    hints: ["Use a dummy node to build the merged list.", "Compare the values at each step and advance the smaller pointer."],
  },

  // ── Trees ──
  {
    id: "maximum-depth-binary-tree",
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    category: "Trees",
    description:
      "Given the `root` of a binary tree, return its **maximum depth**.\n\nA binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "3" },
      { input: "root = [1,null,2]", output: "2" },
    ],
    constraints: ["The number of nodes is in the range [0, 10^4].", "-100 <= Node.val <= 100"],
    starterCode: {
      javascript: "function maxDepth(root) {\n  // Write your solution here\n}",
      python: "def max_depth(root):\n    # Write your solution here\n    pass",
      cpp: "struct TreeNode {\n    int val;\n    TreeNode *left;\n    TreeNode *right;\n};\n\nint maxDepth(TreeNode* root) {\n    // Write your solution here\n}",
    },
    hints: ["Use recursion: depth = 1 + max(left depth, right depth).", "Base case: if node is null, return 0."],
  },
  {
    id: "validate-bst",
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    category: "Trees",
    description:
      "Given the `root` of a binary tree, determine if it is a valid **binary search tree (BST)**.\n\nA valid BST is defined as follows:\n- The left subtree of a node contains only nodes with keys **less than** the node's key.\n- The right subtree of a node contains only nodes with keys **greater than** the node's key.\n- Both the left and right subtrees must also be binary search trees.",
    examples: [
      { input: "root = [2,1,3]", output: "true" },
      { input: "root = [5,1,4,null,null,3,6]", output: "false", explanation: "The root node's value is 5 but its right child's value is 4." },
    ],
    constraints: ["The number of nodes is in the range [1, 10^4].", "-2^31 <= Node.val <= 2^31 - 1"],
    starterCode: {
      javascript: "function isValidBST(root) {\n  // Write your solution here\n}",
      python: "def is_valid_bst(root):\n    # Write your solution here\n    pass",
      cpp: "bool isValidBST(TreeNode* root) {\n    // Write your solution here\n}",
    },
    hints: ["Use min/max bounds for each node.", "Recursively check: left subtree values < node, right subtree values > node."],
  },

  // ── Dynamic Programming ──
  {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "Dynamic Programming",
    description:
      "You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?",
    examples: [
      { input: "n = 2", output: "2", explanation: "1. 1 step + 1 step  2. 2 steps" },
      { input: "n = 3", output: "3", explanation: "1. 1+1+1  2. 1+2  3. 2+1" },
    ],
    constraints: ["1 <= n <= 45"],
    starterCode: {
      javascript: "function climbStairs(n) {\n  // Write your solution here\n}",
      python: "def climb_stairs(n):\n    # Write your solution here\n    pass",
      cpp: "int climbStairs(int n) {\n    // Write your solution here\n}",
    },
    hints: ["This is a Fibonacci-like sequence.", "dp[i] = dp[i-1] + dp[i-2]"],
  },
  {
    id: "coin-change",
    title: "Coin Change",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description:
      "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the **fewest number of coins** that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.\n\nYou may assume that you have an infinite number of each kind of coin.",
    examples: [
      { input: "coins = [1,5,10], amount = 12", output: "3", explanation: "12 = 10 + 1 + 1" },
      { input: "coins = [2], amount = 3", output: "-1" },
    ],
    constraints: ["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"],
    starterCode: {
      javascript: "function coinChange(coins, amount) {\n  // Write your solution here\n}",
      python: "def coin_change(coins, amount):\n    # Write your solution here\n    pass",
      cpp: "#include <vector>\nusing namespace std;\n\nint coinChange(vector<int>& coins, int amount) {\n    // Write your solution here\n}",
    },
    hints: ["Use bottom-up DP.", "dp[i] = min number of coins to make amount i. Try each coin."],
  },
  {
    id: "longest-increasing-subsequence",
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description:
      "Given an integer array `nums`, return the length of the longest **strictly increasing subsequence**.",
    examples: [
      { input: "nums = [10,9,2,5,3,7,101,18]", output: "4", explanation: "The LIS is [2,3,7,101]." },
      { input: "nums = [0,1,0,3,2,3]", output: "4" },
    ],
    constraints: ["1 <= nums.length <= 2500", "-10^4 <= nums[i] <= 10^4"],
    starterCode: {
      javascript: "function lengthOfLIS(nums) {\n  // Write your solution here\n}",
      python: "def length_of_lis(nums):\n    # Write your solution here\n    pass",
      cpp: "#include <vector>\nusing namespace std;\n\nint lengthOfLIS(vector<int>& nums) {\n    // Write your solution here\n}",
    },
    hints: ["dp[i] = length of LIS ending at index i.", "For each i, check all j < i where nums[j] < nums[i]."],
  },

  // ── Graphs ──
  {
    id: "number-of-islands",
    title: "Number of Islands",
    difficulty: "Medium",
    category: "Graphs",
    description:
      'Given an `m x n` 2D binary grid `grid` which represents a map of `\'1\'`s (land) and `\'0\'`s (water), return the number of islands.\n\nAn **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
    examples: [
      {
        input: 'grid = [\n  ["1","1","1","1","0"],\n  ["1","1","0","1","0"],\n  ["1","1","0","0","0"],\n  ["0","0","0","0","0"]\n]',
        output: "1",
      },
      {
        input: 'grid = [\n  ["1","1","0","0","0"],\n  ["1","1","0","0","0"],\n  ["0","0","1","0","0"],\n  ["0","0","0","1","1"]\n]',
        output: "3",
      },
    ],
    constraints: ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 300", "grid[i][j] is '0' or '1'."],
    starterCode: {
      javascript: "function numIslands(grid) {\n  // Write your solution here\n}",
      python: "def num_islands(grid):\n    # Write your solution here\n    pass",
      cpp: "#include <vector>\nusing namespace std;\n\nint numIslands(vector<vector<char>>& grid) {\n    // Write your solution here\n}",
    },
    hints: ["Use DFS or BFS to traverse connected lands.", "Mark visited cells to avoid counting the same island twice."],
  },

  // ── Stack ──
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack",
    description:
      "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    examples: [
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" },
    ],
    constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'."],
    starterCode: {
      javascript: "function isValid(s) {\n  // Write your solution here\n}",
      python: "def is_valid(s):\n    # Write your solution here\n    pass",
      cpp: "#include <string>\n#include <stack>\nusing namespace std;\n\nbool isValid(string s) {\n    // Write your solution here\n}",
    },
    hints: ["Use a stack to track opening brackets.", "When encountering a closing bracket, check if it matches the top of the stack."],
  },

  // ── Binary Search ──
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
  },

  // ── Hard Problems ──
  {
    id: "merge-k-sorted-lists",
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    category: "Linked Lists",
    description:
      "You are given an array of `k` linked lists `lists`, each linked list is sorted in ascending order.\n\nMerge all the linked lists into one sorted linked list and return it.",
    examples: [
      { input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" },
      { input: "lists = []", output: "[]" },
    ],
    constraints: ["k == lists.length", "0 <= k <= 10^4", "lists[i] is sorted in ascending order."],
    starterCode: {
      javascript: "function mergeKLists(lists) {\n  // Write your solution here\n}",
      python: "def merge_k_lists(lists):\n    # Write your solution here\n    pass",
      cpp: "#include <vector>\nusing namespace std;\n\nListNode* mergeKLists(vector<ListNode*>& lists) {\n    // Write your solution here\n}",
    },
    hints: ["Use a min-heap (priority queue) to always pick the smallest node.", "Alternatively, use divide and conquer to merge pairs of lists."],
  },
  {
    id: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    category: "Arrays",
    description:
      "Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.",
    examples: [
      { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" },
      { input: "height = [4,2,0,3,2,5]", output: "9" },
    ],
    constraints: ["n == height.length", "1 <= n <= 2 * 10^4", "0 <= height[i] <= 10^5"],
    starterCode: {
      javascript: "function trap(height) {\n  // Write your solution here\n}",
      python: "def trap(height):\n    # Write your solution here\n    pass",
      cpp: "#include <vector>\nusing namespace std;\n\nint trap(vector<int>& height) {\n    // Write your solution here\n}",
    },
    hints: ["Use two pointers approach.", "Water at each position = min(max_left, max_right) - height[i]."],
  },
];

export const dsaCategories = [
  "Arrays",
  "Strings",
  "Linked Lists",
  "Trees",
  "Dynamic Programming",
  "Graphs",
  "Stack",
  "Binary Search",
];
