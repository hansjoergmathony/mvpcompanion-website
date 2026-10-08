"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { localeFromPathname, localizePath } from "@/lib/i18n/paths";

type LocaleLinkProps = ComponentProps<typeof Link>;

export function LocaleLink({ href, ...props }: LocaleLinkProps) {
  const pathname = usePathname();
  const localized =
    typeof href === "string" ? localizePath(href, localeFromPathname(pathname)) : href;

  return <Link href={localized} {...props} />;
}
