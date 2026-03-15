import { useEffect, useState } from "react";
import { useNavigate, useParams, useFetcher } from "react-router";
import { dsaProblems } from "../../constants/dsa-problems";
import Editor from "@monaco-editor/react";
import LoadingSpinner from "~/components/LoadingSpinner";
import { requireAuth, getCookie } from "~/lib/session.server";
import type { Route } from "./+types/dsa-problem.$id";

export function meta({ params }: Route.MetaArgs) {
  const problem = dsaProblems.find((p) => p.id === params.id);
  return [
    { title: `Selectify | ${problem?.title || "DSA Problem"}` },
    { name: "description", content: problem?.description?.slice(0, 150) || "Solve DSA problems" },
  ];
}

export async function loader({ request, params }: { request: Request; params: { id: string } }) {
  await requireAuth(request);
  const token = getCookie(request, "token");

  // Fetch from Python backend
  const res = await fetch("http://localhost:8000/api/dsa/progress", {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  let previousProgress = null;
  if (res.ok) {
    const data = await res.json();
    const map = data.progressMap || {};
    previousProgress = map[params.id] || null;
  }
  
  return { previousProgress };
}

export async function action({ request, params }: { request: Request; params: { id: string } }) {
  await requireAuth(request);
  const token = getCookie(request, "token");
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "saveProgress") {
    const isCorrect = formData.get("isCorrect") === "true";
    const submittedCode = formData.get("code") as string;
    const language = formData.get("language") as string;
    const aiReview = formData.get("aiReview") as string;

    await fetch("http://localhost:8000/api/dsa/progress", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        problemId: params.id,
        isCorrect,
        submittedCode,
        language,
        aiReview,
      }),
    });
    return Response.json({ success: true });
  }

  return Response.json({ error: "Unknown intent" }, { status: 400 });
}

