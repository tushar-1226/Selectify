import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { requireAuth, getCookie } from "~/lib/session.server";
import type { Route } from "./+types/mock-interview";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Selectify | Mock Interview" },
    { name: "description", content: "Practice live mock interviews with AI-powered feedback" },
  ];
}

export async function loader({ request }: { request: Request }) {
  await requireAuth(request);
  const token = getCookie(request, "token");

  const res = await fetch("http://localhost:8000/api/mock-interviews", {
    headers: { Authorization: `Bearer ${token}` },
  });

  let history: Array<{
    id: number;
    type: string;
    difficulty: string;
    overallScore: number | null;
    startedAt: string;
    completedAt: string | null;
  }> = [];

  if (res.ok) {
    const data = await res.json();
    history = data.history || [];
  }

  return { history };
}

export default function MockInterview({ loaderData }: Route.ComponentProps) {
  const { history } = loaderData;
  const navigate = useNavigate();

  const [type, setType] = useState<string>("Technical");
  const [difficulty, setDifficulty] = useState<string>("Medium");
  const [count, setCount] = useState(5);
  const [timeLimit, setTimeLimit] = useState(300);
  const [targetRole, setTargetRole] = useState("Software Engineer");

  const handleStart = () => {
    const params = new URLSearchParams({
      type, difficulty, count: count.toString(), time: timeLimit.toString(), role: targetRole,
    });
    navigate(`/mock-session?${params.toString()}`);
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto w-full min-h-screen">
      <div className="page-heading mx-auto pt-10 pb-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-text-primary mb-2">Mock Interview</h1>
        <h2 className="text-text-secondary">Practice real interview questions with timed submissions and AI scoring.</h2>
      </div>

      <div className="max-w-4xl mx-auto w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">

        {/* Configuration */}
        <div className="glass-panel p-8">
          <h3 className="text-lg font-bold text-text-primary mb-6">Configure Session</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-div">
              <label>Interview Type</label>
              <select className="bg-dark-surface/50 border border-glass-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-neon-blue transition-colors appearance-none" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="Technical">Technical</option>
                <option value="Behavioral">Behavioral</option>
                <option value="System Design">System Design</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>
            <div className="form-div">
              <label>Difficulty</label>
              <select className="bg-dark-surface/50 border border-glass-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-neon-blue transition-colors appearance-none" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="form-div">
              <label>Target Role</label>
              <input type="text" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="e.g. Software Engineer" className="bg-dark-surface/50 border border-glass-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-neon-blue transition-colors" />
            </div>
            <div className="form-div">
              <label>Questions</label>
              <select className="bg-dark-surface/50 border border-glass-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-neon-blue transition-colors appearance-none" value={count} onChange={(e) => setCount(parseInt(e.target.value))}>
                <option value={3}>3 Questions</option>
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
              </select>
            </div>
            <div className="form-div">
              <label>Time per Question</label>
              <select className="bg-dark-surface/50 border border-glass-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-neon-blue transition-colors appearance-none" value={timeLimit} onChange={(e) => setTimeLimit(parseInt(e.target.value))}>
                <option value={120}>2 Minutes</option>
                <option value={300}>5 Minutes</option>
                <option value={600}>10 Minutes</option>
              </select>
            </div>
          </div>
          <button onClick={handleStart} className="primary-button w-full mt-6 group">
            <span className="flex items-center justify-center gap-2">
              Start Interview
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </button>
        </div>

        {/* Past Sessions */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-bold text-text-primary mb-4">Past Sessions</h3>
          {history.length === 0 ? (
            <p className="text-text-tertiary text-sm">Complete your first mock interview to see your history here.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {history.map((session) => {
                const score = session.overallScore || 0;
                const scoreColor = score >= 7 ? "text-neon-emerald" : score >= 4 ? "text-neon-amber" : "text-red-400";
                return (
                  <div key={session.id} className="flex items-center justify-between bg-white/5 border border-glass-border rounded-xl p-4">
                    <div>
                      <p className="font-medium text-text-primary text-sm">{session.type} · {session.difficulty}</p>
                      <p className="text-text-tertiary text-xs mt-0.5">{new Date(session.startedAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xl font-bold ${scoreColor}`}>{score.toFixed(1)}/10</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
