export const treesProblems: DSAProblem[] = [
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
  }
];
