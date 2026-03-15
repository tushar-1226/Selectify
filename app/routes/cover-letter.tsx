import { useState } from "react";
import { requireAuth } from "~/lib/session.server";
import LoadingSpinner from "~/components/LoadingSpinner";
import type { Route } from "./+types/cover-letter";

export function meta() {
  return [
    { title: "Selectify | Cover Letter Generator" },
    { name: "description", content: "Generate tailored cover letters with AI" },
  ];
}

export async function loader({ request }: { request: Request }) {
  await requireAuth(request);
  return {};
}

export default function CoverLetter() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!resumeText || !jobDescription || !companyName || !jobTitle) {
      setError("All fields are required");
      return;
    }

    setIsLoading(true);
    setError("");
    setCoverLetter("");

    try {
      const response = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription, companyName, jobTitle }),
      });

      const data = await response.json();
      if (data.success) {
        setCoverLetter(data.data.coverLetter);
      } else {
        setError(data.error || "Failed to generate cover letter");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([coverLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover-letter-${companyName.toLowerCase().replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Cover Letter Generator
        </h1>
        <p className="text-slate-400 text-lg">Create a compelling, tailored cover letter in seconds.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-300 mb-2 block">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
                  placeholder="e.g., Google"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-300 mb-2 block">Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
                  placeholder="e.g., Senior Engineer"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">Your Resume (paste text)</label>
              <textarea
                rows={6}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all resize-none text-sm"
                placeholder="Paste your resume content here..."
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">Job Description</label>
              <textarea
                rows={6}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all resize-none text-sm"
                placeholder="Paste the full job description..."
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full bg-sky-500 text-white px-6 py-3 rounded-xl font-bold transition-all hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Generating...
                </>
              ) : (
                "Generate Cover Letter"
              )}
            </button>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
          </div>
        </div>

        <div>
          {coverLetter ? (
            <div className="glass p-8 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-300 text-sm uppercase tracking-wider">Your Cover Letter</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/10 transition-colors"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sm font-medium text-sky-400 hover:bg-sky-500/20 transition-colors"
                  >
                    Download
                  </button>
                </div>
              </div>
              <div className="prose prose-invert max-w-none">
                <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-[system-ui]">
                  {coverLetter}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass p-12 rounded-2xl flex flex-col items-center justify-center text-center min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-sky-500/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-slate-400 text-sm">Fill in the details and click Generate to create your tailored cover letter.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
