import { resultContent } from "@/content/homepage";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ResultDimensions } from "@/components/visuals/ResultDimensions";

export function ResultSection() {
  return (
    <Section id="result">
      <SectionHeading
        eyebrow={resultContent.eyebrow}
        title={resultContent.headline}
        description={resultContent.introduction}
      />

      <div className="mt-10">
        <ResultDimensions />
      </div>

      <div className="mt-10 max-w-3xl">
        <p className="text-xl leading-snug font-semibold tracking-tight text-navy md:text-2xl">
          {resultContent.statementLead}
        </p>
        <p className="mt-3 text-xl leading-snug tracking-tight text-teal md:text-2xl">
          {resultContent.statementEmphasis}
        </p>
        <p className="mt-6 text-base leading-relaxed text-muted">
          {resultContent.learningNote}
        </p>
      </div>
    </Section>
  );
}
