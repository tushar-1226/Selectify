import type { Route } from "./+types/home";
import { Link, useSearchParams } from "react-router";
import { useState } from "react";
import { requireAuth, getCookie } from "~/lib/session.server";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Selectify | Resume Analytics" },
    { name: "description", content: "Detailed resume analysis and feedback" },
  ];
}

interface AnalysisData {
  analysis: {
    atsScore: number;
    matchPercentage: number;
    strengths: string[];
    weaknesses: string[];
    keywords: string[];
    improvements: string[];
    summary: string;
  };
  insights: Array<{
    title: string;
    description: string;
    icon: string;
    priority: string;
  }>;
  resumeInfo: {
    fullName: string;
    currentRole: string;
    skills: string[];
  };
}

export async function loader({ request }: { request: Request }) {
  const userId = await requireAuth(request);
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return { analysisData: null };
  }

  const token = getCookie(request, "token");
  if (!token) {
    return { analysisData: null };
  }

  try {
    const backendResponse = await fetch(`https://selectify-platform-production.up.railway.app/api/resume-analysis/single/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!backendResponse.ok) {
      console.error("Failed to fetch analysis:", backendResponse.statusText);
      return { analysisData: null };
    }

    const data = await backendResponse.json();
    if (!data.success || !data.analysis) {
      return { analysisData: null };
    }

    // The backend stores analysis_data as a stringified JSON (by default in ResumeAnalysis model)
    // or direct JSON. We need to ensure we parse it correctly.
    let parsedData = data.analysis.analysis_data;
    if (typeof parsedData === 'string') {
      try {
        parsedData = JSON.parse(parsedData);
      } catch (e) {
        console.error("Failed to parse analysis data string", e);
        return { analysisData: null };
      }
    }

    return { analysisData: parsedData };
  } catch (error) {
    console.error("Error fetching analysis data:", error);
    return { analysisData: null };
  }
}

export default function Analysis({ loaderData }: Route.ComponentProps) {
  const analysisData = (loaderData as any)?.analysisData as AnalysisData | null;

  if (!analysisData) {
    return (
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <p className="text-slate-400 mb-6">No analysis data available</p>
          <Link to="/upload" className="text-sky-400 hover:text-sky-300">
            Upload a resume to get started →
          </Link>
        </div>
      </main>
    );
  }

  const { analysis, insights, resumeInfo } = analysisData;
  const jobCategories = [
    { category: "Software Engineering", percentage: analysis.matchPercentage, color: "bg-primary", shadow: "shadow-[0_0_10px_rgba(14,165,233,0.3)]", textColor: "text-primary" },
    { category: "Product Management", percentage: Math.max(0, analysis.matchPercentage - 15), color: "bg-amber-400", shadow: "shadow-[0_0_10px_rgba(251,191,36,0.3)]", textColor: "text-amber-400" },
    { category: "Data Analysis", percentage: Math.max(0, analysis.matchPercentage - 25), color: "bg-indigo-400", shadow: "shadow-[0_0_10px_rgba(129,140,248,0.3)]", textColor: "text-indigo-400" },
    { category: "Cloud Architecture", percentage: Math.max(0, analysis.matchPercentage - 10), color: "bg-emerald-400", shadow: "shadow-[0_0_10px_rgba(52,211,153,0.3)]", textColor: "text-emerald-400" }
  ];

  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Resume Analytics Overview
          </h1>
          <p className="text-slate-400 text-lg">Detailed performance breakdown of your professional profile.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">Last updated: Today, {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          <button className="glass px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-sm">download</span> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass p-8 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-4 left-6">
            <h3 className="font-bold text-slate-400 text-sm uppercase tracking-wider">Average ATS Score</h3>
          </div>
          <div className="relative w-48 h-48 mt-4">
            <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
              <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
              <circle cx="100" cy="100" r="90" fill="none" stroke="#0EA5E9" strokeWidth="12" strokeDasharray={`${(analysis.atsScore / 100) * 565} 565`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-white">{analysis.atsScore}</span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Target: 85+</span>
            </div>
          </div>
          <div className="mt-8 text-center">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>+12% vs last month</span>
            </div>
            <p className="text-xs text-slate-500">Based on recent resume analyses</p>
          </div>
        </div>

        <div className="lg:col-span-2 glass p-8 rounded-3xl flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-400 text-sm uppercase tracking-wider text-left">Analysis Score Over Time</h3>
            <div className="flex gap-2">
              <span className="px-2 py-1 rounded-md bg-white/5 text-[10px] font-bold border border-white/10">30 DAYS</span>
              <span className="px-2 py-1 rounded-md bg-primary/20 text-primary text-[10px] font-bold border border-primary/20">90 DAYS</span>
            </div>
          </div>
          <div className="flex-1 flex items-end justify-between gap-2 min-h-[160px] relative">
            <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
              <div className="border-t border-white/5 w-full"></div>
              <div className="border-t border-white/5 w-full"></div>
              <div className="border-t border-white/5 w-full"></div>
            </div>
            <div className="w-full flex items-end justify-between h-full relative z-10 px-4">
              {[62, 55, 65, 75, 70, 80, 85, analysis.atsScore].map((score, idx, arr) => (
                <div key={idx} className="group relative flex flex-col items-center flex-1">
                  <div className={`w-1.5 rounded-full transition-all duration-300 ${idx === arr.length - 1 ? 'bg-primary shadow-[0_0_15px_rgba(14,165,233,0.4)]' : 'bg-white/10 group-hover:bg-primary/40'}`} style={{ height: `${score}%` }}></div>
                  <div className="absolute -top-6 opacity-0 group-hover:opacity-100 text-[10px] font-bold bg-slate-800 px-2 py-1 rounded">{score}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between mt-4 text-[10px] text-slate-500 font-medium px-4">
            <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span><span>JUL</span><span>AUG</span>
          </div>
        </div>

        <div className="lg:col-span-2 glass p-8 rounded-3xl">
          <h3 className="font-bold text-slate-400 text-sm uppercase tracking-wider mb-8">Skills Match across Job Categories</h3>
          <div className="space-y-6">
            {jobCategories.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.category}</span>
                  <span className={`${item.textColor} font-bold`}>{item.percentage}%</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className={`${item.color} h-full rounded-full ${item.shadow}`} style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-8 rounded-3xl">
          <h3 className="font-bold text-slate-400 text-sm uppercase tracking-wider mb-6">Top Identified Skills</h3>
          <div className="flex flex-wrap gap-2">
            {resumeInfo.skills && resumeInfo.skills.length > 0 ? (
              resumeInfo.skills.map((skill, idx) => {
                const colors = [
                  "bg-primary/10 border-primary/20 text-primary",
                  "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
                  "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                  "bg-white/5 border-white/10 text-slate-300"
                ];
                const color = colors[idx % colors.length];
                return (
                  <span key={idx} className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${color}`}>
                    {skill}
                  </span>
                )
              })
            ) : (
              <span className="text-slate-500 text-sm">Skills will be identified from your resume</span>
            )}
          </div>
          <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-xs text-slate-400 leading-relaxed italic">"Your profile shows a strong concentration in technologies relevant to {resumeInfo.currentRole}, which aligns nicely with market demand."</p>
          </div>
        </div>

        {insights && insights.length > 0 && (
          <div className="lg:col-span-3 glass p-8 rounded-3xl mt-2">
            <div className="flex items-center gap-2 mb-8">
              <span className="material-symbols-outlined text-amber-400">auto_awesome</span>
              <h3 className="font-bold text-slate-400 text-sm uppercase tracking-wider">AI-Powered Improvement Insights</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {insights.map((insight, idx) => {
                const colorSets = [
                  { bg: "bg-amber-400/10", text: "text-amber-400", groupText: "group-hover:text-amber-400" },
                  { bg: "bg-primary/10", text: "text-primary", groupText: "group-hover:text-primary" },
                  { bg: "bg-emerald-400/10", text: "text-emerald-400", groupText: "group-hover:text-emerald-400" }
                ];
                const cs = colorSets[idx % colorSets.length];
                return (
                  <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group">
                    <div className={`w-10 h-10 rounded-xl ${cs.bg} flex items-center justify-center flex-shrink-0`}>
                      <span className={`material-symbols-outlined ${cs.text}`}>{insight.icon || "lightbulb"}</span>
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm mb-1 ${cs.groupText} transition-colors`}>{insight.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{insight.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
