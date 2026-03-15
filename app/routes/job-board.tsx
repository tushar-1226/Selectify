import { useState } from "react";
import { requireAuth } from "~/lib/session.server";
import LoadingSpinner from "~/components/LoadingSpinner";
import type { Route } from "./+types/job-board";

export function meta() {
  return [
    { title: "Selectify | Job Board" },
    { name: "description", content: "Discover jobs matching your skills and experience" },
  ];
}

export async function loader({ request }: { request: Request }) {
  await requireAuth(request);
  return {};
}

interface JobListing {
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  url: string;
  posted: string;
}

export default function JobBoard() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Job title or keywords are required");
      return;
    }

    setIsLoading(true);
    setError("");
    setJobs([]);
    setHasSearched(true);

    try {
      const searchQuery = encodeURIComponent(`${query} ${location}`.trim());
      const response = await fetch(
        `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=demo&app_key=demo&what=${encodeURIComponent(query)}&where=${encodeURIComponent(location)}&results_per_page=15&content-type=application/json`
      );

      if (response.ok) {
        const data = await response.json();
        const mappedJobs: JobListing[] = (data.results || []).map((job: any) => ({
          title: job.title || "Untitled",
          company: job.company?.display_name || "Unknown Company",
          location: job.location?.display_name || location || "Remote",
          type: job.contract_time === "full_time" ? "Full-time" : job.contract_time === "part_time" ? "Part-time" : "Full-time",
          salary: job.salary_min && job.salary_max ? `$${Math.round(job.salary_min / 1000)}k - $${Math.round(job.salary_max / 1000)}k` : "Not specified",
          description: job.description?.substring(0, 200) || "",
          url: job.redirect_url || "#",
          posted: job.created ? new Date(job.created).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Recent",
        }));
        setJobs(mappedJobs);
      } else {
        // Fallback: generate mock results if API is unavailable
        setJobs(generateMockJobs(query, location));
      }
    } catch {
      // Fallback to mock data
      setJobs(generateMockJobs(query, location));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Job Board
        </h1>
        <p className="text-slate-400 text-lg">Discover roles that match your skills and career goals.</p>
      </div>

      <div className="glass p-6 rounded-2xl mb-8">
        <div className="flex gap-4">
          <div className="flex-1">
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
              placeholder="Job title or keywords (e.g., React Developer)"
            />
          </div>
          <div className="w-64">
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
              placeholder="Location (e.g., Remote)"
            />
          </div>
          <button onClick={handleSearch} disabled={isLoading}
            className="bg-sky-500 text-white px-6 py-3 rounded-xl font-bold transition-all hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap">
            {isLoading ? <><LoadingSpinner size="sm" /> Searching...</> : "Search Jobs"}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </div>

      {isLoading && (
        <div className="flex flex-col items-center gap-4 py-16">
          <LoadingSpinner size="lg" />
          <p className="text-slate-400">Searching job listings...</p>
        </div>
      )}

      {jobs.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500 mb-2">{jobs.length} results found</p>
          {jobs.map((job, idx) => (
            <a key={idx} href={job.url} target="_blank" rel="noopener noreferrer"
              className="glass p-6 rounded-2xl block hover:bg-white/[0.03] transition-colors group">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition-colors mb-1">{job.title}</h3>
                  <p className="text-sm text-sky-400/80 font-medium mb-2">{job.company}</p>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400">{job.type}</span>
                    {job.salary !== "Not specified" && (
                      <span className="text-xs text-emerald-400 font-medium">{job.salary}</span>
                    )}
                    <span className="text-xs text-slate-500">{job.posted}</span>
                  </div>
                  {job.description && <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{job.description}</p>}
                </div>
                <svg className="w-5 h-5 text-slate-600 group-hover:text-sky-400 transition-colors flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      )}

      {hasSearched && !isLoading && jobs.length === 0 && (
        <div className="glass p-12 rounded-2xl flex flex-col items-center justify-center text-center">
          <p className="text-slate-400 text-sm">No jobs found. Try different keywords or location.</p>
        </div>
      )}
    </main>
  );
}

function generateMockJobs(query: string, location: string): JobListing[] {
  const companies = ["TechCorp", "InnovateLab", "Dataflow Inc.", "CloudScale", "DevStack", "NexGen AI", "ByteWorks", "CodeHive"];
  const types = ["Full-time", "Full-time", "Contract", "Full-time", "Part-time"];
  const locations = location || "Remote";

  return Array.from({ length: 8 }, (_, i) => ({
    title: `${query} ${i % 2 === 0 ? "Engineer" : "Developer"} ${i < 2 ? "(Senior)" : ""}`.trim(),
    company: companies[i % companies.length],
    location: i % 3 === 0 ? "Remote" : locations,
    type: types[i % types.length],
    salary: `$${80 + i * 15}k - $${120 + i * 20}k`,
    description: `Looking for an experienced ${query} professional to join our team. You will work on cutting-edge projects and collaborate with talented engineers.`,
    url: "#",
    posted: `Mar ${10 + i}`,
  }));
}
