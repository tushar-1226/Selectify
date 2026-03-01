import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import AnimatedBackground from "~/components/AnimatedBackground";
import LoadingSpinner from "~/components/LoadingSpinner";

export const meta = () => ([
    { title: 'Selectify | Auth' },
    { name: 'description', content: 'Log into your account' },
])

const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next])

    return (
        <main className="relative min-h-screen flex items-center justify-center overflow-hidden selection:bg-primary-500 selection:text-white">
            <AnimatedBackground />
            
            <div className="w-full max-w-md mx-auto p-4 animate-in fade-in zoom-in-95 duration-700 relative z-10">
                <section className="flex flex-col gap-8 glass-card p-10 md:p-12 text-center text-dark-400">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center shadow-lg shadow-primary-500/30 mb-2">
                            <span className="text-white font-bold text-3xl leading-none">S</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight mb-0">Welcome Back</h1>
                        <p className="text-dark-200">Log in to track your resume performance.</p>
                    </div>
                    
                    <div className="w-full mt-4">
                        {isLoading ? (
                            <button className="primary-button flex items-center justify-center gap-3 w-full opacity-80 cursor-not-allowed">
                                <LoadingSpinner size="sm" color="white" />
                                <span>Authenticating...</span>
                            </button>
                        ) : (
                            <>
                                {auth.isAuthenticated ? (
                                    <button
                                        className="secondary-button"
                                        onClick={auth.signOut}
                                    >
                                        Log Out
                                    </button>
                                ) : (
                                    <button
                                        className="primary-button w-full flex items-center justify-center gap-2 group"
                                        onClick={auth.signIn}
                                    >
                                        <span>Continue with Puter</span>
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    )
}

export default Auth