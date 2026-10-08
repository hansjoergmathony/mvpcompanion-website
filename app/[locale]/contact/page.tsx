import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getDictionary, getLocale } from "@/lib/i18n/get-dictionary";
import { localeAlternates } from "@/lib/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { contactPage } = await getDictionary();

  return {
    title: { absolute: contactPage.title },
    description: contactPage.supporting,
    alternates: localeAlternates("/contact", locale),
  };
}

export default async function ContactPage() {
  const locale = await getLocale();
  const { contactPage, publicContactEmail, ui } = await getDictionary();

  return (
    <main id="content">
      <Section>
        <SectionHeading
          eyebrow={contactPage.eyebrow}
          title={contactPage.headline}
          description={contactPage.supporting}
        />
        <ContactForm
          copy={ui.contact}
          email={publicContactEmail}
          locale={locale}
        />
      </Section>
    </main>
  );
}
