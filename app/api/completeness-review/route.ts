import { NextResponse, type NextRequest } from "next/server";
import { isAdminRequest } from "@/lib/admin/auth";
import { consumeAdminAiRequest } from "@/lib/admin/rateLimit";
import { stageGates } from "@/lib/completeness/stageGates";
import type { CompletenessReview } from "@/lib/completeness/types";
import { criterionId, deterministicStatus, quoteExists, reviewOverall } from "@/lib/completeness/review";
import { isStageKey, type StageKey } from "@/lib/project/types";

const MAX_ANSWER_LENGTH = 8_000;
const MAX_RELATED_LENGTH = 8_000;

const reviewSchema = {
  type: "object",
  properties: {
    overall: { type: "string", enum: ["ready", "needs_work"] },
    summary: { type: "string" },
    criteria: {
      type: "array",
      items: {
        type: "object",
        properties: {
          index: { type: "integer" },
          status: { type: "string", enum: ["met", "partial", "missing", "not_applicable"] },
          evidenceQuote: { type: "string" },
          source: { type: "string", enum: ["current_stage", "no_direct_evidence"] },
          evidence: { type: "string" },
          improvement: { type: "string" },
        },
        required: ["index", "status", "evidenceQuote", "source", "evidence", "improvement"],
        additionalProperties: false,
      },
    },
    missingInformation: { type: "array", items: { type: "string" } },
    contradictions: { type: "array", items: { type: "string" } },
    suggestedNextStep: { type: "string" },
  },
  required: ["overall", "summary", "criteria", "missingInformation", "contradictions", "suggestedNextStep"],
  additionalProperties: false,
} as const;

const quoteVerificationSchema = {
  type: "object",
  properties: {
    checks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          index: { type: "integer" },
          supported: { type: "boolean" },
          reason: { type: "string" },
        },
        required: ["index", "supported", "reason"],
        additionalProperties: false,
      },
    },
  },
  required: ["checks"],
  additionalProperties: false,
} as const;

type ReviewRequest = {
  stageKey: StageKey;
  answer: string;
  templateData?: Record<string, string>;
  relatedAnswers?: Partial<Record<StageKey, string>>;
  locale?: "en" | "de";
};

function parseRequest(value: unknown): ReviewRequest | null {
  if (!value || typeof value !== "object") return null;
  const request = value as Partial<ReviewRequest>;
  const stageKey = String(request.stageKey);
  if (!isStageKey(stageKey) || typeof request.answer !== "string" || !request.answer.trim() || request.answer.length > MAX_ANSWER_LENGTH) return null;
  const templateData = request.templateData && typeof request.templateData === "object"
    ? Object.fromEntries(Object.entries(request.templateData).filter(([, item]) => typeof item === "string").map(([key, item]) => [key, item as string]))
    : undefined;
  return { stageKey, answer: request.answer, templateData, relatedAnswers: compactRelatedAnswers(request.relatedAnswers), locale: request.locale === "de" ? "de" : "en" };
}

function compactRelatedAnswers(value: unknown): Partial<Record<StageKey, string>> {
  if (!value || typeof value !== "object") return {};
  let remaining = MAX_RELATED_LENGTH;
  const compact: Partial<Record<StageKey, string>> = {};
  for (const [key, answer] of Object.entries(value)) {
    if (!isStageKey(key) || typeof answer !== "string" || remaining <= 0) continue;
    const text = answer.trim().slice(0, Math.min(1_500, remaining));
    if (text) { compact[key] = text; remaining -= text.length; }
  }
  return compact;
}

function responseText(response: unknown): string | null {
  if (!response || typeof response !== "object") return null;
  const output = (response as { output?: Array<{ type?: string; content?: Array<{ type?: string; text?: string }> }> }).output;
  return output?.find((item) => item.type === "message")?.content?.find((item) => item.type === "output_text")?.text ?? null;
}

type ModelReview = Omit<CompletenessReview, "criteria"> & {
  criteria: Array<{
    index: number;
    status: CompletenessReview["criteria"][number]["status"];
    evidenceQuote: string;
    source: "current_stage" | "no_direct_evidence";
    evidence: string;
    improvement: string;
  }>;
};

