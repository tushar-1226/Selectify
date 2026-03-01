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

        setStatusText('Uploading the file...');
        const uploadedFile = await fs.upload([file]);
        if (!uploadedFile) return setStatusText('Error: Failed to upload file');

        setStatusText('Converting to image...');
        const imageFile = await convertPdfToImage(file);
        if (!imageFile.file) return setStatusText('Error: Failed to convert PDF to image');

        setStatusText('Uploading the image...');
        const uploadedImage = await fs.upload([imageFile.file]);
        if (!uploadedImage) return setStatusText('Error: Failed to upload image');

        setStatusText('Preparing data...');
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: '',
        }
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText('Analyzing...');

        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({ jobTitle, jobDescription, AIResponseFormat })
        )
        if (!feedback) return setStatusText('Error: Failed to analyze resume');

        const feedbackText = typeof feedback.message.content === 'string'
            ? feedback.message.content
            : feedback.message.content[0]?.text || '';

        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText('Analysis complete, redirecting...');
        console.log(data);
        navigate(`/resume/${uuid}`);
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
            <div className="page-heading pt-10 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 className="text-text-primary mb-2">Evaluate your fit</h1>
                {isProcessing ? (
                    <div className="flex flex-col items-center gap-6 mt-12 glass-panel p-12 max-w-lg mx-auto border-dashed border-neon-blue/30 glow-neon-blue">
                        <LoadingSpinner size="lg" />
                        <h2 className="text-neon-blue font-semibold pulse-glow">{statusText}</h2>
                        <p className="text-text-secondary text-sm">Please wait while our AI analyzes your resume against the job description.</p>
                    </div>
                ) : (
                    <h2 className="text-text-secondary">Upload your resume and the job description for a detailed ATS analysis.</h2>
                )}
            </div>

            {!isProcessing && (
                <div className="w-full max-w-3xl mx-auto glass-panel p-8 md:p-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
                    <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            <div className="form-div">
                                <label htmlFor="company-name">Target Company</label>
                                <input 
                                    type="text" 
                                    name="company-name" 
                                    placeholder="e.g., Google, Stripe, Notion" 
                                    id="company-name"
                                    required
                                />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input 
                                    type="text" 
                                    name="job-title" 
                                    placeholder="e.g., Senior Frontend Engineer" 
                                    id="job-title"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="form-div w-full">
                            <label htmlFor="job-description">Job Description</label>
                            <textarea 
                                rows={6} 
                                name="job-description" 
                                placeholder="Paste the full job description or responsibilities here..." 
                                id="job-description"
                                required
                            />
                        </div>

                        <div className="form-div w-full mt-2">
                            <label htmlFor="uploader" className="mb-2">Your Resume (PDF)</label>
                            <FileUploader onFileSelect={handleFileSelect} />
                        </div>

                        <div className="pt-6 border-t border-glass-border flex justify-end w-full">
                            <button 
                                className="primary-button group max-w-xs" 
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