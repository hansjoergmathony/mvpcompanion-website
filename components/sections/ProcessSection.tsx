import { processContent } from "@/content/homepage";
import { ProcessStagesList } from "@/components/sections/ProcessStagesList";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProcessOverview } from "@/components/visuals/ProcessOverview";

export function ProcessSection() {
  return (
    <Section id="process" tone="ice">
      <SectionHeading
        eyebrow={processContent.eyebrow}
        title={processContent.headline}
        description={processContent.introduction}
      />
      <p className="mt-7 text-2xl leading-snug font-semibold tracking-tight text-navy md:text-3xl">
        {processContent.principle}
      </p>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
        {processContent.note}
      </p>

      <p className="mt-10 text-xs font-medium tracking-[0.18em] text-blue uppercase">
        {processContent.phasesLabel}
      </p>
      <div className="mt-5">
        <ProcessOverview />
      </div>

      <div className="mt-10 border-t border-border pt-8">
        <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
          {processContent.stagesLabel}
        </p>
      </div>

      <ProcessStagesList />
    </Section>
  );
}
