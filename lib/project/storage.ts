import {
  PROJECT_STORAGE_KEY,
  createEmptyStages,
  createProject,
  emptyStartingContext,
  isCurrentStage,
  stageKeys,
  type Project,
  type ProjectStages,
  type ProjectStatus,
  type StageState,
  type StartingContext,
} from "@/lib/project/types";
import type { StageFeedback } from "@/lib/clarification/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function parseStartingContext(value: unknown): StartingContext {
  if (!isRecord(value)) {
    return { ...emptyStartingContext };
  }

  return {
    idea: readString(value.idea),
    problem: readString(value.problem),
    user: readString(value.user),
  };
}

function parseStageState(value: unknown): StageState {
  if (typeof value === "string") {
    return { answer: value };
  }

  if (!isRecord(value)) {
    return { answer: "" };
  }

  return {
    answer: readString(value.answer),
    feedback: parseFeedback(value.feedback),
    submittedAnswer: readString(value.submittedAnswer) || undefined,
  };
}

function parseFeedback(value: unknown): StageFeedback | null {
  if (!isRecord(value)) {
    return null;
  }

  const status = value.status;
  const feedbackStatus =
    status === "needs_clarification" || status === "ready_to_continue"
      ? status
      : "needs_clarification";

  return {
    summary: readString(value.summary),
    observations: readStringArray(value.observations),
    uncertainties: readStringArray(value.uncertainties),
    suggestions: readStringArray(value.suggestions),
    assumptions: readOptionalStringArray(value.assumptions),
    frames: readFrames(value.frames),
    status: feedbackStatus,
  };
}

function readOptionalStringArray(value: unknown): string[] | undefined {
  const items = readStringArray(value);
  return items.length ? items : undefined;
}

function readFrames(value: unknown): StageFeedback["frames"] {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const frames = value.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }

    const label = readString(item.label);
    const text = readString(item.text);

    return label && text ? [{ label, text }] : [];
  });

  return frames.length ? frames : undefined;
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function parseStages(value: unknown): ProjectStages {
  const stages = createEmptyStages();

  if (!isRecord(value)) {
    return stages;
  }

  for (const key of stageKeys) {
    stages[key] = parseStageState(value[key]);
  }

  return stages;
}

function parseStatus(value: unknown): ProjectStatus {
  if (value === "new" || value === "in_progress" || value === "completed") {
    return value;
  }

  return "new";
}

export function parseProject(value: unknown): Project | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readString(value.id);

  if (!id) {
    return null;
  }

  const currentStageValue = readString(value.currentStage);
  const createdAt = readString(value.createdAt) || new Date().toISOString();
  const updatedAt = readString(value.updatedAt) || createdAt;

  return {
    id,
    createdAt,
    updatedAt,
    startingContext: parseStartingContext(value.startingContext),
    stages: parseStages(value.stages),
    currentStage: isCurrentStage(currentStageValue)
      ? currentStageValue
      : "intake",
    status: parseStatus(value.status),
  };
}

let cachedRaw: string | null | undefined;
let cachedProject: Project | null = null;

function setCache(raw: string | null | undefined, project: Project | null) {
  cachedRaw = raw;
  cachedProject = project;
}

export function loadProject(): Project | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(PROJECT_STORAGE_KEY);

    if (raw === cachedRaw) {
      return cachedProject;
    }

    if (!raw) {
      setCache(null, null);
      return null;
    }

    const project = parseProject(JSON.parse(raw) as unknown);
    setCache(raw, project);
    return project;
  } catch {
    setCache(undefined, null);
    return null;
  }
}

const listeners = new Set<() => void>();

function emitProjectChange() {
  listeners.forEach((listener) => {
    listener();
  });
}

export function subscribeProject(listener: () => void) {
  const shouldBindWindow = listeners.size === 0;
  listeners.add(listener);

  if (shouldBindWindow && typeof window !== "undefined") {
    window.addEventListener("storage", handleWindowStorage);
    window.addEventListener("pageshow", handlePageShow);
  }

  return () => {
    listeners.delete(listener);

    if (listeners.size === 0 && typeof window !== "undefined") {
      window.removeEventListener("storage", handleWindowStorage);
      window.removeEventListener("pageshow", handlePageShow);
    }
  };
}

function handleWindowStorage(event: StorageEvent) {
  if (event.key === null || event.key === PROJECT_STORAGE_KEY) {
    setCache(undefined, null);
    emitProjectChange();
  }
}

function handlePageShow() {
  setCache(undefined, null);
  emitProjectChange();
}

export function saveProject(project: Project): void {
  if (typeof window === "undefined") {
    return;
  }

  const raw = JSON.stringify(project);
  window.localStorage.setItem(PROJECT_STORAGE_KEY, raw);
  setCache(raw, project);
  emitProjectChange();
}

export function clearProject(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(PROJECT_STORAGE_KEY);
  setCache(null, null);
  emitProjectChange();
}

export function persistProject(project: Project): Project {
  const next: Project = {
    ...project,
    updatedAt: new Date().toISOString(),
  };

  saveProject(next);
  return next;
}

export function replaceProject(): Project {
  const project = createProject();
  saveProject(project);
  return project;
}
