import type { Metadata } from "next";
import { PdfDocument } from "@/components/resources/PdfDocument";
import { Section } from "@/components/ui/Section";
import { getDictionary, getLocale } from "@/lib/i18n/get-dictionary";
import { localeAlternates } from "@/lib/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { ui } = await getDictionary();

  return {
    title: ui.paperPage.metaTitle,
    description: ui.paperPage.metaDescription,
    alternates: localeAlternates("/resources/from-idea-to-mvp", locale),
  };
}

export default async function WhitePaperPage() {
  const { whitePaper, ui } = await getDictionary();

  return (
    <main id="content">
      <Section>
        <div className="max-w-4xl">
          <p className="text-xs font-medium tracking-[0.2em] text-blue uppercase">
            {ui.paperPage.eyebrow}
          </p>
          <h1 className="mt-4 text-4xl leading-[1.1] font-semibold tracking-tight text-navy md:text-5xl">
            {whitePaper.title}
          </h1>
          <p className="mt-5 text-xl leading-relaxed text-muted">{whitePaper.subtitle}</p>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-navy">{whitePaper.positioning}</p>
          <p className="mt-3 text-sm text-muted">{whitePaper.author}</p>
          <p className="mt-8 max-w-3xl border-t border-border pt-6 text-base leading-relaxed text-muted">
            {ui.paperPage.note}
          </p>
          <PdfDocument
            src={whitePaper.href}
            title={ui.paperPage.documentTitle}
            readOnline={ui.bookSamplePage.readOnline}
            openDocument={ui.bookSamplePage.openDocument}
            downloadPdf={ui.bookSamplePage.downloadPdf}
          />
        </div>
      </Section>
    </main>
  );
}
