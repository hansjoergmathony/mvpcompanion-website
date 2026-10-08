import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LOCALE_COOKIE } from "@/lib/i18n/config";

const PUBLIC_FILE = /\.[^/]+$/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
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
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
