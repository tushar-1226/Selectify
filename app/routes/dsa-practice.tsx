import { useEffect, useState } from "react";
import { Link, useFetcher } from "react-router";
import { dsaProblems, dsaCategories } from "../../constants/dsa-problems";
import { requireAuth } from "~/lib/session.server";
import { prisma } from "~/lib/db.server";
import type { Route } from "./+types/dsa-practice";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Selectify | DSA Practice" },
    { name: "description", content: "LeetCode-style DSA practice with goal tracking and AI evaluation" },
  ];
}

export async function loader({ request }: { request: Request }) {
  const userId = await requireAuth(request);

  const [progressRows, goals] = await Promise.all([
    prisma.dSAProgress.findMany({ where: { userId } }),
    prisma.dSAGoal.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
  ]);

  // Convert progress rows to a map
  const progressMap: Record<string, { status: string; isCorrect: boolean }> = {};
  for (const p of progressRows) {
    progressMap[p.problemId] = { status: p.status, isCorrect: p.isCorrect };
  }

  return { progressMap, goals };
}

export async function action({ request }: { request: Request }) {
  const userId = await requireAuth(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "addGoal") {
    const title = formData.get("title") as string;
    const targetCount = parseInt(formData.get("targetCount") as string) || 5;
    const category = formData.get("category") as string;
    const difficulty = formData.get("difficulty") as string;

    if (!title) return Response.json({ error: "Title is required" }, { status: 400 });

    await prisma.dSAGoal.create({
      data: {
        userId,
        title,
        targetCount,
        category: category === "All" ? null : category,
        difficulty: difficulty === "All" ? null : difficulty,
      },
    });
    return Response.json({ success: true });
  }

  if (intent === "deleteGoal") {
    const goalId = formData.get("goalId") as string;
    await prisma.dSAGoal.delete({ where: { id: goalId } });
    return Response.json({ success: true });
  }

  return Response.json({ error: "Unknown intent" }, { status: 400 });
}

