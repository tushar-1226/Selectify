import { type FormEvent, useState, useEffect } from 'react'
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions, AIResponseFormat } from "../../constants";
import LoadingSpinner from "~/components/LoadingSpinner";
import type { Route } from "./+types/upload";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Selectify | Upload" },
        { name: "description", content: "Upload your resume for AI-powered feedback" },
    ];
}

// Extract text from PDF file
async function extractTextFromPdf(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
    const lib = await import("pdfjs-dist/build/pdf.mjs");
    lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str || '').join(' ');
        fullText += pageText + '\n';
    }

    return fullText;
}

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File }) => {
        setIsProcessing(true);

        try {
            setStatusText('Uploading the file...');
            const uploadedFile = await fs.upload([file]);
            if (!uploadedFile) return setStatusText('Error: Failed to upload file');

            setStatusText('Converting to image...');
            const imageFile = await convertPdfToImage(file);
            console.error("PDF Conversion Output:", imageFile);
            if (!imageFile.file) return setStatusText('Error: ' + (imageFile.error || 'Failed to convert PDF to image'));

            setStatusText('Uploading the image...');
            const uploadedImage = await fs.upload([imageFile.file]);
            if (!uploadedImage) return setStatusText('Error: Failed to upload image');

            setStatusText('Extracting resume text...');
            const resumeText = await extractTextFromPdf(file);

            setStatusText('Preparing data...');
            const uuid = generateUUID();
            const data: any = {
                id: uuid,
                resumePath: uploadedFile.path,
                imagePath: uploadedImage.path,
                resumeText,
                companyName, jobTitle, jobDescription,
                feedback: '',
                geminiAnalysis: null,
            }
            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            setStatusText('Analyzing with Puter AI...');

            const feedback = await ai.feedback(
                uploadedFile.path,
                prepareInstructions({ jobTitle, jobDescription, AIResponseFormat })
            )
            if (!feedback) return setStatusText('Error: Failed to analyze resume');

            const feedbackText = typeof feedback.message.content === 'string'
                ? feedback.message.content
                : feedback.message.content[0]?.text || '';

            data.feedback = JSON.parse(feedbackText);

            // Also analyze with Gemini API
            setStatusText('Running Gemini AI analysis...');
            try {
                const formData = new FormData();
                formData.append('resumeText', resumeText);
                formData.append('jobDescription', jobDescription);

                const geminiResponse = await fetch('/api/analyze', {
                    method: 'POST',
                    body: formData
                });

                if (geminiResponse.ok) {
                    const geminiData = await geminiResponse.json();
                    if (geminiData.success) {
                        data.geminiAnalysis = geminiData.data;
                    }
                }
            } catch (error) {
                console.warn('Gemini analysis failed:', error);
                // Continue without Gemini analysis
            }

            await kv.set(`resume:${uuid}`, JSON.stringify(data));
            setStatusText('Analysis complete, redirecting...');
            navigate(`/analysis?id=${uuid}`);
        } catch (error) {
            console.error('Error during analysis:', error);
            setStatusText(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if (!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if (!companyName || !jobTitle || !jobDescription) {
            alert('Please fill in all fields');
            return;
        }

        if (!file) {
            alert('Please upload a PDF file');
            return;
        }

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <div className="pb-20">
            <div className="pt-32 pb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 className="text-4xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Evaluate your fit</h1>
                {isProcessing ? (
                    <div className="flex flex-col items-center gap-6 mt-12 glass-panel p-12 max-w-lg mx-auto border-dashed border-neon-blue/30 glow-neon-blue">
                        <LoadingSpinner size="lg" />
                        <h2 className="text-neon-blue font-semibold pulse-glow">{statusText}</h2>
                        <p className="text-text-secondary text-sm">Please wait while our AI analyzes your resume against the job description.</p>
                    </div>
                ) : (
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">Upload your resume and the job description for a detailed ATS analysis.</p>
                )}
            </div>

            {!isProcessing && (
                <div className="w-full max-w-3xl mx-auto glass-panel p-8 md:p-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
                    <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            <div className="form-div">
                                <label htmlFor="company-name" className="text-sm font-semibold text-slate-300 mb-2">Target Company</label>
                                <input 
                                    type="text" 
                                    name="company-name" 
                                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
                                    placeholder="e.g., Google, Stripe, Notion" 
                                    id="company-name"
                                    required
                                />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title" className="text-sm font-semibold text-slate-300 mb-2">Job Title</label>
                                <input 
                                    type="text" 
                                    name="job-title" 
                                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
                                    placeholder="e.g., Senior Frontend Engineer" 
                                    id="job-title"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="form-div w-full">
                            <label htmlFor="job-description" className="text-sm font-semibold text-slate-300 mb-2">Job Description</label>
                            <textarea 
                                rows={6} 
                                name="job-description" 
                                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all resize-none"
                                placeholder="Paste the full job description or responsibilities here..." 
                                id="job-description"
                                required
                            />
                        </div>

                        <div className="form-div w-full mt-2">
                            <label htmlFor="uploader" className="text-sm font-semibold text-slate-300 mb-2">Your Resume (PDF)</label>
                            <FileUploader onFileSelect={handleFileSelect} />
                        </div>

                        <div className="pt-6 mt-4 border-t border-slate-800 flex justify-end w-full">
                            <button 
                                className="bg-sky-500 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto group" 
                                type="submit"
                                disabled={!file}
                            >
                                {file ? 'Start Analysis' : 'Upload Resume First'}
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}
export default Upload