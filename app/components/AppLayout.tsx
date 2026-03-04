import type { ReactNode } from "react";
import Navbar from "./Navbar";
import AnimatedBackground from "./AnimatedBackground";

interface AppLayoutProps {
  children: ReactNode;
  user: { id: string; email: string; name: string | null; createdAt: Date };
}

export default function AppLayout({ children, user }: AppLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen w-full relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AnimatedBackground />
      <Navbar user={user} />
      <main className="flex-1 relative z-10">
        {children}
      </main>
      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-12 px-6 mt-20 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center text-xs font-bold text-white">S</div>
            <span className="font-bold text-slate-400">Selectify © 2024</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <a className="hover:text-sky-400 transition-colors" href="#privacy">Privacy Policy</a>
            <a className="hover:text-sky-400 transition-colors" href="#terms">Terms of Service</a>
            <a className="hover:text-sky-400 transition-colors" href="#support">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
