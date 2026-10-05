import type { StageKey } from "@/lib/project/types";
import { processStages, type ProcessStage } from "./process";

export const implementedStageNumbers = [1, 2, 3, 4, 5, 6] as const;

export type ImplementedStageNumber = (typeof implementedStageNumbers)[number];

export const totalStageCount = processStages.length;

export const startContent = {
  title: "Clarify your starting point.",
  supporting:
    "Answer a few essential questions about your idea, problem, users, value, product and context. This website clarification covers the same conceptual areas as the beginning of the shared method — it creates an Idea Snapshot, not the full MVPCompanion process.",
  intakeLabel: "Starting context",
  startingContextDescription:
    "The original context you provided when you started.",
  ideaNameLabel: "Idea name",
  ideaNamePlaceholder: "e.g. Guitar Songbook",
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
  continueHeadline: "Continue your Idea Snapshot.",
  continueSupporting: "Pick up where you left off in the website clarification.",
  continueCta: "Continue",
  startNewCta: "Start a new idea",
  pathLabel: "Website clarification path",
  path: ["Idea", "Clarification", "Idea Snapshot"] as const,
  summaryHeadline: "Your Idea Snapshot",
  summarySupporting:
    "A structured starting point for developing your product further.",
  snapshotClarification:
    "This is your starting point — not your finished MVP specification.",
  snapshotAppBridge:
    "When MVPCompanion is available, you can bring your Idea Snapshot into the app to take the next step: challenge assumptions, uncover gaps and progressively develop your MVP.",
  appContinueHeadline: "Ready to take it further?",
  appContinueSupporting:
    "When the MVPCompanion app is available, you can bring your Idea Snapshot into it. The app will review what you've defined, challenge important assumptions, identify gaps and progressively develop your MVP specification.",
  appDirectPrompt: "Already have an idea and want to start directly?",
  conceptHeadline: "Your Idea Snapshot",
  conceptIntro:
    "You've turned your initial idea into a structured starting point.",
  conceptTagline:
    "Your first structured view of the idea — a starting point for developing your product further.",
  conceptDistinction:
    "This is your starting point — not your finished MVP specification.",
  conceptAppBridge:
    "The MVPCompanion app will take this starting point further by challenging assumptions, uncovering gaps and progressively developing your MVP specification.",
  startingPointTitle: "Your starting point",
  startingPointBody:
    "You now have a structured view of your idea, problem, user, value, product and context.",
  startingPointExpectation:
    "There is more to resolve before this becomes a focused, testable and buildable MVP.",
  whatClarifiedTitle: "What you've clarified",
  whatClarifiedIntro:
    "Your answers reflect your current understanding — initial hypotheses, not validated conclusions.",
  whatClarifiedItems: [
    "A clearer description of the idea",
    "A clearer problem hypothesis",
    "An initial target user",
    "An initial value proposition",
    "An initial product definition",
    "An initial understanding of context / lifecycle",
  ] as const,
  whatComesNextTitle: "What comes next",
  whatComesNextIntro:
    "The Idea Snapshot is intentionally only the starting point. The full MVPCompanion process goes further into areas such as:",
  whatComesNextStages: [
    "Jobs",
    "Scope",
    "Experience",
    "Information Architecture",
    "Data",
    "Requirements",
    "Learning",
    "Technical Boundaries",
    "MVP Boundary",
  ] as const,
  whatComesNextAppIntro:
    "The MVPCompanion app will take this further by helping you:",
  whatComesNextAppItems: [
    "Challenge important assumptions",
    "Uncover gaps and open questions",
    "Define core user jobs",
    "Shape the smallest useful MVP",
    "Define the core experience",
    "Specify requirements",
    "Define what the MVP needs to learn",
  ] as const,
  optionalEntryNote:
    "When the app is available, you will be able to start directly with your own idea — the Idea Snapshot is optional context, not a prerequisite.",
  editConceptCta: "Edit Idea Snapshot",
  viewConceptHeadline: "Your Idea Snapshot is ready.",
  viewConceptSupporting:
    "Open what you clarified on the website, or start a new starting point.",
  viewConceptCta: "View your Idea Snapshot",
  mvpHeadline: "Continue in MVPCompanion — coming soon",
  mvpSupporting:
    "The full 15-stage framework, AI-supported analysis, and evolving MVP Specification will be available in the app — not in this website clarification flow.",
  mvpBackToConcept: "Back to Idea Snapshot",
  ideaSnapshotStages: [
    { number: "01", id: "idea", label: "Idea" },
    { number: "02", id: "problem", label: "Problem" },
    { number: "03", id: "user", label: "User" },
    { number: "04", id: "value", label: "Value" },
    { number: "05", id: "product", label: "Product" },
    { number: "06", id: "context", label: "Context" },
  ] as const,
  assumptionsTitle: "Recorded assumptions",
  openQuestionsTitle: "Open questions",
  answersLabel: "Answers so far",
  emptyAnswer: "Not added yet",
  remainingLabel: "Continues in the app",
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
      "Your current idea hypothesis. This stage frames what the idea could become, before features or implementation.",
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
