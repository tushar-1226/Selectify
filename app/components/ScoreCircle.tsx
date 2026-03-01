import { useEffect, useState } from 'react';

const ScoreCircle = ({ score = 75 }: { score: number }) => {
    const [displayScore, setDisplayScore] = useState(0);
    const radius = 38;
    const stroke = 6;
    const normalizedRadius = radius - stroke / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const progress = displayScore / 100;
    const strokeDashoffset = circumference * (1 - progress);

    useEffect(() => {
        let start = 0;
        const end = score;
        const duration = 1500;
        const increment = end / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setDisplayScore(end);
                clearInterval(timer);
            } else {
                setDisplayScore(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [score]);

    let gradientId = `grad-default-${score}`;
    let startColor = '#818cf8';
    let endColor = '#c084fc';
    let shadowColor = 'rgba(129, 140, 248, 0.3)';

    if (score > 69) {
        startColor = '#34d399';
        endColor = '#059669';
        shadowColor = 'rgba(52, 211, 153, 0.3)';
    } else if (score > 49) {
        startColor = '#fbbf24';
        endColor = '#d97706';
        shadowColor = 'rgba(251, 191, 36, 0.3)';
    } else {
        startColor = '#fca5a5';
        endColor = '#dc2626';
        shadowColor = 'rgba(248, 113, 113, 0.3)';
    }

    return (
        <div 
            className="relative w-[90px] h-[90px] rounded-full transition-all duration-500 bg-white shadow-sm flex items-center justify-center p-1"
            style={{ boxShadow: `0 4px 20px ${shadowColor}` }}
        >
            <svg
                height="100%"
                width="100%"
                viewBox="0 0 100 100"
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx="50"
                    cy="50"
                    r={normalizedRadius}
                    stroke="#f1f5f9"
                    strokeWidth={stroke}
                    fill="transparent"
                />
                {/* Partial circle with gradient */}
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
                        <stop offset="0%" stopColor={startColor} />
                        <stop offset="100%" stopColor={endColor} />
                    </linearGradient>
                </defs>
                <circle
                    cx="50"
                    cy="50"
                    r={normalizedRadius}
                    stroke={`url(#${gradientId})`}
                    strokeWidth={stroke}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>

            {/* Score */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-bold text-xl text-dark-400 tracking-tight leading-none">{displayScore}</span>
                <span className="text-[10px] text-dark-200 mt-0.5 font-medium uppercase tracking-wider">/ 100</span>
            </div>
        </div>
    );
};

export default ScoreCircle;