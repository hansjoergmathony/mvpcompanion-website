export const legalOperator = {
  operatorName: "Hans-Jörg Mathony, PhD",
  streetAddress: "Schorndorfer Weg 34",
  postalCode: "71732",
  city: "Tamm",
  country: "Germany",
} as const;

export const publicContactEmail = "hello@mvpcompanion.com" as const;

export const impressumPage = {
  title: "Impressum — MVPCompanion",
  description: "Legal notice and contact information for MVPCompanion.",
  eyebrow: "Legal",
  headline: "Legal Notice",
  sectionTitle: "Information according to § 5 DDG",
  contactTitle: "Contact",
  emailLabel: "Email:",
  country: "Germany",
} as const;

/**
 * Privacy policy content reflects V1 website behavior only.
 * LEGAL REVIEW: Have a qualified advisor review this text before production launch.
 */
export const datenschutzPage = {
  title: "Datenschutz — MVPCompanion",
  description:
    "Privacy policy for the MVPCompanion website — hosting, contact form, and data processing.",
  eyebrow: "Privacy",
  headline: "Privacy Policy",
  lastUpdatedLabel: "Last updated:",
  lastUpdated: "September 2025",
  intro:
    "This policy describes how personal data is processed when you use the MVPCompanion website at mvpcompanion.com.",
  controllerTitle: "Controller",
  controllerBefore:
    "The controller for data processing on this website is the operator named in the ",
  controllerLink: "Impressum",
  controllerAfter: ". For privacy-related requests, contact ",
  hostingTitle: "Hosting and server logs",
  hostingBody:
    "The website is hosted on a cloud platform (typically Vercel or an equivalent provider). When you visit pages, the host processes connection data such as IP address, date and time of the request, requested URL, referrer, browser type, and operating system in server logs for security, operation, and troubleshooting. Processing is based on legitimate interest in providing a secure and reliable website.",
  contactTitle: "Contact form and email",
  contactBody:
    "If you use the contact form, we process the data you enter (name, email, optional subject, and message) to respond to your inquiry. Messages are transmitted via a server-side email delivery service using environment variables on the server; credentials are not exposed in the browser. Submissions are delivered to",
  contactAfter:
    "(Google Workspace / Gmail mailbox). Legal basis: your request and our legitimate interest in communication, or pre-contractual steps where applicable.",
  fontsTitle: "Fonts",
  fontsBody:
    "Typography uses Plus Jakarta Sans via Next.js font optimization. Font files are downloaded at build time and served from this website, not loaded at runtime from third-party font CDNs in the visitor's browser.",
  cookiesTitle: "Cookies and analytics",
  cookiesBody:
    "This V1 website does not use Google Analytics, Meta Pixel, Hotjar, advertising trackers, or marketing automation. We do not set non-essential cookies for tracking. Essential technical cookies or storage may only apply if required by the hosting platform for security or delivery; no analytics cookies are intentionally deployed. The language choice is stored in a cookie so the site can reopen in the language you selected.",
  rightsTitle: "Your rights",
  rightsBefore:
    "Where the GDPR applies, you may have rights of access, rectification, erasure, restriction, objection, and data portability, and the right to lodge a complaint with a supervisory authority. Contact ",
  rightsAfter: " to exercise these rights.",
} as const;
