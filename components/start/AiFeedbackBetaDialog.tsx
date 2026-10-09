"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { Button } from "@/components/ui/Button";
import type { Dictionary } from "@/content/en";
import type { Locale } from "@/lib/i18n/config";

type FormState = "idle" | "submitting" | "success" | "error";

type AiFeedbackBetaDialogProps = {
  copy: Dictionary["ui"]["betaInterest"];
  locale: Locale;
  source: "clarify" | "full_specification";
  stageNumber?: number;
  onClose: () => void;
};

const fieldClassName =
  "mt-2 w-full rounded-md border border-border bg-card px-4 py-3 text-base leading-relaxed text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue";

export function AiFeedbackBetaDialog({
  copy,
  locale,
  source,
  stageNumber,
  onClose,
}: AiFeedbackBetaDialogProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [formState, setFormState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFormState("submitting");

    const data = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/ai-feedback-beta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interest: data.get("interest"),
          scope: data.get("scope"),
          pricePreference: data.get("pricePreference"),
          email: data.get("email"),
          consent: data.get("consent") === "on",
          source,
          stageNumber,
          locale,
          companyWebsite: data.get("companyWebsite"),
        }),
      });

      if (response.ok) {
        setFormState("success");
        return;
      }

      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (response.status === 400 && payload?.error) {
        setError(payload.error);
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
      <section
        className="mt-8 rounded-xl border border-border bg-ice px-5 py-6"
        role="status"
      >
        <p className="text-base leading-relaxed text-navy">{copy.success}</p>
        <div className="mt-5">
          <Button type="button" variant="secondary" onClick={onClose}>
            {copy.cancel}
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="ai-feedback-beta-title"
      aria-modal="true"
      className="mt-8 rounded-xl border border-border bg-ice px-5 py-6"
      role="dialog"
    >
      <h2
        id="ai-feedback-beta-title"
        ref={headingRef}
        tabIndex={-1}
        className="text-xl font-semibold tracking-tight text-navy outline-none"
      >
        {copy.title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted">{copy.body}</p>

      <form className="mt-6 space-y-6" onSubmit={handleSubmit} noValidate>
        <RadioGroup
          name="interest"
          label={copy.interestLabel}
          options={[
            ["free", copy.interestFree],
            ["paid", copy.interestPaid],
            ["no", copy.interestNo],
          ]}
        />
        <RadioGroup
          name="scope"
          label={copy.scopeLabel}
          options={[
            ["clarify", copy.scopeClarify],
            ["full", copy.scopeFull],
            ["both", copy.scopeBoth],
          ]}
        />
        <RadioGroup
          name="pricePreference"
          label={copy.priceLabel}
          options={[
            ["up_to_590", copy.price590],
            ["up_to_990", copy.price990],
            ["free_only", copy.priceFree],
            ["unsure", copy.priceUnsure],
          ]}
        />
        <div>
          <label htmlFor="ai-feedback-beta-email" className="text-sm font-medium text-navy">
            {copy.emailLabel} <span className="text-muted">({copy.emailOptional})</span>
          </label>
          <input
            id="ai-feedback-beta-email"
            name="email"
            type="email"
            autoComplete="email"
            className={fieldClassName}
          />
          <label className="mt-4 flex gap-3 text-sm leading-relaxed text-muted">
            <input name="consent" type="checkbox" className="mt-1" />
            <span>{copy.consentLabel}</span>
          </label>
          <p className="mt-3 text-sm text-muted">
            {copy.privacyPrefix}
            <LocaleLink href="/datenschutz" className="text-blue underline underline-offset-2">
              {copy.privacyLink}
            </LocaleLink>
            .
          </p>
        </div>
        <input
          aria-hidden="true"
          autoComplete="off"
          className="hidden"
          name="companyWebsite"
          tabIndex={-1}
          type="text"
        />
        {error ? <p className="text-sm text-red-700" role="alert">{error}</p> : null}
        {formState === "error" ? (
          <p className="text-sm text-red-700" role="alert">{copy.sendFailed}</p>
        ) : null}
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={formState === "submitting"}>
            {formState === "submitting" ? copy.submitting : copy.submit}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            {copy.cancel}
          </Button>
        </div>
      </form>
    </section>
  );
}

function RadioGroup({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: Array<[string, string]>;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-navy">{label}</legend>
      <div className="mt-3 space-y-3">
        {options.map(([value, optionLabel]) => (
          <label key={value} className="flex gap-3 text-sm leading-relaxed text-foreground">
            <input name={name} type="radio" value={value} className="mt-1" />
            <span>{optionLabel}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
