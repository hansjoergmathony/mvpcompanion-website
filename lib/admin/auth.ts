import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "mvp_admin_session";
const STATE_COOKIE = "mvp_admin_oauth_state";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;
const STATE_MAX_AGE_SECONDS = 60 * 10;

type SignedPayload = {
  email?: string;
  expiresAt: number;
  nonce?: string;
};

export type AdminAuthConfig = {
  adminEmail: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  sessionSecret: string;
};

function base64Url(value: string | Buffer): string {
  return Buffer.from(value).toString("base64url");
}

function readConfig(): AdminAuthConfig | null {
  const adminEmail = process.env.MVP_ADMIN_EMAIL?.trim().toLowerCase();
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const redirectUri = process.env.MVP_ADMIN_OAUTH_REDIRECT_URI?.trim();
  const sessionSecret = process.env.MVP_ADMIN_SESSION_SECRET?.trim();

  if (!adminEmail || !clientId || !clientSecret || !redirectUri || !sessionSecret) {
    return null;
  }

  return { adminEmail, clientId, clientSecret, redirectUri, sessionSecret };
}

function signature(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function sign(payload: SignedPayload, secret: string): string {
  const encoded = base64Url(JSON.stringify(payload));
  return `${encoded}.${signature(encoded, secret)}`;
}

function verify(value: string | undefined, secret: string): SignedPayload | null {
  if (!value) {
    return null;
  }

  const [encoded, providedSignature] = value.split(".");
  if (!encoded || !providedSignature) {
    return null;
  }

  const expectedSignature = signature(encoded, secret);
  const provided = Buffer.from(providedSignature);
  const expected = Buffer.from(expectedSignature);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SignedPayload;
    return payload.expiresAt > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

export function getAdminAuthConfig(): AdminAuthConfig | null {
  return readConfig();
}

export function createOAuthState(config: AdminAuthConfig): string {
  return sign(
    {
      nonce: randomBytes(24).toString("base64url"),
      expiresAt: Date.now() + STATE_MAX_AGE_SECONDS * 1000,
    },
    config.sessionSecret,
  );
}

export function isValidOAuthState(
  state: string | undefined,
  cookieValue: string | undefined,
  config: AdminAuthConfig,
): boolean {
  if (!state || !cookieValue || state !== cookieValue) {
    return false;
  }

  return Boolean(verify(state, config.sessionSecret)?.nonce);
}

export function createAdminSession(email: string, config: AdminAuthConfig): string | null {
  if (email.trim().toLowerCase() !== config.adminEmail) {
    return null;
  }

  return sign(
    {
      email: config.adminEmail,
      expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
    },
    config.sessionSecret,
  );
}

export function isAdminRequest(request: NextRequest): boolean {
  const config = readConfig();
  if (!config) {
    return false;
  }

  const session = verify(request.cookies.get(SESSION_COOKIE)?.value, config.sessionSecret);
  return session?.email === config.adminEmail;
}

export const adminCookies = {
  session: SESSION_COOKIE,
  state: STATE_COOKIE,
  sessionMaxAge: SESSION_MAX_AGE_SECONDS,
  stateMaxAge: STATE_MAX_AGE_SECONDS,
};
