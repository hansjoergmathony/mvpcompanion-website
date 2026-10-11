import { NextResponse, type NextRequest } from "next/server";
import { isAdminRequest } from "@/lib/admin/auth";
import { consumeAdminAiRequest } from "@/lib/admin/rateLimit";
import type { ClarificationRequest, StageFeedback } from "@/lib/clarification/types";
import { isStageKey, stageNumberByKey } from "@/lib/project/types";

const MAX_TEXT_LENGTH = 6_000;
const MAX_RELATED_ANSWER_LENGTH = 1_500;
const MAX_RELATED_CONTEXT_LENGTH = 8_000;

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

function hasStartingContext(
  value: unknown,
): value is ClarificationRequest["startingContext"] {
  return (
    value !== null &&
    typeof value === "object" &&
    "idea" in value &&
    "problem" in value &&
    "user" in value &&
    typeof value.idea === "string" &&
    typeof value.problem === "string" &&
    typeof value.user === "string"
  );
}

function isClarificationRequest(value: unknown): value is ClarificationRequest {
  if (!value || typeof value !== "object") {
    return false;
  }

  const request = value as Partial<ClarificationRequest>;
  const startingContext = request.startingContext;
  return (
    typeof request.stageKey === "string" &&
      isStageKey(request.stageKey) &&
    typeof request.stageName === "string" &&
    typeof request.question === "string" &&
    typeof request.purpose === "string" &&
    typeof request.answer === "string" &&
    Boolean(request.answer.trim()) &&
    request.answer.length <= MAX_TEXT_LENGTH &&
    hasStartingContext(startingContext)
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

function compactRelatedAnswers(value: unknown): Partial<Record<ClarificationRequest["stageKey"], string>> {
  if (!value || typeof value !== "object") {
    return {};
  }

  let remaining = MAX_RELATED_CONTEXT_LENGTH;
  const answers: Partial<Record<ClarificationRequest["stageKey"], string>> = {};
  for (const [key, answer] of Object.entries(value)) {
    if (!isStageKey(key) || typeof answer !== "string" || remaining <= 0) {
      continue;
    }
    const compact = answer.trim().slice(0, Math.min(MAX_RELATED_ANSWER_LENGTH, remaining));
    if (compact) {
      answers[key] = compact;
      remaining -= compact.length;
    }
  }
  return answers;
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

function clarificationError(locale: "en" | "de" | undefined, key: "invalid" | "input" | "unauthorized" | "rate_limited" | "unavailable" | "empty" | "unconfigured") {
  const copy = {
    en: {
      invalid: "Invalid request.",
      input: "Invalid clarification input.",
      unauthorized: "AI feedback is only available in the private pilot.",
      rate_limited: "Please wait a minute before requesting more AI feedback.",
      unavailable: "AI feedback is temporarily unavailable.",
      empty: "AI feedback did not contain a result.",
      unconfigured: "AI feedback is not configured.",
    },
    de: {
      invalid: "Ungültige Anfrage.",
      input: "Ungültige Eingabe für die Klärung.",
      unauthorized: "KI-Feedback ist nur im privaten Pilot verfügbar.",
      rate_limited: "Bitte warten Sie eine Minute, bevor Sie weiteres KI-Feedback anfordern.",
      unavailable: "Die KI-Rückmeldung ist vorübergehend nicht verfügbar.",
      empty: "Die KI-Rückmeldung enthielt kein Ergebnis.",
      unconfigured: "Die KI-Rückmeldung ist nicht eingerichtet.",
    },
  } as const;

  return copy[locale === "de" ? "de" : "en"][key];
}

export async function POST(request: NextRequest) {
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

  if (!isAdminRequest(request)) {
    return NextResponse.json(
      { error: clarificationError(locale, "unauthorized") },
      { status: 403 },
    );
  }

  if (!consumeAdminAiRequest(request.cookies.get("mvp_admin_session")?.value)) {
    return NextResponse.json(
      { error: clarificationError(locale, "rate_limited") },
      { status: 429 },
    );
  }

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
    startingContext: {
      idea: payload.startingContext.idea.slice(0, MAX_RELATED_ANSWER_LENGTH),
      problem: payload.startingContext.problem.slice(0, MAX_RELATED_ANSWER_LENGTH),
      user: payload.startingContext.user.slice(0, MAX_RELATED_ANSWER_LENGTH),
    },
    relatedAnswers: compactRelatedAnswers(payload.relatedAnswers),
  };
  const stageReviewFocus: Record<ClarificationRequest["stageKey"], string> = {
    idea: "Check that the idea frames a possible product without claiming validation.",
    problem: "Check that the problem is concrete, separate from the solution, and distinguishes evidence from assumptions.",
    user: "Check that the primary user and context are sufficiently specific to guide decisions.",
    value: "Check that the desired outcome and value are concrete and not merely a feature list.",
    product: "Check that the product's core mental model is clear and not an unbounded collection of features.",
    context: "Check that relevant lifecycle states, transitions, and important exceptions are described.",
    jobs: "Check that the most important user jobs are distinguishable, prioritized, and actionable.",
    scope: "Check that the smallest useful solution is bounded and that exclusions are explicit.",
    experience: "Check that the core flow is complete and includes a meaningful error or no-result case.",
    informationArchitecture: "Check that central objects, information, and their organization are understandable.",
    data: "Check that essential entities, relationships, fields, and state are sufficient for the stated MVP.",
    requirements: "Check that requirements and acceptance criteria are observable, testable, and not needlessly solution-specific.",
    learning: "Check that the learning question, metric, and decision that follows from the result are clear.",
    technicalBoundaries: "Check that dependencies, privacy constraints, risks, and open feasibility questions are explicit.",
    mvpBoundary: "Check that the MVP boundary prioritizes what is included and explicitly excludes what is not needed yet.",
  };
  const stageSequencing: Partial<Record<ClarificationRequest["stageKey"], string>> = {
    idea: "This is an early framing stage. Ask only about the possible product concept and the outcome it could enable. Do not ask about features, deliverables, artifacts, workflows, scope, implementation, prioritization, or later specification stages.",
    problem: "This is an early discovery stage. Ask only about the user's current difficulty, its consequences, and what is evidence versus assumption. Do not ask about the proposed product, features, MVP scope, implementation, or later specification stages.",
    user: "This is an early discovery stage. Ask only about the primary person, their situation, and the context in which the problem occurs. Do not ask about solution flows, product outputs, features, MVP scope, implementation, or later specification stages.",
  };
  const sequencingInstruction =
    stageSequencing[payload.stageKey] ??
    "Keep questions appropriate to the current stage. Do not ask the user to complete decisions that belong to a later stage unless a missing earlier-stage decision makes the current answer impossible to understand.";

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
        instructions: `You are MVPCompanion, a careful product-discovery coach. Review a user's answer for stage ${stageNumberByKey[payload.stageKey]} of a 15-stage MVP specification. Write in ${language}. Stage focus: ${stageReviewFocus[payload.stageKey]} Sequencing rule: ${sequencingInstruction} Do not claim market facts, validation, or user research that is not present. Separate evidence from assumptions. Generate 2–4 specific, neutral open questions that would help validate or sharpen the answer. Keep every item concise and actionable. Set status to needs_clarification only when the answer is too vague, conflates problem and solution, or lacks a necessary decision; otherwise set it to ready_to_continue.`,
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
