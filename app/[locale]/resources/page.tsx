import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getDictionary, getLocale } from "@/lib/i18n/get-dictionary";
import { localeAlternates } from "@/lib/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { resourcesPage, ui } = await getDictionary();

  return {
    title: { absolute: ui.resourcesPage.metaTitle },
    description: resourcesPage.supporting,
    alternates: localeAlternates("/resources", locale),
  };
}

export default async function ResourcesPage() {
  const { ctas, resourcesPage, ui } = await getDictionary();

  return (
    <main id="content">
      <Section>
        <SectionHeading
          eyebrow={resourcesPage.eyebrow}
          title={resourcesPage.headline}
          description={resourcesPage.supporting}
        />
        <article className="mt-10 rounded-2xl border border-border bg-ice px-6 py-8 md:px-8 md:py-10">
          <p className="text-xs font-medium tracking-[0.2em] text-blue uppercase">
            {ui.resourcesPage.primarySample}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-navy">
            {resourcesPage.bookSample.title}
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">
            {resourcesPage.bookSample.supporting}
          </p>
          <ol className="mt-7 grid gap-4 md:grid-cols-2">
            <li className="rounded-xl border border-border bg-card px-5 py-5">
              <p className="text-xs font-medium tracking-[0.18em] text-blue uppercase">
                {resourcesPage.bookSample.preface.label}
              </p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-navy">
                {resourcesPage.bookSample.preface.title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-muted">
                {resourcesPage.bookSample.preface.subtitle}
              </p>
            </li>
            <li className="rounded-xl border border-border bg-card px-5 py-5">
              <p className="text-xs font-medium tracking-[0.18em] text-blue uppercase">
                {resourcesPage.bookSample.introduction.label}
              </p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-navy">
                {resourcesPage.bookSample.introduction.title}
              </h3>
            </li>
          </ol>
          <div className="mt-8">
            <Button href="/book/sample">{ui.resourcesPage.readSample}</Button>
          </div>
        </article>
        <article className="mt-8 max-w-3xl border-t border-border pt-8">
          <p className="text-xs font-medium tracking-[0.2em] text-blue uppercase">
            {ui.resourcesPage.companionEyebrow}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-navy">
            {resourcesPage.shortPaper.title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted">
            {resourcesPage.shortPaper.positioning}
          </p>
          <div className="mt-6">
            <Button href="/resources/from-idea-to-mvp" variant="secondary">
              {ui.resourcesPage.readPaper}
            </Button>
          </div>
        </article>
        <article className="mt-8 max-w-3xl border-t border-border pt-8">
          <p className="text-xs font-medium tracking-[0.2em] text-blue uppercase">
            {ui.resourcesPage.processEyebrow}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-navy">
            {resourcesPage.stageProcess.title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted">
            {resourcesPage.stageProcess.positioning}
          </p>
          <div className="mt-6">
            <Button href="/resources/15-stage-process" variant="secondary">
              {ui.resourcesPage.readProcess}
            </Button>
          </div>
        </article>
        <p className="mt-14 text-xs font-medium tracking-[0.2em] text-blue uppercase">
          {resourcesPage.methodLabel}
        </p>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {resourcesPage.parts.map((part) => (
            <li key={part.name} className="rounded-2xl border border-border bg-ice px-6 py-8">
              <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">{part.role}</p>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-navy">{part.name}</h2>
              <p className="mt-3 text-base leading-relaxed text-muted">{part.description}</p>
              <p
                className={`mt-4 text-xs font-medium tracking-[0.14em] uppercase ${
                  part.available ? "text-teal" : "text-muted"
                }`}
              >
                {part.availability}
              </p>
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
