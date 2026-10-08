import { buildProductConcept } from "@/lib/clarification";
import type { Locale } from "@/lib/i18n/config";
import type { StageFeedback } from "@/lib/clarification/types";
import {
  createEmptyStages,
  isCurrentStage,
  isDraftArea,
  stageKeys,
  type Idea,
  type IdeaStatus,
  type StageKey,
  type StageState,
  type StartingContext,
} from "@/lib/project/types";

export const IDEA_SNAPSHOT_FORMAT = "mvpcompanion.idea-snapshot";
export const IDEA_SNAPSHOT_FORMAT_VERSION = 2;
const supportedFormatVersions = [1, 2] as const;

export type IdeaSnapshotExport = {
  format: typeof IDEA_SNAPSHOT_FORMAT;
  formatVersion: typeof IDEA_SNAPSHOT_FORMAT_VERSION;
  idea: Idea;
};

export type IdeaSnapshotImportFailureReason =
  | "invalid_json"
  | "not_snapshot"
  | "unsupported_version"
  | "malformed_idea";

export type IdeaSnapshotImportResult =
  | { ok: true; snapshot: IdeaSnapshotExport; sourceVersion: 1 | 2 }
  | { ok: false; reason: IdeaSnapshotImportFailureReason };

export type SnapshotStage = {
  key: StageKey;
  label: string;
  status: "clarified" | "in_progress" | "unresolved";
  content: string;
};

const stageLabels: Record<StageKey, string> = {
  idea: "Idea",
  problem: "Problem",
  user: "User",
  value: "Value",
  product: "Product",
  context: "Lifecycle",
  jobs: "Jobs",
  scope: "Scope",
  experience: "Experience",
  informationArchitecture: "Information Architecture",
  data: "Data Model",
  requirements: "Requirements",
  learning: "Learning",
  technicalBoundaries: "Technical Boundaries",
  mvpBoundary: "MVP Boundary",
};

const storedUntitled = "Untitled Idea";

export function getIdeaTitle(idea: Idea, placeholder = storedUntitled): string {
  const title = idea.title.trim();

  if (!title || title === storedUntitled) {
    return placeholder;
  }

  return title;
}

export function getStageSnapshotStatus(
  stage: StageState,
): SnapshotStage["status"] {
  if (stage.feedback?.status === "ready_to_continue") {
    return "clarified";
  }

  return stage.answer.trim() ? "in_progress" : "unresolved";
}

export function getSnapshotStages(
  idea: Idea,
  locale: Locale = "en",
  labels: Record<StageKey, string> = stageLabels,
): SnapshotStage[] {
  const concept = buildProductConcept(idea, locale);
  const open = locale === "de" ? "Das ist noch nicht geklärt." : "This has not been clarified yet.";
  const contentByKey: Record<StageKey, string> = {
    idea: concept.idea,
    problem: concept.problem,
    user: concept.primaryUser,
    value: concept.valueProposition,
    product: concept.product,
    context: concept.lifecycle,
    jobs: idea.stages.jobs.answer.trim() || open,
    scope: idea.stages.scope.answer.trim() || open,
    experience: idea.stages.experience.answer.trim() || open,
    informationArchitecture: idea.stages.informationArchitecture.answer.trim() || open,
    data: idea.stages.data.answer.trim() || open,
    requirements: idea.stages.requirements.answer.trim() || open,
    learning: idea.stages.learning.answer.trim() || open,
    technicalBoundaries: idea.stages.technicalBoundaries.answer.trim() || open,
    mvpBoundary: idea.stages.mvpBoundary.answer.trim() || open,
  };

  return stageKeys.map((key) => ({
    key,
    label: labels[key],
    status: getStageSnapshotStatus(idea.stages[key]),
    content: contentByKey[key],
  }));
}

