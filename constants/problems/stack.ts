export const stackProblems: DSAProblem[] = [
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
  }
];
