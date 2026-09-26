export type ContactMessageInput = {
  name: string;
  email: string;
  message: string;
  subject?: string;
};

export type SendContactResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "send_failed" | "invalid_input" };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactInput(input: ContactMessageInput): string | null {
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  if (name.length < 2 || name.length > 120) {
    return "Please enter your name (2–120 characters).";
  }

  if (!emailPattern.test(email) || email.length > 254) {
    return "Please enter a valid email address.";
  }

  if (message.length < 10 || message.length > 5000) {
    return "Please enter a message (10–5000 characters).";
  }

  if (input.subject && input.subject.trim().length > 200) {
    return "Subject must be 200 characters or fewer.";
  }

  return null;
}

export async function sendContactMessage(
  input: ContactMessageInput,
): Promise<SendContactResult> {
  const validationError = validateContactInput(input);
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
