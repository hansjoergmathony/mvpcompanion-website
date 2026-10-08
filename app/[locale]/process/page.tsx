import type { Metadata } from "next";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { ProcessStagesList } from "@/components/sections/ProcessStagesList";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProcessOverview } from "@/components/visuals/ProcessOverview";
import { getDictionary, getLocale } from "@/lib/i18n/get-dictionary";
import { localeAlternates } from "@/lib/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { processPage } = await getDictionary();

  return {
    title: { absolute: processPage.title },
    description: processPage.introduction,
    alternates: localeAlternates("/process", locale),
  };
}

export default async function ProcessPage() {
  const { processContent, processPage, ui } = await getDictionary();

  return (
    <main id="content">
      <Section>
        <SectionHeading
          eyebrow={processPage.eyebrow}
          title={processPage.headline}
          description={processPage.introduction}
        />
        <p className="mt-7 text-2xl leading-snug font-semibold tracking-tight text-navy md:text-3xl">
          {processPage.principle}
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          {processPage.frameworkNote}
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          {processContent.progressionNote}
        </p>

        <p className="mt-10 text-xs font-medium tracking-[0.18em] text-blue uppercase">
          {processPage.phasesLabel}
        </p>
        <div className="mt-5">
          <ProcessOverview />
        </div>

        <div className="mt-12 max-w-3xl space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-navy">
            {processContent.bringToLifeTitle}
          </h2>
          <p className="text-base leading-relaxed text-muted">
            {processContent.bringToLifeSupporting}
          </p>
          <p className="text-base font-medium leading-relaxed text-navy">
            {processContent.keyMessageLead}
          </p>
        </div>

        <div className="mt-10 border-t border-border pt-8">
          <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
            {processPage.stagesLabel}
          </p>
        </div>

        <ProcessStagesList />

        <p className="mt-12 text-sm text-muted">
          {ui.processPage.also}{" "}
          <LocaleLink href="/#process" className="font-medium text-blue hover:underline">
            {ui.processPage.homepageLink}
          </LocaleLink>.
        </p>
      </Section>
    </main>
  );
}
