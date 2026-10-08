import type { StageFeedback } from "@/lib/clarification/types";

export const IDEA_LIBRARY_STORAGE_KEY = "mvpcompanion.idea-library";
export const LEGACY_PROJECT_STORAGE_KEY = "mvpcompanion.project";

export const clarifyStageKeys = [
  "idea",
  "problem",
  "user",
  "value",
  "product",
  "context",
] as const;

export const workspaceStageKeys = [
  "jobs",
  "scope",
  "experience",
  "informationArchitecture",
  "data",
  "requirements",
  "learning",
  "technicalBoundaries",
  "mvpBoundary",
] as const;

export const stageKeys = [...clarifyStageKeys, ...workspaceStageKeys] as const;

export type ClarifyStageKey = (typeof clarifyStageKeys)[number];
export type StageKey = (typeof stageKeys)[number];
export type DraftArea = "clarify" | "workspace";

export type IdeaStatus = "new" | "in_progress" | "completed";

export type CurrentStage = "intake" | StageKey | "summary" | "mvp";

export type StartingContext = {
  idea: string;
  problem: string;
  user: string;
};

export type StageState = {
  answer: string;
  feedback?: StageFeedback | null;
  submittedAnswer?: string;
};

export type IdeaStages = Record<StageKey, StageState>;

export type Idea = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  startingContext: StartingContext;
  stages: IdeaStages;
  currentStage: CurrentStage;
  status: IdeaStatus;
  area: DraftArea;
};

export type IdeaLibrary = {
  version: 1 | 2;
  activeIdeaId: string | null;
  ideas: Idea[];
};

export const emptyStartingContext: StartingContext = {
  idea: "",
  problem: "",
  user: "",
};

export const stageNumberByKey: Record<StageKey, number> = {
  idea: 1,
  problem: 2,
  user: 3,
  value: 4,
  product: 5,
  context: 6,
  jobs: 7,
  scope: 8,
  experience: 9,
  informationArchitecture: 10,
  data: 11,
  requirements: 12,
  learning: 13,
  technicalBoundaries: 14,
  mvpBoundary: 15,
};

export const stageKeyByNumber: Record<number, StageKey> = {
  1: "idea",
  2: "problem",
  3: "user",
  4: "value",
  5: "product",
  6: "context",
  7: "jobs",
  8: "scope",
  9: "experience",
  10: "informationArchitecture",
  11: "data",
  12: "requirements",
  13: "learning",
  14: "technicalBoundaries",
  15: "mvpBoundary",
};

export function createEmptyStages(): IdeaStages {
  return {
    idea: { answer: "" },
    problem: { answer: "" },
    user: { answer: "" },
    value: { answer: "" },
    product: { answer: "" },
    context: { answer: "" },
    jobs: { answer: "" },
    scope: { answer: "" },
    experience: { answer: "" },
    informationArchitecture: { answer: "" },
    data: { answer: "" },
    requirements: { answer: "" },
    learning: { answer: "" },
    technicalBoundaries: { answer: "" },
    mvpBoundary: { answer: "" },
  };
}

export function createIdeaId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `idea-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createIdea(): Idea {
  const now = new Date().toISOString();

  return {
    id: createIdeaId(),
    title: "Untitled Idea",
    createdAt: now,
    updatedAt: now,
    startingContext: { ...emptyStartingContext },
    stages: createEmptyStages(),
    currentStage: "intake",
    status: "new",
    area: "clarify",
  };
}

export function isStageKey(value: string): value is StageKey {
  return stageKeys.includes(value as StageKey);
}

export function isClarifyStageKey(value: string): value is ClarifyStageKey {
  return clarifyStageKeys.includes(value as ClarifyStageKey);
}

export function isDraftArea(value: string): value is DraftArea {
  return value === "clarify" || value === "workspace";
}

export function isCurrentStage(value: string): value is CurrentStage {
  return (
    value === "intake" ||
    value === "summary" ||
    value === "mvp" ||
    isStageKey(value)
  );
}

export function hasCompletedConcept(idea: Idea | null): boolean {
  return idea?.status === "completed";
}

export function hasStartingContext(context: StartingContext): boolean {
  return Boolean(
    context.idea.trim() || context.problem.trim() || context.user.trim(),
  );
}

export function shouldResumeIdea(idea: Idea | null): boolean {
  if (!idea) {
    return false;
  }

  if (idea.status === "completed" || idea.status === "in_progress") {
    return true;
  }

  return hasStartingContext(idea.startingContext);
}

export function seedEmptyStageAnswers(
  stages: IdeaStages,
  context: StartingContext,
): IdeaStages {
  return {
    ...stages,
    idea: {
      ...stages.idea,
      answer: stages.idea.answer.trim() || context.idea.trim(),
    },
    problem: {
      ...stages.problem,
      answer: stages.problem.answer.trim() || context.problem.trim(),
    },
    user: {
      ...stages.user,
      answer: stages.user.answer.trim() || context.user.trim(),
    },
  };
}
