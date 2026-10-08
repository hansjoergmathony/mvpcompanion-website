import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getDictionary, getLocale } from "@/lib/i18n/get-dictionary";
import { localeAlternates } from "@/lib/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { aboutPage, ui } = await getDictionary();

  return {
    title: { absolute: ui.aboutMetaTitle },
    description: aboutPage.supporting,
    alternates: localeAlternates("/about", locale),
  };
}

export default async function AboutPage() {
  const { aboutPage, ctas } = await getDictionary();

  return (
    <main id="content">
      <Section>
        <SectionHeading
          eyebrow={aboutPage.eyebrow}
          title={aboutPage.headline}
          description={aboutPage.supporting}
        />
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">
          {aboutPage.introduction}
        </p>
        <ol className="mt-14 grid gap-4 sm:grid-cols-2">
          {aboutPage.groups.map((group) => (
            <li key={group.name} className="rounded-2xl border border-border bg-ice px-6 py-8">
              <h2 className="text-xl font-semibold tracking-tight text-navy">{group.name}</h2>
              <p className="mt-3 text-base leading-relaxed text-muted">{group.description}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12">
          <Button href={ctas.primary.href}>{ctas.primary.label}</Button>
        </div>
      </Section>
    </main>
  );
}
