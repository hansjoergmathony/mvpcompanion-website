import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getDictionary, getLocale } from "@/lib/i18n/get-dictionary";
import { localeAlternates } from "@/lib/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { templatesPage, ui } = await getDictionary();

  return {
    title: { absolute: ui.templatesMetaTitle },
    description: templatesPage.supporting,
    alternates: localeAlternates("/templates", locale),
  };
}

export default async function TemplatesPage() {
  const { ctas, templatesPage } = await getDictionary();

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
