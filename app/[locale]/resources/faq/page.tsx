import type { Metadata } from "next";
import { FaqAccordion } from "@/components/resources/FaqAccordion";
import { Section } from "@/components/ui/Section";
import { loadFaq } from "@/lib/faq";
import { getDictionary, getLocale } from "@/lib/i18n/get-dictionary";
import { localeAlternates } from "@/lib/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { ui } = await getDictionary();

  return {
    title: { absolute: ui.faqPage.metaTitle },
    description: ui.faqPage.metaDescription,
    alternates: localeAlternates("/resources/faq", locale),
  };
}

export default async function FaqPage() {
  const locale = await getLocale();
  const { ui } = await getDictionary();
  const faq = loadFaq(locale);

  return (
    <main id="content">
      <Section>
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-blue uppercase">
            {ui.faqPage.eyebrow}
          </p>
          <h1 className="text-3xl leading-[1.15] font-semibold tracking-tight text-balance text-navy md:text-4xl">
            {faq.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{ui.faqPage.intro}</p>
        </div>
        <FaqAccordion sections={faq.sections} />
      </Section>
    </main>
  );
}
