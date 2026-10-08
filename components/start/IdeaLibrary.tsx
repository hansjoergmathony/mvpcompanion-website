"use client";

import { useEffect, useRef, useState, type ChangeEvent, type RefObject } from "react";
import { Button } from "@/components/ui/Button";
import { exportIdeaAsJson } from "@/lib/project/export";
import {
  countFilledFields,
  getClarificationProgress,
  getIdeaTitle,
  getSnapshotStages,
  parseIdeaSnapshotImport,
  type IdeaSnapshotImportFailureReason,
  type IdeaSnapshotExport,
} from "@/lib/project/ideaSnapshot";
import type { Dictionary } from "@/content/en";
import type { Locale } from "@/lib/i18n/config";
import {
  isStageKey,
  stageKeys,
  workspaceStageKeys,
  type Idea,
  type StageKey,
} from "@/lib/project/types";

type LibraryLabels = Dictionary["ui"]["library"];
type StatusLabels = Dictionary["ui"]["pdf"]["statuses"];

type IdeaLibraryProps = {
  labels: LibraryLabels;
  statuses: StatusLabels;
  stageLabels: Record<StageKey, string>;
  untitled: string;
  locale: Locale;
  ideas: Idea[];
  activeIdeaId: string | null;
  onCreate: () => void;
  onOpen: (id: string) => void;
  onViewSnapshot: () => void;
  onDelete: (id: string) => void;
  onImport: (idea: Idea) => void;
  onReplace: (idea: Idea) => void;
  canUndo: boolean;
  onUndo: () => void;
};

function draftHasContent(idea: Idea | null): boolean {
  if (!idea) {
    return false;
  }

  return Boolean(
    (idea.title.trim() && idea.title !== "Untitled Idea") ||
      stageKeys.some((key) => idea.stages[key]?.answer.trim()),
  );
}

function ideaDescription(idea: Idea, empty: string): string {
  return idea.stages.idea.answer.trim() || empty;
}

function isCompleteSpecification(idea: Idea): boolean {
  return workspaceStageKeys.every((key) => Boolean(idea.stages[key]?.answer.trim()));
}

function clarificationLabel(idea: Idea, labels: LibraryLabels, stageLabels: Record<StageKey, string>): string {
  if (isCompleteSpecification(idea)) {
    return labels.fullSpecification;
  }

  if (isStageKey(idea.currentStage)) {
    return `${labels.stagePrefix} · ${stageLabels[idea.currentStage]}`;
  }

  if (idea.currentStage === "intake") {
    return labels.startingContext;
  }

  return labels.ideaSnapshot;
}

function updatedLabel(updatedAt: string, labels: LibraryLabels): string {
  const updated = new Date(updatedAt);

  if (Number.isNaN(updated.getTime())) {
    return labels.updatedRecently;
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
    return labels.updatedToday;
  }

  if (daysAgo === 1) {
    return labels.updatedYesterday;
  }

  return labels.updatedDaysAgo.replace("{days}", String(daysAgo));
}

