import { ecosystemContent } from "@/content/homepage";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EcosystemMap } from "@/components/visuals/EcosystemMap";

export function EcosystemSection() {
  return (
    <Section id="ecosystem" tone="ice">
      <SectionHeading
        eyebrow={ecosystemContent.eyebrow}
        title={ecosystemContent.headline}
        description={ecosystemContent.introduction}
      />
      <EcosystemMap />
    </Section>
  );
}
