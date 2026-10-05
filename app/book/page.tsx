import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { bookSample } from "@/content/resources";

export const metadata: Metadata = {
  title: "MVPCompanion Book Sample",
  description: bookSample.supporting,
};

export default function BookPage() {
  return (
    <main id="content">
      <Section>
        <div className="max-w-3xl">
          <p className="text-xs font-medium tracking-[0.2em] text-blue uppercase">
            Book
          </p>
          <h1 className="mt-4 text-4xl leading-[1.1] font-semibold tracking-tight text-navy md:text-5xl">
            {bookSample.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            {bookSample.supporting}
          </p>
        </div>

        <article className="mt-12 rounded-2xl border border-border bg-ice px-6 py-8 md:px-8 md:py-10">
          <p className="text-xs font-medium tracking-[0.2em] text-blue uppercase">
            Primary reading
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-navy">
            Experience how MVPCompanion thinks.
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">
            Read the original Preface and Chapter 0 as they appear in the book.
          </p>
          <ol className="mt-8 grid gap-5 md:grid-cols-2">
            <li className="rounded-xl border border-border bg-card px-5 py-5">
              <p className="text-xs font-medium tracking-[0.18em] text-blue uppercase">
                {bookSample.preface.label}
              </p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-navy">
                {bookSample.preface.title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-muted">
                {bookSample.preface.subtitle}
              </p>
            </li>
            <li className="rounded-xl border border-border bg-card px-5 py-5">
              <p className="text-xs font-medium tracking-[0.18em] text-blue uppercase">
                {bookSample.introduction.label}
              </p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-navy">
                {bookSample.introduction.title}
              </h3>
            </li>
          </ol>
          <div className="mt-8">
            <Button href="/book/sample">Read the Sample</Button>
          </div>
        </article>

        <section className="mt-12 max-w-3xl border-t border-border pt-8">
          <p className="text-xs font-medium tracking-[0.2em] text-blue uppercase">
            Companion white paper
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-navy">
            Explore the Method
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Prefer the short version? Read the companion paper for a concise overview of the MVPCompanion method, 15-stage process, five lenses, traceability, learning loop, and human–AI relationship.
          </p>
          <div className="mt-6">
            <Button href="/resources/from-idea-to-mvp" variant="secondary">
              Read the White Paper
            </Button>
          </div>
        </section>
      </Section>
    </main>
  );
}
