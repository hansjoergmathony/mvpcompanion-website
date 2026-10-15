export type CompletenessCriterionStatus =
  | "met"
  | "partial"
  | "missing"
  | "not_applicable";

export type CompletenessReview = {
  overall: "ready" | "needs_work";
  summary: string;
  criteria: Array<{
    id: string;
    criterion: string;
    status: CompletenessCriterionStatus;
    evidenceQuote: string;
    source: "current_stage" | "no_direct_evidence";
    evidence: string;
    improvement: string;
  }>;
  missingInformation: string[];
  contradictions: string[];
  suggestedNextStep: string;
};
