import type { Route } from "./+types/home";
import { Link } from "react-router";
import { useEffect, useState } from "react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Selectify | Dashboard" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          YOUR DASHBOARD
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
          Track and improve your<br/>applications
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Upload your first resume to get AI-powered, actionable feedback and start tracking your journey to your dream job.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-24">
        <Link to="/upload" className="block">
          <div className="dotted-border p-12 text-center group cursor-pointer hover:border-primary/50 transition-all duration-300 bg-slate-900/40">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(14,165,233,0.1)]">
              <span className="material-symbols-outlined text-primary text-3xl">cloud_upload</span>
            </div>
            <h3 className="text-xl font-bold mb-2">No resumes yet</h3>
            <p className="text-slate-400 mb-6">Start your journey by uploading a resume and pasting a job description. We'll give you a detailed ATS score and feedback.</p>
            <button className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-8 py-3 rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all inline-flex items-center gap-2">
              <span className="material-symbols-outlined">upload_file</span>
              Upload Resume
            </button>
            <p className="mt-4 text-xs text-slate-500">PDF, DOCX up to 10MB</p>
          </div>
        </Link>
      </div>

      <div className="mb-24">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold">How it works</h2>
          <div className="h-px flex-1 bg-slate-800 mx-8 hidden md:block"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-8xl font-black text-white/5 group-hover:text-primary/10 transition-colors">1</div>
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-indigo-400">description</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Upload Resume</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Simply upload your current resume in PDF or Word format to get started.</p>
          </div>
          <div className="glass p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-8xl font-black text-white/5 group-hover:text-primary/10 transition-colors">2</div>
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary">psychology</span>
            </div>
            <h3 className="text-xl font-bold mb-3">AI Analysis</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Our AI analyzes your skills against job requirements and identifies gaps.</p>
          </div>
          <div className="glass p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-8xl font-black text-white/5 group-hover:text-primary/10 transition-colors">3</div>
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-emerald-400">rocket_launch</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Track Success</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Manage applications and track your progress in a central dashboard.</p>
          </div>
        </div>
      </div>

      {/* Practice Hub Stats */}
      <div className="mb-24">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold">Interview Practice Hub</h2>
          <div className="h-px flex-1 bg-slate-800 mx-8 hidden md:block"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/dsa-practice" className="block">
            <div className="glass p-8 rounded-3xl group cursor-pointer hover:border-primary/50 transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-emerald-400">code</span>
              </div>
              <h3 className="text-xl font-bold mb-2">DSA Practice</h3>
              <p className="text-slate-400 text-sm leading-relaxed">LeetCode-style problems with AI code review, goal tracking, and completion reports.</p>
              <p className="text-primary text-sm font-semibold mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
                Start Practicing <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </p>
            </div>
          </Link>
          <Link to="/mock-interview" className="block">
            <div className="glass p-8 rounded-3xl group cursor-pointer hover:border-primary/50 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-purple-400">mic</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Mock Interviews</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Timed interview sessions with real-time AI scoring, feedback, and session reports.</p>
              <p className="text-primary text-sm font-semibold mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
                Start Session <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </p>
            </div>
          </Link>
          <Link to="/interview-prep" className="block">
            <div className="glass p-8 rounded-3xl group cursor-pointer hover:border-primary/50 transition-all duration-300">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-amber-400">psychology_alt</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Interview Q&A</h3>
              <p className="text-slate-400 text-sm leading-relaxed">AI-generated interview questions tailored to your resume and target role.</p>
              <p className="text-primary text-sm font-semibold mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
                Generate Questions <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </p>
            </div>
          </Link>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold">Recent Analysis</h2>
          <Link to="/job-matches" className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
            View all <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        <div className="grid gap-4 opacity-40 grayscale pointer-events-none">
          <div className="glass p-5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-500">article</span>
              </div>
              <div>
                <h4 className="font-bold">Senior Software Engineer</h4>
                <p className="text-xs text-slate-500">Google • Analyzed 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-right">
                <div className="text-sm font-bold text-emerald-400">88% Match</div>
                <div className="text-[10px] text-slate-500 tracking-wider uppercase">ATS Score</div>
              </div>
              <div className="h-8 w-px bg-slate-800"></div>
              <button className="px-4 py-2 bg-slate-800 rounded-lg text-xs font-bold">View Report</button>
            </div>
          </div>
          <div className="glass p-5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-500">article</span>
              </div>
              <div>
                <h4 className="font-bold">Product Designer</h4>
                <p className="text-xs text-slate-500">Airbnb • Analyzed yesterday</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-right">
                <div className="text-sm font-bold text-amber-400">62% Match</div>
                <div className="text-[10px] text-slate-500 tracking-wider uppercase">ATS Score</div>
              </div>
              <div className="h-8 w-px bg-slate-800"></div>
              <button className="px-4 py-2 bg-slate-800 rounded-lg text-xs font-bold">View Report</button>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 italic">Example preview. Your actual analyses will appear here.</p>
        </div>
      </div>
    </main>
  );
}