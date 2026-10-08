import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/paths";

const domain = "https://www.mvpcompanion.com";

function absoluteUrl(path: string): string {
  if (path === "/") {
    return domain;
  }

  return `${domain}${path}`;
}

export function localeAlternates(path: string, locale: Locale): Metadata["alternates"] {
  const english = absoluteUrl(localizePath(path, "en"));
  const german = absoluteUrl(localizePath(path, "de"));

  return {
    canonical: locale === "de" ? german : english,
    languages: {
      en: english,
      de: german,
      "x-default": english,
    },
  };
}

export function openGraphLocale(locale: Locale): string {
  return locale === "de" ? "de_DE" : "en_US";
}
