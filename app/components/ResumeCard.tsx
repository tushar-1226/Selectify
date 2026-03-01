import { Link } from 'react-router';
import ScoreCircle from './ScoreCircle';
import ScoreBadge from './ScoreBadge';

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {
    return (
        <Link
            to={`/resume/${id}`}
            className="resume-card group"
        >
            <div className="flex flex-row justify-between items-start z-10">
                <div className="flex flex-col gap-2 flex-1 pr-4">
                    <h2 className="text-2xl font-bold text-dark-400 break-words group-hover:text-primary-600 transition-colors line-clamp-1">
                        {companyName}
                    </h2>
                    <h3 className="text-base font-medium text-dark-200 line-clamp-1 mb-2">
                        {jobTitle}
                    </h3>
                    <div>
                        <ScoreBadge score={feedback.overallScore} />
                    </div>
                </div>
                <div className="flex-shrink-0">
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>

            <div className="w-full mt-6 h-full bg-gray-50 rounded-xl overflow-hidden border border-gray-100 relative group-hover:shadow-inner transition-shadow flex items-center justify-center">
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-gray-50 to-transparent z-10" />
                <img
                    src={imagePath}
                    alt="resume thumbnail"
                    className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
            </div>
        </Link>
    )
}

export default ResumeCard