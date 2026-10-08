export const site = {
  name: "MVPCompanion",
  domain: "https://www.mvpcompanion.com",
  title: "MVPCompanion — Aus Ideen werden sinnvolle Produkte",
  description:
    "Eine systematische Methode, um App-Ideen in wertvolle, tragfähige und umsetzbare MVPs zu verwandeln.",
  brandStatement: "Aus Ideen werden sinnvolle Produkte.",
  positioning:
    "Eine systematische Methode, um App-Ideen in wertvolle, tragfähige und umsetzbare MVPs zu verwandeln.",
} as const;

export const navigation = [
  { label: "Methode", href: "/process" },
  { label: "Buch", href: "/book" },
  { label: "Ressourcen", href: "/resources" },
  { label: "Kontakt", href: "/contact" },
] as const;

export const legalNavigation = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
] as const;

export const sitemapPaths = [
  "/",
  "/process",
  "/book",
  "/book/sample",
  "/resources",
  "/resources/from-idea-to-mvp",
  "/contact",
  "/impressum",
  "/datenschutz",
] as const;

export const ctas = {
  primary: {
    label: "Kostenlos starten →",
    href: "/start",
  },
  secondary: {
    label: "Methode entdecken",
    href: "/#method",
  },
  clarify: {
    label: "Ausgangspunkt klären →",
    href: "/start",
  },
} as const;

/** Set NEXT_PUBLIC_MVPCOMPANION_APP_URL when the app is publicly available. */
export const appEntry = {
  continueLabel: "Mit MVPCompanion fortfahren",
  directStartLabel: "Direkt in der App starten",
  unavailableContinueLabel:
    "Mit MVPCompanion fortfahren — demnächst in der MVPCompanion-App.",
  unavailableDirectLabel: "Die MVPCompanion-App kommt bald.",
  href: process.env.NEXT_PUBLIC_MVPCOMPANION_APP_URL?.trim() ?? "",
} as const;
