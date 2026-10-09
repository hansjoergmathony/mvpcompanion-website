import { NextResponse } from "next/server";
import { dictionary as de } from "@/content/de";
import { dictionary as en } from "@/content/en";
import {
  betaLocale,
  sendAiFeedbackBetaInterest,
  validateAiFeedbackBetaInterest,
  type AiFeedbackBetaInterestInput,
} from "@/lib/email/sendAiFeedbackBetaInterest";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: en.ui.betaInterest.sendFailed }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: en.ui.betaInterest.sendFailed }, { status: 400 });
  }

  const input = body as Partial<AiFeedbackBetaInterestInput> & {
    companyWebsite?: unknown;
  };
  const locale = betaLocale(input.locale ? String(input.locale) : undefined);
  const copy = (locale === "de" ? de : en).ui.betaInterest;

  if (typeof input.companyWebsite === "string" && input.companyWebsite.trim()) {
    return NextResponse.json({ ok: true });
  }

  const payload: AiFeedbackBetaInterestInput = {
    interest: String(input.interest ?? ""),
    scope: String(input.scope ?? ""),
    pricePreference: String(input.pricePreference ?? ""),
    email: input.email ? String(input.email) : undefined,
    consent: input.consent === true,
    source: String(input.source ?? ""),
    stageNumber:
      typeof input.stageNumber === "number" ? input.stageNumber : undefined,
    locale,
  };
  const validationError = validateAiFeedbackBetaInterest(payload, locale);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const result = await sendAiFeedbackBetaInterest(payload);
  if (result.ok) {
    return NextResponse.json({ ok: true });
  }

  if (result.reason === "not_configured") {
    console.error("AI feedback beta interest: email provider is not configured.");
  } else if (result.reason === "send_failed") {
    console.error("AI feedback beta interest: email delivery failed.");
  }

  return NextResponse.json({ error: copy.sendFailed }, { status: 503 });
}
