import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import LoadingSpinner from "~/components/LoadingSpinner";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Selectify | Dashboard" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { kv } = usePuterStore();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list('resume:*', true)) as KVItem[];

      const parsedResumes = resumes?.map((resume) => (
        JSON.parse(resume.value) as Resume
      ))

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    }

    loadResumes()
  }, [kv]);

  return <div className="pb-20">
    <div className="page-heading animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-sm font-medium mb-4 backdrop-blur-md glow-neon-blue">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-blue opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-blue"></span>
        </span>
        Your Dashboard
      </div>
      <h1 className="text-text-primary">Track and improve your applications</h1>
      {!loadingResumes && resumes?.length === 0 ? (
        <h2 className="text-text-secondary mt-2">Upload your first resume to get AI-powered, actionable feedback.</h2>
      ) : (
        <h2 className="text-text-secondary mt-2">Review your past submissions and view detailed ATS scores.</h2>
      )}
    </div>

    {loadingResumes && (
      <div className="flex flex-col items-center justify-center gap-4 py-20 animate-in fade-in duration-500">
        <LoadingSpinner size="lg" />
        <p className="text-text-secondary font-medium tracking-wide">Fetching your resumes...</p>
      </div>
    )}

    {!loadingResumes && resumes.length > 0 && (
      <div className="resumes-section mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {resumes.map((resume, index) => (
          <div
            key={resume.id}
            style={{ animationDelay: `${index * 150}ms` }}
            className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both w-full"
          >
            <ResumeCard resume={resume} />
          </div>
        ))}
      </div>
    )}

    {!loadingResumes && resumes?.length === 0 && (
      <div className="flex flex-col items-center justify-center mt-12 py-16 px-8 max-w-2xl mx-auto glass-card animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-20 h-20 bg-neon-blue/10 text-neon-blue rounded-full flex items-center justify-center mb-6 glow-neon-blue">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        </div>
        <h3 className="text-2xl font-semibold mb-2 text-text-primary">No resumes yet</h3>
        <p className="text-text-secondary text-center mb-8 max-w-md">Start your journey by uploading a resume and pasting a job description. We'll give you a detailed ATS score and improvement tips.</p>
        <Link to="/upload" className="primary-button group max-w-xs">
          Upload Your First Resume
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    )}
  </div>
}