export function countFilledFields(idea: Idea, keys: readonly StageKey[] = stageKeys) {
  const filled = keys.filter((key) => idea.stages[key]?.answer.trim()).length;
  return { filled, total: keys.length };
}

export function getClarificationProgress(idea: Idea) {
  const stages = getSnapshotStages(idea);
  const clarified = stages.filter((stage) => stage.status === "clarified").length;
  const inProgress = stages.filter((stage) => stage.status === "in_progress").length;

  return {
    clarified,
    inProgress,
    unresolved: stages.length - clarified - inProgress,
    total: stages.length,
  };
}

/**
 * Stable exchange envelope for future MVPCompanion JSON imports.
 * Only persisted Idea fields are included; no React or UI state is exported.
 */
/**
 * Backup of the active draft. Field ids stay language-independent.
 * Provider feedback and anything that is not part of the written draft are omitted.
 */
export function createIdeaSnapshotExport(idea: Idea): IdeaSnapshotExport {
  return {
    format: IDEA_SNAPSHOT_FORMAT,
    formatVersion: IDEA_SNAPSHOT_FORMAT_VERSION,
    idea: ideaForExport(idea),
  };
}

function ideaForExport(idea: Idea): Idea {
  const stages = createEmptyStages();
  for (const key of stageKeys) {
    const stage = idea.stages[key];
    const submittedAnswer = stage?.submittedAnswer;
    stages[key] = {
      answer: stage?.answer ?? "",
      ...(typeof submittedAnswer === "string" ? { submittedAnswer } : {}),
    };
  }

  return {
    id: idea.id,
    title: idea.title,
    createdAt: idea.createdAt,
    updatedAt: idea.updatedAt,
    startingContext: { ...idea.startingContext },
    stages,
    currentStage: idea.currentStage,
    status: idea.status,
    area: idea.area,
  };
}

/**
 * Explicit file mappings. A `.json` extension is not enough.
 *
 * - `mvpcompanion.idea-snapshot` version 1: Clarify export with stages 1–6.
 *   Missing later stages stay empty. Texts, ids, and timestamps are kept.
 * - `mvpcompanion.idea-snapshot` version 2: current full-draft backup.
 *
 * No prototype file format is registered. The private prototype dataset was
 * not available, so unknown envelopes are rejected and leave local data unchanged.
 */
export function parseIdeaSnapshotImport(value: unknown): IdeaSnapshotImportResult {
  if (!isRecord(value)) {
    return { ok: false, reason: "invalid_json" };
  }

  if (value.format !== IDEA_SNAPSHOT_FORMAT) {
    return { ok: false, reason: "not_snapshot" };
  }

  if (
    typeof value.formatVersion !== "number" ||
    !supportedFormatVersions.includes(value.formatVersion as 1 | 2)
  ) {
    return { ok: false, reason: "unsupported_version" };
  }

  const sourceVersion = value.formatVersion as 1 | 2;
  const idea = parseImportedIdea(value.idea);
  if (!idea) {
    return { ok: false, reason: "malformed_idea" };
  }

  return {
    ok: true,
    sourceVersion,
    snapshot: {
      format: IDEA_SNAPSHOT_FORMAT,
      formatVersion: IDEA_SNAPSHOT_FORMAT_VERSION,
      idea,
    },
  };
}

function parseImportedIdea(value: unknown): Idea | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readRequiredString(value.id);
  const createdAt = readDate(value.createdAt);
  const updatedAt = readDate(value.updatedAt);
  const currentStage = readRequiredString(value.currentStage);
  const status = parseIdeaStatus(value.status);
  const startingContext = parseStartingContext(value.startingContext);
  const stages = parseStages(value.stages);

  if (
    !id ||
    !createdAt ||
    !updatedAt ||
    currentStage === null ||
    !isCurrentStage(currentStage) ||
    !status ||
    !startingContext ||
    !stages
  ) {
    return null;
  }

  const title =
    typeof value.title === "string" && value.title.trim()
      ? value.title
      : "Untitled Idea";

  return {
    id,
    title,
    createdAt,
    updatedAt,
    currentStage,
    status,
    startingContext,
    stages,
    area: isDraftArea(readOptionalString(value.area) ?? "")
      ? (readOptionalString(value.area) as Idea["area"])
      : "clarify",
  };
}

