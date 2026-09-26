import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import {
  impressumPage,
  legalOperator,
  publicContactEmail,
} from "@/content/legal";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: { absolute: impressumPage.title },
  description: "Legal notice and contact information for MVPCompanion.",
  alternates: { canonical: `${site.domain}/impressum` },
};

export default function ImpressumPage() {
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
          <p>{legalOperator.country}</p>
        </address>
      </section>

      <section aria-labelledby="impressum-contact">
        <h2 id="impressum-contact" className="text-xl font-semibold text-navy">
          Contact
        </h2>
        <p className="mt-4">
          Email:{" "}
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
