import type { Metadata } from "next";
import { PdfDocument } from "@/components/resources/PdfDocument";
import { Section } from "@/components/ui/Section";
import { shortPaper } from "@/content/resources";

export const metadata: Metadata = {
  title: "From Idea to MVP — MVPCompanion Short Paper",
  description:
    "A concise conceptual and practical overview of the MVPCompanion method, 15-stage process, five lenses, traceability, learning, and human–AI relationship.",
};

export default function ShortPaperPage() {
  return (
    <main id="content">
      <Section>
        <div className="max-w-4xl">
          <p className="text-xs font-medium tracking-[0.2em] text-blue uppercase">
            Companion white paper
          </p>
          <h1 className="mt-4 text-4xl leading-[1.1] font-semibold tracking-tight text-navy md:text-5xl">
            {shortPaper.title}
          </h1>
          <p className="mt-5 text-xl leading-relaxed text-muted">
            {shortPaper.subtitle}
          </p>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-navy">
            {shortPaper.positioning}
          </p>
          <p className="mt-3 text-sm text-muted">{shortPaper.author}</p>
          <p className="mt-8 max-w-3xl border-t border-border pt-6 text-base leading-relaxed text-muted">
            This condensed methodology overview is a companion white paper, not a book chapter or a substitute for the book sample.
          </p>
          <PdfDocument src={shortPaper.href} title="From Idea to MVP — MVPCompanion Short Paper" />
        </div>
      </Section>
    </main>
  );
}
