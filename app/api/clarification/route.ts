import { NextResponse } from "next/server";
import type { ClarificationRequest, StageFeedback } from "@/lib/clarification/types";

const MAX_TEXT_LENGTH = 6_000;

const feedbackSchema = {
  type: "object",
  properties: {
    summary: { type: "string" },
    observations: { type: "array", items: { type: "string" } },
    uncertainties: { type: "array", items: { type: "string" } },
    suggestions: { type: "array", items: { type: "string" } },
    assumptions: { type: "array", items: { type: "string" } },
    status: {
      type: "string",
      enum: ["needs_clarification", "ready_to_continue"],
    },
  },
  required: [
    "summary",
    "observations",
    "uncertainties",
    "suggestions",
    "assumptions",
    "status",
  ],
  additionalProperties: false,
} as const;

function isClarificationRequest(value: unknown): value is ClarificationRequest {
  if (!value || typeof value !== "object") {
    return false;
  }

  const request = value as Partial<ClarificationRequest>;
  return (
    typeof request.stageKey === "string" &&
    typeof request.stageName === "string" &&
    typeof request.question === "string" &&
    typeof request.purpose === "string" &&
    typeof request.answer === "string" &&
    Boolean(request.answer.trim()) &&
    request.answer.length <= MAX_TEXT_LENGTH
  );
}

function responseText(response: unknown): string | null {
  if (!response || typeof response !== "object") {
    return null;
  }

  const value = response as {
    output?: Array<{
      type?: unknown;
      content?: Array<{ type?: unknown; text?: unknown }>;
    }>;
  };
  const message = value.output?.find((item) => item.type === "message");
  const content = message?.content?.find((item) => item.type === "output_text");
  return typeof content?.text === "string" ? content.text : null;
}

function normalizeFeedback(value: StageFeedback): StageFeedback {
  return {
    summary: value.summary.trim(),
    observations: value.observations.map((item) => item.trim()).filter(Boolean).slice(0, 4),
    uncertainties: value.uncertainties.map((item) => item.trim()).filter(Boolean).slice(0, 3),
    suggestions: value.suggestions.map((item) => item.trim()).filter(Boolean).slice(0, 4),
    assumptions: value.assumptions?.map((item) => item.trim()).filter(Boolean).slice(0, 4),
    status: value.status,
  };
}

function clarificationError(locale: "en" | "de" | undefined, key: "invalid" | "input" | "unavailable" | "empty" | "unconfigured") {
  const copy = {
    en: {
      invalid: "Invalid request.",
      input: "Invalid clarification input.",
      unavailable: "AI feedback is temporarily unavailable.",
      empty: "AI feedback did not contain a result.",
      unconfigured: "AI feedback is not configured.",
    },
    de: {
      invalid: "Ungültige Anfrage.",
      input: "Ungültige Eingabe für die Klärung.",
      unavailable: "Die KI-Rückmeldung ist vorübergehend nicht verfügbar.",
      empty: "Die KI-Rückmeldung enthielt kein Ergebnis.",
      unconfigured: "Die KI-Rückmeldung ist nicht eingerichtet.",
    },
  } as const;

  return copy[locale === "de" ? "de" : "en"][key];
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: clarificationError("en", "invalid") }, { status: 400 });
  }

  if (!isClarificationRequest(payload)) {
    const locale = payload && typeof payload === "object" && "locale" in payload && payload.locale === "de" ? "de" : "en";
    return NextResponse.json({ error: clarificationError(locale, "input") }, { status: 400 });
  }

  const locale = payload.locale === "de" ? "de" : "en";

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: clarificationError(locale, "unconfigured") },
      { status: 503 },
    );
  }

  const language = locale === "de" ? "German" : "English";
  const input = {
    stage: payload.stageName,
    purpose: payload.purpose,
    question: payload.question,
    answer: payload.answer.trim(),
    startingContext: payload.startingContext,
    relatedAnswers: payload.relatedAnswers,
  };

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        reasoning: { effort: "minimal" },
        instructions: `You are MVPCompanion, a careful product-discovery coach. Review a user's answer for the current product-clarification stage. Write in ${language}. Do not claim market facts, validation, or user research that is not present. Separate evidence from assumptions. Generate 2–4 specific, neutral open questions that would help validate or sharpen the answer. Keep every item concise and actionable. Set status to needs_clarification only when the answer is too vague, conflates problem and solution, or lacks a necessary decision; otherwise set it to ready_to_continue.`,
        input: JSON.stringify(input),
        max_output_tokens: 700,
        text: {
          format: {
            type: "json_schema",
            name: "clarification_feedback",
            strict: true,
            schema: feedbackSchema,
          },
        },
      }),
    });

    if (!response.ok) {
      console.error("OpenAI clarification request failed.", response.status);
      return NextResponse.json(
        { error: clarificationError(locale, "unavailable") },
        { status: 502 },
      );
    }

    const output = responseText(await response.json());
    if (!output) {
      return NextResponse.json(
        { error: clarificationError(locale, "empty") },
        { status: 502 },
      );
    }

    const feedback = normalizeFeedback(JSON.parse(output) as StageFeedback);
    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("OpenAI clarification request failed.", error);
    return NextResponse.json(
      { error: clarificationError(locale, "unavailable") },
      { status: 502 },
    );
  }
}
