import type { Metadata } from "next";
import Link from "next/link";
import { PdfDocument } from "@/components/resources/PdfDocument";
import { Section } from "@/components/ui/Section";
import { bookSample } from "@/content/resources";

export const metadata: Metadata = {
  title: "MVPCompanion — Book Sample: Before You Vibe-Code & Chapter 0",
  description:
    "Read a sample of MVPCompanion, including the Preface ‘Before You Vibe-Code’ and Chapter 0, ‘From an Idea to Something Worth Building.’",
};

export default function BookSamplePage() {
  return (
    <main id="content">
      <Section tone="ice">
        <div className="max-w-4xl">
          <p className="text-xs font-medium tracking-[0.2em] text-blue uppercase">
            Book sample
          </p>
          <h1 className="mt-4 text-4xl leading-[1.1] font-semibold tracking-tight text-navy md:text-5xl">
            Read the Book Sample
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted">
            Experience the original editorial voice, figures, exercises, and structure of MVPCompanion before Chapter 1 begins.
          </p>
          <nav aria-label="Book sample contents" className="mt-8 border-y border-border py-4">
            <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-blue">
              <li>
                <Link href="#preface" className="underline-offset-4 hover:underline">
                  Preface
                </Link>
              </li>
              <li>
                <Link href="#chapter-0" className="underline-offset-4 hover:underline">
                  Chapter 0
                </Link>
              </li>
            </ul>
          </nav>

          <article id="preface" className="scroll-mt-28 pt-14">
            <p className="text-xs font-medium tracking-[0.2em] text-blue uppercase">
              {bookSample.preface.label}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-navy">
              {bookSample.preface.title}
            </h2>
            <p className="mt-3 text-xl leading-relaxed text-muted">
              {bookSample.preface.subtitle}
            </p>
            <PdfDocument src={bookSample.preface.href} title="MVPCompanion Preface — Before You Vibe-Code" />
          </article>

          <article id="chapter-0" className="scroll-mt-28 pt-16">
            <p className="text-xs font-medium tracking-[0.2em] text-blue uppercase">
              {bookSample.introduction.label}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-navy">
              {bookSample.introduction.title}
            </h2>
            <PdfDocument src={bookSample.introduction.href} title="MVPCompanion Chapter 0 — Introduction" />
          </article>

          <section className="mt-16 border-t border-border pt-8">
            <p className="text-xl font-semibold tracking-tight text-navy">
              Before you vibe-code, vibe-specify.
            </p>
            <p className="mt-3 text-base leading-relaxed text-muted">
              Continue into Chapter 1 when the full book becomes available.
            </p>
          </section>
        </div>
      </Section>
    </main>
  );
}
