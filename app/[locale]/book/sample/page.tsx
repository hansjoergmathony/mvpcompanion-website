import type { Metadata } from "next";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { PdfDocument } from "@/components/resources/PdfDocument";
import { Section } from "@/components/ui/Section";
import { getDictionary, getLocale } from "@/lib/i18n/get-dictionary";
import { localeAlternates } from "@/lib/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { ui } = await getDictionary();

  return {
    title: ui.bookSamplePage.metaTitle,
    description: ui.bookSamplePage.metaDescription,
    alternates: localeAlternates("/book/sample", locale),
  };
}

export default async function BookSamplePage() {
  const { bookSample, ui } = await getDictionary();
  const page = ui.bookSamplePage;

  return (
    <main id="content">
      <Section tone="ice">
        <div className="max-w-4xl">
          <p className="text-xs font-medium tracking-[0.2em] text-blue uppercase">{page.eyebrow}</p>
          <h1 className="mt-4 text-4xl leading-[1.1] font-semibold tracking-tight text-navy md:text-5xl">
            {page.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted">{page.supporting}</p>
          <nav aria-label={page.contents} className="mt-8 border-y border-border py-4">
            <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-blue">
              <li>
                <LocaleLink href="#preface" className="underline-offset-4 hover:underline">
                  {page.preface}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink href="#chapter-0" className="underline-offset-4 hover:underline">
                  {page.chapter}
                </LocaleLink>
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
            <p className="mt-3 text-xl leading-relaxed text-muted">{bookSample.preface.subtitle}</p>
            <PdfDocument
              src={bookSample.preface.href}
              title={page.prefaceDocument}
              readOnline={page.readOnline}
              openDocument={page.openDocument}
              downloadPdf={page.downloadPdf}
            />
          </article>

          <article id="chapter-0" className="scroll-mt-28 pt-16">
            <p className="text-xs font-medium tracking-[0.2em] text-blue uppercase">
              {bookSample.introduction.label}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-navy">
              {bookSample.introduction.title}
            </h2>
            <PdfDocument
              src={bookSample.introduction.href}
              title={page.chapterDocument}
              readOnline={page.readOnline}
              openDocument={page.openDocument}
              downloadPdf={page.downloadPdf}
            />
          </article>

          <section className="mt-16 border-t border-border pt-8">
            <p className="text-xl font-semibold tracking-tight text-navy">{page.closingTitle}</p>
            <p className="mt-3 text-base leading-relaxed text-muted">{page.closingBody}</p>
          </section>
        </div>
      </Section>
    </main>
  );
}
