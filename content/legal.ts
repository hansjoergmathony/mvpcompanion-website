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
  eyebrow: "Legal",
  headline: "Legal Notice",
  sectionTitle: "Information according to § 5 DDG",
} as const;

/**
 * Privacy policy content reflects V1 website behavior only.
 * LEGAL REVIEW: Have a qualified advisor review this text before production launch.
 */
export const datenschutzPage = {
  title: "Datenschutz — MVPCompanion",
  eyebrow: "Privacy",
  headline: "Privacy Policy",
  lastUpdated: "September 2025",
  intro:
    "This policy describes how personal data is processed when you use the MVPCompanion website at mvpcompanion.com.",
} as const;
