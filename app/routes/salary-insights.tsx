import { useState } from "react";
import { requireAuth } from "~/lib/session.server";
import LoadingSpinner from "~/components/LoadingSpinner";
import type { Route } from "./+types/salary-insights";

export function meta() {
  return [
    { title: "Selectify | Salary Insights" },
    { name: "description", content: "Get AI-powered salary estimates and negotiation tips" },
  ];
}

export async function loader({ request }: { request: Request }) {
  await requireAuth(request);
  return {};
}

interface SalaryData {
  salary: { min: number; median: number; max: number; currency: string };
  negotiationTips: string[];
  marketDemand: string;
  demandLevel: "high" | "medium" | "low";
  growthOutlook: string;
}

const demandColors = {
  high: { bg: "bg-emerald-400/10", text: "text-emerald-400", label: "High Demand" },
  medium: { bg: "bg-amber-400/10", text: "text-amber-400", label: "Moderate Demand" },
  low: { bg: "bg-red-400/10", text: "text-red-400", label: "Low Demand" },
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export default function SalaryInsights() {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [data, setData] = useState<SalaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!jobTitle || !location) {
      setError("Job title and location are required");
      return;
    }

    setIsLoading(true);
    setError("");
    setData(null);

    try {
      const response = await fetch("/api/salary-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle,
          location,
          skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
          experienceYears: parseInt(experienceYears) || 0,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || "Failed to get salary insights");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const salaryRange = data ? data.salary.max - data.salary.min : 0;
  const medianPosition = data ? ((data.salary.median - data.salary.min) / salaryRange) * 100 : 50;

  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Salary Insights
        </h1>
        <p className="text-slate-400 text-lg">Understand your market value and negotiate with confidence.</p>
      </div>

      <div className="glass p-6 rounded-2xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-sm font-semibold text-slate-300 mb-2 block">Job Title</label>
            <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
              placeholder="e.g., Senior Frontend Engineer"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-300 mb-2 block">Location</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
              placeholder="e.g., San Francisco, CA"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-300 mb-2 block">Key Skills</label>
            <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
              placeholder="React, TypeScript, Node.js"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-300 mb-2 block">Years of Experience</label>
            <input type="number" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
              placeholder="5"
            />
          </div>
        </div>
        <button onClick={handleGenerate} disabled={isLoading}
          className="bg-sky-500 text-white px-6 py-3 rounded-xl font-bold transition-all hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
          {isLoading ? <><LoadingSpinner size="sm" /> Analyzing...</> : "Get Salary Insights"}
        </button>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </div>

      {isLoading && (
        <div className="flex flex-col items-center gap-4 py-16">
          <LoadingSpinner size="lg" />
          <p className="text-slate-400">Researching compensation data...</p>
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass p-8 rounded-2xl">
            <h3 className="font-bold text-slate-400 text-sm uppercase tracking-wider mb-8">Salary Range</h3>
            <div className="mb-6">
              <div className="flex justify-between text-xs text-slate-500 mb-2">
                <span>{formatCurrency(data.salary.min)}</span>
                <span>{formatCurrency(data.salary.max)}</span>
              </div>
              <div className="relative h-4 bg-white/5 rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-sky-600 to-sky-400 rounded-full" style={{ width: "100%" }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg shadow-sky-500/50 border-2 border-sky-400" style={{ left: `calc(${medianPosition}% - 8px)` }} />
              </div>
              <div className="text-center mt-3">
                <span className="text-2xl font-black text-white">{formatCurrency(data.salary.median)}</span>
                <span className="text-slate-400 text-sm ml-2">median</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <p className="text-xs text-slate-500 mb-1">Minimum</p>
                <p className="text-lg font-bold text-sky-300">{formatCurrency(data.salary.min)}</p>
              </div>
              <div className="text-center p-4 bg-sky-500/10 rounded-xl border border-sky-500/20">
                <p className="text-xs text-slate-500 mb-1">Median</p>
                <p className="text-lg font-bold text-sky-400">{formatCurrency(data.salary.median)}</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <p className="text-xs text-slate-500 mb-1">Maximum</p>
                <p className="text-lg font-bold text-sky-300">{formatCurrency(data.salary.max)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass p-6 rounded-2xl">
              <h3 className="font-bold text-slate-400 text-sm uppercase tracking-wider mb-4">Market Demand</h3>
              {(() => {
                const config = demandColors[data.demandLevel] || demandColors.medium;
                return (
                  <div className={`${config.bg} rounded-xl p-4 mb-3`}>
                    <p className={`text-lg font-bold ${config.text}`}>{config.label}</p>
                  </div>
                );
              })()}
              <p className="text-sm text-slate-400 leading-relaxed">{data.marketDemand}</p>
              <p className="text-sm text-slate-300 mt-3 leading-relaxed">{data.growthOutlook}</p>
            </div>
          </div>

          <div className="lg:col-span-3 glass p-8 rounded-2xl">
            <h3 className="font-bold text-slate-400 text-sm uppercase tracking-wider mb-6">Negotiation Tips</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {data.negotiationTips.map((tip, idx) => (
                <div key={idx} className="flex gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-400 text-sm font-bold">{idx + 1}</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
