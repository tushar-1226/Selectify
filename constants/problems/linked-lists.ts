export const linkedListsProblems: DSAProblem[] = [
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
  }
];
