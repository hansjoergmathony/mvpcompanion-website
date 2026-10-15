export type CompletenessCriterionStatus =
  | "met"
  | "partial"
  | "missing"
  | "not_applicable";

export type CompletenessReview = {
  overall: "ready" | "needs_work";
  summary: string;
  criteria: Array<{
    criterion: string;
    status: CompletenessCriterionStatus;
    evidence: string;
    improvement: string;
  }>;
  missingInformation: string[];
  contradictions: string[];
  suggestedNextStep: string;
};
