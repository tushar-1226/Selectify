import { Link, useLocation } from "react-router";
import { LayoutDashboard, FileText, Briefcase, Settings, LogOut } from "lucide-react";
import { usePuterStore } from "~/lib/puter";

export default function Sidebar() {
  const location = useLocation();
  const { auth } = usePuterStore();

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "My Resumes", href: "/resumes", icon: FileText },
    { label: "Job Matches", href: "/matches", icon: Briefcase },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 glass-panel border-l-0 border-y-0 border-r border-glass-border rounded-none z-50 flex flex-col justify-between py-8 px-4">
      <div>
        <Link to="/" className="flex items-center gap-3 px-2 mb-12">
          <div className="w-10 h-10 rounded-xl bg-neon-blue flex items-center justify-center glow-neon-blue">
            <svg
              className="w-6 h-6 text-dark-base"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-text-primary tracking-tight">Selectify</span>
        </Link>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Support partial matching for active states (e.g. /resumes/:id)
            const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-medium ${
                  isActive
                    ? "bg-neon-blue/10 text-neon-blue border border-neon-blue/30 shadow-[0_0_15px_rgba(0,240,255,0.1)]"
                    : "text-text-secondary hover:bg-dark-surface-elevated hover:text-text-primary border border-transparent hover:border-glass-border"
                }`}
              >
                <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-neon-blue" : "text-text-muted group-hover:text-text-primary"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <button
        onClick={auth.signOut}
        className="group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-medium text-text-secondary hover:bg-neon-pink/10 hover:text-neon-pink hover:border-neon-pink/30 border border-transparent hover:shadow-[0_0_15px_rgba(255,0,127,0.1)] w-full"
      >
        <LogOut className="w-5 h-5 text-text-muted group-hover:text-neon-pink transition-colors" />
        Sign Out
      </button>
    </aside>
  );
}
