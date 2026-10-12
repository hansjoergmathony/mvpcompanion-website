import { NextResponse, type NextRequest } from "next/server";
import { getAdminAuthConfig, isAdminRequest } from "@/lib/admin/auth";
import { loadCloudLibrary, isCloudStorageConfigured, saveCloudLibrary } from "@/lib/project/cloudStorage";
import { parseIdeaLibrary } from "@/lib/project/storage";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 1_000_000;

function unauthorized() {
  return NextResponse.json({ error: "Private cloud storage is only available to the admin." }, { status: 403 });
}

function ownerEmail(request: NextRequest): string | null {
  if (!isAdminRequest(request)) {
    return null;
  }

  return getAdminAuthConfig()?.adminEmail ?? null;
}

export async function GET(request: NextRequest) {
  const owner = ownerEmail(request);
  if (!owner) {
    return unauthorized();
  }

  if (!isCloudStorageConfigured()) {
    return NextResponse.json({ configured: false }, { headers: { "Cache-Control": "no-store" } });
  }

  try {
    const record = await loadCloudLibrary(owner);
    return NextResponse.json({ configured: true, record }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Cloud storage is temporarily unavailable." }, { status: 503 });
  }
}

export async function PUT(request: NextRequest) {
  const owner = ownerEmail(request);
  if (!owner) {
    return unauthorized();
  }
  if (!isCloudStorageConfigured()) {
    return NextResponse.json({ error: "Cloud storage is not configured." }, { status: 503 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: "Draft is too large to save." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const payload = body as { library?: unknown; expectedRevision?: unknown };
  const library = parseIdeaLibrary(payload.library);
  const expectedRevision = payload.expectedRevision === null
    ? null
    : typeof payload.expectedRevision === "number" && Number.isInteger(payload.expectedRevision) && payload.expectedRevision > 0
      ? payload.expectedRevision
      : undefined;
  if (!library || expectedRevision === undefined) {
    return NextResponse.json({ error: "Invalid draft." }, { status: 400 });
  }

  try {
    const result = await saveCloudLibrary(owner, library, expectedRevision);
    if (result === "conflict") {
      const record = await loadCloudLibrary(owner);
      return NextResponse.json({ error: "Cloud draft has changed.", record }, { status: 409 });
    }
    return NextResponse.json({ record: result }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Cloud storage is temporarily unavailable." }, { status: 503 });
  }
}
