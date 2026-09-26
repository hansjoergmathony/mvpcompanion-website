"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/content/site";

function navLinkClassName(isActive: boolean) {
  return isActive
    ? "font-medium text-navy"
    : "tracking-wide transition-colors hover:text-navy";
}

function isNavItemActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

type PrimaryNavProps = {
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
};

export function PrimaryNav({ variant, onNavigate }: PrimaryNavProps) {
  const pathname = usePathname();
  const items = navigation;

  if (variant === "desktop") {
    return (
      <nav aria-label="Primary">
        <ul className="flex items-center gap-8 text-sm text-muted">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={
                  isNavItemActive(pathname, item.href) ? "page" : undefined
                }
                className={navLinkClassName(isNavItemActive(pathname, item.href))}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <nav aria-label="Mobile">
      <ul className="space-y-1 text-sm">
        {items.map((item) => (
          <li key={item.href}>
            <Link
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
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
