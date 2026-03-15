import { useState } from "react";
import { requireAuth } from "~/lib/session.server";
import LoadingSpinner from "~/components/LoadingSpinner";
import type { Route } from "./+types/linkedin-optimizer";

export function meta() {
  return [
    { title: "Selectify | LinkedIn Optimizer" },
    { name: "description", content: "Optimize your LinkedIn profile with AI-powered tips" },
  ];
}

export async function loader({ request }: { request: Request }) {
  await requireAuth(request);
  return {};
}

interface LinkedInTip {
  section: string;
  currentIssue: string;
  suggestion: string;
  priority: "high" | "medium" | "low";
}

const priorityConfig = {
  high: { color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20", label: "High" },
  medium: { color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", label: "Medium" },
  low: { color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", label: "Low" },
};

export default function LinkedInOptimizer() {
  const [resumeText, setResumeText] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [tips, setTips] = useState<LinkedInTip[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!resumeText || !currentRole || !targetRole) {
      setError("All fields are required");
      return;
    }

    setIsLoading(true);
    setError("");
    setTips([]);

    try {
      const response = await fetch("/api/linkedin-tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, currentRole, targetRole }),
      });

      const data = await response.json();
      if (data.success) {
        setTips(data.data.tips);
      } else {
        setError(data.error || "Failed to generate tips");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          LinkedIn Profile Optimizer
        </h1>
        <p className="text-slate-400 text-lg">Get section-by-section suggestions to improve your LinkedIn presence.</p>
      </div>

      <div className="glass p-6 rounded-2xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-semibold text-slate-300 mb-2 block">Current Role</label>
            <input
              type="text"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
              placeholder="e.g., Software Engineer"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-300 mb-2 block">Target Role</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
              placeholder="e.g., Staff Engineer"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="text-sm font-semibold text-slate-300 mb-2 block">Resume Text</label>
          <textarea
            rows={5}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all resize-none text-sm"
            placeholder="Paste your resume content here..."
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="bg-sky-500 text-white px-6 py-3 rounded-xl font-bold transition-all hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? <><LoadingSpinner size="sm" /> Analyzing...</> : "Optimize LinkedIn"}
        </button>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </div>

      {isLoading && (
        <div className="flex flex-col items-center gap-4 py-16">
          <LoadingSpinner size="lg" />
          <p className="text-slate-400">Analyzing your profile and generating recommendations...</p>
        </div>
      )}

      {tips.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white mb-4">Profile Optimization Tips ({tips.length})</h2>
          {tips.map((tip, idx) => {
            const config = priorityConfig[tip.priority] || priorityConfig.medium;
            return (
              <div key={idx} className="glass p-6 rounded-2xl border-l-4" style={{ borderLeftColor: tip.priority === "high" ? "#f87171" : tip.priority === "medium" ? "#fbbf24" : "#34d399" }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white">{tip.section}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${config.bg} ${config.color} ${config.border} border`}>
                      {config.label}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-red-300/80 mb-2">
                  <span className="font-semibold text-slate-400">Issue: </span>{tip.currentIssue}
                </p>
                <p className="text-sm text-emerald-300/80">
                  <span className="font-semibold text-slate-400">Fix: </span>{tip.suggestion}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
