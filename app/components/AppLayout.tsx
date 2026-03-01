import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import AnimatedBackground from "./AnimatedBackground";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full relative selection:bg-neon-blue/30 selection:text-neon-blue">
      <AnimatedBackground />
      <Sidebar />
      <main className="flex-1 ml-64 p-8 xl:p-12 relative z-10 transition-all duration-500 overflow-x-hidden">
        <div className="max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
