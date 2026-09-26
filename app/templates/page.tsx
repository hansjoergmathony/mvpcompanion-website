import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { templatesPage } from "@/content/pages";
import { ctas } from "@/content/site";

export const metadata: Metadata = {
  title: "Templates — MVPCompanion",
  description: templatesPage.supporting,
};

export default function TemplatesPage() {
  return (
    <main id="content">
      <Section>
        <SectionHeading
          eyebrow={templatesPage.eyebrow}
          title={templatesPage.headline}
          description={templatesPage.supporting}
        />
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">
          {templatesPage.introduction}
        </p>
        <div className="mt-12 flex flex-wrap gap-3">
          <Button href={ctas.primary.href}>{ctas.primary.label}</Button>
          <Button href={templatesPage.processHref} variant="secondary">
            {templatesPage.processLabel}
          </Button>
        </div>
      </Section>
    </main>
  );
}