export function IdeaLibrary({
  labels,
  statuses,
  stageLabels,
  untitled,
  locale,
  ideas,
  activeIdeaId,
  onCreate,
  onOpen,
  onViewSnapshot,
  onDelete,
  onImport,
  onReplace,
  canUndo,
  onUndo,
}: IdeaLibraryProps) {
  const [ideaToDelete, setIdeaToDelete] = useState<Idea | null>(null);
  const deleteHeadingRef = useRef<HTMLHeadingElement>(null);
  const importHeadingRef = useRef<HTMLHeadingElement>(null);
  const [importPreview, setImportPreview] = useState<
    { snapshot: IdeaSnapshotExport; sourceVersion: 1 | 2 | "prototype-v1" } | null
  >(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeIdea = ideas.find((idea) => idea.id === activeIdeaId) ?? null;

  useEffect(() => {
    if (ideaToDelete) {
      deleteHeadingRef.current?.focus();
    }
  }, [ideaToDelete]);

  useEffect(() => {
    if (importPreview) {
      importHeadingRef.current?.focus();
    }
  }, [importPreview]);

  async function handleImportFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    setImportError(null);
    setImportPreview(null);

    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(".json")) {
      setImportError(labels.invalidJson);
      return;
    }

    try {
      const parsed = parseIdeaSnapshotImport(JSON.parse(await file.text()) as unknown);
      if (parsed.ok) {
        setImportPreview({
          snapshot: parsed.snapshot,
          sourceVersion: parsed.sourceVersion,
        });
        return;
      }

      setImportError(importErrorMessage(parsed.reason, labels));
    } catch {
      setImportError(labels.invalidJson);
    }
  }

  return (
    <section aria-labelledby="my-ideas-heading" className="max-w-2xl border-b border-border pb-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2
          id="my-ideas-heading"
          className="text-xl font-semibold tracking-tight text-navy"
        >
          {labels.heading}
        </h2>
        <div className="flex flex-wrap gap-3">
          {activeIdeaId ? (
            <Button type="button" variant="secondary" onClick={onViewSnapshot}>
              {activeIdea && isCompleteSpecification(activeIdea)
                ? labels.viewFullSpecification
                : labels.viewSnapshot}
            </Button>
          ) : null}
          <Button type="button" variant="secondary" onClick={onCreate}>
            {labels.newIdea}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            {labels.importSnapshot}
          </Button>
          {canUndo ? (
            <Button type="button" variant="secondary" onClick={onUndo}>
              {labels.undoReplace}
            </Button>
          ) : null}
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
        <p className="mt-5 text-base leading-relaxed text-muted">{labels.empty}</p>
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
                      {getIdeaTitle(idea, untitled)}
                    </p>
                    <p className="mt-1 break-words text-sm leading-relaxed text-muted">
                      {ideaDescription(idea, labels.noHypothesis)}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted">
                      {clarificationLabel(idea, labels, stageLabels)}
                    </p>
                    <p className="mt-1 text-sm text-muted">{updatedLabel(idea.updatedAt, labels)}</p>
                    {isActive ? (
                      <p className="mt-2 text-xs uppercase tracking-[0.14em] text-blue">
                        {labels.currentlyOpen}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => onOpen(idea.id)}
                    >
                      {labels.open}
                    </Button>
                    <button
                      type="button"
                      className="text-sm text-muted underline underline-offset-4 transition-colors hover:text-foreground"
                      onClick={() => setIdeaToDelete(idea)}
                    >
                      {labels.delete}
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
          snapshot={importPreview.snapshot}
          sourceVersion={importPreview.sourceVersion}
          replacesDraft={draftHasContent(activeIdea)}
          labels={labels}
          statuses={statuses}
          stageLabels={stageLabels}
          untitled={untitled}
          locale={locale}
          headingRef={importHeadingRef}
          onDownloadBackup={() => {
            if (activeIdea) {
              exportIdeaAsJson(activeIdea, locale);
            }
          }}
          onCancel={() => setImportPreview(null)}
          onImport={() => {
            if (activeIdea) {
              onReplace(importPreview.snapshot.idea);
            } else {
              onImport(importPreview.snapshot.idea);
            }
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
          <h3 id="delete-idea-title" ref={deleteHeadingRef} tabIndex={-1} className="text-base font-medium text-navy outline-none">
            {labels.deleteTitle}
          </h3>
          <p id="delete-idea-description" className="mt-2 text-sm leading-relaxed text-muted">
            {labels.deleteBody}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button type="button" variant="secondary" onClick={() => setIdeaToDelete(null)}>
              {labels.cancel}
            </Button>
            <Button
              type="button"
              onClick={() => {
                onDelete(ideaToDelete.id);
                setIdeaToDelete(null);
              }}
            >
              {labels.deleteIdea}
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ImportPreview({
  snapshot,
  sourceVersion,
  replacesDraft,
  labels,
  statuses,
  stageLabels,
  untitled,
  locale,
  headingRef,
  onDownloadBackup,
  onCancel,
  onImport,
}: {
  snapshot: IdeaSnapshotExport;
  sourceVersion: 1 | 2 | "prototype-v1";
  replacesDraft: boolean;
  labels: LibraryLabels;
  statuses: StatusLabels;
  stageLabels: Record<StageKey, string>;
  untitled: string;
  locale: Locale;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onDownloadBackup: () => void;
  onCancel: () => void;
  onImport: () => void;
}) {
  const { idea } = snapshot;
  const isFullSpecification = isCompleteSpecification(idea);
  const progress = getClarificationProgress(idea);
  const specificationProgress = countFilledFields(idea);
  const availableSections = getSnapshotStages(idea, locale, stageLabels)
    .filter((stage) => stage.status !== "unresolved")
    .map((stage) => stage.label);

  return (
    <section
      aria-labelledby="import-preview-title"
      className="mt-6 rounded-xl border border-border bg-ice px-5 py-6"
    >
      <h3 id="import-preview-title" ref={headingRef} tabIndex={-1} className="text-lg font-semibold tracking-tight text-navy outline-none">
        {isFullSpecification
          ? replacesDraft
            ? labels.importFullSpecificationReplaceTitle
            : labels.importFullSpecificationTitle
          : replacesDraft
            ? labels.importReplaceTitle
            : labels.importTitle}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {isFullSpecification
          ? replacesDraft
            ? labels.importFullSpecificationReplaceBody
            : labels.importFullSpecificationBody
          : replacesDraft
            ? labels.importReplaceBody
            : labels.importBody}
      </p>
      <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-muted">{labels.idea}</dt>
          <dd className="mt-1 font-medium text-navy">{getIdeaTitle(idea, untitled)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-muted">{labels.format}</dt>
          <dd className="mt-1 text-foreground">
            {sourceVersion === "prototype-v1"
              ? "MVPCompanion Private Prototype v1"
              : `MVPCompanion Idea Snapshot v${sourceVersion}`}
          </dd>
        </div>
        {isFullSpecification ? (
          <div>
            <dt className="text-xs uppercase tracking-[0.14em] text-muted">{labels.fileContents}</dt>
            <dd className="mt-1 text-foreground">{labels.fullSpecificationContents}</dd>
          </div>
        ) : null}
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-muted">{labels.created}</dt>
          <dd className="mt-1 text-foreground">{formatDate(idea.createdAt, locale, labels.unknownDate)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-muted">{labels.updated}</dt>
          <dd className="mt-1 text-foreground">{formatDate(idea.updatedAt, locale, labels.unknownDate)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-muted">{labels.status}</dt>
          <dd className="mt-1 text-foreground">{statuses[idea.status]}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-muted">
            {isFullSpecification ? labels.specificationProgress : labels.progress}
          </dt>
          <dd className="mt-1 text-foreground">
            {isFullSpecification
              ? labels.specificationProgressValue
                  .replace("{filled}", String(specificationProgress.filled))
                  .replace("{total}", String(specificationProgress.total))
              : labels.progressValue
                  .replace("{clarified}", String(progress.clarified))
                  .replace("{inProgress}", String(progress.inProgress))
                  .replace("{unresolved}", String(progress.unresolved))}
          </dd>
        </div>
      </dl>
      <div className="mt-5">
        <p className="text-xs uppercase tracking-[0.14em] text-muted">
          {isFullSpecification ? labels.includedStages : labels.availableSections}
        </p>
        <p className="mt-2 text-sm text-foreground">
          {availableSections.length ? availableSections.join(" · ") : labels.noSections}
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        {replacesDraft ? (
          <Button type="button" variant="secondary" onClick={onDownloadBackup}>
            {labels.importDownload}
          </Button>
        ) : null}
        <Button type="button" variant="secondary" onClick={onCancel}>
          {labels.cancel}
        </Button>
        <Button type="button" onClick={onImport}>
          {isFullSpecification
            ? replacesDraft
              ? labels.importReplaceFullSpecification
              : labels.importFullSpecification
            : replacesDraft
              ? labels.importReplace
              : labels.importNew}
        </Button>
      </div>
    </section>
  );
}

function importErrorMessage(reason: IdeaSnapshotImportFailureReason, labels: LibraryLabels): string {
  switch (reason) {
    case "not_snapshot":
      return labels.notSnapshot;
    case "unsupported_version":
      return labels.unsupportedVersion;
    case "invalid_json":
      return labels.invalidJson;
    default:
      return labels.malformed;
  }
}

function formatDate(value: string, locale: Locale, unknown: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? unknown : date.toLocaleDateString(locale);
}
