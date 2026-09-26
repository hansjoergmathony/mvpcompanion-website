import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { resourcesPage } from "@/content/pages";
import { ctas } from "@/content/site";

export const metadata: Metadata = {
  title: "Resources — MVPCompanion",
  description: resourcesPage.supporting,
};

export default function ResourcesPage() {
  return (
    <main id="content">
      <Section>
        <SectionHeading
          eyebrow={resourcesPage.eyebrow}
          title={resourcesPage.headline}
          description={resourcesPage.supporting}
        />
        <p className="mt-14 text-xs font-medium tracking-[0.2em] text-blue uppercase">
          {resourcesPage.methodLabel}
        </p>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {resourcesPage.parts.map((part) => (
            <li
              key={part.name}
              className="rounded-2xl border border-border bg-ice px-6 py-8"
            >
              <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
                {part.role}
              </p>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-navy">
                {part.name}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted">
                {part.description}
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
