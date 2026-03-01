interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS = ({ score, suggestions }: ATSProps) => {
  const gradientClass = score > 69
    ? 'bg-neon-emerald/10 border-neon-emerald/30'
    : score > 49
      ? 'bg-neon-amber/10 border-neon-amber/30'
      : 'bg-neon-pink/10 border-neon-pink/30';

  const iconSrc = score > 69
    ? '/icons/ats-good.svg'
    : score > 49
      ? '/icons/ats-warning.svg'
      : '/icons/ats-bad.svg';

  const subtitle = score > 69
    ? 'Great Job!'
    : score > 49
      ? 'Good Start'
      : 'Needs Improvement';

  const badgeColor = score > 69
    ? 'bg-neon-emerald/20 text-neon-emerald'
    : score > 49
      ? 'bg-neon-amber/20 text-neon-amber'
      : 'bg-neon-pink/20 text-neon-pink';

  return (
    <div className={`rounded-[2rem] shadow-sm w-full p-8 border ${gradientClass}`}>
      <div className="flex items-center gap-5 mb-8">
        <div className="p-4 bg-dark-surface rounded-2xl shadow-sm border border-glass-border float-animation flex-shrink-0">
          <img src={iconSrc} alt="ATS Score Icon" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1.5">
            <h2 className="text-2xl font-bold tracking-tight text-text-primary">ATS Score</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-bold tracking-wide ${badgeColor}`}>
              {score}/100
            </span>
          </div>
          <h3 className="text-[17px] font-medium text-text-secondary">{subtitle}</h3>
        </div>
      </div>

      <div className="bg-glass-layer rounded-2xl p-6 shadow-sm border border-glass-border">
        <p className="text-text-secondary font-medium leading-relaxed mb-6">
          This score represents how well your resume is likely to perform in Applicant Tracking Systems used by employers.
        </p>

        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 bg-dark-surface rounded-xl shadow-sm border border-glass-border hover:border-glass-border/80 transition-shadow"
            >
              <div className={`mt-0.5 p-1 rounded-full ${suggestion.type === "good" ? "bg-neon-emerald/20 text-neon-emerald" : "bg-neon-amber/20 text-neon-amber"}`}>
                  <img
                    src={suggestion.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                    alt={suggestion.type === "good" ? "Check" : "Warning"}
                    className="w-4 h-4 flex-shrink-0 contrast-200"
                  />
              </div>
              <p className={`${suggestion.type === "good" ? "text-neon-emerald drop-shadow-[0_0_8px_rgba(16,185,129,0.2)]" : "text-neon-amber drop-shadow-[0_0_8px_rgba(245,158,11,0.2)]"} font-medium leading-snug`}>
                {suggestion.tip}
              </p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-text-tertiary font-medium italic text-sm mt-6 px-2 text-center">
        💡 Keep refining your resume to improve your chances of getting past ATS filters and into the hands of recruiters.
      </p>
    </div>
  )
}

export default ATS