import { Link } from "react-router";
import { dsaProblems, dsaCategories } from "../../constants/dsa-problems";
import { requireAuth, getCookie } from "~/lib/session.server";
import type { Route } from "./+types/dsa-report";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Selectify | DSA Report" },
    { name: "description", content: "Your DSA practice completion report and analytics" },
  ];
}

export async function loader({ request }: { request: Request }) {
  await requireAuth(request);
  const token = getCookie(request, "token");

  // Fetch from Python backend
  const [progressRes, goalsRes] = await Promise.all([
    fetch("http://localhost:4000/api/dsa/progress", {
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetch("http://localhost:4000/api/dsa/goals", {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ]);

  let progressMap: Record<string, { status: string; isCorrect: boolean }> = {};
  let goals: Array<{ id: string; title: string; category: string | null; difficulty: string | null; targetCount: number }> = [];

  if (progressRes.ok) {
    const data = await progressRes.json();
    progressMap = data.progressMap || {};
  }

  if (goalsRes.ok) {
    const data = await goalsRes.json();
    goals = data.goals || [];
  }

  return { progressMap, goals };
}

export default function DSAReport({ loaderData }: Route.ComponentProps) {
  const { progressMap, goals } = loaderData;

  const allProgress = Object.values(progressMap);
  const solved = allProgress.filter((p) => p.status === "solved" && p.isCorrect);
  const wrong = allProgress.filter((p) => p.status === "solved" && !p.isCorrect);
  const attempted = allProgress.filter((p) => p.status !== "unsolved");
  const accuracy = attempted.length > 0 ? Math.round((solved.length / attempted.length) * 100) : 0;

  const categoryStats = dsaCategories.map((cat) => {
    const catProblems = dsaProblems.filter((p) => p.category === cat);
    const catSolved = catProblems.filter((p) => {
      const prog = progressMap[p.id];
      return prog && prog.status === "solved" && prog.isCorrect;
    });
    return { category: cat, total: catProblems.length, solved: catSolved.length };
  });

  const difficultyStats = (["Easy", "Medium", "Hard"] as const).map((diff) => {
    const diffProblems = dsaProblems.filter((p) => p.difficulty === diff);
    const diffSolved = diffProblems.filter((p) => {
      const prog = progressMap[p.id];
      return prog && prog.status === "solved" && prog.isCorrect;
    });
    const diffWrong = diffProblems.filter((p) => {
      const prog = progressMap[p.id];
      return prog && prog.status === "solved" && !prog.isCorrect;
    });
    return { difficulty: diff, total: diffProblems.length, solved: diffSolved.length, wrong: diffWrong.length };
  });

  const weakAreas = categoryStats
    .filter((c) => c.total > 0)
    .sort((a, b) => (a.solved / a.total) - (b.solved / b.total))
    .slice(0, 3);

  const getDiffColor = (d: string) => {
    if (d === "Easy") return "bg-neon-emerald";
    if (d === "Medium") return "bg-neon-amber";
    return "bg-red-400";
  };

  const getGoalProgress = (goal: typeof goals[0]) => {
    let s = Object.entries(progressMap).filter(([, p]) => p.status === "solved" && p.isCorrect);
    if (goal.category) s = s.filter(([id]) => dsaProblems.find((p) => p.id === id)?.category === goal.category);
    if (goal.difficulty) s = s.filter(([id]) => dsaProblems.find((p) => p.id === id)?.difficulty === goal.difficulty);
    return Math.min(s.length, goal.targetCount);
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto w-full min-h-screen">
      <div className="page-heading mx-auto pt-10 pb-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-text-primary mb-2">📊 DSA Completion Report</h1>
        <h2 className="text-text-secondary">Your practice analytics and progress overview.</h2>
      </div>

      <div className="max-w-5xl mx-auto w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">

        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="glass-panel p-5 text-center">
            <p className="text-3xl font-bold text-neon-blue">{dsaProblems.length}</p>
            <p className="text-text-secondary text-xs mt-1">Total</p>
          </div>
          <div className="glass-panel p-5 text-center">
            <p className="text-3xl font-bold text-neon-emerald">{solved.length}</p>
            <p className="text-text-secondary text-xs mt-1">Correct</p>
          </div>
          <div className="glass-panel p-5 text-center">
            <p className="text-3xl font-bold text-red-400">{wrong.length}</p>
            <p className="text-text-secondary text-xs mt-1">Wrong</p>
          </div>
          <div className="glass-panel p-5 text-center">
            <p className="text-3xl font-bold text-neon-amber">{attempted.length}</p>
            <p className="text-text-secondary text-xs mt-1">Attempted</p>
          </div>
          <div className="glass-panel p-5 text-center">
            <p className="text-3xl font-bold text-neon-purple">{accuracy}%</p>
            <p className="text-text-secondary text-xs mt-1">Accuracy</p>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-bold text-text-primary mb-4">By Difficulty</h3>
          <div className="space-y-4">
            {difficultyStats.map((d) => {
              const pct = d.total > 0 ? Math.round((d.solved / d.total) * 100) : 0;
              return (
                <div key={d.difficulty} className="flex items-center gap-4">
                  <span className={`w-20 text-sm font-bold ${d.difficulty === "Easy" ? "text-neon-emerald" : d.difficulty === "Medium" ? "text-neon-amber" : "text-red-400"}`}>
                    {d.difficulty}
                  </span>
                  <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${getDiffColor(d.difficulty)}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-text-secondary text-sm w-20 text-right font-mono">{d.solved}/{d.total}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-bold text-text-primary mb-4">By Topic</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryStats.map((c) => {
              const pct = c.total > 0 ? Math.round((c.solved / c.total) * 100) : 0;
              return (
                <div key={c.category} className="bg-white/5 border border-glass-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-text-primary">{c.category}</span>
                    <span className="text-xs font-mono text-text-tertiary">{c.solved}/{c.total}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-neon-blue rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Goals Progress */}
        {goals.length > 0 && (
          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold text-text-primary mb-4">🎯 Goal Progress</h3>
            <div className="space-y-3">
              {goals.map((goal) => {
                const progress = getGoalProgress(goal);
                const pct = Math.round((progress / goal.targetCount) * 100);
                const done = pct >= 100;
                return (
                  <div key={goal.id} className={`flex items-center gap-4 p-3 rounded-xl ${done ? "bg-neon-emerald/10 border border-neon-emerald/30" : "bg-white/5 border border-glass-border"}`}>
                    <span className="text-xl">{done ? "🏆" : "🎯"}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary">{goal.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${done ? "bg-neon-emerald" : "bg-neon-blue"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                        <span className="text-xs font-mono text-text-tertiary">{progress}/{goal.targetCount}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Weak Areas */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-bold text-text-primary mb-4">⚡ Areas to Improve</h3>
          {weakAreas.length > 0 ? (
            <div className="space-y-3">
              {weakAreas.map((area) => (
                <div key={area.category} className="flex items-center justify-between bg-white/5 border border-glass-border rounded-xl p-4">
                  <div>
                    <p className="font-medium text-text-primary">{area.category}</p>
                    <p className="text-text-tertiary text-xs mt-0.5">
                      {area.solved}/{area.total} solved ({area.total > 0 ? Math.round((area.solved / area.total) * 100) : 0}%)
                    </p>
                  </div>
                  <Link to={`/dsa-practice`} className="text-neon-blue text-sm hover:underline">Practice →</Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-tertiary text-sm">Start solving problems to see improvement areas.</p>
          )}
        </div>

        {/* Back link */}
        <div className="text-center">
          <Link to="/dsa-practice" className="text-neon-blue hover:underline text-sm font-medium">← Back to Problems</Link>
        </div>
      </div>
    </div>
  );
}
