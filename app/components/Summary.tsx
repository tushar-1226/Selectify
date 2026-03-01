import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";

const Category = ({ title, score }: { title: string, score: number }) => {
    let textColor = '';
    if (score > 69) textColor = 'text-neon-emerald';
    else if (score > 49) textColor = 'text-neon-amber';
    else textColor = 'text-neon-pink';

    return (
        <div className="group hover:bg-glass-layer transition-all duration-300 rounded-2xl cursor-pointer">
            <div className="flex flex-row gap-3 items-center justify-between p-4 border border-transparent group-hover:border-glass-border rounded-2xl">
                <div className="flex flex-row gap-3 items-center justify-center">
                    <p className="text-xl font-semibold text-text-secondary group-hover:text-text-primary group-hover:translate-x-1 transition-all duration-300">{title}</p>
                    <ScoreBadge score={score} />
                </div>
                <div className="text-xl font-bold">
                    <span className={`${textColor}`}>{score}</span>
                    <span className="text-text-tertiary font-medium text-lg ml-0.5">/100</span>
                </div>
            </div>
        </div>
    )
}

const Summary = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="glass-panel w-full overflow-hidden flex flex-col xl:flex-row shadow-neon-glow">
            <div className="flex flex-col items-center justify-center p-8 gap-6 bg-glass-layer border-r border-glass-border text-center xl:w-1/3 xl:rounded-l-2xl xl:rounded-r-none relative overflow-hidden">
                <div className="absolute inset-0 bg-white/5 mix-blend-overlay"></div>
                <div className="relative z-10 w-full flex flex-col items-center">
                    <ScoreGauge score={feedback.overallScore} />
                    <div className="flex flex-col gap-1 mt-4">
                        <h2 className="text-2xl font-bold text-text-primary tracking-tight">Your Resume Score</h2>
                        <p className="text-sm text-text-secondary font-medium max-w-[250px] mx-auto">
                            Calculated across 4 key dimensions
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6 xl:p-8 flex-1 flex flex-col gap-2 justify-center bg-transparent">
                <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
                <Category title="Content" score={feedback.content.score} />
                <Category title="Structure" score={feedback.structure.score} />
                <Category title="Skills" score={feedback.skills.score} />
            </div>
        </div>
    )
}
export default Summary