import type { Route } from "./+types/home";
import { useState } from "react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Selectify | Application Tracker" },
    { name: "description", content: "Track your job applications" },
  ];
}

export default function JobMatches() {
  const [searchQuery, setSearchQuery] = useState("");

  const columns = [
    {
      id: "saved",
      title: "Saved",
      count: 3,
      color: "from-slate-500 to-slate-600",
      jobs: [
        {
          id: 1,
          title: "Senior Product Designer",
          company: "TechFlow Inc.",
          match: 82,
          date: "Jul 24, 2024",
          icon: "📐"
        }
      ]
    },
    {
      id: "applied",
      title: "Applied",
      count: 2,
      color: "from-sky-500 to-sky-600",
      jobs: [
        {
          id: 2,
          title: "Software Engineer II",
          company: "Nexus Systems",
          match: 85,
          date: "Jul 25, 2024",
          icon: "💻"
        }
      ]
    },
    {
      id: "interviewing",
      title: "Interviewing",
      count: 1,
      color: "from-purple-500 to-purple-600",
      jobs: [
        {
          id: 3,
          title: "Staff UI Engineer",
          company: "GreenHorizon",
          match: 98,
          date: "Oct 16, 2024",
          badge: "ROUND 2: TECHNICAL",
          icon: "💬"
        }
      ]
    },
    {
      id: "offer",
      title: "Offer",
      count: 0,
      color: "from-emerald-500 to-emerald-600",
      jobs: []
    }
  ];

  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Application Tracker</h1>
          <p className="text-slate-400">Manage and track your job search progress across all platforms.</p>
        </div>
        <button className="bg-sky-500 text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-sky-600 transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Application
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-12">
        <div className="relative max-w-md">
          <svg className="absolute left-4 top-3 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2 rounded-lg border border-slate-700 bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
          />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col">
            {/* Column Header */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${column.color}`}></div>
              <h2 className="text-white font-semibold">
                {column.title} <span className="text-slate-500 text-sm font-normal ml-1">{column.count}</span>
              </h2>
            </div>

            {/* Column Content */}
            <div className="flex flex-col gap-4">
              {column.jobs.length > 0 ? (
                column.jobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 hover:border-slate-600 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-3xl">{job.icon}</div>
                      <div className={`text-xs font-bold bg-gradient-to-r ${column.color} bg-clip-text text-transparent`}>
                        {job.match}% Match
                      </div>
                    </div>
                    <h3 className="font-bold text-white text-sm mb-1 group-hover:text-sky-400 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-500 mb-3">{job.company}</p>
                    {job.badge && (
                      <div className="text-xs font-bold text-amber-400 bg-amber-500/20 border border-amber-500/50 rounded px-2 py-1 inline-block mb-3">
                        {job.badge}
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {job.date}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                  </svg>
                  <p className="text-sm">No offers yet</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="text-center text-sm text-slate-500 p-4 border-t border-slate-800">
        System Online
      </div>
    </main>
  );
}
