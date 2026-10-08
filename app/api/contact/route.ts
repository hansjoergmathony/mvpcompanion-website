import { NextResponse } from "next/server";
import { dictionary as de } from "@/content/de";
import { dictionary as en } from "@/content/en";
import {
  contactLocale,
  sendContactMessage,
  validateContactInput,
  type ContactMessageInput,
} from "@/lib/email/sendContactMessage";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: en.ui.contact.invalidRequest }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: en.ui.contact.invalidRequest }, { status: 400 });
  }

  const input = body as Partial<ContactMessageInput>;
  const locale = contactLocale(input.locale ? String(input.locale) : undefined);
  const copy = (locale === "de" ? de : en).ui.contact;
  const payload: ContactMessageInput = {
    name: String(input.name ?? ""),
    email: String(input.email ?? ""),
    message: String(input.message ?? ""),
    subject: input.subject ? String(input.subject) : undefined,
    locale,
  };

  const validationError = validateContactInput(payload, locale);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const result = await sendContactMessage(payload);

  if (result.ok) {
    return NextResponse.json({ ok: true });
  }

  if (result.reason === "not_configured") {
    console.error("Contact form: email provider is not configured.");
  } else if (result.reason === "send_failed") {
    console.error("Contact form: email send failed.");
  }

  return NextResponse.json(
    { error: copy.sendFailed },
    { status: 503 },
  );
}
