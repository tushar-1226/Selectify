interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  let badgeClasses = '';
  let badgeText = '';
  let IconPath = null;

  if (score > 69) {
    badgeClasses = 'bg-neon-emerald/20 text-neon-emerald border border-neon-emerald/30 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]';
    badgeText = 'Strong Match';
    IconPath = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />;
  } else if (score > 49) {
    badgeClasses = 'bg-neon-amber/20 text-neon-amber border border-neon-amber/30 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]';
    badgeText = 'Good Start';
    IconPath = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />;
  } else {
    badgeClasses = 'bg-neon-pink/20 text-neon-pink border border-neon-pink/30 drop-shadow-[0_0_8px_rgba(236,72,153,0.3)]';
    badgeText = 'Needs Work';
    IconPath = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />;
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${badgeClasses}`}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {IconPath}
      </svg>
      <span className="text-[13px] font-semibold tracking-wide uppercase">{badgeText}</span>
    </div>
  );
};

export default ScoreBadge;