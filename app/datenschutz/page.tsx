import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { datenschutzPage, publicContactEmail } from "@/content/legal";
import { site } from "@/content/site";

/**
 * LEGAL REVIEW: This privacy policy must be reviewed by qualified legal counsel
 * before production launch, especially for GDPR compliance and hosting details.
 */

export const metadata: Metadata = {
  title: { absolute: datenschutzPage.title },
  description:
    "Privacy policy for the MVPCompanion website — hosting, contact form, and data processing.",
  alternates: { canonical: `${site.domain}/datenschutz` },
};

export default function DatenschutzPage() {
  return (
    <LegalPageLayout
      eyebrow={datenschutzPage.eyebrow}
      headline={datenschutzPage.headline}
    >
      <p>
        <span className="text-sm text-muted">Last updated: </span>
        {datenschutzPage.lastUpdated}
      </p>
      <p>{datenschutzPage.intro}</p>

      <section aria-labelledby="privacy-controller">
        <h2 id="privacy-controller" className="text-xl font-semibold text-navy">
          Controller
        </h2>
        <p className="mt-4">
          The controller for data processing on this website is the operator named
          in the{" "}
          <a href="/impressum" className="font-medium text-blue hover:underline">
            Impressum
          </a>
          . For privacy-related requests, contact{" "}
          <a
            href={`mailto:${publicContactEmail}`}
            className="font-medium text-blue hover:underline"
          >
            {publicContactEmail}
          </a>
          .
        </p>
      </section>

      <section aria-labelledby="privacy-hosting">
        <h2 id="privacy-hosting" className="text-xl font-semibold text-navy">
          Hosting and server logs
        </h2>
        <p className="mt-4">
          The website is hosted on a cloud platform (typically Vercel or an
          equivalent provider). When you visit pages, the host processes
          connection data such as IP address, date and time of the request, requested
          URL, referrer, browser type, and operating system in server logs for
          security, operation, and troubleshooting. Processing is based on legitimate
          interest in providing a secure and reliable website.
        </p>
      </section>

      <section aria-labelledby="privacy-contact">
        <h2 id="privacy-contact" className="text-xl font-semibold text-navy">
          Contact form and email
        </h2>
        <p className="mt-4">
          If you use the contact form, we process the data you enter (name, email,
          optional subject, and message) to respond to your inquiry. Messages are
          transmitted via a server-side email delivery service using environment
          variables on the server; credentials are not exposed in the browser.
          Submissions are delivered to{" "}
          <a
            href={`mailto:${publicContactEmail}`}
            className="font-medium text-blue hover:underline"
          >
            {publicContactEmail}
          </a>{" "}
          (Google Workspace / Gmail mailbox). Legal basis: your request and our
          legitimate interest in communication, or pre-contractual steps where
          applicable.
        </p>
      </section>

      <section aria-labelledby="privacy-fonts">
        <h2 id="privacy-fonts" className="text-xl font-semibold text-navy">
          Fonts
        </h2>
        <p className="mt-4">
          Typography uses Plus Jakarta Sans via Next.js font optimization. Font
          files are downloaded at build time and served from this website, not
          loaded at runtime from third-party font CDNs in the visitor&apos;s browser.
        </p>
      </section>

      <section aria-labelledby="privacy-cookies">
        <h2 id="privacy-cookies" className="text-xl font-semibold text-navy">
          Cookies and analytics
        </h2>
        <p className="mt-4">
          This V1 website does not use Google Analytics, Meta Pixel, Hotjar,
          advertising trackers, or marketing automation. We do not set
          non-essential cookies for tracking. Essential technical cookies or
          storage may only apply if required by the hosting platform for security
          or delivery; no analytics cookies are intentionally deployed.
        </p>
      </section>

      <section aria-labelledby="privacy-rights">
        <h2 id="privacy-rights" className="text-xl font-semibold text-navy">
          Your rights
        </h2>
        <p className="mt-4">
          Where the GDPR applies, you may have rights of access, rectification,
          erasure, restriction, objection, and data portability, and the right to
          lodge a complaint with a supervisory authority. Contact{" "}
          <a
            href={`mailto:${publicContactEmail}`}
            className="font-medium text-blue hover:underline"
          >
            {publicContactEmail}
          </a>{" "}
          to exercise these rights.
        </p>
      </section>
    </LegalPageLayout>
  );
}
