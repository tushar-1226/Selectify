import { Link } from "react-router";
import { useState, useEffect } from "react";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar flex w-full transition-all duration-500 ${scrolled ? 'shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] py-3 top-4' : 'shadow-sm py-4 top-6'}`}>
            <Link to="/" className="group flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center shadow-md group-hover:shadow-primary-500/30 transition-shadow">
                    <span className="text-white font-bold text-lg leading-none">S</span>
                </div>
                <span className="text-2xl font-bold text-dark-400 tracking-tight group-hover:text-primary-600 transition-colors">
                    Selectify
                </span>
            </Link>
            <div className="flex items-center gap-6">
                <Link to="/" className="text-sm font-medium text-dark-200 hover:text-dark-400 transition-colors hidden md:block">Dashboard</Link>
                <Link
                    to="/upload"
                    className="primary-button !px-6 !py-2.5 !text-sm !w-auto"
                >
                    <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        New Analysis
                    </span>
                </Link>
            </div>
        </nav>
    )
}

export default Navbar;