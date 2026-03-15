import { useState } from "react";
import { requireAuth } from "~/lib/session.server";
import LoadingSpinner from "~/components/LoadingSpinner";
import type { Route } from "./+types/email-templates";

export function meta() {
  return [
    { title: "Selectify | Email Templates" },
    { name: "description", content: "Generate personalized professional email templates" },
  ];
}

export async function loader({ request }: { request: Request }) {
  await requireAuth(request);
  return {};
}

const templateTypes = [
  { value: "application", label: "Job Application", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { value: "follow-up", label: "Follow-Up", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" },
  { value: "networking", label: "Networking", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
  { value: "thank-you", label: "Thank You", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
];

export default function EmailTemplates() {
  const [resumeText, setResumeText] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [selectedType, setSelectedType] = useState("application");
  const [result, setResult] = useState<{ subject: string; body: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!companyName || !jobTitle) {
      setError("Company name and job title are required");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/email-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, companyName, jobTitle, templateType: selectedType }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || "Failed to generate email");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(`Subject: ${result.subject}\n\n${result.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Email Templates
        </h1>
        <p className="text-slate-400 text-lg">Generate personalized emails for networking, applications, and follow-ups.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl">
            <label className="text-sm font-semibold text-slate-300 mb-3 block">Email Type</label>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {templateTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                    selectedType === type.value
                      ? "bg-sky-500/10 border-sky-500/30 text-sky-400"
                      : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={type.icon} />
                  </svg>
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-semibold text-slate-300 mb-2 block">Company</label>
                <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
                  placeholder="e.g., Google"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-300 mb-2 block">Job Title</label>
                <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
                  placeholder="e.g., Senior Engineer"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm font-semibold text-slate-300 mb-2 block">Resume Text (optional, adds personalization)</label>
              <textarea rows={4} value={resumeText} onChange={(e) => setResumeText(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all resize-none text-sm"
                placeholder="Paste your resume for more personalized emails..."
              />
            </div>

            <button onClick={handleGenerate} disabled={isLoading}
              className="w-full bg-sky-500 text-white px-6 py-3 rounded-xl font-bold transition-all hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isLoading ? <><LoadingSpinner size="sm" /> Generating...</> : "Generate Email"}
            </button>
            {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
          </div>
        </div>

        <div>
          {result ? (
            <div className="glass p-8 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-300 text-sm uppercase tracking-wider">Generated Email</h3>
                <button onClick={handleCopy}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/10 transition-colors">
                  {copied ? "Copied" : "Copy All"}
                </button>
              </div>

              <div className="mb-4 p-3 rounded-lg bg-sky-500/5 border border-sky-500/10">
                <p className="text-xs text-slate-500 mb-1">Subject Line</p>
                <p className="text-sm font-semibold text-sky-300">{result.subject}</p>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{result.body}</p>
              </div>
            </div>
          ) : (
            <div className="glass p-12 rounded-2xl flex flex-col items-center justify-center text-center min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-sky-500/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-slate-400 text-sm">Select a template type, fill in the details, and generate your personalized email.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
