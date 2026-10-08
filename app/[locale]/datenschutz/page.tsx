import type { Metadata } from "next";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { getDictionary, getLocale } from "@/lib/i18n/get-dictionary";
import { localeAlternates } from "@/lib/i18n/metadata";

/**
 * LEGAL REVIEW: This privacy policy must be reviewed by qualified legal counsel
 * before production launch, especially for GDPR compliance and hosting details.
 */

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { datenschutzPage } = await getDictionary();

  return {
    title: { absolute: datenschutzPage.title },
    description: datenschutzPage.description,
    alternates: localeAlternates("/datenschutz", locale),
  };
}

export default async function DatenschutzPage() {
  const { datenschutzPage, publicContactEmail } = await getDictionary();

  return (
    <LegalPageLayout eyebrow={datenschutzPage.eyebrow} headline={datenschutzPage.headline}>
      <p>
        <span className="text-sm text-muted">{datenschutzPage.lastUpdatedLabel} </span>
        {datenschutzPage.lastUpdated}
      </p>
      <p>{datenschutzPage.intro}</p>

      <section aria-labelledby="privacy-controller">
        <h2 id="privacy-controller" className="text-xl font-semibold text-navy">
          {datenschutzPage.controllerTitle}
        </h2>
        <p className="mt-4">
          {datenschutzPage.controllerBefore}
          <LocaleLink href="/impressum" className="font-medium text-blue hover:underline">
            {datenschutzPage.controllerLink}
          </LocaleLink>
          {datenschutzPage.controllerAfter}
          <a
            href={`mailto:${publicContactEmail}`}
            className="font-medium text-blue hover:underline"
          >
            {publicContactEmail}
          </a>.
        </p>
      </section>

      <section aria-labelledby="privacy-hosting">
        <h2 id="privacy-hosting" className="text-xl font-semibold text-navy">
          {datenschutzPage.hostingTitle}
        </h2>
        <p className="mt-4">{datenschutzPage.hostingBody}</p>
      </section>

      <section aria-labelledby="privacy-contact">
        <h2 id="privacy-contact" className="text-xl font-semibold text-navy">
          {datenschutzPage.contactTitle}
        </h2>
        <p className="mt-4">
          {datenschutzPage.contactBody}{" "}
          <a
            href={`mailto:${publicContactEmail}`}
            className="font-medium text-blue hover:underline"
          >
            {publicContactEmail}
          </a>{" "}
          {datenschutzPage.contactAfter}
        </p>
      </section>

      <section aria-labelledby="privacy-fonts">
        <h2 id="privacy-fonts" className="text-xl font-semibold text-navy">
          {datenschutzPage.fontsTitle}
        </h2>
        <p className="mt-4">{datenschutzPage.fontsBody}</p>
      </section>

      <section aria-labelledby="privacy-cookies">
        <h2 id="privacy-cookies" className="text-xl font-semibold text-navy">
          {datenschutzPage.cookiesTitle}
        </h2>
        <p className="mt-4">{datenschutzPage.cookiesBody}</p>
      </section>

      <section aria-labelledby="privacy-rights">
        <h2 id="privacy-rights" className="text-xl font-semibold text-navy">
          {datenschutzPage.rightsTitle}
        </h2>
        <p className="mt-4">
          {datenschutzPage.rightsBefore}
          <a
            href={`mailto:${publicContactEmail}`}
            className="font-medium text-blue hover:underline"
          >
            {publicContactEmail}
          </a>
          {datenschutzPage.rightsAfter}
        </p>
      </section>
    </LegalPageLayout>
  );
}
