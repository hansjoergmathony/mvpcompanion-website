import type { CompletenessCriterionStatus, CompletenessReview } from "@/lib/completeness/types";
import type { StageKey } from "@/lib/project/types";

export type TemplateAnswer = {
  index: number;
  question: string;
  answer: string;
};

export function criterionId(stageKey: StageKey, index: number) {
  return `${stageKey}-${index + 1}`;
}

export function quoteExists(answer: string, quote: string) {
  return Boolean(quote.trim()) && answer.toLocaleLowerCase().includes(quote.trim().toLocaleLowerCase());
}

/**
 * Template responses are current-stage evidence in their own right. Keeping
 * their prompt beside each answer prevents a reviewer from having to infer
 * what an otherwise anonymous value is intended to answer.
 */
export function currentStageEvidence(answer: string, templateAnswers: readonly TemplateAnswer[]) {
  const structuredAnswers = templateAnswers
    .filter(({ question, answer: value }) => question.trim() && value.trim())
    .map(({ question, answer: value }) => `Template question: ${question.trim()}\nTemplate answer: ${value.trim()}`)
    .join("\n\n");
  return [answer.trim(), structuredAnswers].filter(Boolean).join("\n\n");
}

function sentenceContaining(answer: string, pattern: RegExp) {
  return answer
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .find((sentence) => pattern.test(sentence)) ?? "";
}

export function explicitCriterionEvidence(
  stageKey: StageKey,
  index: number,
  answer: string,
  templateAnswers: readonly TemplateAnswer[],
) {
  if (stageKey !== "idea") return null;

  const responseFor = (templateIndex: number) =>
    templateAnswers.find(({ index: fieldIndex }) => fieldIndex === templateIndex)?.answer.trim() ?? "";
  const templateEvidence = (templateIndex: number, description: string) => {
    const response = responseFor(templateIndex);
    return response.length >= 12
      ? { quote: response, evidence: `This directly answers the guided template question for ${description}.` }
      : null;
  };

  if (index === 2) return templateEvidence(1, "the provisional intended user");
  if (index === 3) {
    const fromTemplate = templateEvidence(2, "the expected outcome");
    if (fromTemplate) return fromTemplate;
    const quote = sentenceContaining(answer, /\b(focused|testable|buildable|valuable|viable|outcome|result|specification)\b/i);
    return quote ? { quote, evidence: "This directly states the intended result of the idea." } : null;
  }
  if (index === 4) {
    const response = responseFor(4);
    return /\b(assumption|hypothes)/i.test(response)
      ? { quote: response, evidence: "This directly identifies a labelled assumption or hypothesis." }
      : null;
  }
  if (index === 6) {
    const response = responseFor(3);
    return /\b(evidence|hypothes|assumption|derived|open question|uncertain)/i.test(response)
      ? { quote: response, evidence: "This explicitly distinguishes evidence, hypotheses, derived insights, or open questions." }
      : null;
  }
  return null;
}

/**
 * These checks only prevent an impossible "met" result. They never turn a
 * genuine, explicitly written answer into a failure.
 */
