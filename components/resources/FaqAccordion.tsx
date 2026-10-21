import { answerParagraphs, type FaqSection } from "@/lib/faq";

type FaqAccordionProps = {
  sections: readonly FaqSection[];
};

export function FaqAccordion({ sections }: FaqAccordionProps) {
  return (
    <div className="mt-12 max-w-3xl space-y-12">
      {sections.map((section, sectionIndex) => (
        <section key={section.heading} aria-labelledby={sectionId(section.heading, sectionIndex)}>
          <h2
            id={sectionId(section.heading, sectionIndex)}
            className="text-xl font-semibold tracking-tight text-navy md:text-2xl"
          >
            {section.heading}
          </h2>
          <div className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {section.items.map((item) => (
              <details key={item.question} className="group">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-base font-medium text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0 flex-1">{item.question}</span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-xl leading-none text-muted transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="space-y-4 px-5 pb-5">
                  {answerParagraphs(item.answer).map((paragraph, paragraphIndex) => (
                    <p
                      key={`${item.question}-${paragraphIndex}`}
                      className="max-w-[68ch] text-base leading-relaxed text-navy"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function sectionId(heading: string, index: number): string {
  const slug = heading
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `faq-${index + 1}-${slug || "section"}`;
}
