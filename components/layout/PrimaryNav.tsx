"use client";

import { usePathname } from "next/navigation";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { stripLocale } from "@/lib/i18n/paths";

function navLinkClassName(isActive: boolean) {
  return isActive
    ? "font-medium text-navy"
    : "tracking-wide transition-colors hover:text-navy";
}

function isNavItemActive(pathname: string, href: string) {
  const current = stripLocale(pathname);

  if (href === "/") {
    return current === "/";
  }

  return current === href || current.startsWith(`${href}/`);
}

type NavItem = {
  label: string;
  href: string;
};

type PrimaryNavProps = {
  variant: "desktop" | "mobile";
  items: readonly NavItem[];
  label: string;
  onNavigate?: () => void;
};

export function PrimaryNav({ variant, items, label, onNavigate }: PrimaryNavProps) {
  const pathname = usePathname();

  if (variant === "desktop") {
    return (
      <nav aria-label={label}>
        <ul className="flex items-center gap-8 text-sm text-muted">
          {items.map((item) => (
            <li key={item.href}>
              <LocaleLink
                href={item.href}
                aria-current={
                  isNavItemActive(pathname, item.href) ? "page" : undefined
                }
                className={navLinkClassName(isNavItemActive(pathname, item.href))}
              >
                {item.label}
              </LocaleLink>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <nav aria-label={label}>
      <ul className="space-y-1 text-sm">
        {items.map((item) => (
          <li key={item.href}>
            <LocaleLink
              href={item.href}
              onClick={onNavigate}
              aria-current={
                isNavItemActive(pathname, item.href) ? "page" : undefined
              }
              className={`block rounded-md px-3 py-2 hover:bg-ice hover:text-navy ${
                isNavItemActive(pathname, item.href)
                  ? "font-medium text-navy"
                  : "text-muted"
              }`}
            >
              {item.label}
            </LocaleLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
