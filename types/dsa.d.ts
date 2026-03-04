// ── DSA Problem Bank ──
interface DSAProblem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  starterCode: Record<string, string>;
  hints: string[];
}

// ── User Progress ──
interface DSAProgress {
  problemId: string;
  status: "unsolved" | "attempted" | "solved";
  isCorrect: boolean;
  submittedCode: string;
  language: string;
  aiReview: string;
  submittedAt: string;
}

interface DSAGoal {
  id: string;
  title: string;
  targetCount: number;
  currentCount: number;
  category?: string;
  difficulty?: string;
  deadline?: string;
  createdAt: string;
}

// ── AI Evaluation ──
interface DSAEvaluation {
  isCorrect: boolean;
  explanation: string;
  timeComplexity: string;
  spaceComplexity: string;
  suggestions: string[];
  edgeCasesCovered: boolean;
}

// ── Mock Interview ──
interface MockQuestion {
  id: string;
  question: string;
  type: "Technical" | "Behavioral" | "System Design";
  difficulty: "Easy" | "Medium" | "Hard";
}

interface MockAnswer {
  questionId: string;
  answer: string;
  timeSpent: number; // seconds
}

interface MockEvaluation {
  questionId: string;
  score: number; // 0-10
  feedback: string;
  strengths: string[];
  improvements: string[];
}

interface MockSession {
  id: string;
  type: "Technical" | "Behavioral" | "System Design" | "Mixed";
  difficulty: "Easy" | "Medium" | "Hard";
  questions: MockQuestion[];
  answers: MockAnswer[];
  evaluations: MockEvaluation[];
  overallScore: number;
  startedAt: string;
  completedAt?: string;
}
