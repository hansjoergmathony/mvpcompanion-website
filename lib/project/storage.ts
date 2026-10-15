import {
  IDEA_LIBRARY_BACKUPS_STORAGE_KEY,
  IDEA_LIBRARY_STORAGE_KEY,
  LEGACY_PROJECT_STORAGE_KEY,
  createEmptyStages,
  createIdea as createEmptyIdea,
  createIdeaId,
  emptyStartingContext,
  isCurrentStage,
  isDraftArea,
  stageKeys,
  type Idea,
  type IdeaLibraryBackup,
  type IdeaLibrary,
  type IdeaStages,
  type IdeaStatus,
  type StageState,
  type StartingContext,
} from "@/lib/project/types";
import type { StageFeedback } from "@/lib/clarification/types";
import type { CompletenessReview } from "@/lib/completeness/types";

const MAX_LOCAL_BACKUPS = 12;
const EMPTY_BACKUPS: IdeaLibraryBackup[] = [];

export type LocalStorageStatus =
  | { state: "saved"; savedAt: string }
  | { state: "error" };

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
    templateData: readTemplateData(value.templateData),
    completenessReview: parseCompletenessReview(value.completenessReview),
    reviewedAnswer: readString(value.reviewedAnswer) || undefined,
    reviewedAt: readString(value.reviewedAt) || undefined,
    feedback: parseFeedback(value.feedback),
    submittedAnswer: readString(value.submittedAnswer) || undefined,
  };
}

function parseCompletenessReview(value: unknown): CompletenessReview | null {
  if (!isRecord(value) || (value.overall !== "ready" && value.overall !== "needs_work")) return null;
  const criteria = Array.isArray(value.criteria) ? value.criteria.flatMap((item) => {
    if (!isRecord(item) || typeof item.criterion !== "string" || typeof item.evidence !== "string" || typeof item.improvement !== "string" || !["met", "partial", "missing", "not_applicable"].includes(String(item.status))) return [];
    return [{ criterion: item.criterion, evidence: item.evidence, improvement: item.improvement, status: item.status as CompletenessReview["criteria"][number]["status"] }];
  }) : [];
  return { overall: value.overall, summary: readString(value.summary), criteria, missingInformation: readStringArray(value.missingInformation), contradictions: readStringArray(value.contradictions), suggestedNextStep: readString(value.suggestedNextStep) };
}

function readTemplateData(value: unknown): Record<string, string> | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const entries = Object.entries(value).flatMap(([key, entry]) =>
    typeof entry === "string" ? [[key, entry] as const] : [],
  );

  return entries.length ? Object.fromEntries(entries) : undefined;
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

function parseStages(value: unknown): IdeaStages {
  const stages = createEmptyStages();

  if (!isRecord(value)) {
    return stages;
  }

  for (const key of stageKeys) {
    stages[key] = parseStageState(value[key]);
  }

  return stages;
}

function parseStatus(value: unknown): IdeaStatus {
  if (value === "new" || value === "in_progress" || value === "completed") {
    return value;
  }

  return "new";
}

export function parseIdea(value: unknown): Idea | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readString(value.id);

  if (!id) {
    return null;
  }

  const currentStageValue = readString(value.currentStage);
  const title = readString(value.title) || "Untitled Idea";
  const createdAt = readString(value.createdAt) || new Date().toISOString();
  const updatedAt = readString(value.updatedAt) || createdAt;

  return {
    id,
    title,
    createdAt,
    updatedAt,
    startingContext: parseStartingContext(value.startingContext),
    stages: parseStages(value.stages),
    currentStage: isCurrentStage(currentStageValue)
      ? currentStageValue
      : "intake",
    status: parseStatus(value.status),
    area: isDraftArea(readString(value.area)) ? readString(value.area) as Idea["area"] : "clarify",
  };
}

export function parseIdeaLibrary(value: unknown): IdeaLibrary | null {
  if (
    !isRecord(value) ||
    (value.version !== 1 && value.version !== 2 && value.version !== 3) ||
    !Array.isArray(value.ideas)
  ) {
    return null;
  }

  const ideas = value.ideas.flatMap((item) => {
    const idea = parseIdea(item);
    return idea ? [idea] : [];
  });
  const requestedActiveIdeaId = readString(value.activeIdeaId) || null;
  const activeIdeaId = ideas.some((idea) => idea.id === requestedActiveIdeaId)
    ? requestedActiveIdeaId
    : ideas[0]?.id ?? null;

  return {
    version: 3,
    activeIdeaId,
    ideas,
  };
}

function createEmptyLibrary(): IdeaLibrary {
  return { version: 3, activeIdeaId: null, ideas: [] };
}

let cachedRaw: string | null | undefined;
let cachedLibrary: IdeaLibrary = createEmptyLibrary();
let cachedBackupsRaw: string | null | undefined;
let cachedBackups: IdeaLibraryBackup[] = EMPTY_BACKUPS;
let storageStatus: LocalStorageStatus = {
  state: "saved",
  savedAt: new Date().toISOString(),
};

