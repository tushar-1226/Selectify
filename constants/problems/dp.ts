export const dpProblems: DSAProblem[] = [
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
  }
];
