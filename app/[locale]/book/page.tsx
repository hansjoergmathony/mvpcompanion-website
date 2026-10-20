import type { Metadata } from "next";
import { PdfDocument } from "@/components/resources/PdfDocument";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { getDictionary, getLocale } from "@/lib/i18n/get-dictionary";
import { localeAlternates } from "@/lib/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { ui } = await getDictionary();

  return {
    title: ui.bookPage.metaTitle,
    description: ui.bookPage.metaDescription,
    alternates: localeAlternates("/book", locale),
  };
}

export default async function BookPage() {
  const { essentialGuide, ui } = await getDictionary();

  return (
    <main id="content">
      <Section>
        <div className="max-w-4xl">
          <p className="text-xs font-medium tracking-[0.2em] text-blue uppercase">
            {ui.bookPage.eyebrow}
          </p>
          <h1 className="mt-4 text-4xl leading-[1.1] font-semibold tracking-tight text-navy md:text-5xl">
            {essentialGuide.title}
          </h1>
          <PdfDocument
            src={essentialGuide.href}
            title={ui.bookPage.documentTitle}
            readOnline={ui.bookSamplePage.readOnline}
            openDocument={ui.bookSamplePage.openDocument}
            downloadPdf={ui.bookSamplePage.downloadPdf}
          />
        </div>

        <section className="mt-12 max-w-3xl border-t border-border pt-8">
          <p className="text-xs font-medium tracking-[0.2em] text-blue uppercase">
            {ui.bookPage.companionEyebrow}
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-navy">
            {ui.bookPage.companionHeadline}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">{ui.bookPage.companionBody}</p>
          <div className="mt-6">
            <Button href="/resources/from-idea-to-mvp" variant="secondary">
              {ui.bookPage.readPaper}
            </Button>
          </div>
        </section>
      </Section>
    </main>
  );
}
