import { getDictionary } from "@/lib/i18n/get-dictionary";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EcosystemMap } from "@/components/visuals/EcosystemMap";

export async function EcosystemSection() {
  const { ecosystemContent } = await getDictionary();
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
