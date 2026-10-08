import { notFound } from "next/navigation";
import { locale as localeParam } from "next/root-params";
import { dictionary as de } from "@/content/de";
import { dictionary as en, type Dictionary } from "@/content/en";
import { isLocale, type Locale } from "@/lib/i18n/config";

export async function getLocale(): Promise<Locale> {
  const value = await localeParam();

  if (!isLocale(value)) {
    notFound();
  }

  return value;
}

export async function getDictionary(): Promise<Dictionary> {
  const locale = await getLocale();
  return locale === "de" ? de : en;
}