function parseStartingContext(value: unknown): StartingContext | null {
  if (!isRecord(value)) {
    return null;
  }

  const idea = readRequiredString(value.idea, true);
  const problem = readRequiredString(value.problem, true);
  const user = readRequiredString(value.user, true);
  return idea === null || problem === null || user === null
    ? null
    : { idea, problem, user };
}

function parseStages(value: unknown): Idea["stages"] | null {
  if (!isRecord(value)) {
    return null;
  }

  const stages = createEmptyStages();
  for (const key of stageKeys) {
    if (value[key] === undefined) {
      continue;
    }

    const stage = parseStageState(value[key]);
    if (!stage) {
      return null;
    }
    stages[key] = stage;
  }
  return stages;
}

function parseStageState(value: unknown): StageState | null {
  if (!isRecord(value)) {
    return null;
  }

  const answer = readRequiredString(value.answer, true);
  if (answer === null) {
    return null;
  }

  const submittedAnswer = value.submittedAnswer;
  if (submittedAnswer !== undefined && typeof submittedAnswer !== "string") {
    return null;
  }

  const feedback = parseFeedback(value.feedback);
  if (feedback === undefined) {
    return null;
  }

  return {
    answer,
    ...(submittedAnswer !== undefined ? { submittedAnswer } : {}),
    ...(feedback ? { feedback } : {}),
  };
}

function parseFeedback(value: unknown): StageFeedback | null | undefined {
  if (value === undefined || value === null) {
    return null;
  }
  if (!isRecord(value)) {
    return undefined;
  }

  const summary = readRequiredString(value.summary, true);
  const observations = readStringArray(value.observations);
  const uncertainties = readStringArray(value.uncertainties);
  const suggestions = readStringArray(value.suggestions);
  if (
    summary === null ||
    observations === null ||
    uncertainties === null ||
    suggestions === null
  ) {
    return undefined;
  }

  const status = value.status;
  if (status !== "needs_clarification" && status !== "ready_to_continue") {
    return undefined;
  }

  const assumptions =
    value.assumptions === undefined ? undefined : readStringArray(value.assumptions);
  if (assumptions === null) {
    return undefined;
  }

  const frames = parseFrames(value.frames);
  if (frames === null) {
    return undefined;
  }

  return {
    summary,
    observations,
    uncertainties,
    suggestions,
    ...(assumptions ? { assumptions } : {}),
    ...(frames ? { frames } : {}),
    status,
  };
}

function parseFrames(value: unknown): StageFeedback["frames"] | null {
  if (value === undefined) {
    return undefined;
  }
  if (!Array.isArray(value)) {
    return null;
  }

  const frames = value.map((frame) => {
    if (!isRecord(frame)) {
      return null;
    }
    const label = readRequiredString(frame.label, true);
    const text = readRequiredString(frame.text, true);
    return label === null || text === null ? null : { label, text };
  });
  return frames.some((frame) => frame === null)
    ? null
    : (frames as NonNullable<StageFeedback["frames"]>);
}

function readStringArray(value: unknown): string[] | null {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
    ? value
    : null;
}

function parseIdeaStatus(value: unknown): IdeaStatus | null {
  return value === "new" || value === "in_progress" || value === "completed"
    ? value
    : null;
}

function readDate(value: unknown): string | null {
  return typeof value === "string" && !Number.isNaN(new Date(value).getTime())
    ? value
    : null;
}

function readRequiredString(value: unknown, allowEmpty = false): string | null {
  return typeof value === "string" && (allowEmpty || value.trim()) ? value : null;
}

function readOptionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
