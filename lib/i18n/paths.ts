import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";

export function localeFromPathname(pathname: string): Locale {
  const segment = pathname.split("/").filter(Boolean)[0];

  if (segment && isLocale(segment) && segment !== defaultLocale) {
    return segment;
  }

  return defaultLocale;
}

export function stripLocale(pathname: string): string {
  if (pathname === "/de" || pathname.startsWith("/de/")) {
    const stripped = pathname.slice(3);
    return stripped === "" ? "/" : stripped;
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const stripped = pathname.slice(3);
    return stripped === "" ? "/" : stripped;
  }

  return pathname || "/";
}

export function localizePath(href: string, locale: Locale): string {
  if (!href.startsWith("/") || href.startsWith("//")) {
    return href;
  }

  const hashIndex = href.indexOf("#");
  const beforeHash = hashIndex === -1 ? href : href.slice(0, hashIndex);
  const hash = hashIndex === -1 ? "" : href.slice(hashIndex);
  const queryIndex = beforeHash.indexOf("?");
  const pathname = queryIndex === -1 ? beforeHash : beforeHash.slice(0, queryIndex);
  const query = queryIndex === -1 ? "" : beforeHash.slice(queryIndex);

  if (pathname.includes(".")) {
    return href;
  }

  const neutral = stripLocale(pathname || "/");

  if (locale === defaultLocale) {
    return `${neutral}${query}${hash}`;
  }

  if (neutral === "/") {
    return `/de${query}${hash}`;
  }

  return `/de${neutral}${query}${hash}`;
}

export function alternatePath(pathname: string, locale: Locale): string {
  return localizePath(stripLocale(pathname), locale);
}
