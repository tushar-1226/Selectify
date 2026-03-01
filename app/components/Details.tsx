import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";
import ScoreBadge from "./ScoreBadge";


const CategoryHeader = ({
                          title,
                          categoryScore,
                        }: {
  title: string;
  categoryScore: number;
}) => {
  return (
      <div className="flex flex-row gap-4 items-center py-4 w-full group">
        <p className="text-2xl font-bold tracking-tight text-text-primary group-hover:text-neon-blue transition-colors drop-shadow">{title}</p>
        <ScoreBadge score={categoryScore} />
      </div>
  );
};

const CategoryContent = ({
                           tips,
                         }: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  return (
      <div className="flex flex-col gap-6 items-center w-full pt-2 pb-6">
        <div className="bg-glass-layer border border-glass-border shadow-sm w-full rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4 place-items-start">
          {tips.map((tip, index) => (
              <div className="flex flex-row gap-3 items-start" key={index}>
                  <div className={`mt-1 p-1 rounded-full shrink-0 flex items-center justify-center ${tip.type === "good" ? "bg-neon-emerald/20 text-neon-emerald" : "bg-neon-amber/20 text-neon-amber"}`}>
                      <img
                        src={
                          tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"
                        }
                        alt="score"
                        className="w-4 h-4 contrast-200"
                      />
                  </div>
                <p className="text-lg font-medium text-text-secondary leading-snug">{tip.tip}</p>
              </div>
          ))}
        </div>
        <div className="flex flex-col gap-4 w-full">
          {tips.map((tip, index) => (
              <div
                  key={index + tip.tip}
                  className={cn(
                      "flex flex-col gap-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-neon-glow",
                      tip.type === "good"
                          ? "bg-neon-emerald/5 border border-neon-emerald/20"
                          : "bg-neon-amber/5 border border-neon-amber/20"
                  )}
              >
                <div className="flex flex-row gap-3 items-center">
                    <div className={`p-1.5 rounded-full ${tip.type === "good" ? "bg-neon-emerald/20 text-neon-emerald" : "bg-neon-amber/20 text-neon-amber"}`}>
                      <img
                          src={
                            tip.type === "good"
                                ? "/icons/check.svg"
                                : "/icons/warning.svg"
                          }
                          alt="score"
                          className="w-5 h-5 contrast-200"
                      />
                  </div>
                  <p className={cn("text-xl font-bold tracking-tight", tip.type === "good" ? "text-neon-emerald drop-shadow-[0_0_8px_rgba(16,185,129,0.2)]" : "text-neon-amber drop-shadow-[0_0_8px_rgba(245,158,11,0.2)]")}>{tip.tip}</p>
                </div>
                <p className={cn("font-medium leading-relaxed mt-1 pl-11", "text-text-secondary")}>{tip.explanation}</p>
              </div>
          ))}
        </div>
      </div>
  );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
      <div className="flex flex-col gap-4 w-full glass-panel p-6 md:p-8">
        <h3 className="text-xl font-bold text-text-secondary mb-2 px-2 uppercase tracking-widest text-sm">Detailed Breakdown</h3>
        <Accordion>
          <AccordionItem id="tone-style">
            <AccordionHeader itemId="tone-style">
              <CategoryHeader
                  title="Tone & Style"
                  categoryScore={feedback.toneAndStyle.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="tone-style">
              <CategoryContent tips={feedback.toneAndStyle.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="content">
            <AccordionHeader itemId="content">
              <CategoryHeader
                  title="Content"
                  categoryScore={feedback.content.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="content">
              <CategoryContent tips={feedback.content.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="structure">
            <AccordionHeader itemId="structure">
              <CategoryHeader
                  title="Structure"
                  categoryScore={feedback.structure.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="structure">
              <CategoryContent tips={feedback.structure.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="skills">
            <AccordionHeader itemId="skills">
              <CategoryHeader
                  title="Skills"
                  categoryScore={feedback.skills.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="skills">
              <CategoryContent tips={feedback.skills.tips} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
  );
};

export default Details;