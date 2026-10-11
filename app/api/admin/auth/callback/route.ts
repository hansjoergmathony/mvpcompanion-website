import { NextResponse, type NextRequest } from "next/server";
import {
  adminCookies,
  createAdminSession,
  getAdminAuthConfig,
  isValidOAuthState,
} from "@/lib/admin/auth";

function redirectToStart(request: NextRequest, state: string) {
  const destination = new URL("/start", request.url);
  destination.searchParams.set("admin", state);
  return NextResponse.redirect(destination);
}

export async function GET(request: NextRequest) {
  const config = getAdminAuthConfig();
  const code = request.nextUrl.searchParams.get("code") ?? undefined;
  const state = request.nextUrl.searchParams.get("state") ?? undefined;

  if (!config || !code || !isValidOAuthState(
    state,
    request.cookies.get(adminCookies.state)?.value,
    config,
  )) {
    return redirectToStart(request, "denied");
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.redirectUri,
        grant_type: "authorization_code",
      }),
      cache: "no-store",
    });
    const token = (await tokenResponse.json()) as { access_token?: unknown };
    if (!tokenResponse.ok || typeof token.access_token !== "string") {
      return redirectToStart(request, "denied");
    }

    const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${token.access_token}` },
      cache: "no-store",
    });
    const profile = (await profileResponse.json()) as {
      email?: unknown;
      email_verified?: unknown;
    };
    if (
      !profileResponse.ok ||
      typeof profile.email !== "string" ||
      profile.email_verified !== true
    ) {
      return redirectToStart(request, "denied");
    }

    const session = createAdminSession(profile.email, config);
    if (!session) {
      return redirectToStart(request, "denied");
    }

    const response = redirectToStart(request, "signed-in");
    response.cookies.set(adminCookies.session, session, {
      httpOnly: true,
      maxAge: adminCookies.sessionMaxAge,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    response.cookies.delete(adminCookies.state);
    return response;
  } catch {
    return redirectToStart(request, "denied");
  }
}
