"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  bookScoutContent,
  bookScoutContext,
  bookScoutStages,
} from "@/content/examples/bookscout";
import type { Dictionary } from "@/content/en";
import type { Locale } from "@/lib/i18n/config";
import { exportIdeaAsJson } from "@/lib/project/export";
import {
  clarifyStageKeys,
  stageKeys,
  stageNumberByKey,
  type Idea,
  type StageKey,
} from "@/lib/project/types";

export function BookScoutPanel({
  locale,
  copy,
  activeIdea,
  stageLabels,
  onApply,
  onUndo,
  canUndo,
}: {
  locale: Locale;
  copy: Dictionary["startContent"];
  stageLabels: Record<StageKey, string>;
  activeIdea: Idea | null;
  onApply: (next: Pick<Idea, "title" | "startingContext" | "stages" | "currentStage" | "area" | "status">) => void;
  onUndo: () => void;
  canUndo: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const titleId = useId();
  const confirmHeadingRef = useRef<HTMLHeadingElement>(null);
  const example = bookScoutContent(locale);
  const stages = bookScoutStages(locale);
  const keys = showAll ? stageKeys : clarifyStageKeys;
  const draftHasContent = Boolean(
    activeIdea &&
      (activeIdea.title.trim() && activeIdea.title !== "Untitled Idea" ||
        stageKeys.some((key) => activeIdea.stages[key].answer.trim())),
  );

  useEffect(() => {
    if (confirming) {
      confirmHeadingRef.current?.focus();
    }
  }, [confirming]);

  function apply() {
    onApply({
      title: example.title,
      startingContext: bookScoutContext(locale),
      stages: bookScoutStages(locale),
      currentStage: "summary",
      area: "clarify",
      status: "in_progress",
    });
    setConfirming(false);
    setOpen(false);
  }

  return (
    <section className="mt-8 rounded-2xl border border-border bg-card px-5 py-5" aria-labelledby={titleId}>
      <p className="text-xs uppercase tracking-[0.18em] text-muted">{copy.exampleEyebrow}</p>
      <h2 id={titleId} className="mt-2 text-lg font-semibold text-navy">
        {copy.exampleTitle}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{copy.exampleBody}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button type="button" variant="secondary" onClick={() => setOpen((value) => !value)}>
          {open ? copy.exampleClose : copy.exampleView}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            if (draftHasContent) {
              setConfirming(true);
              return;
            }
            apply();
          }}
        >
          {copy.exampleUse}
        </Button>
        {canUndo ? (
          <Button type="button" variant="secondary" onClick={onUndo}>
            {copy.undoReplace}
          </Button>
        ) : null}
      </div>
      {confirming ? (
        <div className="mt-4 rounded-xl border border-border bg-ice p-4" role="dialog" aria-modal="true" aria-labelledby={`${titleId}-confirm`}>
          <h3 id={`${titleId}-confirm`} ref={confirmHeadingRef} tabIndex={-1} className="text-base font-semibold text-navy outline-none">
            {copy.exampleConfirmTitle}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{copy.exampleConfirmBody}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                if (activeIdea) {
                  exportIdeaAsJson(activeIdea, locale);
                }
              }}
            >
              {copy.exampleDownload}
            </Button>
            <Button type="button" onClick={apply}>
              {copy.exampleReplace}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setConfirming(false)}>
              {copy.exampleCancel}
            </Button>
          </div>
        </div>
      ) : null}
      {open ? (
        <div className="mt-5">
          <p className="text-sm leading-relaxed text-navy">{example.idea}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="button" variant="secondary" aria-pressed={!showAll} onClick={() => setShowAll(false)}>
              {copy.showSixStages}
            </Button>
            <Button type="button" variant="secondary" aria-pressed={showAll} onClick={() => setShowAll(true)}>
              {copy.showAllStages}
            </Button>
          </div>
          <ol className="mt-4 space-y-4">
            {keys.map((key) => (
              <li key={key}>
                <p className="text-xs uppercase tracking-[0.14em] text-muted">
                  {String(stageNumberByKey[key]).padStart(2, "0")} {stageLabels[key]}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-navy">
                  {stages[key].answer}
                </p>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </section>
  );
}