import type { ReactNode } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

type LegalPageLayoutProps = {
  eyebrow: string;
  headline: string;
  children: ReactNode;
};

export function LegalPageLayout({
  eyebrow,
  headline,
  children,
}: LegalPageLayoutProps) {
  return (
    <main id="content">
      <Section>
        <SectionHeading eyebrow={eyebrow} title={headline} />
        <article className="prose-legal mt-10 max-w-3xl space-y-8 text-base leading-relaxed text-muted">
          {children}
        </article>
      </Section>
    </main>
  );
}
