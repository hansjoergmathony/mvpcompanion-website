import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { contactPage } from "@/content/pages";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: { absolute: contactPage.title },
  description: contactPage.supporting,
  alternates: { canonical: `${site.domain}/contact` },
};

export default function ContactPage() {
  return (
    <main id="content">
      <Section>
        <SectionHeading
          eyebrow={contactPage.eyebrow}
          title={contactPage.headline}
          description={contactPage.supporting}
        />
        <ContactForm />
      </Section>
    </main>
  );
}
