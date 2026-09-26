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
  { label: "Process", href: "/process" },
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
} as const;
