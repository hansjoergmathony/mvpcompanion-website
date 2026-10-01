"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/Button";
import {
  getClarificationProgress,
  getIdeaTitle,
  getSnapshotStages,
  parseIdeaSnapshotImport,
  type IdeaSnapshotImportFailureReason,
  type IdeaSnapshotExport,
} from "@/lib/project/ideaSnapshot";
import { isStageKey, stageNumberByKey, type Idea } from "@/lib/project/types";

type IdeaLibraryProps = {
  ideas: Idea[];
  activeIdeaId: string | null;
  onCreate: () => void;
  onOpen: (id: string) => void;
  onViewSnapshot: () => void;
  onDelete: (id: string) => void;
  onImport: (idea: Idea) => void;
};

function ideaDescription(idea: Idea): string {
  return idea.stages.idea.answer.trim() || "No Idea hypothesis yet.";
}

function clarificationLabel(idea: Idea): string {
  if (isStageKey(idea.currentStage)) {
    return `Clarification · Stage ${stageNumberByKey[idea.currentStage]}`;
  }

  if (idea.currentStage === "intake") {
    return "Clarification · Starting context";
  }

  return "Clarification · Idea Snapshot";
}

function updatedLabel(updatedAt: string): string {
  const updated = new Date(updatedAt);

  if (Number.isNaN(updated.getTime())) {
    return "Updated recently";
  }

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const updatedStart = new Date(
    updated.getFullYear(),
    updated.getMonth(),
    updated.getDate(),
  );
  const daysAgo = Math.round(
    (todayStart.getTime() - updatedStart.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysAgo <= 0) {
    return "Updated today";
  }

  if (daysAgo === 1) {
    return "Updated yesterday";
  }

  return `Updated ${daysAgo} days ago`;
}

export function IdeaLibrary({
  ideas,
  activeIdeaId,
  onCreate,
  onOpen,
  onViewSnapshot,
  onDelete,
  onImport,
}: IdeaLibraryProps) {
  const [ideaToDelete, setIdeaToDelete] = useState<Idea | null>(null);
  const [importPreview, setImportPreview] = useState<IdeaSnapshotExport | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleImportFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    setImportError(null);
    setImportPreview(null);

    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(".json")) {
      setImportError("Invalid JSON file.");
      return;
    }

    try {
      const parsed = parseIdeaSnapshotImport(JSON.parse(await file.text()) as unknown);
      if (parsed.ok) {
        setImportPreview(parsed.snapshot);
        return;
      }

      setImportError(importErrorMessage(parsed.reason));
    } catch {
      setImportError("Invalid JSON file.");
    }
  }

  return (
    <section aria-labelledby="my-ideas-heading" className="max-w-2xl border-b border-border pb-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2
          id="my-ideas-heading"
          className="text-xl font-semibold tracking-tight text-navy"
        >
          My Ideas
        </h2>
        <div className="flex flex-wrap gap-3">
          {activeIdeaId ? (
            <Button type="button" variant="secondary" onClick={onViewSnapshot}>
              View Idea Snapshot
            </Button>
          ) : null}
          <Button type="button" variant="secondary" onClick={onCreate}>
            + New Idea
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            Import Snapshot
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={handleImportFile}
          />
        </div>
      </div>

      {ideas.length === 0 ? (
        <p className="mt-5 text-base leading-relaxed text-muted">No ideas yet.</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {ideas.map((idea) => {
            const isActive = idea.id === activeIdeaId;

            return (
              <li
                key={idea.id}
                className={`rounded-xl border px-4 py-4 ${
                  isActive ? "border-blue bg-ice" : "border-border bg-card"
                }`}
                aria-current={isActive ? "true" : undefined}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold tracking-tight text-navy">
                      {getIdeaTitle(idea)}
                    </p>
                    <p className="mt-1 break-words text-sm leading-relaxed text-muted">
                      {ideaDescription(idea)}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted">
                      {clarificationLabel(idea)}
                    </p>
                    <p className="mt-1 text-sm text-muted">{updatedLabel(idea.updatedAt)}</p>
                    {isActive ? (
                      <p className="mt-2 text-xs uppercase tracking-[0.14em] text-blue">
                        Currently open
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => onOpen(idea.id)}
                    >
                      Open
                    </Button>
                    <button
                      type="button"
                      className="text-sm text-muted underline underline-offset-4 transition-colors hover:text-foreground"
                      onClick={() => setIdeaToDelete(idea)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {importError ? (
        <p className="mt-5 text-sm text-foreground" role="alert">
          {importError}
        </p>
      ) : null}

      {importPreview ? (
        <ImportPreview
          snapshot={importPreview}
          onCancel={() => setImportPreview(null)}
          onImport={() => {
            onImport(importPreview.idea);
            setImportPreview(null);
          }}
        />
      ) : null}

      {ideaToDelete ? (
        <div
          className="mt-6 rounded-xl border border-border bg-card px-5 py-5"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="delete-idea-title"
          aria-describedby="delete-idea-description"
        >
          <h3 id="delete-idea-title" className="text-base font-medium text-navy">
            Delete this Idea?
          </h3>
          <p id="delete-idea-description" className="mt-2 text-sm leading-relaxed text-muted">
            This will remove the Idea from this browser. Make sure you have exported
            it if you want to keep a copy.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button type="button" variant="secondary" onClick={() => setIdeaToDelete(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                onDelete(ideaToDelete.id);
                setIdeaToDelete(null);
              }}
            >
              Delete Idea
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ImportPreview({
  snapshot,
  onCancel,
  onImport,
}: {
  snapshot: IdeaSnapshotExport;
  onCancel: () => void;
  onImport: () => void;
}) {
  const { idea } = snapshot;
  const progress = getClarificationProgress(idea);
  const availableSections = getSnapshotStages(idea)
    .filter((stage) => stage.status !== "unresolved")
    .map((stage) => stage.label);

  return (
    <section
      aria-labelledby="import-preview-title"
      className="mt-6 rounded-xl border border-border bg-ice px-5 py-6"
    >
      <h3 id="import-preview-title" className="text-lg font-semibold tracking-tight text-navy">
        Import as a new Idea
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Your existing Ideas will not be changed.
      </p>
      <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-muted">Idea</dt>
          <dd className="mt-1 font-medium text-navy">{getIdeaTitle(idea)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-muted">Snapshot format</dt>
          <dd className="mt-1 text-foreground">
            MVPCompanion Idea Snapshot v{snapshot.formatVersion}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-muted">Created</dt>
          <dd className="mt-1 text-foreground">{formatDate(idea.createdAt)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-muted">Updated</dt>
          <dd className="mt-1 text-foreground">{formatDate(idea.updatedAt)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-muted">Status</dt>
          <dd className="mt-1 text-foreground">{idea.status.replace("_", " ")}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-muted">Clarification progress</dt>
          <dd className="mt-1 text-foreground">
            {progress.clarified} clarified · {progress.inProgress} in progress · {progress.unresolved} unresolved
          </dd>
        </div>
      </dl>
      <div className="mt-5">
        <p className="text-xs uppercase tracking-[0.14em] text-muted">Available sections</p>
        <p className="mt-2 text-sm text-foreground">
          {availableSections.length ? availableSections.join(" · ") : "No sections clarified yet"}
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={onImport}>
          Import as New Idea
        </Button>
      </div>
    </section>
  );
}

function importErrorMessage(
  reason: IdeaSnapshotImportFailureReason,
): string {
  switch (reason) {
    case "not_snapshot":
      return "This file is not an MVPCompanion Idea Snapshot.";
    case "unsupported_version":
      return "This Snapshot format version is not supported.";
    case "invalid_json":
      return "Invalid JSON file.";
    default:
      return "This Idea Snapshot is malformed.";
  }
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Unknown" : date.toLocaleDateString();
}