function setCache(raw: string | null | undefined, library: IdeaLibrary) {
  cachedRaw = raw;
  cachedLibrary = library;
}

const listeners = new Set<() => void>();

function emitLibraryChange() {
  listeners.forEach((listener) => {
    listener();
  });
}

function setStorageStatus(status: LocalStorageStatus) {
  storageStatus = status;
}

export function getLocalStorageStatus(): LocalStorageStatus {
  return storageStatus;
}

function readBackups(): IdeaLibraryBackup[] {
  if (typeof window === "undefined") {
    return EMPTY_BACKUPS;
  }

  try {
    const raw = window.localStorage.getItem(IDEA_LIBRARY_BACKUPS_STORAGE_KEY);
    if (raw === cachedBackupsRaw) {
      return cachedBackups;
    }
    if (!raw) {
      cachedBackupsRaw = raw;
      cachedBackups = EMPTY_BACKUPS;
      return cachedBackups;
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      cachedBackupsRaw = raw;
      cachedBackups = EMPTY_BACKUPS;
      return cachedBackups;
    }

    cachedBackupsRaw = raw;
    cachedBackups = parsed.flatMap((item) => {
      if (!isRecord(item)) {
        return [];
      }

      const library = parseIdeaLibrary(item.library);
      const id = readString(item.id);
      const savedAt = readString(item.savedAt);
      return library && id && savedAt ? [{ id, savedAt, library }] : [];
    });
    return cachedBackups;
  } catch {
    cachedBackupsRaw = undefined;
    cachedBackups = EMPTY_BACKUPS;
    return cachedBackups;
  }
}

export function getLocalBackups(): IdeaLibraryBackup[] {
  return readBackups();
}

