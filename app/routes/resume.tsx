import { Link, useParams } from "react-router";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import { requireAuth } from "~/lib/session.server";
import { prisma } from "~/lib/db.server";
import type { Route } from "./+types/resume";

export const meta = () => ([
    { title: 'Selectify | Review' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

export async function loader({ request, params }: { request: Request; params: { id: string } }) {
    const userId = await requireAuth(request);

    const record = await prisma.resumeAnalysis.findFirst({
        where: { id: params.id, userId },
    });

    if (!record) {
        return { feedback: null };
    }

    try {
        const parsed = JSON.parse(record.analysisData);
        return { feedback: parsed?.feedback || null };
    } catch {
        return { feedback: null };
    }
}

const Resume = ({ loaderData }: Route.ComponentProps) => {
    const feedback = (loaderData as any)?.feedback as Feedback | null;

    return (
        <div className="pb-10 min-h-screen">
            <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
                <Link to="/" className="back-button w-max inline-flex">
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Back to Dashboard</span>
                </Link>
            </div>
            <div className="flex flex-col lg:flex-row w-full gap-8">
                <section className="w-full lg:w-[45%] xl:w-2/5 h-[85vh] lg:sticky lg:top-8 flex items-center justify-center">
                    <div className="glass-panel w-full h-full p-6 flex items-center justify-center">
                        <p className="text-text-secondary text-sm">Resume preview is available after re-uploading.</p>
                    </div>
                </section>
                <section className="w-full lg:w-[55%] xl:w-3/5 flex flex-col gap-8">
                    <h2 className="text-4xl text-text-primary font-bold tracking-tight">Application Analysis</h2>
                    {feedback ? (
                        <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <Summary feedback={feedback} />
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 glass-panel">
                            <p className="text-text-secondary font-medium">No analysis data found.</p>
                            <Link to="/upload" className="text-neon-blue hover:underline mt-4 text-sm">Upload a resume →</Link>
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
export default Resume