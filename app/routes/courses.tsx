import { useState } from "react";
import { requireAuth } from "~/lib/session.server";
import LoadingSpinner from "~/components/LoadingSpinner";
import type { Route } from "./+types/courses";

export function meta() {
  return [
    { title: "Selectify | Course Recommendations" },
    { name: "description", content: "Get personalized course recommendations to bridge skill gaps" },
  ];
}

export async function loader({ request }: { request: Request }) {
  await requireAuth(request);
  return {};
}

interface Course {
  title: string;
  platform: string;
  url: string;
  relevance: number;
  estimatedHours: number;
  skillCovered: string;
}

const platformColors: Record<string, string> = {
  Coursera: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Udemy: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  edX: "bg-red-500/10 text-red-400 border-red-500/20",
  "LinkedIn Learning": "bg-sky-500/10 text-sky-400 border-sky-500/20",
  Pluralsight: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

export default function Courses() {
  const [currentSkills, setCurrentSkills] = useState("");
  const [missingSkills, setMissingSkills] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!targetRole) {
      setError("Target role is required");
      return;
    }

    setIsLoading(true);
    setError("");
    setCourses([]);

    try {
      const response = await fetch("/api/course-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentSkills: currentSkills.split(",").map((s) => s.trim()).filter(Boolean),
          missingSkills: missingSkills.split(",").map((s) => s.trim()).filter(Boolean),
          targetRole,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCourses(data.data.courses);
      } else {
        setError(data.error || "Failed to get recommendations");
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
          Course Recommendations
        </h1>
        <p className="text-slate-400 text-lg">Bridge your skill gaps with curated learning paths.</p>
      </div>

      <div className="glass p-6 rounded-2xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-sm font-semibold text-slate-300 mb-2 block">Target Role</label>
            <input type="text" value={targetRole} onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
              placeholder="e.g., ML Engineer"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-300 mb-2 block">Current Skills</label>
            <input type="text" value={currentSkills} onChange={(e) => setCurrentSkills(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
              placeholder="Python, SQL, React"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-300 mb-2 block">Skills to Develop</label>
            <input type="text" value={missingSkills} onChange={(e) => setMissingSkills(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
              placeholder="TensorFlow, PyTorch, MLOps"
            />
          </div>
        </div>
        <button onClick={handleGenerate} disabled={isLoading}
          className="bg-sky-500 text-white px-6 py-3 rounded-xl font-bold transition-all hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
          {isLoading ? <><LoadingSpinner size="sm" /> Searching...</> : "Find Courses"}
        </button>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </div>

      {isLoading && (
        <div className="flex flex-col items-center gap-4 py-16">
          <LoadingSpinner size="lg" />
          <p className="text-slate-400">Finding the best courses for your learning path...</p>
        </div>
      )}

      {courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course, idx) => {
            const platformStyle = platformColors[course.platform] || "bg-white/5 text-slate-400 border-white/10";
            return (
              <div key={idx} className="glass p-6 rounded-2xl flex flex-col justify-between hover:bg-white/[0.03] transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold border ${platformStyle}`}>
                      {course.platform}
                    </span>
                    <span className="text-xs text-slate-500">{course.estimatedHours}h</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 leading-snug">{course.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-slate-500">Covers:</span>
                    <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 text-xs font-medium border border-sky-500/20">
                      {course.skillCovered}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1">
                    <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-400 rounded-full" style={{ width: `${course.relevance}%` }} />
                    </div>
                    <span className="text-xs text-sky-400 font-semibold">{course.relevance}%</span>
                  </div>
                  <a href={course.url} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-sky-400 hover:text-sky-300 font-medium">
                    View Course
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
