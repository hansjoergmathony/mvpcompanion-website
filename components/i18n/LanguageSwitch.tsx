"use client";

import { usePathname } from "next/navigation";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";
import { alternatePath, localeFromPathname } from "@/lib/i18n/paths";

const options = ["en", "de"] as const;

function persistLocaleAndOpen(locale: Locale, href: string) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
  window.location.assign(href);
}

export function LanguageSwitch({ label }: { label: string }) {
  const pathname = usePathname();
  const current = localeFromPathname(pathname);

  function choose(locale: Locale) {
    if (locale === current) {
      return;
    }

    const hash = window.location.hash;
    persistLocaleAndOpen(locale, `${alternatePath(pathname, locale)}${hash}`);
  }

  return (
    <div className="flex items-center gap-1 text-sm" role="group" aria-label={label}>
      {options.map((locale, index) => (
        <span key={locale} className="flex items-center gap-1">
          {index > 0 ? (
            <span aria-hidden="true" className="text-muted">
              /
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => choose(locale)}
            aria-pressed={current === locale}
            className={
              current === locale
                ? "font-semibold tracking-wide text-navy"
                : "tracking-wide text-muted transition-colors hover:text-navy"
            }
          >
            {locale.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
