import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useSearchParams, useFetcher } from "react-router";
import LoadingSpinner from "~/components/LoadingSpinner";
import { requireAuth, getCookie } from "~/lib/session.server";
import type { Route } from "./+types/mock-session";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Selectify | Mock Session" },
    { name: "description", content: "Live timed mock interview session" },
  ];
}

export async function loader({ request }: { request: Request }) {
  const userId = await requireAuth(request);
  return { userId };
}

export async function action({ request }: { request: Request }) {
  await requireAuth(request);
  const token = getCookie(request, "token");
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "saveSession") {
    const type = formData.get("type") as string;
    const difficulty = formData.get("difficulty") as string;
    const targetRole = formData.get("targetRole") as string;
    const overallScore = parseFloat(formData.get("overallScore") as string);
    const questionsData = formData.get("questionsData") as string;
    const answersData = formData.get("answersData") as string;
    const evaluationsData = formData.get("evaluationsData") as string;

    await fetch("http://localhost:8000/api/mock-interviews", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
        difficulty,
        targetRole,
        overallScore,
        questionsData,
        answersData,
        evaluationsData,
      }),
    });

    return Response.json({ success: true });
  }

  return Response.json({ error: "Unknown intent" }, { status: 400 });
}

interface MockQuestion {
  id: string;
  question: string;
  type: string;
  difficulty: string;
}

interface MockAnswer {
  questionId: string;
  answer: string;
  timeSpent: number;
}

interface MockEvaluation {
  questionId: string;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export default function MockSession() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const questionFetcher = useFetcher();
  const answerFetcher = useFetcher();
  const saveFetcher = useFetcher();

  const type = searchParams.get("type") || "Technical";
  const difficulty = searchParams.get("difficulty") || "Medium";
  const count = parseInt(searchParams.get("count") || "5");
  const timeLimit = parseInt(searchParams.get("time") || "300");
  const targetRole = searchParams.get("role") || "Software Engineer";

  const [phase, setPhase] = useState<"loading" | "active" | "reviewing" | "complete">("loading");
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [answers, setAnswers] = useState<MockAnswer[]>([]);
  const [evaluations, setEvaluations] = useState<MockEvaluation[]>([]);
  const [currentEval, setCurrentEval] = useState<MockEvaluation | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate questions on mount
  useEffect(() => {
    const formData = new FormData();
    formData.append("type", type);
    formData.append("difficulty", difficulty);
    formData.append("count", count.toString());
    formData.append("targetRole", targetRole);
    questionFetcher.submit(formData, { method: "post", action: "/api/generate-questions" });
  }, []);

  // Handle question generation response
  useEffect(() => {
    if (questionFetcher.data && (questionFetcher.data as any).success) {
      const qs = (questionFetcher.data as any).data as MockQuestion[];
      setQuestions(qs);
      setPhase("active");
      setTimeRemaining(timeLimit);
    }
  }, [questionFetcher.data]);

  // Timer
  useEffect(() => {
    if (phase !== "active") return;
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmitAnswer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, currentIndex]);

  // Handle answer evaluation response
  useEffect(() => {
    if (answerFetcher.data && (answerFetcher.data as any).success) {
      const evalData = (answerFetcher.data as any).data as MockEvaluation;
      const evalWithId = { ...evalData, questionId: questions[currentIndex]?.id || "" };
      setCurrentEval(evalWithId);
      setEvaluations((prev) => [...prev, evalWithId]);
      setPhase("reviewing");
    }
  }, [answerFetcher.data]);

  const handleSubmitAnswer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const elapsed = timeLimit - timeRemaining;
    const newAnswer: MockAnswer = {
      questionId: questions[currentIndex]?.id || "",
      answer: answer || "(No answer provided)",
      timeSpent: elapsed,
    };
    setAnswers((prev) => [...prev, newAnswer]);

