import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { useEffect, useState, type FormEvent } from "react";
import type { Route } from "./+types/interview-prep";
import LoadingSpinner from "~/components/LoadingSpinner";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Selectify | Interview Prep" },
        { name: "description", content: "Generate custom interview questions and tips based on your resume" },
    ];
}

const mockQuestions = [
    {
        id: 1,
        question: "Can you tell me more about your experience developing responsive web applications using React at Tech Innovators Inc.?",
        type: "Experience",
        tips: "Focus on specific projects, the challenges you faced, and how your responsive design improved user engagement."
    },
    {
        id: 2,
        question: "How do you approach code splitting and lazy loading to improve performance by 30%?",
        type: "Technical",
        tips: "Explain the concepts clearly, mention the tools you used (like Webpack or Vite), and discuss the trade-offs."
    },
    {
        id: 3,
        question: "Describe a time you mentored a junior developer. What was your approach and what was the outcome?",
        type: "Behavioral",
        tips: "Use the STAR method (Situation, Task, Action, Result). Highlight your patience, feedback style, and their growth."
    },
];

const InterviewPrep = () => {
    const { auth, isLoading } = usePuterStore();
    const navigate = useNavigate();
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate('/auth?next=/interview-prep');
        }
    }, [isLoading, auth.isAuthenticated, navigate]);

    const handleGenerate = (e: FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);
        // Simulate AI generation delay
        setTimeout(() => {
            setIsGenerating(false);
            setHasGenerated(true);
        }, 2000);
    }

    return (
        <div className="pb-20 min-h-screen">
            <div className="page-heading pt-10 pb-6 animate-in fade-in slide-in-from-top-4 duration-700">
                <h1 className="text-text-primary mb-2">Interview Preparation</h1>
                <h2 className="text-text-secondary">Generate tailored interview questions based on your parsed resume and target job.</h2>
            </div>

            <div className="max-w-4xl mx-auto w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
                
                {/* Configuration Panel */}
                <div className="glass-panel p-8">
                    <form onSubmit={handleGenerate} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-div">
                                <label htmlFor="target-role">Target Role</label>
                                <input id="target-role" type="text" placeholder="e.g., Senior Frontend Engineer" defaultValue="Senior Frontend Engineer" required />
                            </div>
                            <div className="form-div">
                                <label htmlFor="interview-stage">Interview Stage</label>
                                <select id="interview-stage" className="bg-dark-surface/50 border border-glass-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-colors appearance-none" required>
                                    <option value="hr">HR Screen</option>
                                    <option value="technical">Technical Round</option>
                                    <option value="behavioral">Behavioral / Cultural</option>
                                    <option value="manager">Hiring Manager</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-div w-full">
                            <label>Selected Resume (Active Context)</label>
                            <div className="px-4 py-3 bg-white/5 border border-glass-border rounded-xl flex items-center gap-3">
                                <svg className="w-5 h-5 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-text-primary font-medium">John_Doe_Frontend_Resume.pdf</span>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button type="submit" className="primary-button group w-full md:w-auto" disabled={isGenerating}>
                                {isGenerating ? (
                                    <span className="flex items-center gap-2">
                                        <LoadingSpinner size="sm" />
                                        Generating...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Generate Questions
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Generated Results */}
                {hasGenerated && (
                    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-3 mb-2 px-2">
                            <div className="w-2 h-2 rounded-full bg-neon-emerald"></div>
                            <h3 className="text-xl font-bold text-text-primary uppercase tracking-widest text-sm">Generated Practice Questions</h3>
                        </div>

                        {mockQuestions.map((q, i) => (
                            <div key={q.id} className="glass-panel p-6 flex flex-col gap-4 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-neon-blue/50 group-hover:bg-neon-blue transition-colors"></div>
                                
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <span className="text-xs font-bold text-neon-blue uppercase tracking-wider mb-2 block">{q.type} Question</span>
                                        <p className="text-lg font-medium text-text-primary leading-relaxed">"{q.question}"</p>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-glass-border text-text-secondary hover:text-text-primary" title="Record Answer">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                            </svg>
                                        </button>
                                        <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-glass-border text-text-secondary hover:text-text-primary" title="Save Question">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="bg-dark-surface/50 border border-glass-border p-4 rounded-xl mt-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg className="w-4 h-4 text-neon-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm font-bold text-text-secondary uppercase">Pro Tip</span>
                                    </div>
                                    <p className="text-sm text-text-tertiary">{q.tips}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterviewPrep;
