import { useState, useEffect } from "react";
import { requireAuth, getCookie } from "~/lib/session.server";
import LoadingSpinner from "~/components/LoadingSpinner";
import type { Route } from "./+types/resume-versions";

const BACKEND_URL = "http://localhost:8000";

export function meta() {
  return [
    { title: "Selectify | Resume Versions" },
    { name: "description", content: "Manage multiple versions of your resume" },
  ];
}

export async function loader({ request }: { request: Request }) {
  const userId = await requireAuth(request);
  const token = getCookie(request, "token");

  let resumes: any[] = [];
  try {
    const response = await fetch(`${BACKEND_URL}/api/resumes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const data = await response.json();
      resumes = data.resumes || [];
    }
  } catch (error) {
    console.error("Failed to fetch resumes:", error);
  }

  return { resumes };
}

export default function ResumeVersions({ loaderData }: Route.ComponentProps) {
  const initialResumes = (loaderData as any)?.resumes || [];
  const [resumes, setResumes] = useState<any[]>(initialResumes);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [versionLabel, setVersionLabel] = useState("");

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${BACKEND_URL}/api/resumes`, {
        method: "POST",
        headers: { Authorization: `Bearer ${document.cookie.match(/token=([^;]+)/)?.[1] || ""}` },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResumes((prev) => [data.resume, ...prev]);
        setVersionLabel("");
      } else {
        setError("Failed to upload resume");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (resumeId: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/resumes/${resumeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${document.cookie.match(/token=([^;]+)/)?.[1] || ""}` },
      });

      if (response.ok) {
        setResumes((prev) => prev.filter((r) => r.id !== resumeId));
      }
    } catch {
      setError("Failed to delete resume");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Resume Versions
          </h1>
          <p className="text-slate-400 text-lg">Manage different versions of your resume for different roles.</p>
        </div>
        <label className="bg-sky-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-sky-600 transition-all cursor-pointer shadow-lg shadow-sky-500/20">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Upload Version
          <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} className="hidden" />
        </label>
      </div>

      {isUploading && (
        <div className="glass p-6 rounded-2xl mb-6 flex items-center gap-4">
          <LoadingSpinner size="sm" />
          <span className="text-slate-300">Uploading resume...</span>
        </div>
      )}

      {error && (
        <div className="glass p-4 rounded-xl mb-6 border border-red-500/20 bg-red-500/5">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {resumes.length === 0 ? (
        <div className="glass p-16 rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-sky-500/10 flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No resumes uploaded yet</h3>
          <p className="text-slate-400 text-sm max-w-md">Upload different versions of your resume to track which performs best for different types of roles.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {resumes.map((resume, idx) => (
            <div key={resume.id} className="glass p-6 rounded-2xl flex items-center justify-between group hover:bg-white/[0.03] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{resume.filename}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-medium text-sky-400">
                      v{resumes.length - idx}
                    </span>
                    <span className="text-xs text-slate-500">
                      {resume.uploaded_at ? new Date(resume.uploaded_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Unknown date"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {resume.file_path && (
                  <a href={`${BACKEND_URL}${resume.file_path}`} target="_blank" rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-300 hover:bg-white/10 transition-colors">
                    Download
                  </a>
                )}
                <button onClick={() => handleDelete(resume.id)}
                  className="px-3 py-1.5 rounded-lg bg-red-500/5 border border-red-500/20 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