export function deterministicStatus(
  stageKey: StageKey,
  index: number,
  answer: string,
): { status: CompletenessCriterionStatus; reason: string } | null {
  const text = answer.toLocaleLowerCase();
  const has = (pattern: RegExp) => pattern.test(text);
  const missing = (reason: string) => ({ status: "partial" as const, reason });

  if (stageKey === "idea") {
    if (index === 4 && !has(/assumption|hypothes/)) return missing("No explicit assumption or hypothesis is labelled in the current stage.");
    if (index === 5 && !has(/open question|uncertain|unknown|unresolved/)) return missing("No explicit uncertainty or open question is labelled in the current stage.");
    if (index === 6 && !has(/evidence|assumption|hypothes|derived|open question|uncertain/)) return missing("The current stage does not label evidence, hypotheses, derived conclusions, or open questions.");
  }
  if (stageKey === "problem") {
    if (index === 3 && !has(/alternative|workaround|currently|today|instead/)) return missing("No explicit alternative or current workaround is visible in the current stage.");
    if (index === 5 && !has(/evidence|assumption|hypothes/)) return missing("The current stage does not explicitly distinguish evidence from assumptions.");
  }
  if (stageKey === "user") {
    if (index === 3 && !has(/secondary|non-target|not target|outside/)) return missing("No explicit secondary or non-target user boundary is visible in the current stage.");
    if (index === 4 && !has(/because|rationale|selected|reason/)) return missing("No explicit rationale for selecting the primary user is visible in the current stage.");
  }
  if (stageKey === "value") {
    if (index === 3 && !has(/alternative|status quo|instead|compet/)) return missing("No relevant alternative is visible in the current stage.");
    if (index === 6 && !has(/hypothes|assumption|unvalidated|uncertain/)) return missing("Unsupported value claims are not explicitly labelled as hypotheses.");
  }
  if (stageKey === "product" && index === 3 && !has(/action|process|persistent|object/)) return missing("The current stage does not distinguish persistent objects from actions.");
  if (stageKey === "context" && index === 3 && !has(/transition|moves? |from .* to /)) return missing("No explicit lifecycle transition is visible in the current stage.");
  if (stageKey === "jobs") {
    if (index === 2 && !has(/priority|prioriti[sz]|essential|secondary/)) return missing("No explicit job prioritization is visible in the current stage.");
    if (index === 4 && has(/screen|page|dashboard|button/) && !has(/accomplish|outcome|progress|job/)) return missing("Jobs appear to be expressed as screens or features rather than user accomplishments.");
  }
  if (stageKey === "scope" && index === 3 && !has(/out of scope|not in mvp|exclude|exclusion/)) return missing("No explicit exclusion is visible in the current stage.");
  if (stageKey === "scope" && index === 2 && !has(/must|should|later|not in mvp/)) return missing("Must, Should, Later, and Not in MVP are not explicitly distinguished.");
  if (stageKey === "experience") {
    if (index === 0 && !has(/first value|value moment/)) return missing("The first-value moment is not explicit.");
    if (index === 3 && !has(/empty|error|permission|fail/)) return missing("No essential empty, error, or permission state is visible.");
  }
  if (stageKey === "informationArchitecture" && index === 1 && !has(/navigation|menu|section|area/)) return missing("No explicit navigation structure is visible.");
  if (stageKey === "data") {
    if (index === 2 && !has(/one-to|many-to|cardinality|relationship/)) return missing("No explicit relationship or cardinality is visible.");
    if (index === 3 && !has(/owner|owned by|workspace|account/)) return missing("No explicit data ownership or workspace boundary is visible.");
  }
  if (stageKey === "requirements" && index === 4 && !has(/acceptance criteria|given |when |then /)) return missing("No explicit acceptance criterion is visible in the current stage.");
  if (stageKey === "learning" && index === 4 && !has(/would change|if .* then|decision/)) return missing("No evidence threshold that would change a decision is visible in the current stage.");
  if (stageKey === "learning" && index === 0 && !has(/value event|activation/)) return missing("No explicit core value event or activation signal is visible.");
  if (stageKey === "technicalBoundaries") {
    if (index === 4 && !has(/risk|constraint|cost|dependenc/)) return missing("No explicit technical risk or operating constraint is visible.");
    if (index === 5 && !has(/decision|open question|unknown|unresolved/)) return missing("Technical decisions are not distinguished from open questions.");
  }
  if (stageKey === "mvpBoundary") {
    if (index === 9 && !has(/exclude|out of scope|not in mvp/)) return missing("No explicit MVP exclusion is visible.");
    if (index === 10 && !has(/dependenc|open question|unknown|unresolved/)) return missing("Dependencies or open questions are not explicit.");
  }
  return null;
}

export function reviewOverall(criteria: CompletenessReview["criteria"]): CompletenessReview["overall"] {
  return criteria.some((criterion) => criterion.status === "missing" || criterion.status === "partial")
    ? "needs_work"
    : "ready";
}

function hasActionableImprovement(improvement: string) {
  const value = improvement.trim().toLocaleLowerCase().replace(/[.!]/g, "");
  return !["", "none", "none required", "no action required", "no action needed", "not required", "n/a", "na"].includes(value);
}

function fallbackImprovement(criterion: string) {
  return `Add a direct current-stage statement that addresses: ${criterion}`;
}

function requiredImprovement(improvement: string, criterion: string) {
  const withoutOptionalPrefix = improvement
    .trim()
    .replace(/^optional(?:ly)?\s*:\s*/i, "");
  return hasActionableImprovement(withoutOptionalPrefix)
    ? withoutOptionalPrefix
    : fallbackImprovement(criterion);
}

/** Build the visible result from validated criterion statuses, never free-form AI prose. */
export function composeReview(review: CompletenessReview, stageKey: StageKey): CompletenessReview {
  const criteria = review.criteria.map((criterion) => {
    if (criterion.status === "missing" || criterion.status === "partial") {
      return {
        ...criterion,
        improvement: requiredImprovement(criterion.improvement, criterion.criterion),
      };
    }
    return hasActionableImprovement(criterion.improvement)
      ? criterion
      : { ...criterion, improvement: "" };
  });
  const unresolved = criteria.filter((criterion) =>
    criterion.status === "missing" || criterion.status === "partial",
  );
  const missingInformation = unresolved.map((criterion) =>
    `${criterion.criterion} ${criterion.improvement || "Add an explicit statement for this criterion."}`,
  );
  const stageNext = stageKey === "mvpBoundary"
    ? "Review the final MVP boundary and prepare the integrated MVP specification."
    : `Complete the remaining current-stage criteria, then continue to the next stage.`;
  return {
    ...review,
    criteria,
    overall: reviewOverall(criteria),
    summary: unresolved.length
      ? `This stage needs clarification in ${unresolved.length} gate ${unresolved.length === 1 ? "criterion" : "criteria"}.`
      : "This stage has direct current-stage evidence for every gate criterion.",
    missingInformation,
    suggestedNextStep: unresolved[0]?.improvement || stageNext,
  };
}
