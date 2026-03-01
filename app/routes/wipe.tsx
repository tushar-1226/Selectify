import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
import Navbar from "~/components/Navbar";
import AnimatedBackground from "~/components/AnimatedBackground";
import LoadingSpinner from "~/components/LoadingSpinner";
import type { Route } from "./+types/wipe";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Selectify | Wipe Data" },
        { name: "description", content: "Manage your application data" },
    ];
}

const WipeApp = () => {
    const { auth, isLoading, error, fs, kv } = usePuterStore();
    const navigate = useNavigate();
    const [files, setFiles] = useState<FSItem[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadFiles = async () => {
        const files = (await fs.readDir("./")) as FSItem[];
        setFiles(files || []);
    };

    useEffect(() => {
        loadFiles();
    }, []);

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate("/auth?next=/wipe");
        }
    }, [isLoading, auth.isAuthenticated, navigate]);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete all your data? This action cannot be undone.")) {
            return;
        }
        
        setIsDeleting(true);
        try {
            for (const file of files) {
                await fs.delete(file.path);
            }
            await kv.flush();
            await loadFiles();
        } catch (err) {
            console.error("Error deleting files:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <main className="bg-[url('/images/bg-main.svg')] bg-cover relative min-h-screen">
                <AnimatedBackground />
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <LoadingSpinner size="lg" />
                    <p className="text-gray-600">Loading...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover relative min-h-screen">
            <AnimatedBackground />
            <Navbar />
            
            <section className="main-section relative z-10">
                <div className="page-heading py-16 animate-in fade-in duration-700">
                    <h1 className="float-animation">Data Management</h1>
                    <h2>View and manage your application data</h2>
                </div>

                <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8 animate-in fade-in duration-700">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700">Error: {error}</p>
                        </div>
                    )}

                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Account Info</h3>
                        <p className="text-gray-600">Authenticated as: <span className="font-semibold text-gray-800">{auth.user?.username}</span></p>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Files ({files.length})</h3>
                        {files.length > 0 ? (
                            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                                <div className="grid grid-cols-1 gap-2">
                                    {files.map((file) => (
                                        <div 
                                            key={file.id} 
                                            className="flex flex-row items-center gap-4 bg-white p-3 rounded-lg shadow-sm border border-gray-200"
                                        >
                                            <img 
                                                src="/icons/pin.svg" 
                                                alt="file" 
                                                className="w-5 h-5 opacity-50" 
                                            />
                                            <div className="flex-1">
                                                <p className="text-gray-800 font-medium truncate">{file.name}</p>
                                                <p className="text-gray-500 text-sm">{file.path}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No files found.</p>
                        )}
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <h3 className="text-xl font-bold text-red-700 mb-2">Danger Zone</h3>
                            <p className="text-red-600 mb-4">
                                This will permanently delete all your resumes, files, and data. This action cannot be undone.
                            </p>
                            <button
                                className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:shadow-lg disabled:cursor-not-allowed flex items-center gap-2"
                                onClick={handleDelete}
                                disabled={isDeleting || files.length === 0}
                            >
                                {isDeleting ? (
                                    <>
                                        <LoadingSpinner size="sm" color="white" />
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    <span>🗑️ Wipe All Data</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default WipeApp;