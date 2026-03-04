import { useState, useEffect } from "react";
import type { Route } from "./+types/resume-editor";
import ScoreGauge from "~/components/ScoreGauge";
import { requireAuth } from "~/lib/session.server";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Selectify | Resume Editor" },
        { name: "description", content: "Edit your resume with real-time AI feedback" },
    ];
}

export async function loader({ request }: { request: Request }) {
    await requireAuth(request);
    return {};
}

const defaultResumeText = `John Doe
johndoe@email.com | (555) 123-4567 | github.com/johndoe

SUMMARY
Experienced Software Engineer with a passion for building scalable web applications.

EXPERIENCE
Senior Frontend Developer
Tech Innovators Inc. (2020 - Present)
- Developed responsive web applications using React and TypeScript.
- Improved application performance by 30% through code splitting and lazy loading.
- Mentored junior developers and conducted code reviews.

Web Developer
Creative Solutions (2017 - 2020)
- Designed and redeveloped company website using Next.js and TailwindCSS.
- Integrated RESTful APIs and optimized data fetching.

EDUCATION
B.S. in Computer Science
State University (2013 - 2017)

SKILLS
JavaScript, TypeScript, React, Node.js, HTML, CSS, Git
`;

const ResumeEditor = () => {
    const [resumeText, setResumeText] = useState(defaultResumeText);
    const [score, setScore] = useState(74);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Simple auto-save/mock analysis simulation
    useEffect(() => {
        const analyzeTimer = setTimeout(() => {
            setIsAnalyzing(true);
            setTimeout(() => {
                const boost = Math.min(20, Math.floor(resumeText.length / 100));
                setScore(Math.min(99, 60 + boost));
                setIsAnalyzing(false);
            }, 800);
        }, 1500);

        return () => clearTimeout(analyzeTimer);
    }, [resumeText]);

    return (
        <div className="pb-20 min-h-[calc(100vh-80px)] flex flex-col">
            <div className="page-heading pt-10 pb-6 animate-in fade-in slide-in-from-top-4 duration-700">
                <h1 className="text-text-primary mb-2">Resume Editor</h1>
                <h2 className="text-text-secondary">Refine your resume with real-time feedback and dynamic scoring.</h2>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 h-full">

                {/* Editor Pane */}
                <div className="lg:col-span-2 glass-panel p-6 flex flex-col !h-[70vh]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-text-primary">Content</h3>
                        <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-neon-amber animate-pulse' : 'bg-neon-emerald'}`}></div>
                             <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                {isAnalyzing ? 'Analyzing...' : 'Auto-saved'}
                             </span>
                        </div>
                    </div>
                    <textarea
                        className="flex-1 w-full bg-dark-surface/50 border border-glass-border rounded-xl p-4 text-text-primary placeholder:text-text-tertiary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-neon-blue/50 resize-none transition-shadow"
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        placeholder="Start typing your resume here..."
                        spellCheck={false}
                    />
                </div>

                {/* Score & Feedback Pane */}
                <div className="glass-panel p-6 flex flex-col gap-8 !h-[70vh] overflow-y-auto custom-scrollbar">

                    <div>
                        <h3 className="text-xl font-bold text-text-primary mb-6">Real-Time Score</h3>
                        <div className="flex justify-center bg-dark-surface p-6 rounded-2xl border border-glass-border">
                             <ScoreGauge score={score} />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-text-primary mb-4">Actionable Tips</h3>
                        <div className="flex flex-col gap-3">
                            <div className="bg-neon-emerald/5 border border-neon-emerald/20 p-4 rounded-xl">
                                <span className="text-xs font-bold text-neon-emerald uppercase tracking-wider mb-1 block">Good</span>
                                <p className="text-sm font-medium text-text-secondary">Clear contact information provided.</p>
                            </div>
                            <div className="bg-neon-amber/5 border border-neon-amber/20 p-4 rounded-xl">
                                <span className="text-xs font-bold text-neon-amber uppercase tracking-wider mb-1 block">Improvement</span>
                                <p className="text-sm font-medium text-text-secondary">Use stronger action verbs in your experience section (e.g., "Spearheaded", "Engineered").</p>
                            </div>
                            <div className="bg-neon-pink/5 border border-neon-pink/20 p-4 rounded-xl">
                                <span className="text-xs font-bold text-neon-pink uppercase tracking-wider mb-1 block">Critical</span>
                                <p className="text-sm font-medium text-text-secondary">Missing quantitative metrics. Try to add numbers to show impact (e.g., "by 40%").</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-6">
                        <button className="primary-button w-full shadow-neon-glow hover:shadow-neon-glow/80 active:scale-95 transition-all">
                            Export PDF
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ResumeEditor;
