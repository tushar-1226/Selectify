import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import ScoreBadge from "~/components/ScoreBadge";
import type { Route } from "./+types/job-matches";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Selectify | Job Matches" },
        { name: "description", content: "Explore recommended jobs based on your profile" },
    ];
}

const mockJobs = [
    {
        id: 1,
        title: "Senior React Engineer",
        company: "Vercel",
        location: "Remote",
        type: "Full-time",
        matchScore: 92,
        logo: "https://logo.clearbit.com/vercel.com",
    },
    {
        id: 2,
        title: "Frontend Developer",
        company: "Stripe",
        location: "San Francisco, CA / Remote",
        type: "Full-time",
        matchScore: 85,
        logo: "https://logo.clearbit.com/stripe.com",
    },
    {
        id: 3,
        title: "UI Engineer",
        company: "Linear",
        location: "Remote",
        type: "Full-time",
        matchScore: 78,
        logo: "https://logo.clearbit.com/linear.app",
    },
    {
        id: 4,
        title: "Fullstack Developer (React/Node)",
        company: "Notion",
        location: "New York, NY",
        type: "Hybrid",
        matchScore: 65,
        logo: "https://logo.clearbit.com/notion.so",
    }
];

const JobMatches = () => {
    const { auth, isLoading } = usePuterStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate('/auth?next=/job-matches');
        }
    }, [isLoading, auth.isAuthenticated, navigate]);

    return (
        <div className="pb-20 min-h-screen">
            <div className="page-heading pt-10 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 className="text-text-primary mb-2">Job Matches</h1>
                <h2 className="text-text-secondary">Explore AI-curated roles that fit your resume profile.</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
                {mockJobs.map(job => (
                    <div key={job.id} className="glass-panel p-6 flex flex-col justify-between hover:shadow-neon-glow transition-all duration-300 group">
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-white/10 rounded-xl border border-glass-border">
                                    <img src={job.logo} alt={job.company} className="w-8 h-8 object-contain rounded-md" onError={(e) => { e.currentTarget.src = "/placeholder-logo.png" }} />
                                </div>
                                <ScoreBadge score={job.matchScore} />
                            </div>
                            
                            <div>
                                <h3 className="text-xl font-bold text-text-primary group-hover:text-neon-blue transition-colors">{job.title}</h3>
                                <p className="text-text-secondary font-medium mt-1">{job.company}</p>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-2">
                                <span className="px-3 py-1 bg-white/5 border border-glass-border rounded-full text-xs text-text-tertiary">{job.location}</span>
                                <span className="px-3 py-1 bg-white/5 border border-glass-border rounded-full text-xs text-text-tertiary">{job.type}</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-glass-border">
                            <a 
                                href="#" 
                                className="w-full text-center flex items-center justify-center gap-2 primary-button text-sm py-2.5"
                            >
                                Apply Now
                                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JobMatches;
