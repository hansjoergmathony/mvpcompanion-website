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
  if (stageKey === "scope" && index === 3 && !has(/out of scope|not in mvp|exclude|exclusion/)) return missing("No explicit exclusion is visible in the current stage.");
  if (stageKey === "requirements" && index === 4 && !has(/acceptance criteria|given |when |then /)) return missing("No explicit acceptance criterion is visible in the current stage.");
  if (stageKey === "learning" && index === 4 && !has(/would change|if .* then|decision/)) return missing("No evidence threshold that would change a decision is visible in the current stage.");
  return null;
}

export function reviewOverall(criteria: CompletenessReview["criteria"]): CompletenessReview["overall"] {
  return criteria.some((criterion) => criterion.status === "missing" || criterion.status === "partial")
    ? "needs_work"
    : "ready";
}
