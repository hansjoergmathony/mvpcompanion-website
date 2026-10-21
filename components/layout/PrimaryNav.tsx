"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { stripLocale } from "@/lib/i18n/paths";

function navLinkClassName(isActive: boolean) {
  return isActive
    ? "font-medium text-navy"
    : "tracking-wide transition-colors hover:text-navy";
}

function currentPath(pathname: string) {
  return stripLocale(pathname);
}

function matchesHref(pathname: string, href: string) {
  const current = currentPath(pathname);

  if (href === "/") {
    return current === "/";
  }

  return current === href || current.startsWith(`${href}/`);
}

type NavLink = {
  label: string;
  href: string;
};

type NavItem = NavLink & {
  children?: readonly NavLink[];
};

type PrimaryNavProps = {
  variant: "desktop" | "mobile";
  items: readonly NavItem[];
  label: string;
  submenuLabel: string;
  onNavigate?: () => void;
};

export function PrimaryNav({
  variant,
  items,
  label,
  submenuLabel,
  onNavigate,
}: PrimaryNavProps) {
  const pathname = usePathname();

  if (variant === "desktop") {
    return (
      <nav aria-label={label}>
        <ul className="flex items-center gap-8 text-sm text-muted">
          {items.map((item) => (
            <DesktopNavItem
              key={`${item.href}-${pathname}`}
              item={item}
              pathname={pathname}
              submenuLabel={submenuLabel}
            />
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <nav aria-label={label}>
      <ul className="space-y-1 text-sm">
        {items.map((item) => {
          const active = parentIsCurrentPage(pathname, item);
          const inSection = matchesHref(pathname, item.href);

          return (
            <li key={item.href}>
              <LocaleLink
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={`block rounded-md px-3 py-2 hover:bg-ice hover:text-navy ${
                  inSection ? "font-medium text-navy" : "text-muted"
                }`}
              >
                {item.label}
              </LocaleLink>
              {item.children ? (
                <ul className="mt-1 space-y-1 border-l border-border pl-3">
                  {item.children.map((child) => {
                    const childActive = matchesHref(pathname, child.href);

                    return (
                      <li key={child.href}>
                        <LocaleLink
                          href={child.href}
                          onClick={onNavigate}
                          aria-current={childActive ? "page" : undefined}
                          className={`block min-h-11 rounded-md px-3 py-2.5 hover:bg-ice hover:text-navy ${
                            childActive ? "font-medium text-navy" : "text-muted"
                          }`}
                        >
                          {child.label}
                        </LocaleLink>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function childIsCurrent(pathname: string, item: NavItem) {
  return item.children?.some((child) => matchesHref(pathname, child.href)) ?? false;
}

function parentIsCurrentPage(pathname: string, item: NavItem) {
  if (childIsCurrent(pathname, item)) {
    return false;
  }

  return matchesHref(pathname, item.href);
}

function DesktopNavItem({
  item,
  pathname,
  submenuLabel,
}: {
  item: NavItem;
  pathname: string;
  submenuLabel: string;
}) {
  const menuId = useId();
  const buttonId = useId();
  const [open, setOpen] = useState(false);
  const pointerOpen = useRef(false);
  const children = item.children ?? [];
  const active = parentIsCurrentPage(pathname, item);
  const inSection = matchesHref(pathname, item.href);

  useEffect(() => {
    if (!open) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  if (children.length === 0) {
    return (
      <li>
        <LocaleLink
          href={item.href}
          aria-current={active ? "page" : undefined}
          className={navLinkClassName(active)}
        >
          {item.label}
        </LocaleLink>
      </li>
    );
  }

  return (
    <li
      className="relative"
      onMouseEnter={() => {
        pointerOpen.current = true;
        setOpen(true);
      }}
      onMouseLeave={() => {
        pointerOpen.current = false;
        setOpen(false);
      }}
      onBlur={(event) => {
        const next = event.relatedTarget;
        if (!(next instanceof Node) || !event.currentTarget.contains(next)) {
          setOpen(false);
        }
      }}
    >
      <span className="inline-flex items-center gap-0.5">
        <LocaleLink
          href={item.href}
          aria-current={active ? "page" : undefined}
          className={navLinkClassName(inSection)}
        >
          {item.label}
        </LocaleLink>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={submenuLabel.replace("{label}", item.label)}
          onClick={() => {
            if (pointerOpen.current) {
              setOpen(true);
              return;
            }

            setOpen((current) => !current);
          }}
          className="rounded-md px-1.5 py-1 text-muted hover:text-navy"
        >
          <span
            aria-hidden="true"
            className={`inline-block text-[10px] leading-none motion-safe:transition-transform ${
              open ? "rotate-180" : ""
            }`}
          >
            ▾
          </span>
        </button>
      </span>
      <div className={`absolute top-full left-0 z-50 min-w-40 pt-2 ${open ? "block" : "hidden"}`}>
        <ul
          id={menuId}
          aria-labelledby={buttonId}
          className="overflow-hidden rounded-xl border border-border bg-card py-1 shadow-lg shadow-navy/5"
        >
          {children.map((child) => {
            const childActive = matchesHref(pathname, child.href);

            return (
              <li key={child.href}>
                <LocaleLink
                  href={child.href}
                  aria-current={childActive ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-2.5 hover:bg-ice hover:text-navy ${
                    childActive ? "font-medium text-navy" : "text-muted"
                  }`}
                >
                  {child.label}
                </LocaleLink>
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}
