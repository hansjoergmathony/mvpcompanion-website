"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ClarificationPath } from "@/components/start/ClarificationPath";
import { IdeaLibrary } from "@/components/start/IdeaLibrary";
import {
  MvpPlaceholderView,
  ProductConceptView,
} from "@/components/start/ProductConceptView";
import { StageClarification } from "@/components/start/StageClarification";
import { Button } from "@/components/ui/Button";
import { processStages } from "@/content/process";
import { buildProductConcept } from "@/lib/clarification";
import {
  emptyIntakeValues,
  getImplementedStages,
  getPriorStageKeys,
  getStageFocus,
  isImplementedStage,
  priorStageLabel,
  startContent,
  totalStageCount,
  type IntakeValues,
} from "@/content/start";
import {
  isStageKey,
  seedEmptyStageAnswers,
  stageKeyByNumber,
  stageKeys,
  stageNumberByKey,
  type IdeaStages,
  type StageKey,
  type StageState,
} from "@/lib/project/types";
import { useIdeaLibrary } from "@/lib/project/useProject";

const implementedStages = getImplementedStages();

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

export function StartExperience() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const errorId = useId();
  const {
    activeIdea,
    ideas,
    library,
    isReady,
    createIdea,
    importIdea,
    selectIdea,
    updateActiveIdea,
    deleteIdea,
  } = useIdeaLibrary();
  const [intakeError, setIntakeError] = useState(false);
  const [isViewingSnapshot, setIsViewingSnapshot] = useState(false);

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
    updateActiveIdea((current) => ({ ...current, title }));
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

    const currentIndex = implementedStages.findIndex(
      (stage) => stage.number === stageNumberByKey[currentStageKey],
    );
    const previous = implementedStages[currentIndex - 1];
    const previousKey = previous
      ? stageKeyByNumber[previous.number]
      : undefined;

    if (!previousKey) {
      return;
    }

    updateActiveIdea((current) => ({
      ...current,
      currentStage: previousKey,
      status: "in_progress",
    }));
  }

  function goToNextStage() {
    if (!currentStageKey) {
      return;
    }

    const currentIndex = implementedStages.findIndex(
      (stage) => stage.number === stageNumberByKey[currentStageKey],
    );

    if (currentIndex === implementedStages.length - 1) {
      updateActiveIdea((current) => ({
        ...current,
        stages: confirmStage(current.stages, currentStageKey),
        currentStage: "summary",
        status: "completed",
      }));
      return;
    }

    const next = implementedStages[currentIndex + 1];
    const nextKey = next ? stageKeyByNumber[next.number] : undefined;

    if (!nextKey) {
      return;
    }

    updateActiveIdea((current) => ({
      ...current,
      stages: confirmStage(current.stages, currentStageKey),
      currentStage: nextKey,
      status: "in_progress",
    }));
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
    <IdeaLibrary
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
      onImport={(idea) => {
        importIdea(idea);
        setIntakeError(false);
        setIsViewingSnapshot(false);
      }}
    />
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
            concept={buildProductConcept(activeIdea)}
            editLabel={
              currentStage === "summary"
                ? startContent.editConceptCta
                : "Back to clarification"
            }
            onEditConcept={() => {
              if (currentStage === "summary") {
                updateActiveIdea((current) => ({
                  ...current,
                  currentStage: "idea",
                  status: "in_progress",
                }));
              }
              setIsViewingSnapshot(false);
            }}
            onStartNew={handleCreateIdea}
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

  if (currentProcessStage && currentStageKey) {
    return (
      <>
        {ideaLibrary}
        <div className="mt-10 max-w-2xl">
        <ClarificationPath current={1} />
        <p className="mt-8 text-xs uppercase tracking-[0.18em] text-muted">
          {String(currentProcessStage.number).padStart(2, "0")} /{" "}
          {String(totalStageCount).padStart(2, "0")}
        </p>

        <ol className="mt-5 flex gap-1" aria-hidden="true">
          {processStages.map((stage) => {
            const reached =
              isImplementedStage(stage.number) &&
              stage.number <= currentProcessStage.number;

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
            ideaTitle={activeIdea?.title ?? "Untitled Idea"}
            focus={getStageFocus(currentProcessStage.number)}
            contextNotes={contextNotes()}
            relatedAnswers={relatedAnswers()}
            onChangeIdeaTitle={updateIdeaTitle}
            onChangeAnswer={updateCurrentAnswer}
            onSubmitFeedback={submitStageFeedback}
            onContinue={goToNextStage}
            onPrevious={goToPreviousStage}
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
      <ClarificationPath current={0} />
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
              value={activeIdea?.title ?? "Untitled Idea"}
              placeholder={startContent.ideaNamePlaceholder}
              onChange={(event) => updateIdeaTitle(event.target.value)}
              className={ideaNameFieldClassName}
            />
          </label>
          {startContent.intakeFields.map((field) => (
            <label key={field.key} className="block">
              <span className="text-sm tracking-wide">{field.label}</span>
              <span className="mt-2 block text-sm leading-relaxed text-muted">
                {field.prompt}
              </span>
              <textarea
                name={field.key}
                value={startingContext[field.key]}
                aria-invalid={intakeError && !startingContext[field.key].trim()}
                aria-describedby={
                  intakeError && !startingContext[field.key].trim()
                    ? errorId
                    : undefined
                }
                onChange={(event) => {
                  setIntakeError(false);
                  updateStartingContext({
                    ...startingContext,
                    [field.key]: event.target.value,
                  });
                }}
                rows={field.key === "idea" ? 3 : 2}
                className={fieldClassName}
              />
            </label>
          ))}
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
