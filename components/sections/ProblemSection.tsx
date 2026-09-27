import { problemContent } from "@/content/homepage";
import { Section } from "@/components/ui/Section";

export function ProblemSection() {
  return (
    <Section id="problem">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
        <div>
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-blue uppercase">
            {problemContent.eyebrow}
          </p>
          <h2 className="text-3xl leading-[1.15] font-semibold tracking-tight text-balance text-navy md:text-4xl">
            {problemContent.headline}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            {problemContent.introduction}
          </p>
          <div className="mt-10 max-w-xl border-t border-border pt-6">
            <p className="text-xl leading-snug font-semibold tracking-tight text-navy md:text-2xl">
              {problemContent.statementLead}
            </p>
            <p className="mt-3 text-xl leading-snug tracking-tight text-teal md:text-2xl">
              {problemContent.statementEmphasis}
            </p>
          </div>
        </div>

        <ol className="relative lg:mt-8">
          <span
            aria-hidden="true"
            className="absolute top-4 bottom-4 left-3 w-px bg-blue/20"
          />
          {problemContent.questions.map((question, index) => {
            const isLast = index === problemContent.questions.length - 1;

            return (
              <li
                key={question}
                className={`relative flex gap-5 py-4 first:pt-0 last:pb-0 ${
                  isLast ? "" : "border-b border-border"
                }`}
              >
                <span className="relative z-10 mt-0.5 w-6 shrink-0 bg-card text-sm text-blue">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-base leading-relaxed text-navy">
                  {question}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