function saveBackup(library: IdeaLibrary) {
  if (typeof window === "undefined" || library.ideas.length === 0) {
    return;
  }

  try {
    const raw = JSON.stringify(library);
    const backups = readBackups();
    if (backups[0] && JSON.stringify(backups[0].library) === raw) {
      return;
    }

    const backup: IdeaLibraryBackup = {
      id: `backup-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      savedAt: new Date().toISOString(),
      library,
    };
    window.localStorage.setItem(
      IDEA_LIBRARY_BACKUPS_STORAGE_KEY,
      JSON.stringify([backup, ...backups].slice(0, MAX_LOCAL_BACKUPS)),
    );
  } catch {
    // The current library remains the primary copy. A backup failure must not block editing.
  }
}

function writeIdeaLibrary(library: IdeaLibrary): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const previous = loadIdeaLibraryFromStorage();
    if (previous && JSON.stringify(previous) !== JSON.stringify(library)) {
      saveBackup(previous);
    }
    const raw = JSON.stringify(library);
    window.localStorage.setItem(IDEA_LIBRARY_STORAGE_KEY, raw);
    setCache(raw, library);
    setStorageStatus({ state: "saved", savedAt: new Date().toISOString() });
    return true;
  } catch {
    setStorageStatus({ state: "error" });
    return false;
  }
}

function loadIdeaLibraryFromStorage(): IdeaLibrary | null {
  try {
    const raw = window.localStorage.getItem(IDEA_LIBRARY_STORAGE_KEY);
    return raw ? parseIdeaLibrary(JSON.parse(raw) as unknown) : null;
  } catch {
    return null;
  }
}

function loadLegacyIdea(): Idea | null {
  try {
    const raw = window.localStorage.getItem(LEGACY_PROJECT_STORAGE_KEY);
    return raw ? parseIdea(JSON.parse(raw) as unknown) : null;
  } catch {
    return null;
  }
}

function migrateLegacyProject(): IdeaLibrary {
  const legacyIdea = loadLegacyIdea();

  if (!legacyIdea) {
    const emptyLibrary = createEmptyLibrary();
    setCache(null, emptyLibrary);
    return emptyLibrary;
  }

  const library: IdeaLibrary = {
    version: 3,
    activeIdeaId: legacyIdea.id,
    ideas: [legacyIdea],
  };

  if (writeIdeaLibrary(library)) {
    try {
      window.localStorage.removeItem(LEGACY_PROJECT_STORAGE_KEY);
    } catch {
      // The saved library is authoritative; retaining the legacy copy is safe.
    }
  } else {
    setCache(undefined, library);
  }

  return library;
}

export function loadIdeaLibrary(): IdeaLibrary {
  if (typeof window === "undefined") {
    return cachedLibrary;
  }

  try {
    const raw = window.localStorage.getItem(IDEA_LIBRARY_STORAGE_KEY);

    if (raw === cachedRaw) {
      return cachedLibrary;
    }

    if (!raw) {
      return migrateLegacyProject();
    }

    const stored = JSON.parse(raw) as unknown;
    const library = parseIdeaLibrary(stored);
    if (library) {
      if (isRecord(stored) && stored.version === 1) {
        writeIdeaLibrary(library);
      } else {
        setCache(raw, library);
      }
      return library;
    }
  } catch {
    // Leave the browser's stored value untouched if it cannot be read.
    setStorageStatus({ state: "error" });
  }

  const emptyLibrary = createEmptyLibrary();
  setCache(undefined, emptyLibrary);
  return emptyLibrary;
}

export function subscribeIdeaLibrary(listener: () => void) {
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
  if (
    event.key === null ||
    event.key === IDEA_LIBRARY_STORAGE_KEY ||
    event.key === LEGACY_PROJECT_STORAGE_KEY
  ) {
    setCache(undefined, createEmptyLibrary());
    emitLibraryChange();
  }
}

function handlePageShow() {
  setCache(undefined, createEmptyLibrary());
  emitLibraryChange();
}

export function saveIdeaLibrary(library: IdeaLibrary): boolean {
  const saved = writeIdeaLibrary(library);
  emitLibraryChange();

  return saved;
}

/** Replaces the complete local library after a confirmed cloud restore or migration. */
export function replaceIdeaLibrary(library: IdeaLibrary): boolean {
  return saveIdeaLibrary(library);
}

export function restoreLocalBackup(id: string): boolean {
  const backup = readBackups().find((item) => item.id === id);
  return backup ? saveIdeaLibrary(backup.library) : false;
}

/** Deletes one browser-only recovery copy. It never changes the active draft or cloud storage. */
export function deleteLocalBackup(id: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const backups = readBackups();
    const nextBackups = backups.filter((backup) => backup.id !== id);
    if (nextBackups.length === backups.length) {
      return false;
    }

    const raw = JSON.stringify(nextBackups);
    window.localStorage.setItem(IDEA_LIBRARY_BACKUPS_STORAGE_KEY, raw);
    cachedBackupsRaw = raw;
    cachedBackups = nextBackups;
    emitLibraryChange();
    return true;
  } catch {
    return false;
  }
}

export function createIdea(): Idea {
  const library = loadIdeaLibrary();
  const idea = createEmptyIdea();
  const next: IdeaLibrary = {
    ...library,
    activeIdeaId: idea.id,
    ideas: [...library.ideas, idea],
  };

  saveIdeaLibrary(next);
  return idea;
}

/**
 * Replaces the active draft in place and keeps the imported timestamps.
 * Does nothing when there is no active draft.
 */
export function replaceActiveIdea(incoming: Idea): boolean {
  const library = loadIdeaLibrary();
  const active = library.ideas.find((idea) => idea.id === library.activeIdeaId);
  if (!active) {
    return false;
  }

  const replaced: Idea = {
    ...incoming,
    id: active.id,
  };
  return saveIdeaLibrary({
    ...library,
    ideas: library.ideas.map((idea) => (idea.id === active.id ? replaced : idea)),
  });
}

/** Adds a validated snapshot as a separate local Idea without altering its dates or content. */
export function importIdea(idea: Idea): Idea {
  const library = loadIdeaLibrary();
  const importedIdea: Idea = {
    id: createIdeaId(),
    title: idea.title,
    createdAt: idea.createdAt,
    updatedAt: idea.updatedAt,
    startingContext: idea.startingContext,
    stages: idea.stages,
    currentStage: idea.currentStage,
    status: idea.status,
    area: idea.area ?? "clarify",
  };

  saveIdeaLibrary({
    ...library,
    activeIdeaId: importedIdea.id,
    ideas: [...library.ideas, importedIdea],
  });
  return importedIdea;
}

export function selectIdea(id: string): void {
  const library = loadIdeaLibrary();

  if (!library.ideas.some((idea) => idea.id === id) || library.activeIdeaId === id) {
    return;
  }

  saveIdeaLibrary({ ...library, activeIdeaId: id });
}

export function updateActiveIdea(updater: (current: Idea) => Idea): void {
  const library = loadIdeaLibrary();
  const activeIdea = library.ideas.find((idea) => idea.id === library.activeIdeaId);

  if (!activeIdea) {
    const idea = createEmptyIdea();
    const updatedIdea = withUpdatedTimestamp(updater(idea));
    saveIdeaLibrary({
      ...library,
      activeIdeaId: updatedIdea.id,
      ideas: [...library.ideas, updatedIdea],
    });
    return;
  }

  const updatedIdea = withUpdatedTimestamp(updater(activeIdea));
  saveIdeaLibrary({
    ...library,
    ideas: library.ideas.map((idea) =>
      idea.id === activeIdea.id ? updatedIdea : idea,
    ),
  });
}

function withUpdatedTimestamp(idea: Idea): Idea {
  return { ...idea, updatedAt: new Date().toISOString() };
}

export function deleteIdea(id: string): void {
  const library = loadIdeaLibrary();
  const ideas = library.ideas.filter((idea) => idea.id !== id);

  if (ideas.length === library.ideas.length) {
    return;
  }

  const activeIdeaId =
    library.activeIdeaId === id
      ? ideas[ideas.length - 1]?.id ?? null
      : library.activeIdeaId;

  saveIdeaLibrary({ ...library, activeIdeaId, ideas });
}
