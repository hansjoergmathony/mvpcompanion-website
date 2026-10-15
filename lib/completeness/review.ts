import type { CompletenessCriterionStatus, CompletenessReview } from "@/lib/completeness/types";
import type { StageKey } from "@/lib/project/types";

export function criterionId(stageKey: StageKey, index: number) {
  return `${stageKey}-${index + 1}`;
}

export function quoteExists(answer: string, quote: string) {
  return Boolean(quote.trim()) && answer.toLocaleLowerCase().includes(quote.trim().toLocaleLowerCase());
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

/** Build the visible result from validated criterion statuses, never free-form AI prose. */
export function composeReview(review: CompletenessReview, stageKey: StageKey): CompletenessReview {
  const unresolved = review.criteria.filter((criterion) =>
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
    overall: reviewOverall(review.criteria),
    summary: unresolved.length
      ? `This stage needs clarification in ${unresolved.length} gate ${unresolved.length === 1 ? "criterion" : "criteria"}.`
      : "This stage has direct current-stage evidence for every gate criterion.",
    missingInformation,
    suggestedNextStep: unresolved[0]?.improvement || stageNext,
  };
}
