import type { Metadata } from "next";
import { ResourceLibrary, type LibraryResourceView } from "@/components/resources/ResourceLibrary";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { loadFaq } from "@/lib/faq";
import {
  libraryCategories,
  libraryResources,
  resourceHref,
  type LibraryLocale,
} from "@/content/library/catalog";
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
  const locale = await getLocale();
  const { ctas, resourcesPage, ui } = await getDictionary();
  const faq = loadFaq(locale);
  const library = ui.resourcesPage.library;
  const text = (copy: { en: string; de: string }) => copy[locale as LibraryLocale];

  const categories = libraryCategories.map((category) => ({
    id: category.id,
    title: text(category.title),
    description: text(category.description),
  }));

  const resources: LibraryResourceView[] = libraryResources.map((resource) => ({
    id: resource.id,
    categoryId: resource.categoryId,
    title: text(resource.title),
    description: text(resource.description),
    benefit: text(resource.benefit),
    kind: resource.kind,
    action: resource.action,
    href: resourceHref(resource),
    filename: resource.filename,
    formatLabel: resource.format === "pdf" ? "PDF" : "PNG",
    pages: resource.pages,
    fillable: resource.fillable === true,
    featured: resource.featured === true,
    imageAlt: resource.imageAlt ? text(resource.imageAlt) : undefined,
    relatedIds: resource.relatedIds ? [...resource.relatedIds] : [],
  }));

  return (
    <main id="content">
      <Section>
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-blue uppercase">
            {resourcesPage.eyebrow}
          </p>
          <h1 className="text-3xl leading-[1.15] font-semibold tracking-tight text-balance text-navy md:text-4xl">
            {resourcesPage.headline}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{resourcesPage.supporting}</p>
        </div>

        <article className="mt-10 flex flex-col gap-6 rounded-2xl border border-border bg-ice px-6 py-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-[0.2em] text-blue uppercase">
              {ui.faqPage.eyebrow}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-navy">{faq.title}</h2>
            <p className="mt-3 text-base leading-relaxed text-muted">{ui.faqPage.intro}</p>
          </div>
          <div className="shrink-0">
            <Button href="/resources/faq" variant="secondary">
              {ui.faqPage.read}
            </Button>
          </div>
        </article>

        <ResourceLibrary
          categories={categories}
          resources={resources}
          labels={{
            searchLabel: library.searchLabel,
            searchPlaceholder: library.searchPlaceholder,
            allCategories: library.allCategories,
            featured: library.featured,
            categoriesLabel: library.categoriesLabel,
            empty: library.empty,
            fillable: library.fillable,
            related: library.related,
            results: library.results,
            kinds: library.kinds,
            actions: library.actions,
            pagesOne: library.pagesOne,
            pagesMany: library.pagesMany,
          }}
        />

        <article className="mt-16 flex flex-col gap-6 rounded-2xl border border-border bg-ice px-6 py-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-[0.2em] text-blue uppercase">
              {ui.cursorArticlePage.eyebrow}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-navy">
              {resourcesPage.cursorArticle.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted">
              {resourcesPage.cursorArticle.positioning}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-3">
            <Button href={resourcesPage.cursorArticle.href} variant="secondary">
              {ui.cursorArticlePage.read}
            </Button>
            <a
              href={resourcesPage.cursorArticle.pdfHref}
              download
              className="text-sm font-medium text-blue underline-offset-4 hover:underline"
            >
              {ui.cursorArticlePage.downloadPdf}
            </a>
          </div>
        </article>

        <p className="mt-16 text-xs font-medium tracking-[0.2em] text-blue uppercase">
          {ui.resourcesPage.papersEyebrow}
        </p>
        <article className="mt-6 max-w-3xl">
          <p className="text-xs font-medium tracking-[0.2em] text-blue uppercase">
            {ui.resourcesPage.whitePaperEyebrow}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-navy">
            {resourcesPage.whitePaper.title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted">{resourcesPage.whitePaper.positioning}</p>
          <div className="mt-6">
            <Button href="/resources/from-idea-to-mvp" variant="secondary">
              {ui.resourcesPage.readWhitePaper}
            </Button>
          </div>
        </article>
        <article className="mt-8 max-w-3xl border-t border-border pt-8">
          <p className="text-xs font-medium tracking-[0.2em] text-blue uppercase">
            {ui.resourcesPage.methodPaperEyebrow}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-navy">
            {resourcesPage.methodPaper.title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted">{resourcesPage.methodPaper.positioning}</p>
          <div className="mt-6">
            <Button href="/resources/method-paper" variant="secondary">
              {ui.resourcesPage.readMethodPaper}
            </Button>
          </div>
        </article>
        <article className="mt-8 max-w-3xl border-t border-border pt-8">
          <p className="text-xs font-medium tracking-[0.2em] text-blue uppercase">
            {ui.resourcesPage.processEyebrow}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-navy">
            {resourcesPage.processPaper.title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted">
            {resourcesPage.processPaper.positioning}
          </p>
          <div className="mt-6">
            <Button href="/resources/15-stage-process" variant="secondary">
              {ui.resourcesPage.readProcess}
            </Button>
          </div>
        </article>

        <p className="mt-16 text-xs font-medium tracking-[0.2em] text-blue uppercase">
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
