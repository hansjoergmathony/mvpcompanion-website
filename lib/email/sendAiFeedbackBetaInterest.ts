import { dictionary as de } from "@/content/de";
import { dictionary as en } from "@/content/en";
import { isLocale, type Locale } from "@/lib/i18n/config";

export type AiFeedbackBetaInterestInput = {
  interest: string;
  scope: string;
  pricePreference: string;
  email?: string;
  consent: boolean;
  source: string;
  stageNumber?: number;
  locale?: string;
};

export type SendAiFeedbackBetaInterestResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "send_failed" | "invalid_input" };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const interests = new Set(["free", "paid", "no"]);
const scopes = new Set(["clarify", "full", "both"]);
const pricePreferences = new Set(["up_to_590", "up_to_990", "free_only", "unsure"]);
const sources = new Set(["clarify", "full_specification"]);

function betaLocale(value: string | undefined): Locale {
  return value && isLocale(value) ? value : "en";
}

export function validateAiFeedbackBetaInterest(
  input: AiFeedbackBetaInterestInput,
  locale: Locale = "en",
): string | null {
  const copy = (locale === "de" ? de : en).ui.betaInterest;
  const email = input.email?.trim() ?? "";

  if (!interests.has(input.interest)) {
    return copy.interestError;
  }
  if (!scopes.has(input.scope)) {
    return copy.scopeError;
  }
  if (!pricePreferences.has(input.pricePreference)) {
    return copy.priceError;
  }
  if (!sources.has(input.source)) {
    return copy.sendFailed;
  }
  if (
    input.stageNumber !== undefined &&
    (!Number.isInteger(input.stageNumber) || input.stageNumber < 1 || input.stageNumber > 6)
  ) {
    return copy.sendFailed;
  }
  if (email && (!emailPattern.test(email) || email.length > 254)) {
    return copy.emailError;
  }
  if (email && !input.consent) {
    return copy.consentError;
  }

  return null;
}

export async function sendAiFeedbackBetaInterest(
  input: AiFeedbackBetaInterestInput,
): Promise<SendAiFeedbackBetaInterestResult> {
  const locale = betaLocale(input.locale);
  if (validateAiFeedbackBetaInterest(input, locale)) {
    return { ok: false, reason: "invalid_input" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO?.trim() ?? "hello@mvpcompanion.com";
  const from = process.env.CONTACT_EMAIL_FROM?.trim();

  if (!apiKey || !from) {
    return { ok: false, reason: "not_configured" };
  }

  const email = input.email?.trim() ?? "";
  const source = input.source === "full_specification" ? "full specification" : "Clarify";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      ...(email ? { reply_to: email } : {}),
      subject: "[MVPCompanion] AI feedback beta interest",
      text: [
        `Interest: ${input.interest}`,
        `Preferred scope: ${input.scope}`,
        `Price preference: ${input.pricePreference}`,
        `Entry point: ${source}${input.stageNumber ? ` stage ${input.stageNumber}` : ""}`,
        `Locale: ${locale}`,
        `Email: ${email || "not provided"}`,
        `Contact consent: ${input.consent ? "yes" : "no"}`,
      ].join("\n"),
    }),
  });

  return response.ok ? { ok: true } : { ok: false, reason: "send_failed" };
}

export { betaLocale };
