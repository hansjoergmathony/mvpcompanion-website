import type { StageKey } from "@/lib/project/types";
import { processStages, type ProcessStage } from "./process";

export const implementedStageNumbers = [1, 2, 3, 4, 5, 6] as const;

export type ImplementedStageNumber = (typeof implementedStageNumbers)[number];

export const totalStageCount = processStages.length;

export const startContent = {
  title: "Start with your idea.",
  supporting:
    "Give us the starting point. This is starting context, not Stage 01. Clarification begins after this.",
  intakeLabel: "Starting context",
  backToHome: "Back to homepage",
  submitLabel: "Start clarification",
  continueLabel: "Continue",
  previousLabel: "Previous",
  reviewLabel: "Review",
  hearingLabel: "Here's what I'm hearing",
  unclearLabel: "One thing is still unclear",
  refineLabel: "Refine your answer",
  confirmLabel: "Looks good — continue",
  stageAnswerError: "Add an answer before this stage can be reviewed.",
  intakeError: "Add your idea, the problem, and the user to begin.",
  continueHeadline: "Continue your idea.",
  continueSupporting: "Pick up where you left off.",
  continueCta: "Continue",
  startNewCta: "Start a new idea",
  replaceConfirm:
    "This will replace your current idea. The work already captured will be lost.",
  replaceConfirmAction: "Replace current idea",
  keepCurrentAction: "Keep current idea",
  pathLabel: "From idea to MVP",
  path: ["Idea", "Clarification", "Product", "MVP"] as const,
  summaryHeadline: "Your idea is becoming clearer.",
  summarySupporting:
    "You have worked through the first six stages of the 15-stage process. Stages 07–15 are not yet part of this prototype.",
  conceptHeadline: "Your Product Concept",
  conceptUnderstood:
    "You now have a clearer product concept.",
  conceptDistinction:
    "The sections below record what is currently understood. Assumptions and open questions are listed separately. They have not been validated.",
  conceptNext:
    "Clarification is complete for now. The next step is to define what the MVP should actually contain.",
  defineMvpCta: "Define my MVP",
  editConceptCta: "Edit my concept",
  viewConceptHeadline: "Your product concept is ready.",
  viewConceptSupporting: "Open the concept you clarified, or start a new idea.",
  viewConceptCta: "View your concept",
  mvpHeadline: "Define the MVP",
  mvpSupporting:
    "The next step is to decide what the MVP should actually contain. Stages 07–15 are not yet part of this prototype.",
  mvpBackToConcept: "Back to product concept",
  conceptSections: [
    { id: "idea", title: "1. Idea" },
    { id: "problem", title: "2. Problem" },
    { id: "primaryUser", title: "3. Primary User" },
    { id: "desiredOutcome", title: "4. Desired Outcome" },
    { id: "valueProposition", title: "5. Value Proposition" },
    { id: "product", title: "6. Product Concept" },
    { id: "lifecycle", title: "7. Context / Lifecycle" },
    { id: "assumptions", title: "8. Key Assumptions" },
    { id: "openQuestions", title: "9. Open Questions" },
  ] as const,
  answersLabel: "Answers so far",
  emptyAnswer: "Not added yet",
  remainingLabel: "Not yet in this prototype",
  soFarLabel: "So far",
  assumptionsLabel: "Assumptions",
  intakeFields: [
    {
      key: "idea",
      informsStage: 1,
      label: "Idea",
      prompt: "Describe your product idea in one sentence.",
    },
    {
      key: "problem",
      informsStage: 2,
      label: "Problem",
      prompt: "What problem does it solve?",
    },
    {
      key: "user",
      informsStage: 3,
      label: "User",
      prompt: "Who is it for?",
    },
  ],
} as const;

export type IntakeKey = (typeof startContent.intakeFields)[number]["key"];

export type IntakeValues = Record<IntakeKey, string>;

export const emptyIntakeValues: IntakeValues = {
  idea: "",
  problem: "",
  user: "",
};

export function getImplementedStages(): ProcessStage[] {
  return implementedStageNumbers.map((stageNumber) => {
    const stage = processStages.find((item) => item.number === stageNumber);

    if (!stage) {
      throw new Error(`Missing implemented stage ${stageNumber}`);
    }

    return stage;
  });
}

export function getStartingContext(
  stageNumber: number,
  values: IntakeValues,
): string | null {
  const field = startContent.intakeFields.find(
    (item) => item.informsStage === stageNumber,
  );

  if (!field) {
    return null;
  }

  const value = values[field.key].trim();
  return value || null;
}

export function isImplementedStage(stageNumber: number): boolean {
  return implementedStageNumbers.includes(
    stageNumber as ImplementedStageNumber,
  );
}

export const stageFocusByNumber: Record<
  ImplementedStageNumber,
  { uncertainty: string; prior: readonly StageKey[] }
> = {
  1: {
    uncertainty:
      "This stage frames what the idea could become, before features or implementation.",
    prior: [],
  },
  2: {
    uncertainty:
      "This stage defines the problem independently of the product you want to build.",
    prior: ["idea"],
  },
  3: {
    uncertainty:
      "This stage identifies the primary user who experiences the problem.",
    prior: ["problem"],
  },
  4: {
    uncertainty:
      "This stage names the outcome that would make solving the problem valuable.",
    prior: ["problem", "user"],
  },
  5: {
    uncertainty:
      "This stage names what the product is, what it revolves around, and what the user does with it.",
    prior: ["problem", "user", "value"],
  },
  6: {
    uncertainty:
      "This stage names what happens to the main thing in the product after first use, and later.",
    prior: ["product"],
  },
};

export const priorStageLabel: Record<StageKey, string> = {
  idea: "Idea",
  problem: "Problem",
  user: "User",
  value: "Value",
  product: "Product",
  context: "Context",
};

export function getStageFocus(stageNumber: number): string | null {
  if (!isImplementedStage(stageNumber)) {
    return null;
  }

  return stageFocusByNumber[stageNumber as ImplementedStageNumber].uncertainty;
}

export function getPriorStageKeys(stageNumber: number): StageKey[] {
  if (!isImplementedStage(stageNumber)) {
    return [];
  }

  return [...stageFocusByNumber[stageNumber as ImplementedStageNumber].prior];
}
