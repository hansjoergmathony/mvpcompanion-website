import type { Metadata } from "next";
import Link from "next/link";
import { ProcessStagesList } from "@/components/sections/ProcessStagesList";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProcessOverview } from "@/components/visuals/ProcessOverview";
import { processPage } from "@/content/pages";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: { absolute: processPage.title },
  description: processPage.introduction,
  alternates: { canonical: `${site.domain}/process` },
};

export default function ProcessPage() {
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

        <p className="mt-10 text-xs font-medium tracking-[0.18em] text-blue uppercase">
          {processPage.phasesLabel}
        </p>
        <div className="mt-5">
          <ProcessOverview />
        </div>

        <div className="mt-10 border-t border-border pt-8">
          <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
            {processPage.stagesLabel}
          </p>
        </div>

        <ProcessStagesList />

        <p className="mt-12 text-sm text-muted">
          See also the{" "}
          <Link href="/#process" className="font-medium text-blue hover:underline">
            process section on the homepage
          </Link>
          .
        </p>
      </Section>
    </main>
  );
}
