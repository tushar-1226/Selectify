import type { Route } from "./+types/home";
import { useState } from "react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Selectify | Career Roadmap" },
    { name: "description", content: "Your personalized career growth roadmap" },
  ];
}

export default function CareerPath() {
  const [selectedPath, setSelectedPath] = useState<"staff" | "manager" | null>(null);

  const currentRole = {
    title: "Senior Software Engineer",
    company: "Tech Infrastructure Team",
    skills: ["React", "Node.js", "AWS", "PostgreSQL"]
  };

  const growthPaths = [
    {
      id: "staff",
      title: "Staff Software Engineer",
      subtitle: "Strategic Technical Leadership",
      demand: "High",
      demandIcon: "trending_up",
      demandColor: "text-emerald-400",
      skillsAlignment: "75%",
      buttonClass: "bg-slate-800 group-hover:bg-primary",
      skills: [
        { title: "Gap: Architecture", desc: "Distributed Systems Design" },
        { title: "Gap: Soft Skills", desc: "Cross-team Alignment" }
      ],
      certName: "AWS Certified Solutions Architect",
      certIcon: "verified"
    },
    {
      id: "manager",
      title: "Engineering Manager",
      subtitle: "People & Delivery focus",
      demand: "Stable",
      demandIcon: "trending_up",
      demandColor: "text-amber-400",
      skillsAlignment: "60%",
      buttonClass: "bg-slate-800 group-hover:bg-indigo-600",
      skills: [
        { title: "Gap: Management", desc: "Agile & Sprint Planning" },
        { title: "Gap: Finance", desc: "Resource Budgeting" }
      ],
      certName: "Scrum Alliance: CSM Certification",
      certIcon: "school"
    }
  ];

  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto font-display">
      <div className="mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
          <span className="material-symbols-outlined text-xs">auto_awesome</span>
          AI CAREER CO-PILOT
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
          Your Career Roadmap
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          Based on your current profile as a <span className="text-white font-semibold underline decoration-primary/50 underline-offset-4">{currentRole.title}</span>.
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 roadmap-line -translate-x-1/2 opacity-20 hidden sm:block"></div>
        <div className="space-y-24 relative">
          
          {/* Timeline Current Role */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-center gap-8">
            <div className="w-full md:w-[calc(50%-3rem)] order-2 md:order-1">
              <div className="glass p-6 rounded-3xl border-primary/30 bg-primary/5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Current Role</span>
                  <span className="px-2 py-1 rounded bg-primary/20 text-[10px] font-bold text-primary">PRESENT</span>
                </div>
                <h3 className="text-2xl font-bold mb-1">{currentRole.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{currentRole.company}</p>
                <div className="flex flex-wrap gap-2">
                  {currentRole.skills.map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative z-10 order-1 md:order-2">
              <div className="w-16 h-16 rounded-full bg-primary border-4 border-[#0B1120] flex items-center justify-center node-pulse">
                <span className="material-symbols-outlined text-white">person</span>
              </div>
            </div>
            <div className="hidden md:block w-[calc(50%-3rem)] order-3"></div>
          </div>

          <div className="flex justify-center -my-12 relative z-10">
            <div className="glass px-6 py-2 rounded-full text-sm font-medium text-slate-400 border-slate-700/50">
              Select a Growth Path
            </div>
          </div>

          {/* Timeline Future Roles */}
          {growthPaths.map((path, index) => {
            const isRight = index % 2 === 0;

            const card = (
              <div className={`glass p-8 rounded-3xl border-white/5 transition-colors group cursor-pointer ${path.id === 'staff' ? 'hover:border-primary/40' : 'hover:border-indigo-400/40'}`}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold">{path.title}</h3>
                    <p className="text-slate-400 text-sm">{path.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center gap-1 ${path.demandColor} font-bold mb-1 justify-end`}>
                      <span className="material-symbols-outlined text-sm">{path.demandIcon}</span>
                      {path.demand}
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Market Demand</div>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-300">Skills Alignment</span>
                      <span className={`${path.id === 'staff' ? 'text-primary' : 'text-indigo-400'} font-bold`}>{path.skillsAlignment} Match</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${path.id === 'staff' ? 'w-[75%] bg-primary' : 'w-[60%] bg-indigo-500'}`}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {path.skills.map(skill => (
                      <div key={skill.title} className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">{skill.title}</p>
                        <p className="text-xs text-slate-300">{skill.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{path.id === 'staff' ? 'Recommended Certifications' : 'Suggested Training'}</p>
                  <div className={`flex items-center gap-3 p-3 rounded-2xl border ${path.id === 'staff' ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                    <span className={`material-symbols-outlined ${path.id === 'staff' ? 'text-indigo-400' : 'text-emerald-400'}`}>{path.certIcon}</span>
                    <span className="text-sm font-medium">{path.certName}</span>
                  </div>
                </div>
                <button className={`w-full py-3 ${path.buttonClass} text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2`}>
                  Explore Role Details
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            );

            const dot = (
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-full bg-slate-800 border-4 border-[#0B1120] flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-400">{path.id === 'staff' ? 'terminal' : 'groups'}</span>
                </div>
              </div>
            );

            return (
              <div key={path.id} className="flex flex-col md:flex-row items-start md:items-center justify-center gap-8">
                {isRight ? (
                  <>
                    <div className="hidden md:block w-[calc(50%-3rem)]"></div>
                    {dot}
                    <div className="w-full md:w-[calc(50%-3rem)]">{card}</div>
                  </>
                ) : (
                  <>
                    <div className="w-full md:w-[calc(50%-3rem)] order-2 md:order-1">{card}</div>
                    <div className="relative z-10 order-1 md:order-2">{dot}</div>
                    <div className="hidden md:block w-[calc(50%-3rem)] order-3"></div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-32 p-12 rounded-[3rem] bg-gradient-to-br from-indigo-900/40 via-[#0B1120] to-primary/10 border border-white/5 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to bridge the gap?</h2>
        <p className="text-slate-400 mb-8 max-w-xl mx-auto">Upload a target job description and we'll tell you exactly what to change in your resume to land these roles.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">description</span>
            Analyze Resume
          </button>
          <button className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
            Find Open Jobs
          </button>
        </div>
      </div>
    </main>
  );
}
