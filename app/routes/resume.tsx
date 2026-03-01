import {Link, useParams} from "react-router";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta = () => ([
    { title: 'Selectify | Review' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = () => {
    const { fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);

    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);

            if(!resume) return;

            const data = JSON.parse(resume);

            const resumeBlob = await fs.read(data.resumePath);
            if(!resumeBlob) return;

            const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);

            const imageBlob = await fs.read(data.imagePath);
            if(!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            setFeedback(data.feedback);
            console.log({resumeUrl, imageUrl, feedback: data.feedback });
        }

        loadResume();
    }, [id]);

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
                    {imageUrl && resumeUrl && (
                        <div className="animate-in fade-in duration-1000 glass-panel w-full h-full p-2 flex items-center justify-center">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
                                <img
                                    src={imageUrl}
                                    className="w-full h-full object-contain rounded-xl"
                                    title="resume"
                                />
                            </a>
                        </div>
                    )}
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
                             <div className="w-16 h-16 border-4 border-glass-border border-t-neon-blue rounded-full animate-spin mb-4"></div>
                             <p className="text-text-secondary font-medium tracking-wide pulse-glow">Loading Analysis...</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
export default Resume