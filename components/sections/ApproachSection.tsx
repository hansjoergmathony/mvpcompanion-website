import { approachContent } from "@/content/homepage";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ApproachJourney } from "@/components/visuals/ApproachJourney";

export function ApproachSection() {
  return (
    <Section id={approachContent.id} tone="ice">
      <SectionHeading
        eyebrow={approachContent.eyebrow}
        title={approachContent.headline}
        description={approachContent.introduction}
      />

      <p className="mt-10 max-w-2xl text-2xl leading-snug font-semibold tracking-tight text-navy md:text-3xl">
        {approachContent.principle}
      </p>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
        {approachContent.principleExplanation}
      </p>

      <div className="mt-10">
        <ApproachJourney />
      </div>
      <p className="mt-6 text-xs font-medium tracking-[0.18em] text-muted uppercase">
        {approachContent.progressionNote}
      </p>

      <p className="mt-10 max-w-2xl text-lg leading-relaxed text-navy">
        {approachContent.coreIdea}
      </p>
    </Section>
  );
}