export default function DSAPractice({ loaderData }: Route.ComponentProps) {
  const { progressMap, goals } = loaderData;
  const fetcher = useFetcher();

  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: "", targetCount: 5, category: "All", difficulty: "All" });

  const filteredProblems = dsaProblems.filter((p) => {
    if (selectedDifficulty !== "All" && p.difficulty !== selectedDifficulty) return false;
    if (selectedCategory !== "All" && p.category !== selectedCategory) return false;
    if (selectedStatus !== "All") {
      const progress = progressMap[p.id];
      if (selectedStatus === "Solved" && (!progress || progress.status !== "solved" || !progress.isCorrect)) return false;
      if (selectedStatus === "Attempted" && (!progress || progress.status === "unsolved")) return false;
      if (selectedStatus === "Unsolved" && progress && progress.status !== "unsolved") return false;
    }
    return true;
  });

  const totalSolved = Object.values(progressMap).filter((p) => p.status === "solved" && p.isCorrect).length;
  const totalAttempted = Object.values(progressMap).filter((p) => p.status !== "unsolved").length;
  const accuracy = totalAttempted > 0 ? Math.round((totalSolved / totalAttempted) * 100) : 0;

  const handleAddGoal = () => {
    if (!newGoal.title) return;
    const formData = new FormData();
    formData.append("intent", "addGoal");
    formData.append("title", newGoal.title);
    formData.append("targetCount", newGoal.targetCount.toString());
    formData.append("category", newGoal.category);
    formData.append("difficulty", newGoal.difficulty);
    fetcher.submit(formData, { method: "post" });
    setShowGoalModal(false);
    setNewGoal({ title: "", targetCount: 5, category: "All", difficulty: "All" });
  };

  const handleDeleteGoal = (goalId: string) => {
    const formData = new FormData();
    formData.append("intent", "deleteGoal");
    formData.append("goalId", goalId);
    fetcher.submit(formData, { method: "post" });
  };

  const getStatusIcon = (problemId: string) => {
    const p = progressMap[problemId];
    if (!p || p.status === "unsolved") return <span className="text-text-tertiary text-lg">⬜</span>;
    if (p.status === "solved" && p.isCorrect) return <span className="text-neon-emerald text-lg">✅</span>;
    if (p.status === "solved" && !p.isCorrect) return <span className="text-red-400 text-lg">❌</span>;
    return <span className="text-neon-amber text-lg">🔄</span>;
  };

  const getDifficultyColor = (d: string) => {
    if (d === "Easy") return "text-neon-emerald bg-neon-emerald/10 border-neon-emerald/30";
    if (d === "Medium") return "text-neon-amber bg-neon-amber/10 border-neon-amber/30";
    return "text-red-400 bg-red-400/10 border-red-400/30";
  };

  const getGoalProgress = (goal: { id: string; category: string | null; difficulty: string | null; targetCount: number }) => {
    let solved = Object.entries(progressMap).filter(([, p]) => p.status === "solved" && p.isCorrect);
    if (goal.category) {
      solved = solved.filter(([id]) => {
        const problem = dsaProblems.find((p) => p.id === id);
        return problem?.category === goal.category;
      });
    }
    if (goal.difficulty) {
      solved = solved.filter(([id]) => {
        const problem = dsaProblems.find((p) => p.id === id);
        return problem?.difficulty === goal.difficulty;
      });
    }
    return Math.min(solved.length, goal.targetCount);
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto w-full min-h-screen">
      <div className="page-heading mx-auto pt-10 pb-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-text-primary mb-2">DSA Practice</h1>
        <h2 className="text-text-secondary">Master algorithms & data structures with AI-powered feedback.</h2>
      </div>

      <div className="max-w-6xl mx-auto w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">

        {/* Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-5 text-center">
            <p className="text-3xl font-bold text-neon-blue">{dsaProblems.length}</p>
            <p className="text-text-secondary text-sm mt-1">Total Problems</p>
          </div>
          <div className="glass-panel p-5 text-center">
            <p className="text-3xl font-bold text-neon-emerald">{totalSolved}</p>
            <p className="text-text-secondary text-sm mt-1">Solved</p>
          </div>
          <div className="glass-panel p-5 text-center">
            <p className="text-3xl font-bold text-neon-amber">{totalAttempted}</p>
            <p className="text-text-secondary text-sm mt-1">Attempted</p>
          </div>
          <div className="glass-panel p-5 text-center">
            <p className="text-3xl font-bold text-neon-purple">{accuracy}%</p>
            <p className="text-text-secondary text-sm mt-1">Accuracy</p>
          </div>
        </div>

        {/* Goals Section */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              🎯 Your Goals
            </h3>
            <button onClick={() => setShowGoalModal(true)} className="primary-button text-sm !py-2 !px-4">
              + Add Goal
            </button>
          </div>

          {goals.length === 0 ? (
            <p className="text-text-tertiary text-sm">No goals yet. Set a practice target to stay on track!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.map((goal: { id: string; title: string; category: string | null; difficulty: string | null; targetCount: number }) => {
                const progress = getGoalProgress(goal);
                const pct = Math.round((progress / goal.targetCount) * 100);
                return (
                  <div key={goal.id} className="bg-white/5 border border-glass-border rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-text-primary text-sm">{goal.title}</p>
                        <p className="text-text-tertiary text-xs mt-1">
                          {goal.category && `${goal.category} · `}
                          {goal.difficulty && `${goal.difficulty}`}
                        </p>
                      </div>
                      <button onClick={() => handleDeleteGoal(goal.id)} className="text-text-tertiary hover:text-red-400 transition-colors text-xs" title="Delete goal">✕</button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${pct >= 100 ? "bg-neon-emerald" : "bg-neon-blue"}`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-text-secondary">{progress}/{goal.targetCount}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Goal Modal */}
        {showGoalModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowGoalModal(false)}>
            <div className="glass-panel p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-text-primary mb-4">Create a Goal</h3>
              <div className="flex flex-col gap-4">
                <div className="form-div">
                  <label>Goal Title</label>
                  <input type="text" placeholder='e.g. "Solve 5 Easy Array problems"' value={newGoal.title} onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })} />
                </div>
                <div className="form-div">
                  <label>Target Count</label>
                  <input type="number" min={1} max={50} value={newGoal.targetCount} onChange={(e) => setNewGoal({ ...newGoal, targetCount: parseInt(e.target.value) || 1 })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-div">
                    <label>Category</label>
                    <select className="bg-dark-surface/50 border border-glass-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-neon-blue transition-colors appearance-none" value={newGoal.category} onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}>
                      <option value="All">Any</option>
                      {dsaCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-div">
                    <label>Difficulty</label>
                    <select className="bg-dark-surface/50 border border-glass-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-neon-blue transition-colors appearance-none" value={newGoal.difficulty} onChange={(e) => setNewGoal({ ...newGoal, difficulty: e.target.value })}>
                      <option value="All">Any</option>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowGoalModal(false)} className="flex-1 py-3 rounded-xl border border-glass-border text-text-secondary hover:bg-white/5 transition-colors">Cancel</button>
                  <button onClick={handleAddGoal} className="primary-button flex-1">Create Goal</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="glass-panel p-4 flex flex-wrap gap-4 items-center">
          <div className="flex gap-2">
            {["All", "Easy", "Medium", "Hard"].map((d) => (
              <button key={d} onClick={() => setSelectedDifficulty(d)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedDifficulty === d ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/40" : "bg-white/5 text-text-secondary border border-glass-border hover:bg-white/10"}`}>
                {d}
              </button>
            ))}
          </div>
          <select className="bg-dark-surface/50 border border-glass-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-neon-blue transition-colors appearance-none" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="All">All Topics</option>
            {dsaCategories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="bg-dark-surface/50 border border-glass-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-neon-blue transition-colors appearance-none" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Solved">Solved</option>
            <option value="Attempted">Attempted</option>
            <option value="Unsolved">Unsolved</option>
          </select>
          <span className="text-text-tertiary text-sm ml-auto">{filteredProblems.length} problems</span>
        </div>

        {/* Problem List */}
        <div className="flex flex-col gap-2">
          {filteredProblems.map((problem, i) => (
            <Link
              key={problem.id}
              to={`/dsa-practice/${problem.id}`}
              className="glass-panel p-4 flex items-center gap-4 group hover:border-neon-blue/40 transition-all cursor-pointer"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div className="w-8 text-center">{getStatusIcon(problem.id)}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text-primary group-hover:text-neon-blue transition-colors truncate">{problem.title}</p>
                <p className="text-text-tertiary text-xs mt-0.5">{problem.category}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              <svg className="w-5 h-5 text-text-tertiary group-hover:text-neon-blue group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        {/* Report Link */}
        <div className="text-center pt-4">
          <Link to="/dsa-report" className="text-neon-blue hover:underline text-sm font-medium">
            📊 View Full Completion Report →
          </Link>
        </div>
      </div>
    </div>
  );
}
