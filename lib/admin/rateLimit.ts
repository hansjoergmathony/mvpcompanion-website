const requests = new Map<string, number[]>();
const WINDOW_MS = 60_000;

function limit(): number {
  const configured = Number.parseInt(
    process.env.MVP_ADMIN_AI_REQUESTS_PER_MINUTE ?? "6",
    10,
  );
  return Number.isInteger(configured) && configured > 0 ? configured : 6;
}

/**
 * Lightweight defence-in-depth for the single private pilot account. The
 * session cookie is never returned or logged; it is used only as a memory key.
 */
export function consumeAdminAiRequest(sessionIdentifier: string | undefined): boolean {
  if (!sessionIdentifier) {
    return false;
  }

  const now = Date.now();
  const active = (requests.get(sessionIdentifier) ?? []).filter(
    (timestamp) => now - timestamp < WINDOW_MS,
  );

  if (active.length >= limit()) {
    requests.set(sessionIdentifier, active);
    return false;
  }

  active.push(now);
  requests.set(sessionIdentifier, active);
  return true;
}
