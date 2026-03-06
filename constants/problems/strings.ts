export const stringsProblems: DSAProblem[] = [
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
  }
];