function normalizeReview(value: unknown, stageKey: StageKey, criteria: readonly string[], answer: string): CompletenessReview | null {
  if (!value || typeof value !== "object") return null;
  const review = value as Partial<ModelReview>;
  if ((review.overall !== "ready" && review.overall !== "needs_work") || typeof review.summary !== "string" || !Array.isArray(review.criteria) || typeof review.suggestedNextStep !== "string") return null;
  const statuses = ["met", "partial", "missing", "not_applicable"] as const;
  if (review.criteria.length !== criteria.length) return null;
  const normalized = review.criteria.map((assessment) => {
    if (!assessment || !Number.isInteger(assessment.index) || assessment.index < 0 || assessment.index >= criteria.length || !statuses.includes(assessment.status as typeof statuses[number]) || typeof assessment.evidence !== "string" || typeof assessment.improvement !== "string" || typeof assessment.evidenceQuote !== "string" || (assessment.source !== "current_stage" && assessment.source !== "no_direct_evidence")) return null;
    const quoteIsValid = assessment.source === "current_stage" && quoteExists(answer, assessment.evidenceQuote);
    const forced = deterministicStatus(stageKey, assessment.index, answer);
    const status = assessment.status === "met" && (!quoteIsValid || forced) ? forced?.status ?? "partial" : forced?.status === "partial" && assessment.status === "met" ? "partial" : assessment.status;
    const evidence = assessment.status === "met" && !quoteIsValid
      ? "No direct quote from the current stage supports a pass."
      : forced?.reason ?? assessment.evidence.trim();
    return { id: criterionId(stageKey, assessment.index), criterion: criteria[assessment.index], status, evidenceQuote: quoteIsValid ? assessment.evidenceQuote.trim() : "", source: quoteIsValid ? "current_stage" : "no_direct_evidence", evidence, improvement: assessment.improvement.trim() };
  });
  if (normalized.some((assessment) => assessment === null) || new Set(review.criteria.map((assessment) => assessment.index)).size !== criteria.length) return null;
  const normalizedCriteria = normalized as CompletenessReview["criteria"];
  return { overall: reviewOverall(normalizedCriteria), summary: review.summary.trim(), criteria: normalizedCriteria, missingInformation: Array.isArray(review.missingInformation) ? review.missingInformation.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean) : [], contradictions: Array.isArray(review.contradictions) ? review.contradictions.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean) : [], suggestedNextStep: review.suggestedNextStep.trim() };
}

type QuoteVerification = { index: number; supported: boolean; reason: string };

function applyQuoteVerification(
  review: CompletenessReview,
  checks: QuoteVerification[],
): CompletenessReview {
  const byIndex = new Map(checks.map((check) => [check.index, check]));
  const criteria = review.criteria.map((criterion, index) => {
    const check = byIndex.get(index);
    if (!check || check.supported || criterion.source !== "current_stage") {
      return criterion;
    }
    return {
      ...criterion,
      status: criterion.status === "met" ? "partial" as const : criterion.status,
      evidenceQuote: "",
      source: "no_direct_evidence" as const,
      evidence: `The supplied quote does not directly support this criterion. ${check.reason}`.trim(),
    };
  });
  return { ...review, criteria, overall: reviewOverall(criteria) };
}

async function verifyQuotes(
  apiKey: string,
  locale: "en" | "de",
  review: CompletenessReview,
): Promise<QuoteVerification[] | null> {
  const candidates = review.criteria.flatMap((criterion, index) =>
    criterion.source === "current_stage" && criterion.evidenceQuote
      ? [{ index, criterion: criterion.criterion, status: criterion.status, quote: criterion.evidenceQuote, explanation: criterion.evidence }]
      : [],
  );
  if (!candidates.length) return [];
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-5-mini",
      reasoning: { effort: "minimal" },
      instructions: `You are a strict evidence verifier. Write in ${locale === "de" ? "German" : "English"}. For every item, decide whether the quoted text directly supports the stated gate criterion. Do not infer missing facts from the quote. A quote about product scope, features, or a desired outcome does not establish a named user, a trigger, an explicit assumption, an uncertainty, or evidence classification unless it actually says so. Return every supplied index exactly once.`,
      input: JSON.stringify({ checks: candidates }),
      max_output_tokens: 600,
      text: { format: { type: "json_schema", name: "quote_verification", strict: true, schema: quoteVerificationSchema } },
    }),
  });
  if (!response.ok) return null;
  const output = responseText(await response.json());
  if (!output) return null;
  const parsed = JSON.parse(output) as { checks?: unknown };
  if (!Array.isArray(parsed.checks) || parsed.checks.length !== candidates.length) return null;
  const checks = parsed.checks.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const check = item as Partial<QuoteVerification>;
    const index = check.index;
    return typeof index === "number" && Number.isInteger(index) && typeof check.supported === "boolean" && typeof check.reason === "string"
      ? [{ index, supported: check.supported, reason: check.reason.trim() }]
      : [];
  });
  const candidateIndexes = new Set(candidates.map((candidate) => candidate.index));
  return checks.length === candidates.length &&
    new Set(checks.map((check) => check.index)).size === candidates.length &&
    checks.every((check) => candidateIndexes.has(check.index))
    ? checks
    : null;
}

