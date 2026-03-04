import { useState, type FormEvent } from "react";
import { useFetcher } from "react-router";
import type { Route } from "./+types/interview-prep";
import LoadingSpinner from "~/components/LoadingSpinner";
import { requireAuth } from "~/lib/session.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Selectify | Interview Prep" },
    { name: "description", content: "Generate custom interview questions and tips based on your resume" },
  ];
}

export async function loader({ request }: { request: Request }) {
  await requireAuth(request);
  return {};
}

interface GeneratedQuestion {
  id: string;
  question: string;
  type: string;
  difficulty: string;
}

const InterviewPrep = () => {
  const fetcher = useFetcher();
  const answerFetcher = useFetcher();

  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [answerText, setAnswerText] = useState<Record<string, string>>({});
  const [savedQuestions, setSavedQuestions] = useState<string[]>([]);
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  const [evaluations, setEvaluations] = useState<Record<string, { score: number; feedback: string; strengths: string[]; improvements: string[] }>>({});

  // Handle question generation response
  if (fetcher.data && (fetcher.data as any).success && !hasGenerated) {
    setQuestions((fetcher.data as any).data);
    setHasGenerated(true);
  }

  // Handle answer evaluation response
  if (answerFetcher.data && (answerFetcher.data as any).success && evaluatingId) {
    setEvaluations((prev) => ({
      ...prev,
      [evaluatingId]: (answerFetcher.data as any).data,
    }));
    setEvaluatingId(null);
  }

  const handleGenerate = (e: FormEvent) => {
    e.preventDefault();
    setHasGenerated(false);
    const formData = new FormData(e.target as HTMLFormElement);
    fetcher.submit(formData, { method: "post", action: "/api/generate-questions" });
  };

  const handleEvaluateAnswer = (questionId: string, question: string, questionType: string) => {
    const text = answerText[questionId];
    if (!text?.trim()) return;
    setEvaluatingId(questionId);
    const formData = new FormData();
    formData.append("question", question);
    formData.append("answer", text);
    formData.append("questionType", questionType);
    answerFetcher.submit(formData, { method: "post", action: "/api/evaluate-mock" });
  };

  const handleSaveQuestion = (qId: string) => {
    setSavedQuestions((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  const isGenerating = fetcher.state !== "idle";

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto w-full min-h-screen">
      <div className="page-heading mx-auto pt-10 pb-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-text-primary mb-2">Interview Preparation</h1>
        <h2 className="text-text-secondary">Generate tailored interview questions and practice your answers with AI feedback.</h2>
      </div>

      <div className="max-w-4xl mx-auto w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
        {/* Configuration Panel */}
        <div className="glass-panel p-8">
          <form onSubmit={handleGenerate} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-div">
                <label htmlFor="targetRole">Target Role</label>
                <input id="targetRole" name="targetRole" type="text" placeholder="e.g., Senior Frontend Engineer" defaultValue="Senior Frontend Engineer" required />
              </div>
              <div className="form-div">
                <label htmlFor="type">Question Type</label>
                <select id="type" name="type" className="bg-dark-surface/50 border border-glass-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-colors appearance-none" required>
                  <option value="Technical">Technical</option>
                  <option value="Behavioral">Behavioral / Cultural</option>
                  <option value="System Design">System Design</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-div">
                <label htmlFor="difficulty">Difficulty</label>
                <select id="difficulty" name="difficulty" className="bg-dark-surface/50 border border-glass-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-colors appearance-none">
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div className="form-div">
                <label htmlFor="count">Number of Questions</label>
                <select id="count" name="count" className="bg-dark-surface/50 border border-glass-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-colors appearance-none">
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="8">8</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button type="submit" className="primary-button group w-full md:w-auto" disabled={isGenerating}>
                {isGenerating ? (
                  <span className="flex items-center gap-2"><LoadingSpinner size="sm" /> Generating...</span>
                ) : (
                  <span className="flex items-center gap-2">
                    Generate Questions
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Error */}
        {fetcher.data && !(fetcher.data as any).success && (
          <div className="glass-panel p-4 border-l-4 border-l-red-400">
            <p className="text-red-400 text-sm">{(fetcher.data as any).error || "Failed to generate questions."}</p>
          </div>
        )}

        {/* Generated Results */}
        {hasGenerated && questions.length > 0 && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-2 px-2">
              <div className="w-2 h-2 rounded-full bg-neon-emerald"></div>
              <h3 className="text-xl font-bold text-text-primary uppercase tracking-widest text-sm">Generated Practice Questions</h3>
            </div>

            {questions.map((q, i) => {
              const ev = evaluations[q.id];
              return (
                <div key={q.id || i} className="glass-panel p-6 flex flex-col gap-4 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-neon-blue/50 group-hover:bg-neon-blue transition-colors"></div>

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-neon-blue uppercase tracking-wider mb-2 block">{q.type} Question</span>
                      <p className="text-lg font-medium text-text-primary leading-relaxed">"{q.question}"</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleSaveQuestion(q.id)}
                        className={`p-2 rounded-lg transition-colors border ${savedQuestions.includes(q.id) ? "bg-neon-blue/10 border-neon-blue/40 text-neon-blue" : "bg-white/5 hover:bg-white/10 border-glass-border text-text-secondary hover:text-text-primary"}`}
                        title="Save Question"
                      >
                        <svg className="w-5 h-5" fill={savedQuestions.includes(q.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Answer Area */}
                  <div className="mt-2">
                    <textarea
                      className="w-full h-28 bg-dark-surface/50 border border-glass-border rounded-xl p-3 text-text-primary text-sm placeholder-text-tertiary focus:outline-none focus:border-neon-blue transition-colors resize-none"
                      placeholder="Type your answer here to get AI feedback..."
                      value={answerText[q.id] || ""}
                      onChange={(e) => setAnswerText((prev) => ({ ...prev, [q.id]: e.target.value }))}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => handleEvaluateAnswer(q.id, q.question, q.type)}
                        disabled={!answerText[q.id]?.trim() || (evaluatingId === q.id)}
                        className="px-4 py-2 rounded-lg bg-neon-blue/10 text-neon-blue border border-neon-blue/30 text-sm font-medium hover:bg-neon-blue/20 transition-colors disabled:opacity-50"
                      >
                        {evaluatingId === q.id ? <span className="flex items-center gap-2"><LoadingSpinner size="sm" /> Evaluating...</span> : "Get AI Feedback"}
                      </button>
                    </div>
                  </div>

                  {/* Evaluation */}
                  {ev && (
                    <div className={`bg-dark-surface/50 border rounded-xl p-4 mt-1 ${ev.score >= 7 ? "border-neon-emerald/30" : ev.score >= 4 ? "border-neon-amber/30" : "border-red-400/30"}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-lg font-bold ${ev.score >= 7 ? "text-neon-emerald" : ev.score >= 4 ? "text-neon-amber" : "text-red-400"}`}>{ev.score}/10</span>
                        <span className="text-sm text-text-secondary">AI Score</span>
                      </div>
                      <p className="text-sm text-text-secondary">{ev.feedback}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewPrep;
