import { dictionary as de } from "@/content/de";
import { dictionary as en } from "@/content/en";
import { isLocale, type Locale } from "@/lib/i18n/config";

export type ContactMessageInput = {
  name: string;
  email: string;
  message: string;
  subject?: string;
  locale?: string;
};

export type SendContactResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "send_failed" | "invalid_input" };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactInput(
  input: ContactMessageInput,
  locale: Locale = "en",
): string | null {
  const copy = (locale === "de" ? de : en).ui.contact;
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  if (name.length < 2 || name.length > 120) {
    return copy.nameError;
  }

  if (!emailPattern.test(email) || email.length > 254) {
    return copy.emailError;
  }

  if (message.length < 10 || message.length > 5000) {
    return copy.messageError;
  }

  if (input.subject && input.subject.trim().length > 200) {
    return copy.subjectError;
  }

  return null;
}

export function contactLocale(value: string | undefined): Locale {
  return value && isLocale(value) ? value : "en";
}

export async function sendContactMessage(
  input: ContactMessageInput,
): Promise<SendContactResult> {
  const validationError = validateContactInput(input, contactLocale(input.locale));
  if (validationError) {
    return { ok: false, reason: "invalid_input" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to =
    process.env.CONTACT_EMAIL_TO?.trim() ?? "hello@mvpcompanion.com";
  const from = process.env.CONTACT_EMAIL_FROM?.trim();

  if (!apiKey || !from) {
    return { ok: false, reason: "not_configured" };
  }

  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();
  const subjectLine = input.subject?.trim()
    ? `[MVPCompanion] ${input.subject.trim()}`
    : `[MVPCompanion] Message from ${name}`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: subjectLine,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        input.subject?.trim() ? `Subject: ${input.subject.trim()}` : null,
        "",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    }),
  });

  if (!response.ok) {
    return { ok: false, reason: "send_failed" };
  }

  return { ok: true };
}