function errorMessage(locale: "en" | "de", key: "invalid" | "unauthorized" | "rate" | "unavailable" | "unconfigured") {
  const copy = {
    en: { invalid: "Add a stage description before requesting a review.", unauthorized: "AI completeness review is only available in the private pilot.", rate: "Please wait a minute before requesting another review.", unavailable: "AI completeness review is temporarily unavailable.", unconfigured: "AI completeness review is not configured." },
    de: { invalid: "Fügen Sie eine Beschreibung der Stufe hinzu, bevor Sie eine Prüfung anfordern.", unauthorized: "Die KI-Vollständigkeitsprüfung ist nur im privaten Pilot verfügbar.", rate: "Bitte warten Sie eine Minute, bevor Sie eine weitere Prüfung anfordern.", unavailable: "Die KI-Vollständigkeitsprüfung ist vorübergehend nicht verfügbar.", unconfigured: "Die KI-Vollständigkeitsprüfung ist nicht eingerichtet." },
  } as const;
  return copy[locale][key];
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: errorMessage("en", "invalid") }, { status: 400 }); }
  const payload = parseRequest(body);
  const locale = payload?.locale ?? (body && typeof body === "object" && "locale" in body && body.locale === "de" ? "de" : "en");
  if (!payload) return NextResponse.json({ error: errorMessage(locale, "invalid") }, { status: 400 });
  if (!isAdminRequest(request)) return NextResponse.json({ error: errorMessage(locale, "unauthorized") }, { status: 403 });
  if (!consumeAdminAiRequest(request.cookies.get("mvp_admin_session")?.value)) return NextResponse.json({ error: errorMessage(locale, "rate") }, { status: 429 });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: errorMessage(locale, "unconfigured") }, { status: 503 });

  const gate = stageGates[payload.stageKey];
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-5-mini",
        reasoning: { effort: "minimal" },
        instructions: `You are MVPCompanion's careful stage-gate reviewer. Write in ${locale === "de" ? "German" : "English"}. Assess whether the current stage is sufficiently coherent to proceed, not whether it is validated or certain. Never invent evidence or infer details that are absent. The summary must not claim that an element exists unless a current-criterion result has direct supporting evidence. Evaluate only the supplied gate criteria and return exactly one result for each criterion index. A criterion may be met only if you provide an exact direct quote from CURRENT STAGE ANSWER and set source to current_stage. If no direct quote supports it, use partial or missing and source no_direct_evidence. Earlier-stage context is for contradictions only and must never prove a current criterion. Only list missing information necessary for a supplied criterion. Do not treat work from later stages as missing. Recommendations outside the gate must be marked optional and must not introduce topics prohibited by the stage boundary.`,
        input: JSON.stringify({ purpose: gate.purpose, expectedOutput: gate.expectedOutput, gateCriteria: gate.criteria.map((criterion, index) => ({ index, criterion })), stageBoundary: gate.boundary, currentStageAnswer: payload.answer.trim(), currentTemplateFields: payload.templateData, earlierStageContextForContradictionsOnly: payload.relatedAnswers }),
        max_output_tokens: 1_200,
        text: { format: { type: "json_schema", name: "completeness_review", strict: true, schema: reviewSchema } },
      }),
    });
    if (!response.ok) { console.error("OpenAI completeness review failed.", response.status); return NextResponse.json({ error: errorMessage(locale, "unavailable") }, { status: 502 }); }
    const output = responseText(await response.json());
    if (!output) return NextResponse.json({ error: errorMessage(locale, "unavailable") }, { status: 502 });
    const review = normalizeReview(JSON.parse(output), payload.stageKey, gate.criteria, payload.answer);
    if (!review) return NextResponse.json({ error: errorMessage(locale, "unavailable") }, { status: 502 });
    const verification = await verifyQuotes(apiKey, locale, review);
    if (!verification) return NextResponse.json({ error: errorMessage(locale, "unavailable") }, { status: 502 });
    return NextResponse.json({ review: applyQuoteVerification(review, verification) });
  } catch (error) {
    console.error("OpenAI completeness review failed.", error);
    return NextResponse.json({ error: errorMessage(locale, "unavailable") }, { status: 502 });
  }
}
