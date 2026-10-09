"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { BookScoutPanel } from "@/components/start/BookScoutPanel";
import { ClarificationPath } from "@/components/start/ClarificationPath";
import { IdeaLibrary } from "@/components/start/IdeaLibrary";
import {
  MvpPlaceholderView,
  ProductConceptView,
} from "@/components/start/ProductConceptView";
import { StageClarification } from "@/components/start/StageClarification";
import { Button } from "@/components/ui/Button";
import type { Dictionary } from "@/content/en";
import {
  emptyIntakeValues,
  getImplementedStages,
  getPriorStageKeys,
  getStageFocus,
  type IntakeKey,
  type IntakeValues,
} from "@/content/start-path";
import { buildProductConcept } from "@/lib/clarification";
import type { Locale } from "@/lib/i18n/config";
import { countFilledFields } from "@/lib/project/ideaSnapshot";
import {
  clarifyStageKeys,
  isStageKey,
  seedEmptyStageAnswers,
  stageKeyByNumber,
  stageKeys,
  stageNumberByKey,
  workspaceStageKeys,
  type Idea,
  type IdeaStages,
  type StageKey,
  type StageState,
} from "@/lib/project/types";
import { useIdeaLibrary } from "@/lib/project/useProject";

const STORED_UNTITLED = "Untitled Idea";

function editableTitle(title: string | undefined): string {
  const value = title?.trim() ?? "";
  return !value || value === STORED_UNTITLED ? "" : value;
}

function confirmStage(stages: IdeaStages, key: StageKey): IdeaStages {
  const current = stages[key];

  if (!current.feedback) {
    return stages;
  }

  return {
    ...stages,
    [key]: {
      ...current,
      feedback: {
        ...current.feedback,
        status: "ready_to_continue",
      },
    },
  };
}
const fieldClassName =
  "mt-3 w-full resize-y rounded-md border border-border bg-card px-4 py-3 text-base leading-relaxed text-foreground placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue";
const ideaNameFieldClassName =
  "mt-3 w-full rounded-md border border-border bg-card px-4 py-3 text-base text-foreground placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue";

