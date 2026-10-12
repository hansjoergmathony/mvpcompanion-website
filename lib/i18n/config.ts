export const locales = ["en", "de"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const LOCALE_COOKIE = "mvp_locale";

export function isLocale(value: string | undefined): value is Locale {
  return locales.some((locale) => locale === value);
}
