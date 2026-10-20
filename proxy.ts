import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LOCALE_COOKIE } from "@/lib/i18n/config";

const PUBLIC_FILE = /\.[^/]+$/;
const LOCALE_REWRITE = "x-mvp-locale-rewrite";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname.startsWith("/_next") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    if (request.headers.get(LOCALE_REWRITE) === "1") {
      return NextResponse.next();
    }

    const url = request.nextUrl.clone();
    const stripped = pathname.slice(3);
    url.pathname = stripped === "" ? "/" : stripped;
    return NextResponse.redirect(url);
  }

  if (pathname === "/de" || pathname.startsWith("/de/")) {
    return NextResponse.next();
  }

  if (request.cookies.get(LOCALE_COOKIE)?.value === "de") {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? "/de" : `/de${pathname}`;
    return NextResponse.redirect(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
  const headers = new Headers(request.headers);
  headers.set(LOCALE_REWRITE, "1");
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