    const formData = new FormData();
    formData.append("question", questions[currentIndex]?.question || "");
    formData.append("answer", answer || "(No answer provided)");
    formData.append("questionType", questions[currentIndex]?.type || type);
    answerFetcher.submit(formData, { method: "post", action: "/api/evaluate-mock" });
  }, [answer, currentIndex, questions, timeLimit, timeRemaining, type]);

  const handleNextQuestion = () => {
    setCurrentEval(null);
    if (currentIndex + 1 >= questions.length) {
      finishSession();
    } else {
      setCurrentIndex((prev) => prev + 1);
      setAnswer("");
      setTimeRemaining(timeLimit);
      setPhase("active");
    }
  };

  const finishSession = () => {
    setPhase("complete");
    const overall = evaluations.length > 0
      ? evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length
      : 0;

    // Save session to database
    const formData = new FormData();
    formData.append("intent", "saveSession");
    formData.append("type", type);
    formData.append("difficulty", difficulty);
    formData.append("targetRole", targetRole);
    formData.append("overallScore", (Math.round(overall * 10) / 10).toString());
    formData.append("questionsData", JSON.stringify(questions));
    formData.append("answersData", JSON.stringify(answers));
    formData.append("evaluationsData", JSON.stringify(evaluations));
    saveFetcher.submit(formData, { method: "post" });
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const overallScore = evaluations.length > 0
    ? (evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length).toFixed(1)
    : "0";
  const scoreColor = parseFloat(overallScore) >= 7 ? "text-neon-emerald" : parseFloat(overallScore) >= 4 ? "text-neon-amber" : "text-red-400";

  // Loading state
  if (phase === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-panel p-12 text-center animate-in fade-in duration-500">
          <LoadingSpinner size="lg" />
          <p className="text-text-primary font-medium mt-4">Generating interview questions...</p>
          <p className="text-text-tertiary text-sm mt-1">{type} · {difficulty} · {count} questions</p>
        </div>
      </div>
    );
  }

  // Complete state
  if (phase === "complete") {
    return (
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto w-full min-h-screen">
        <div className="page-heading mx-auto pt-10 pb-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-text-primary mb-2">Session Complete! 🎉</h1>
          <h2 className="text-text-secondary">{type} Interview · {difficulty}</h2>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          <div className="glass-panel p-8 text-center">
            <p className={`text-6xl font-bold ${scoreColor}`}>{overallScore}</p>
            <p className="text-text-secondary mt-2">Overall Score (out of 10)</p>
          </div>

          <div className="flex flex-col gap-4">
            {questions.map((q, i) => {
              const ev = evaluations[i];
              const ans = answers[i];
              const sc = ev?.score || 0;
              const color = sc >= 7 ? "border-l-neon-emerald" : sc >= 4 ? "border-l-neon-amber" : "border-l-red-400";
              return (
                <div key={i} className={`glass-panel p-6 border-l-4 ${color}`}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="text-xs text-text-tertiary uppercase tracking-wider mb-1">Question {i + 1}</p>
                      <p className="text-text-primary font-medium">{q.question}</p>
                    </div>
                    <span className={`text-xl font-bold shrink-0 ${sc >= 7 ? "text-neon-emerald" : sc >= 4 ? "text-neon-amber" : "text-red-400"}`}>
                      {sc}/10
                    </span>
                  </div>
                  {ans && (
                    <div className="bg-white/5 border border-glass-border rounded-xl p-3 mb-3">
                      <p className="text-xs text-text-tertiary mb-1">Your Answer ({formatTime(ans.timeSpent)})</p>
                      <p className="text-sm text-text-secondary">{ans.answer}</p>
                    </div>
                  )}
                  {ev && (
                    <div className="text-sm text-text-secondary">
                      <p className="mb-2">{ev.feedback}</p>
                      {ev.strengths?.length > 0 && (
                        <div className="mb-1">
                          <span className="text-neon-emerald font-medium text-xs">Strengths: </span>
                          <span className="text-xs text-text-tertiary">{ev.strengths.join(", ")}</span>
                        </div>
                      )}
                      {ev.improvements?.length > 0 && (
                        <div>
                          <span className="text-neon-amber font-medium text-xs">Improve: </span>
                          <span className="text-xs text-text-tertiary">{ev.improvements.join(", ")}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <button onClick={() => navigate("/mock-interview")} className="px-6 py-3 rounded-xl border border-glass-border text-text-secondary hover:bg-white/5 transition-colors">
              ← Back to Hub
            </button>
            <button onClick={() => window.location.reload()} className="primary-button">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active / Reviewing state
  const currentQ = questions[currentIndex];
  const timerPct = (timeRemaining / timeLimit) * 100;
  const timerColor = timerPct > 50 ? "bg-neon-emerald" : timerPct > 20 ? "bg-neon-amber" : "bg-red-400";

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto w-full min-h-screen">
      <div className="max-w-4xl mx-auto pt-6 flex flex-col gap-6">

        {/* Progress Bar */}
        <div className="flex items-center gap-4 animate-in fade-in duration-300">
          <span className="text-text-tertiary text-sm font-mono">Q{currentIndex + 1}/{questions.length}</span>
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-neon-blue rounded-full transition-all duration-300" style={{ width: `${((currentIndex + (phase === "reviewing" ? 1 : 0)) / questions.length) * 100}%` }} />
          </div>
          <span className="text-text-tertiary text-xs">{type} · {difficulty}</span>
        </div>

        {/* Timer */}
        {phase === "active" && (
          <div className="flex items-center gap-3 animate-in fade-in duration-300">
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 ${timerColor}`} style={{ width: `${timerPct}%` }} />
            </div>
            <span className={`font-mono font-bold text-sm ${timerPct <= 20 ? "text-red-400 animate-pulse" : "text-text-secondary"}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        )}

        {/* Question Card */}
        <div className="glass-panel p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold text-neon-blue uppercase tracking-wider">{currentQ?.type} Question</span>
            <span className="text-text-tertiary text-xs">·</span>
            <span className="text-text-tertiary text-xs">{currentQ?.difficulty}</span>
          </div>
          <p className="text-lg font-medium text-text-primary leading-relaxed">{currentQ?.question}</p>
        </div>

        {/* Answer Area */}
        {phase === "active" && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <textarea
              className="w-full h-48 bg-dark-surface/50 border border-glass-border rounded-xl p-4 text-text-primary placeholder-text-tertiary focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-colors resize-none"
              placeholder="Type your answer here... Be detailed and structured."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              autoFocus
            />
            <div className="flex items-center justify-between">
              <span className="text-text-tertiary text-xs">{answer.length} characters</span>
              <button
                onClick={handleSubmitAnswer}
                disabled={answerFetcher.state !== "idle"}
                className="primary-button group"
              >
                {answerFetcher.state !== "idle" ? (
                  <span className="flex items-center gap-2"><LoadingSpinner size="sm" /> Evaluating...</span>
                ) : (
                  <span className="flex items-center gap-2">
                    Submit Answer
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Review / Evaluation */}
        {phase === "reviewing" && currentEval && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={`glass-panel p-6 border-l-4 ${currentEval.score >= 7 ? "border-l-neon-emerald" : currentEval.score >= 4 ? "border-l-neon-amber" : "border-l-red-400"}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-3xl font-bold ${currentEval.score >= 7 ? "text-neon-emerald" : currentEval.score >= 4 ? "text-neon-amber" : "text-red-400"}`}>
                  {currentEval.score}/10
                </span>
                <div>
                  <p className="text-text-primary font-medium">
                    {currentEval.score >= 7 ? "Great answer!" : currentEval.score >= 4 ? "Decent answer" : "Needs improvement"}
                  </p>
                </div>
              </div>
              <p className="text-sm text-text-secondary mb-4">{currentEval.feedback}</p>

              {currentEval.strengths?.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-bold text-neon-emerald uppercase tracking-wider mb-1">Strengths</p>
                  <ul className="space-y-1">
                    {currentEval.strengths.map((s, i) => <li key={i} className="text-sm text-text-secondary flex items-start gap-2"><span className="text-neon-emerald">✓</span> {s}</li>)}
                  </ul>
                </div>
              )}
              {currentEval.improvements?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-neon-amber uppercase tracking-wider mb-1">Areas to Improve</p>
                  <ul className="space-y-1">
                    {currentEval.improvements.map((s, i) => <li key={i} className="text-sm text-text-secondary flex items-start gap-2"><span className="text-neon-amber">→</span> {s}</li>)}
                  </ul>
                </div>
              )}
            </div>

            <button onClick={handleNextQuestion} className="primary-button w-full">
              {currentIndex + 1 >= questions.length ? "Finish Session →" : "Next Question →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