export function StartExperience({
  copy,
  locale,
}: {
  copy: Dictionary;
  locale: Locale;
}) {
  const { priorStageLabel, processStages, stageFocusByNumber, startContent, ui } = copy;
  const implementedStages = getImplementedStages(processStages);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const errorId = useId();
  const {
    activeIdea,
    ideas,
    library,
    isReady,
    createIdea,
    importIdea,
    replaceActiveIdea,
    selectIdea,
    updateActiveIdea,
    deleteIdea,
  } = useIdeaLibrary();
  const [intakeError, setIntakeError] = useState(false);
  const [isViewingSnapshot, setIsViewingSnapshot] = useState(false);
  const [undoIdea, setUndoIdea] = useState<Idea | null>(null);

  const currentStage = activeIdea?.currentStage ?? "intake";
  const startingContext = activeIdea?.startingContext ?? emptyIntakeValues;
  const currentStageKey = isStageKey(currentStage) ? currentStage : null;
  const currentStageNumber = currentStageKey
    ? stageNumberByKey[currentStageKey]
    : null;
  const currentProcessStage = implementedStages.find(
    (stage) => stage.number === currentStageNumber,
  );

  useEffect(() => {
    if (!isReady) {
      return;
    }

    headingRef.current?.focus();
  }, [isReady, currentStage]);

  function updateStartingContext(values: IntakeValues) {
    updateActiveIdea((current) => ({
      ...current,
      startingContext: values,
      status: current.status === "in_progress" ? "in_progress" : "new",
    }));
  }

  function updateIdeaTitle(title: string) {
    updateActiveIdea((current) => ({
      ...current,
      title: title.trim() ? title : STORED_UNTITLED,
    }));
  }

  function handleIntakeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextContext: IntakeValues = {
      idea: startingContext.idea.trim(),
      user: startingContext.user.trim(),
      problem: startingContext.problem.trim(),
    };

    if (!nextContext.idea || !nextContext.user || !nextContext.problem) {
      setIntakeError(true);
      return;
    }

    setIntakeError(false);
    updateActiveIdea((current) => ({
      ...current,
      startingContext: nextContext,
      stages: seedEmptyStageAnswers(current.stages, nextContext),
      currentStage: "idea",
      status: "in_progress",
    }));
  }

  function goToPreviousStage() {
    if (!currentStageKey || currentStageKey === "idea") {
      return;
    }

    const previous = stageKeyByNumber[stageNumberByKey[currentStageKey] - 1];

    if (!previous) {
      return;
    }

    updateActiveIdea((current) => ({
      ...current,
      currentStage: previous,
      status: "in_progress",
    }));
  }

  function goToNextStage() {
    if (!currentStageKey) {
      return;
    }

    const number = stageNumberByKey[currentStageKey];
    const workspace =
      activeIdea?.area === "workspace" ||
      workspaceStageKeys.some((key) =>
        Boolean(activeIdea?.stages[key]?.answer.trim()),
      );

    if (number === 15 || (!workspace && number === 6)) {
      updateActiveIdea((current) => ({
        ...current,
        stages: confirmStage(current.stages, currentStageKey),
        currentStage: "summary",
        status: workspace ? "in_progress" : "completed",
      }));
      return;
    }

    const next = stageKeyByNumber[number + 1];

    if (!next) {
      return;
    }

    updateActiveIdea((current) => ({
      ...current,
      stages: confirmStage(current.stages, currentStageKey),
      currentStage: next,
      status: "in_progress",
    }));
  }

  function openWorkspace() {
    updateActiveIdea((current) => ({
      ...current,
      area: "workspace",
      currentStage: "jobs",
      status: "in_progress",
    }));
    setIsViewingSnapshot(false);
  }

  function returnToOverview() {
    updateActiveIdea((current) => ({
      ...current,
      currentStage: "summary",
      status:
        current.area === "workspace" ||
        workspaceStageKeys.some((key) => Boolean(current.stages[key]?.answer.trim()))
          ? "in_progress"
          : "completed",
    }));
    setIsViewingSnapshot(false);
  }

  function updateCurrentAnswer(value: string) {
    if (!currentStageKey) {
      return;
    }

    updateActiveIdea((current) => {
      const stage = current.stages[currentStageKey];
      const nextStage = { ...stage, answer: value };

      if (
        stage.submittedAnswer !== undefined &&
        stage.submittedAnswer !== value.trim()
      ) {
        nextStage.submittedAnswer = undefined;
        nextStage.feedback = null;
      }

      return {
        ...current,
        stages: {
          ...current.stages,
          [currentStageKey]: nextStage,
        },
        status: "in_progress",
      };
    });
  }

  function submitStageFeedback(next: StageState) {
    if (!currentStageKey) {
      return;
    }

    updateActiveIdea((current) => ({
      ...current,
      stages: {
        ...current.stages,
        [currentStageKey]: next,
      },
      status: "in_progress",
    }));
  }

  function relatedAnswers() {
    if (!activeIdea) {
      return {};
    }

    return Object.fromEntries(
      stageKeys
        .filter((key) => key !== currentStageKey)
        .map((key) => {
          const stage = activeIdea.stages[key];
          const clarified = stage.feedback?.summary?.trim() || stage.answer.trim();
          return [key, clarified];
        }),
    ) as Partial<Record<StageKey, string>>;
  }

  function contextNotes() {
    if (!activeIdea || !currentProcessStage) {
      return [];
    }

    if (currentProcessStage.number === 1) {
      const idea = activeIdea.startingContext.idea.trim();
      return idea
        ? [{ label: startContent.intakeLabel, text: idea }]
        : [];
    }

    return getPriorStageKeys(currentProcessStage.number).flatMap((key) => {
      const stage = activeIdea.stages[key];
      const text = (stage.feedback?.summary || stage.answer).trim();

      return text ? [{ label: priorStageLabel[key], text }] : [];
    });
  }

  function handleCreateIdea() {
    createIdea();
    setIntakeError(false);
    setIsViewingSnapshot(false);
  }

  const ideaLibrary = (
    <>
      <IdeaLibrary
        labels={ui.library}
        statuses={ui.pdf.statuses}
        stageLabels={priorStageLabel}
        untitled={ui.untitledIdea}
        locale={locale}
        ideas={ideas}
        activeIdeaId={library.activeIdeaId}
        onCreate={handleCreateIdea}
        onOpen={(id) => {
          selectIdea(id);
          setIntakeError(false);
          setIsViewingSnapshot(false);
        }}
        onViewSnapshot={() => setIsViewingSnapshot(true)}
        onDelete={deleteIdea}
        canUndo={undoIdea !== null}
        onUndo={() => {
          if (!undoIdea) {
            return;
          }
          updateActiveIdea(() => undoIdea);
          setUndoIdea(null);
        }}
        onImport={(idea) => {
          importIdea(idea);
          setIntakeError(false);
          setIsViewingSnapshot(true);
        }}
        onReplace={(idea) => {
          if (
            activeIdea &&
            ((activeIdea.title.trim() && activeIdea.title !== "Untitled Idea") ||
              stageKeys.some((key) => activeIdea.stages[key].answer.trim()))
          ) {
            setUndoIdea(activeIdea);
          }
          if (!replaceActiveIdea(idea)) {
            importIdea(idea);
          }
          setIntakeError(false);
          setIsViewingSnapshot(true);
        }}
      />
      <BookScoutPanel
        locale={locale}
        copy={startContent}
        activeIdea={activeIdea}
        stageLabels={priorStageLabel}
        canUndo={undoIdea !== null}
        onUndo={() => {
          if (!undoIdea) {
            return;
          }
          updateActiveIdea(() => undoIdea);
          setUndoIdea(null);
        }}
        onApply={(next) => {
          if (activeIdea) {
            setUndoIdea(activeIdea);
          }
          updateActiveIdea((current) => ({
            ...current,
            ...next,
          }));
          setIsViewingSnapshot(true);
        }}
      />
    </>
  );

  if (!isReady) {
    return <div className="min-h-[24rem]" aria-busy="true" />;
  }

  if ((isViewingSnapshot || currentStage === "summary") && activeIdea) {
    return (
      <>
        {ideaLibrary}
        <div className="mt-10">
          <ProductConceptView
            headingRef={headingRef}
            idea={activeIdea}
            copy={copy}
            locale={locale}
            concept={buildProductConcept(activeIdea, locale)}
            editLabel={
              currentStage === "summary"
                ? startContent.editConceptCta
                : startContent.backToClarification
            }
            onEditConcept={() => {
              if (currentStage === "summary") {
                updateActiveIdea((current) => ({
                  ...current,
                  currentStage:
                    current.area === "workspace" ? "jobs" : "idea",
                  status: "in_progress",
                }));
              }
              setIsViewingSnapshot(false);
            }}
            onStartNew={handleCreateIdea}
            onDevelop={openWorkspace}
          />
        </div>
      </>
    );
  }

  if (currentStage === "mvp") {
    return (
      <>
        {ideaLibrary}
        <div className="mt-10">
          <MvpPlaceholderView
            headingRef={headingRef}
            copy={copy}
            onBackToConcept={() => {
              updateActiveIdea((current) => ({
                ...current,
                currentStage: "summary",
                status: "completed",
              }));
            }}
          />
        </div>
      </>
    );
  }

  if (currentStageKey && stageNumberByKey[currentStageKey] > 6 && activeIdea) {
    const stage = processStages.find(
      (item) => item.number === stageNumberByKey[currentStageKey],
    );
    const filled = countFilledFields(activeIdea);
    const answer = activeIdea.stages[currentStageKey].answer;

    return (
      <>
        {ideaLibrary}
        <div className="mt-10 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            {String(stageNumberByKey[currentStageKey]).padStart(2, "0")} / 15
          </p>
          <p className="mt-3 text-sm text-muted">
            {startContent.filledFields
              .replace("{filled}", String(filled.filled))
              .replace("{total}", String(filled.total))}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{startContent.filledNote}</p>
          <label className="mt-4 block text-sm text-navy">
            <span className="text-xs uppercase tracking-[0.14em] text-muted">
              {startContent.overallProgress}
            </span>
            <select
              className="mt-2 w-full rounded-md border border-border bg-card px-3 py-2"
              value={currentStageKey}
              onChange={(event) => {
                const next = event.target.value;
                if (!isStageKey(next)) {
                  return;
                }
                updateActiveIdea((current) => ({
                  ...current,
                  area:
                    current.area === "workspace" ||
                    workspaceStageKeys.some((key) =>
                      Boolean(current.stages[key]?.answer.trim()),
                    ) ||
                    stageNumberByKey[next] > 6
                      ? "workspace"
                      : "clarify",
                  currentStage: next,
                  status: "in_progress",
                }));
              }}
            >
              {processStages.map((stage) => (
                <option key={stage.number} value={stageKeyByNumber[stage.number]}>
                  {String(stage.number).padStart(2, "0")} {stage.name}
                </option>
              ))}
            </select>
          </label>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="mt-8 text-4xl font-semibold tracking-tight text-navy outline-none"
          >
            {stage?.name}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{stage?.question}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{startContent.noAiReview}</p>
          <label className="mt-8 block">
            <span className="sr-only">{stage?.question}</span>
            <textarea
              value={answer}
              rows={6}
              onChange={(event) => updateCurrentAnswer(event.target.value)}
              className={fieldClassName}
            />
          </label>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" onClick={goToNextStage}>
              {startContent.saveAndContinue}
            </Button>
            <Button type="button" variant="secondary" onClick={goToPreviousStage}>
              {startContent.previousLabel}
            </Button>
            <Button type="button" variant="secondary" onClick={returnToOverview}>
              {startContent.backToOverview}
            </Button>
          </div>
        </div>
      </>
    );
  }

  if (currentProcessStage && currentStageKey) {
    const clarifyFilled = activeIdea
      ? countFilledFields(activeIdea, clarifyStageKeys)
      : null;

    return (
      <>
        {ideaLibrary}
        <div className="mt-10 max-w-2xl">
        <ClarificationPath current={1} startContent={startContent} />
        <p className="mt-8 text-xs uppercase tracking-[0.18em] text-muted">
          {String(currentProcessStage.number).padStart(2, "0")} / 06
        </p>
        {clarifyFilled ? (
          <p className="mt-3 text-sm text-muted">
            {startContent.clarifyProgress}{" "}
            {startContent.filledFields
              .replace("{filled}", String(clarifyFilled.filled))
              .replace("{total}", String(clarifyFilled.total))}
          </p>
        ) : null}
        <p className="mt-2 text-sm leading-relaxed text-muted">{startContent.filledNote}</p>

        <ol className="mt-5 flex gap-1" aria-hidden="true">
          {processStages
            .filter((stage) => stage.number <= 6)
            .map((stage) => {
            const reached = stage.number <= currentProcessStage.number;

            return (
              <li
                key={stage.number}
                className={
                  reached ? "h-px flex-1 bg-blue" : "h-px flex-1 bg-border"
                }
              />
            );
          })}
        </ol>

        <div className="mt-10">
          <StageClarification
            key={`${activeIdea?.id ?? "new"}-${currentStageKey}`}
            headingRef={headingRef}
            stage={currentProcessStage}
            stageKey={currentStageKey}
            stageState={
              activeIdea?.stages[currentStageKey] ?? {
                answer: "",
              }
            }
            startingContext={startingContext}
            ideaTitle={editableTitle(activeIdea?.title)}
            locale={locale}
            startContent={startContent}
            focus={getStageFocus(currentProcessStage.number, stageFocusByNumber)}
            contextNotes={contextNotes()}
            relatedAnswers={relatedAnswers()}
            onChangeIdeaTitle={updateIdeaTitle}
            onChangeAnswer={updateCurrentAnswer}
            onSubmitFeedback={submitStageFeedback}
            onContinue={goToNextStage}
            onPrevious={goToPreviousStage}
            onBackToOverview={returnToOverview}
          />
        </div>
        </div>
      </>
    );
  }

  return (
    <>
      {ideaLibrary}
      <div className="mt-10 max-w-2xl">
      <ClarificationPath current={0} startContent={startContent} />
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mt-8 text-4xl leading-[1.1] font-semibold tracking-tight text-navy outline-none md:text-5xl"
      >
        {startContent.title}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-muted">
        {startContent.supporting}
      </p>

      <form
        className="mt-12"
        onSubmit={handleIntakeSubmit}
        noValidate
        aria-describedby={intakeError ? errorId : undefined}
      >
        <p className="text-xs uppercase tracking-[0.18em] text-muted">
          {startContent.intakeLabel}
        </p>
        <div className="mt-6 space-y-8">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-muted">
              {startContent.ideaNameLabel}
            </span>
            <input
              name="title"
              type="text"
              value={editableTitle(activeIdea?.title)}
              placeholder={startContent.ideaNamePlaceholder}
              onChange={(event) => updateIdeaTitle(event.target.value)}
              className={ideaNameFieldClassName}
            />
          </label>
          {startContent.intakeFields.map((field) => {
            const key = field.key as IntakeKey;

            return (
            <label key={key} className="block">
              <span className="text-sm tracking-wide">{field.label}</span>
              <span className="mt-2 block text-sm leading-relaxed text-muted">
                {field.prompt}
              </span>
              <textarea
                name={key}
                value={startingContext[key]}
                aria-invalid={intakeError && !startingContext[key].trim()}
                aria-describedby={
                  intakeError && !startingContext[key].trim()
                    ? errorId
                    : undefined
                }
                onChange={(event) => {
                  setIntakeError(false);
                  updateStartingContext({
                    ...startingContext,
                    [key]: event.target.value,
                  });
                }}
                rows={key === "idea" ? 3 : 2}
                className={fieldClassName}
              />
            </label>
            );
          })}
        </div>

        {intakeError ? (
          <p id={errorId} className="mt-6 text-sm text-foreground" role="alert">
            {startContent.intakeError}
          </p>
        ) : null}

        <div className="mt-10">
          <Button type="submit">{startContent.submitLabel}</Button>
        </div>
      </form>
      </div>
    </>
  );
}
