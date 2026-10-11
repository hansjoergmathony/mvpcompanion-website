import { NextResponse } from "next/server";
import { adminCookies, createOAuthState, getAdminAuthConfig } from "@/lib/admin/auth";

export async function GET() {
  const config = getAdminAuthConfig();
  if (!config) {
    return NextResponse.json({ error: "Private admin sign-in is not configured." }, { status: 503 });
  }

  const state = createOAuthState(config);
  const authorizationUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authorizationUrl.searchParams.set("client_id", config.clientId);
  authorizationUrl.searchParams.set("redirect_uri", config.redirectUri);
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("scope", "openid email");
  authorizationUrl.searchParams.set("state", state);
  authorizationUrl.searchParams.set("prompt", "select_account");

  const response = NextResponse.redirect(authorizationUrl);
  response.cookies.set(adminCookies.state, state, {
    httpOnly: true,
    maxAge: adminCookies.stateMaxAge,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
