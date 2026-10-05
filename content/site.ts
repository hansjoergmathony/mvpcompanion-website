export const site = {
  name: "MVPCompanion",
  domain: "https://www.mvpcompanion.com",
  title: "MVPCompanion — Turn Ideas into Meaningful Products",
  description:
    "A systematic method for turning app ideas into valuable, viable and buildable MVPs.",
  brandStatement: "Turn Ideas into Meaningful Products.",
  positioning:
    "A systematic method for turning app ideas into valuable, viable and buildable MVPs.",
} as const;

export const navigation = [
  { label: "Method", href: "/process" },
  { label: "Contact", href: "/contact" },
] as const;

export const legalNavigation = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
] as const;

export const sitemapPaths = [
  "/",
  "/process",
  "/contact",
  "/impressum",
  "/datenschutz",
] as const;

export const ctas = {
  primary: {
    label: "Get Started Free →",
    href: "/start",
  },
  secondary: {
    label: "Explore the Method",
    href: "/#method",
  },
  clarify: {
    label: "Clarify your starting point →",
    href: "/start",
  },
} as const;

/** Set NEXT_PUBLIC_MVPCOMPANION_APP_URL when the app is publicly available. */
export const appEntry = {
  continueLabel: "Continue with MVPCompanion",
  directStartLabel: "Start directly in the app",
  unavailableContinueLabel:
    "Continue with MVPCompanion — coming soon in the MVPCompanion app.",
  unavailableDirectLabel: "The MVPCompanion app is coming soon.",
  href: process.env.NEXT_PUBLIC_MVPCOMPANION_APP_URL?.trim() ?? "",
} as const;
