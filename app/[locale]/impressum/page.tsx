import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { getDictionary, getLocale } from "@/lib/i18n/get-dictionary";
import { localeAlternates } from "@/lib/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { impressumPage } = await getDictionary();

  return {
    title: { absolute: impressumPage.title },
    description: impressumPage.description,
    alternates: localeAlternates("/impressum", locale),
  };
}

export default async function ImpressumPage() {
  const { impressumPage, legalOperator, publicContactEmail } = await getDictionary();

  return (
    <LegalPageLayout eyebrow={impressumPage.eyebrow} headline={impressumPage.headline}>
      <section aria-labelledby="impressum-provider">
        <h2 id="impressum-provider" className="text-xl font-semibold text-navy">
          {impressumPage.sectionTitle}
        </h2>

        <address className="mt-4 not-italic">
          <p className="text-navy">{legalOperator.operatorName}</p>
          <p>{legalOperator.streetAddress}</p>
          <p>
            {legalOperator.postalCode} {legalOperator.city}
          </p>
          <p>{impressumPage.country}</p>
        </address>
      </section>

      <section aria-labelledby="impressum-contact">
        <h2 id="impressum-contact" className="text-xl font-semibold text-navy">
          {impressumPage.contactTitle}
        </h2>
        <p className="mt-4">
          {impressumPage.emailLabel}{" "}
          <a
            href={`mailto:${publicContactEmail}`}
            className="font-medium text-blue underline-offset-2 hover:underline"
          >
            {publicContactEmail}
          </a>
        </p>
      </section>
    </LegalPageLayout>
  );
}
