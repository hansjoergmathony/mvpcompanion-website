import { NextResponse, type NextRequest } from "next/server";
import { isAdminRequest } from "@/lib/admin/auth";
import { consumeAdminAiRequest } from "@/lib/admin/rateLimit";
import { stageGates } from "@/lib/completeness/stageGates";
import type { CompletenessReview } from "@/lib/completeness/types";
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
          evidence: { type: "string" },
          improvement: { type: "string" },
        },
        required: ["index", "status", "evidence", "improvement"],
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

type ReviewRequest = {
  stageKey: StageKey;
  answer: string;
  relatedAnswers?: Partial<Record<StageKey, string>>;
  locale?: "en" | "de";
};

function parseRequest(value: unknown): ReviewRequest | null {
  if (!value || typeof value !== "object") return null;
  const request = value as Partial<ReviewRequest>;
  const stageKey = String(request.stageKey);
  if (!isStageKey(stageKey) || typeof request.answer !== "string" || !request.answer.trim() || request.answer.length > MAX_ANSWER_LENGTH) return null;
  return { stageKey, answer: request.answer, relatedAnswers: compactRelatedAnswers(request.relatedAnswers), locale: request.locale === "de" ? "de" : "en" };
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
    evidence: string;
    improvement: string;
  }>;
};

function normalizeReview(value: unknown, criteria: readonly string[]): CompletenessReview | null {
  if (!value || typeof value !== "object") return null;
  const review = value as Partial<ModelReview>;
  if ((review.overall !== "ready" && review.overall !== "needs_work") || typeof review.summary !== "string" || !Array.isArray(review.criteria) || typeof review.suggestedNextStep !== "string") return null;
  const statuses = ["met", "partial", "missing", "not_applicable"] as const;
  if (review.criteria.length !== criteria.length) return null;
  const normalized = review.criteria.map((assessment) => {
    if (!assessment || !Number.isInteger(assessment.index) || assessment.index < 0 || assessment.index >= criteria.length || !statuses.includes(assessment.status as typeof statuses[number]) || typeof assessment.evidence !== "string" || typeof assessment.improvement !== "string") return null;
    return { criterion: criteria[assessment.index], status: assessment.status, evidence: assessment.evidence.trim(), improvement: assessment.improvement.trim() };
  });
  if (normalized.some((assessment) => assessment === null) || new Set(review.criteria.map((assessment) => assessment.index)).size !== criteria.length) return null;
  return { overall: review.overall, summary: review.summary.trim(), criteria: normalized as CompletenessReview["criteria"], missingInformation: Array.isArray(review.missingInformation) ? review.missingInformation.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean) : [], contradictions: Array.isArray(review.contradictions) ? review.contradictions.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean) : [], suggestedNextStep: review.suggestedNextStep.trim() };
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
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: errorMessage(locale, "unconfigured") }, { status: 503 });

  const gate = stageGates[payload.stageKey];
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-5-mini",
        reasoning: { effort: "minimal" },
        instructions: `You are MVPCompanion's careful stage-gate reviewer. Write in ${locale === "de" ? "German" : "English"}. Assess whether the draft is sufficiently coherent to proceed, not whether it is validated or certain. Never invent evidence. Treat unsupported claims as hypotheses. Evaluate only the supplied gate criteria and return exactly one result for each criterion index. Only list missing information necessary for a supplied criterion. Do not treat work from later stages as missing. Recommendations outside the gate must be explicitly marked optional. Set overall to ready when no criterion is missing; partial criteria can still be ready if the stage is coherent.`,
        input: JSON.stringify({ purpose: gate.purpose, expectedOutput: gate.expectedOutput, gateCriteria: gate.criteria.map((criterion, index) => ({ index, criterion })), stageBoundary: gate.boundary, stageAnswer: payload.answer.trim(), earlierStageAnswers: payload.relatedAnswers }),
        max_output_tokens: 1_200,
        text: { format: { type: "json_schema", name: "completeness_review", strict: true, schema: reviewSchema } },
      }),
    });
    if (!response.ok) { console.error("OpenAI completeness review failed.", response.status); return NextResponse.json({ error: errorMessage(locale, "unavailable") }, { status: 502 }); }
    const output = responseText(await response.json());
    if (!output) return NextResponse.json({ error: errorMessage(locale, "unavailable") }, { status: 502 });
    const review = normalizeReview(JSON.parse(output), gate.criteria);
    if (!review) return NextResponse.json({ error: errorMessage(locale, "unavailable") }, { status: 502 });
    return NextResponse.json({ review });
  } catch (error) {
    console.error("OpenAI completeness review failed.", error);
    return NextResponse.json({ error: errorMessage(locale, "unavailable") }, { status: 502 });
  }
}
