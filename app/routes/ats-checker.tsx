import { useState } from "react";
import { requireAuth } from "~/lib/session.server";
import LoadingSpinner from "~/components/LoadingSpinner";
import FileUploader from "~/components/FileUploader";
import type { Route } from "./+types/ats-checker";

export function meta() {
  return [
    { title: "Selectify | ATS Format Checker" },
    { name: "description", content: "Check your resume for ATS compatibility issues" },
  ];
}

export async function loader({ request }: { request: Request }) {
  await requireAuth(request);
  return {};
}

interface ATSIssue {
  type: string;
  description: string;
  severity: "critical" | "warning" | "info";
  fix: string;
}

interface ATSResult {
  score: number;
  issues: ATSIssue[];
  summary: string;
}

const severityConfig = {
  critical: { color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
  warning: { color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  info: { color: "text-sky-400", bg: "bg-sky-400/10", border: "border-sky-400/20", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
};

export default function ATSChecker() {
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState<ATSResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputMode, setInputMode] = useState<"paste" | "upload">("paste");

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
    const lib = await import("pdfjs-dist/build/pdf.mjs");
    lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str || "").join(" ");
      fullText += pageText + "\n";
    }
    return fullText;
  };

  const handleFileSelect = async (file: File | null) => {
    if (!file) return;
    try {
      const text = await extractTextFromPdf(file);
      setResumeText(text);
    } catch {
      setError("Failed to extract text from PDF");
    }
  };

  const handleCheck = async () => {
    if (!resumeText.trim()) {
      setError("Resume text is required");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/ats-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || "Check failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-emerald-600 to-emerald-400";
    if (score >= 60) return "from-amber-600 to-amber-400";
    return "from-red-600 to-red-400";
  };

  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          ATS Format Checker
        </h1>
        <p className="text-slate-400 text-lg">Identify formatting issues that could hurt your resume's ATS compatibility.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <div className="glass p-6 rounded-2xl">
            <div className="flex gap-2 mb-4">
              <button onClick={() => setInputMode("paste")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${inputMode === "paste" ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" : "text-slate-400 border border-white/10 hover:bg-white/5"}`}>
                Paste Text
              </button>
              <button onClick={() => setInputMode("upload")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${inputMode === "upload" ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" : "text-slate-400 border border-white/10 hover:bg-white/5"}`}>
                Upload PDF
              </button>
            </div>

            {inputMode === "paste" ? (
              <textarea rows={12} value={resumeText} onChange={(e) => setResumeText(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all resize-none text-sm mb-4"
                placeholder="Paste your resume text here..."
              />
            ) : (
              <div className="mb-4">
                <FileUploader onFileSelect={handleFileSelect} />
                {resumeText && <p className="text-emerald-400 text-xs mt-2">Text extracted successfully ({resumeText.length} characters)</p>}
              </div>
            )}

            <button onClick={handleCheck} disabled={isLoading || !resumeText.trim()}
              className="w-full bg-sky-500 text-white px-6 py-3 rounded-xl font-bold transition-all hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isLoading ? <><LoadingSpinner size="sm" /> Checking...</> : "Run ATS Check"}
            </button>
            {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
          </div>
        </div>

        <div className="lg:col-span-3">
          {isLoading && (
            <div className="glass p-12 rounded-2xl flex flex-col items-center justify-center">
              <LoadingSpinner size="lg" />
              <p className="text-slate-400 mt-4">Analyzing your resume formatting...</p>
            </div>
          )}

          {result && !isLoading && (
            <div className="space-y-6">
              <div className="glass p-8 rounded-2xl flex items-center gap-8">
                <div className="relative w-32 h-32 flex-shrink-0">
                  <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                    <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14" />
                    <circle cx="100" cy="100" r="85" fill="none" stroke="url(#scoreGradient)" strokeWidth="14" strokeDasharray={`${(result.score / 100) * 534} 534`} strokeLinecap="round" />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" className={`${getScoreGradient(result.score).split(" ")[0].replace("from-", "")}`} style={{ stopColor: result.score >= 80 ? "#059669" : result.score >= 60 ? "#d97706" : "#dc2626" }} />
                        <stop offset="100%" style={{ stopColor: result.score >= 80 ? "#34d399" : result.score >= 60 ? "#fbbf24" : "#f87171" }} />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-black ${getScoreColor(result.score)}`}>{result.score}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Score</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">ATS Compatibility Score</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{result.summary}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-slate-300 text-sm uppercase tracking-wider">Issues Found ({result.issues.length})</h3>
                {result.issues.map((issue, idx) => {
                  const config = severityConfig[issue.severity] || severityConfig.info;
                  return (
                    <div key={idx} className={`glass p-5 rounded-xl border-l-4 ${config.border}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <svg className={`w-4 h-4 ${config.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={config.icon} />
                          </svg>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-semibold uppercase ${config.color}`}>{issue.severity}</span>
                            <span className="text-xs text-slate-500">{issue.type}</span>
                          </div>
                          <p className="text-sm text-slate-200 mb-1">{issue.description}</p>
                          <p className="text-xs text-emerald-300/70">Fix: {issue.fix}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!result && !isLoading && (
            <div className="glass p-12 rounded-2xl flex flex-col items-center justify-center text-center min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-sky-500/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-slate-400 text-sm">Upload or paste your resume to check for ATS compatibility issues.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
