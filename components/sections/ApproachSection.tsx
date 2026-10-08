import { getDictionary } from "@/lib/i18n/get-dictionary";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ApproachJourney } from "@/components/visuals/ApproachJourney";

export async function ApproachSection() {
  const { approachContent } = await getDictionary();
  return (
    <Section id={approachContent.id} tone="ice">
      <SectionHeading
        eyebrow={approachContent.eyebrow}
        title={approachContent.headline}
        description={approachContent.introduction}
        className="lg:max-w-[1080px]"
        descriptionClassName="lg:max-w-[1080px]"
      />

      <p className="mt-10 max-w-2xl text-2xl leading-snug font-semibold tracking-tight text-navy md:text-3xl lg:max-w-[1080px]">
        {approachContent.principle}
      </p>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted lg:max-w-[1080px]">
        {approachContent.principleExplanation}
      </p>

      <div className="mt-10">
        <ApproachJourney />
      </div>
      <p className="mt-6 text-xs font-medium tracking-[0.18em] text-muted uppercase">
        {approachContent.progressionNote}
      </p>

      <p className="mt-10 max-w-2xl text-lg leading-relaxed text-navy lg:max-w-[1080px]">
        {approachContent.coreIdea}
      </p>
    </Section>
  );
}