export default function DSAProblem({ loaderData }: Route.ComponentProps) {
  const { previousProgress } = loaderData;
  const { id } = useParams();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const saveFetcher = useFetcher();

  const problem = dsaProblems.find((p) => p.id === id);

  const [language, setLanguage] = useState(previousProgress?.language || "javascript");
  const [code, setCode] = useState(previousProgress?.submittedCode || problem?.starterCode?.javascript || "");
  const [showHints, setShowHints] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    if (!previousProgress || previousProgress.language !== lang) {
      setCode(problem?.starterCode?.[lang] || "");
    }
  };

  // Handle AI evaluation response and save progress
  useEffect(() => {
    if (fetcher.data && (fetcher.data as any).success) {
      const evalData = (fetcher.data as any).data;
      setEvaluation(evalData);

      // Save progress to database
      const formData = new FormData();
      formData.append("intent", "saveProgress");
      formData.append("isCorrect", evalData.isCorrect.toString());
      formData.append("code", code);
      formData.append("language", language);
      formData.append("aiReview", evalData.explanation || "");
      saveFetcher.submit(formData, { method: "post" });
    }
  }, [fetcher.data]);

  const isSubmitting = fetcher.state !== "idle";

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-panel p-8 text-center">
          <p className="text-text-primary text-lg mb-4">Problem not found</p>
          <button onClick={() => navigate("/dsa-practice")} className="primary-button">← Back to Problems</button>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (d: string) => {
    if (d === "Easy") return "text-neon-emerald bg-neon-emerald/10 border-neon-emerald/30";
    if (d === "Medium") return "text-neon-amber bg-neon-amber/10 border-neon-amber/30";
    return "text-red-400 bg-red-400/10 border-red-400/30";
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto w-full min-h-screen">
      {/* Header */}
      <div className="pt-6 pb-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate("/dsa-practice")} className="text-text-secondary hover:text-text-primary transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-text-primary">{problem.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${getDifficultyColor(problem.difficulty)}`}>{problem.difficulty}</span>
              <span className="text-text-tertiary text-sm">{problem.category}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Split View */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">

        {/* Left Panel - Problem Description */}
        <div className="glass-panel p-6 flex flex-col gap-6 overflow-auto max-h-[75vh]">
          <div>
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">Description</h3>
            <div className="text-text-primary leading-relaxed whitespace-pre-wrap text-sm">{problem.description}</div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">Examples</h3>
            {problem.examples.map((ex, i) => (
              <div key={i} className="bg-dark-surface/50 border border-glass-border rounded-xl p-4 mb-3">
                <p className="text-xs text-text-tertiary mb-1">Example {i + 1}:</p>
                <p className="text-sm text-text-primary"><strong>Input:</strong> <code className="bg-white/10 px-1 rounded">{ex.input}</code></p>
                <p className="text-sm text-text-primary mt-1"><strong>Output:</strong> <code className="bg-white/10 px-1 rounded">{ex.output}</code></p>
                {ex.explanation && <p className="text-sm text-text-secondary mt-1"><strong>Explanation:</strong> {ex.explanation}</p>}
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">Constraints</h3>
            <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
              {problem.constraints.map((c, i) => <li key={i}><code className="bg-white/10 px-1 rounded text-text-primary text-xs">{c}</code></li>)}
            </ul>
          </div>

          {/* Hints */}
          <div>
            <button onClick={() => setShowHints(!showHints)} className="text-neon-amber text-sm font-medium flex items-center gap-2 hover:underline">
              💡 {showHints ? "Hide Hints" : `Show Hints (${problem.hints.length})`}
            </button>
            {showHints && (
              <div className="mt-3 flex flex-col gap-2 animate-in fade-in duration-300">
                {problem.hints.map((h, i) => (
                  <div key={i} className="bg-neon-amber/5 border border-neon-amber/20 rounded-xl p-3 text-sm text-text-secondary">
                    <span className="text-neon-amber font-bold">Hint {i + 1}:</span> {h}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="flex flex-col gap-4">
          {/* Language Selector */}
          <div className="flex items-center gap-3">
            {Object.keys(problem.starterCode).map((lang) => (
              <button key={lang} onClick={() => handleLanguageChange(lang)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${language === lang ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/40" : "bg-white/5 text-text-secondary border border-glass-border hover:bg-white/10"}`}>
                {lang === "cpp" ? "C++" : lang}
              </button>
            ))}
          </div>

          {/* Editor */}
          <div className="glass-panel overflow-hidden rounded-xl" style={{ height: "400px" }}>
            <Editor
              height="100%"
              language={language === "cpp" ? "cpp" : language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                wordWrap: "on",
                automaticLayout: true,
              }}
            />
          </div>

          {/* Submit */}
          <fetcher.Form method="post" action="/api/evaluate-dsa">
            <input type="hidden" name="code" value={code} />
            <input type="hidden" name="language" value={language} />
            <input type="hidden" name="problemTitle" value={problem.title} />
            <input type="hidden" name="problemDescription" value={problem.description} />
            <input type="hidden" name="examples" value={JSON.stringify(problem.examples)} />
            <button type="submit" disabled={isSubmitting || !code.trim()} className="primary-button w-full group">
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2"><LoadingSpinner size="sm" /> Evaluating...</span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Submit Solution
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </span>
              )}
            </button>
          </fetcher.Form>

          {/* Evaluation Result */}
          {evaluation && (
            <div className={`glass-panel p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 border-l-4 ${evaluation.isCorrect ? "border-l-neon-emerald" : "border-l-red-400"}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{evaluation.isCorrect ? "✅" : "❌"}</span>
                <div>
                  <p className={`text-lg font-bold ${evaluation.isCorrect ? "text-neon-emerald" : "text-red-400"}`}>
                    {evaluation.isCorrect ? "Correct!" : "Not Quite Right"}
                  </p>
                  <p className="text-text-tertiary text-xs">
                    Time: {evaluation.timeComplexity} · Space: {evaluation.spaceComplexity}
                  </p>
                </div>
              </div>

              <p className="text-sm text-text-secondary leading-relaxed mb-4">{evaluation.explanation}</p>

              {evaluation.suggestions?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Suggestions</p>
                  <ul className="space-y-1">
                    {evaluation.suggestions.map((s: string, i: number) => (
                      <li key={i} className="text-sm text-text-tertiary flex items-start gap-2">
                        <span className="text-neon-blue mt-0.5">→</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 flex items-center gap-2 text-xs text-text-tertiary">
                <span>Edge Cases: {evaluation.edgeCasesCovered ? "✅ Covered" : "⚠️ Some missing"}</span>
              </div>
            </div>
          )}

          {/* Error */}
          {fetcher.data && !(fetcher.data as any).success && (
            <div className="glass-panel p-4 border-l-4 border-l-red-400">
              <p className="text-red-400 text-sm">{(fetcher.data as any).error || "Something went wrong. Please try again."}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
