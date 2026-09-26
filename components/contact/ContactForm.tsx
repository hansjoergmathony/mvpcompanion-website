"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { publicContactEmail } from "@/content/legal";

type FormState = "idle" | "submitting" | "success" | "error";

const fieldClassName =
  "mt-2 w-full rounded-md border border-border bg-card px-4 py-3 text-base leading-relaxed text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue";

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [fieldError, setFieldError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldError(null);
    setFormState("submitting");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
        }),
      });

      if (response.ok) {
        form.reset();
        setFormState("success");
        return;
      }

      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (response.status === 400 && payload?.error) {
        setFieldError(payload.error);
        setFormState("idle");
        return;
      }

      setFormState("error");
    } catch {
      setFormState("error");
    }
  }

  if (formState === "success") {
    return (
      <p
        className="rounded-xl border border-border bg-ice px-6 py-5 text-lg text-navy"
        role="status"
      >
        Thanks — your message has been sent.
      </p>
    );
  }

  return (
    <div>
      <p className="max-w-xl text-base leading-relaxed text-muted">
        You can also reach us directly at{" "}
        <a
          href={`mailto:${publicContactEmail}`}
          className="font-medium text-blue underline-offset-2 hover:underline"
        >
          {publicContactEmail}
        </a>
        .
      </p>

      <form
        className="mt-10 max-w-xl space-y-6"
        onSubmit={handleSubmit}
        noValidate
      >
        <div>
          <label htmlFor="contact-name" className="text-sm font-medium text-navy">
            Name <span className="text-blue">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={fieldClassName}
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="text-sm font-medium text-navy">
            Email <span className="text-blue">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldClassName}
          />
        </div>

        <div>
          <label htmlFor="contact-subject" className="text-sm font-medium text-navy">
            Subject <span className="text-muted">(optional)</span>
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            autoComplete="off"
            className={fieldClassName}
          />
        </div>

        <div>
          <label htmlFor="contact-message" className="text-sm font-medium text-navy">
            Message <span className="text-blue">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={6}
            className={`${fieldClassName} resize-y`}
          />
        </div>

        {fieldError ? (
          <p className="text-sm text-red-700" role="alert">
            {fieldError}
          </p>
        ) : null}

        {formState === "error" ? (
          <p className="text-sm text-red-700" role="alert">
            Something went wrong. Please try again or contact us directly.
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={formState === "submitting"}
        >
          {formState === "submitting" ? "Sending…" : "Send message"}
        </Button>
      </form>
    </div>
  );
}
