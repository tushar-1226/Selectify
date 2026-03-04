import { Link, useLocation } from "react-router";
import { useState, useEffect } from "react";

interface NavbarProps {
  user: { id: string; email: string; name: string | null };
}

const Navbar = ({ user }: NavbarProps) => {
    const [scrolled, setScrolled] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    const navItems = [
        { label: "Dashboard", path: "/" },
        { label: "Analysis", path: "/analysis" },
        { label: "Tracker", path: "/job-matches" },
        { label: "Career Path", path: "/career-path" }
    ];

    const initials = user.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : user.email[0].toUpperCase();

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${scrolled ? 'bg-slate-900/80 backdrop-blur-lg shadow-lg' : ''}`}>
            <div className={`max-w-7xl mx-auto flex items-center justify-between ${scrolled ? '' : 'glass rounded-full px-6 py-3'}`}>
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">S</div>
                    <span className="text-xl font-bold tracking-tight text-white">Selectify</span>
                </Link>

                {/* Navigation */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`transition-colors py-2 ${
                                isActive(item.path)
                                    ? 'text-sky-400 border-b-2 border-sky-400 pb-0.5'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}

                    {/* Practice Dropdown */}
                    <div className="relative group">
                        <button className={`flex items-center gap-1 transition-colors py-2 ${
                            isActive('/dsa-practice') || isActive('/mock-interview') || isActive('/interview-prep') || isActive('/dsa-report') || isActive('/mock-session')
                                ? 'text-sky-400 border-b-2 border-sky-400 pb-0.5'
                                : 'text-slate-400 hover:text-white'
                        }`}>
                            Practice
                            <svg className="w-4 h-4 opacity-70 group-hover:rotate-180 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div className="absolute top-10 left-0 w-48 rounded-xl bg-slate-900 border border-slate-700 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                            <Link to="/dsa-practice" className="block px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border-b border-slate-700/50">
                                DSA Practice
                            </Link>
                            <Link to="/mock-interview" className="block px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border-b border-slate-700/50">
                                Mock Interviews
                            </Link>
                            <Link to="/interview-prep" className="block px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                                Interview Q&A
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>

                    {/* User Avatar / Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-sky-600 flex items-center justify-center text-xs font-bold text-white ring-2 ring-white/10 hover:ring-sky-400/50 transition-all cursor-pointer"
                        >
                            {initials}
                        </button>
                        {showUserMenu && (
                            <div className="absolute top-12 right-0 w-56 rounded-xl bg-slate-900 border border-slate-700 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="px-4 py-3 border-b border-slate-700/50">
                                    <p className="text-sm font-medium text-white truncate">{user.name || "User"}</p>
                                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                </div>
                                <Link
                                    to="/logout"
                                    className="block px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-slate-800 transition-colors"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    Sign Out
                                </Link>
                            </div>
                        )}
                    </div>

                    <Link
                        to="/upload"
                        className="bg-sky-500 text-white px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Analysis
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;