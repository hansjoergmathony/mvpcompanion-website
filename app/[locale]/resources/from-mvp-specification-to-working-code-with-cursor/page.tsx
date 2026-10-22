import type { Metadata } from "next";
import { KnowledgeArticle } from "@/components/resources/KnowledgeArticle";
import { Section } from "@/components/ui/Section";
import { cursorSpecificationArticle } from "@/content/articles/cursor-specification";
import { getDictionary, getLocale } from "@/lib/i18n/get-dictionary";
import { localeAlternates, openGraphLocale } from "@/lib/i18n/metadata";
import { localizePath } from "@/lib/i18n/paths";

const articlePath = "/resources/from-mvp-specification-to-working-code-with-cursor";

const ogImage = {
  url: "/brand/mvpcompanion-logo-compact.png",
  width: 2119,
  height: 430,
  alt: "MVPCompanion — Turn Ideas into Meaningful Products",
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { site, ui } = await getDictionary();
  const page = ui.cursorArticlePage;
  const canonicalPath = localizePath(articlePath, locale);
  const canonical = canonicalPath === "/" ? site.domain : `${site.domain}${canonicalPath}`;

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: localeAlternates(articlePath, locale),
    openGraph: {
      title: page.ogTitle,
      description: page.ogDescription,
      url: canonical,
      siteName: site.name,
      type: "article",
      locale: openGraphLocale(locale),
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: page.ogTitle,
      description: page.ogDescription,
      images: [ogImage.url],
    },
  };
}

export default async function CursorArticlePage() {
  const { ctas, cursorArticle, methodPaper, processPage, processPaper, ui, whitePaper } =
    await getDictionary();
  const page = ui.cursorArticlePage;

  return (
    <main id="content">
      <Section>
        <KnowledgeArticle
          eyebrow={page.eyebrow}
          title={cursorArticle.title}
          subtitle={cursorArticle.subtitle}
          languageNote={page.languageNote}
          intro={cursorSpecificationArticle.intro}
          sections={cursorSpecificationArticle.sections}
          pdfHref={cursorArticle.pdfHref}
          downloadLabel={page.downloadPdf}
          backHref="/resources"
          backLabel={page.backToResources}
          contentsLabel={page.contents}
          relatedLabel={page.related}
          relatedLinks={[
            { href: "/process", label: processPage.headline },
            { href: "/resources/method-paper", label: methodPaper.title },
            { href: "/resources/from-idea-to-mvp", label: whitePaper.title },
            { href: "/resources/15-stage-process", label: processPaper.title },
          ]}
          ctaHref={ctas.primary.href}
          ctaLabel={ctas.primary.label}
        />
      </Section>
    </main>
  );
}
