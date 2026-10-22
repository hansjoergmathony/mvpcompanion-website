import { LocaleLink } from "@/components/i18n/LocaleLink";
import { Button } from "@/components/ui/Button";
import type {
  ArticleBlock,
  ArticleSection,
} from "@/content/articles/cursor-specification";

type RelatedLink = {
  href: string;
  label: string;
};

type KnowledgeArticleProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  languageNote: string;
  intro: readonly string[];
  sections: readonly ArticleSection[];
  pdfHref: string;
  downloadLabel: string;
  backHref: string;
  backLabel: string;
  contentsLabel: string;
  relatedLabel: string;
  relatedLinks: readonly RelatedLink[];
  ctaHref: string;
  ctaLabel: string;
};

export function KnowledgeArticle({
  eyebrow,
  title,
  subtitle,
  languageNote,
  intro,
  sections,
  pdfHref,
  downloadLabel,
  backHref,
  backLabel,
  contentsLabel,
  relatedLabel,
  relatedLinks,
  ctaHref,
  ctaLabel,
}: KnowledgeArticleProps) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm">
        <LocaleLink
          href={backHref}
          className="font-medium text-blue underline-offset-4 hover:underline"
        >
          {backLabel}
        </LocaleLink>
      </p>
      <p className="mt-6 text-xs font-medium tracking-[0.2em] text-blue uppercase">{eyebrow}</p>
      <h1
        lang="en"
        className="mt-4 text-4xl leading-[1.1] font-semibold tracking-tight text-balance text-navy md:text-5xl"
      >
        {title}
      </h1>
      <p lang="en" className="mt-5 text-xl leading-relaxed text-muted">
        {subtitle}
      </p>
      {languageNote ? (
        <p className="mt-4 text-sm leading-relaxed text-muted">{languageNote}</p>
      ) : null}
      <div lang="en" className="mt-6 space-y-4 text-base leading-relaxed text-muted">
        {intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <p className="mt-8">
        <a
          href={pdfHref}
          download
          className="text-sm font-medium text-blue underline-offset-4 hover:underline"
        >
          {downloadLabel}
        </a>
      </p>
      <nav aria-label={contentsLabel} className="mt-8 border-y border-border py-4">
        <ol lang="en" className="space-y-2 text-sm font-medium text-blue">
          {sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`} className="underline-offset-4 hover:underline">
                {section.heading}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <article lang="en" className="mt-2">
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-heading`}
            className="mt-12 scroll-mt-28 border-t border-border pt-10"
          >
            <h2
              id={`${section.id}-heading`}
              className="text-2xl font-semibold tracking-tight text-balance text-navy"
            >
              {section.heading}
            </h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-muted">
              {section.blocks.map((block, index) => (
                <ArticleBlockView
                  key={`${section.id}-${index}`}
                  block={block}
                  labelledBy={`${section.id}-heading`}
                />
              ))}
            </div>
          </section>
        ))}
      </article>
      <p className="mt-12 border-t border-border pt-8">
        <a
          href={pdfHref}
          download
          className="text-sm font-medium text-blue underline-offset-4 hover:underline"
        >
          {downloadLabel}
        </a>
      </p>
      <section className="mt-10" aria-labelledby="related-resources">
        <h2 id="related-resources" className="text-xl font-semibold tracking-tight text-navy">
          {relatedLabel}
        </h2>
        <ul className="mt-4 space-y-2 text-sm">
          {relatedLinks.map((link) => (
            <li key={link.href}>
              <LocaleLink
                href={link.href}
                className="font-medium text-blue underline-offset-4 hover:underline"
              >
                {link.label}
              </LocaleLink>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Button href={ctaHref}>{ctaLabel}</Button>
        </div>
      </section>
    </div>
  );
}

function ArticleBlockView({
  block,
  labelledBy,
}: {
  block: ArticleBlock;
  labelledBy: string;
}) {
  if (block.type === "paragraph") {
    return <p>{block.text}</p>;
  }

  if (block.type === "list") {
    return (
      <ul className="list-disc space-y-2 pl-5">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  if (block.type === "chain") {
    return <p className="font-medium text-navy">{block.text}</p>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-left text-sm" aria-labelledby={labelledBy}>
        <thead className="bg-ice text-navy max-md:hidden">
          <tr>
            <th scope="col" className="w-[28%] px-4 py-3 font-semibold">
              {block.columns[0]}
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              {block.columns[1]}
            </th>
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, index) => (
            <tr
              key={`${row[0]}-${index}`}
              className="block border-border align-top max-md:border-t max-md:first:border-t-0 md:table-row md:border-t"
            >
              <th
                scope="row"
                className="block bg-ice px-4 pt-3 pb-1 font-medium text-navy md:table-cell md:w-[28%] md:bg-transparent md:px-4 md:py-3"
              >
                {row[0]}
              </th>
              <td className="block px-4 pt-1 pb-3 md:table-cell md:px-4 md:py-3">{row[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
