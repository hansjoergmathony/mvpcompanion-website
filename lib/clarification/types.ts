import type { StageKey } from "@/lib/project/types";

export type FeedbackStatus = "needs_clarification" | "ready_to_continue";

export type FeedbackFrame = {
  label: string;
  text: string;
};

export type StageFeedback = {
  summary: string;
  observations: string[];
  uncertainties: string[];
  suggestions: string[];
  assumptions?: string[];
  frames?: FeedbackFrame[];
  status: FeedbackStatus;
};

export type ClarificationRequest = {
  stageKey: StageKey;
  stageName: string;
  question: string;
  purpose: string;
  answer: string;
  startingContext: {
    idea: string;
    problem: string;
    user: string;
  };
  relatedAnswers: Partial<Record<StageKey, string>>;
  locale?: "en" | "de";
};

export type ClarificationEngine = {
  interpret(request: ClarificationRequest): StageFeedback;
};

export type ProductConcept = {
  idea: string;
  problem: string;
  primaryUser: string;
  desiredOutcome: string;
  valueProposition: string;
  product: string;
  lifecycle: string;
  assumptions: string[];
  openQuestions: string[];
};
