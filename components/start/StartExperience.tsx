"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ClarificationPath } from "@/components/start/ClarificationPath";
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
  type ProjectStages,
  type StageKey,
  type StageState,
} from "@/lib/project/types";
import { useProject } from "@/lib/project/useProject";

const implementedStages = getImplementedStages();

function confirmStage(stages: ProjectStages, key: StageKey): ProjectStages {
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

export function StartExperience() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const errorId = useId();
  const { project, isReady, updateProject, discardProject } = useProject();
  const [intakeError, setIntakeError] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);

  const currentStage = project?.currentStage ?? "intake";
  const startingContext = project?.startingContext ?? emptyIntakeValues;
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
    updateProject((current) => ({
      ...current,
      startingContext: values,
      status: current.status === "in_progress" ? "in_progress" : "new",
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
    updateProject((current) => ({
      ...current,
      startingContext: nextContext,
      stages: seedEmptyStageAnswers(current.stages, nextContext),
      currentStage: "idea",
      status: "in_progress",
    }));
  }

  function goToPreviousStage() {
    if (!currentStageKey || currentStageKey === "idea") {
      updateProject((current) => ({
        ...current,
        currentStage: "intake",
      }));
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

    updateProject((current) => ({
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
      updateProject((current) => ({
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

    updateProject((current) => ({
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

    updateProject((current) => ({
      ...current,
      stages: {
        ...current.stages,
        [currentStageKey]: {
          ...current.stages[currentStageKey],
          answer: value,
        },
      },
      status: "in_progress",
    }));
  }

  function submitStageFeedback(next: StageState) {
    if (!currentStageKey) {
      return;
    }

    updateProject((current) => ({
      ...current,
      stages: {
        ...current.stages,
        [currentStageKey]: next,
      },
      status: "in_progress",
    }));
  }

  function relatedAnswers() {
    if (!project) {
      return {};
    }

    return Object.fromEntries(
      stageKeys
        .filter((key) => key !== currentStageKey)
        .map((key) => {
          const stage = project.stages[key];
          const clarified = stage.feedback?.summary?.trim() || stage.answer.trim();
          return [key, clarified];
        }),
    ) as Partial<Record<StageKey, string>>;
  }

  function contextNotes() {
    if (!project || !currentProcessStage) {
      return [];
    }

    if (currentProcessStage.number === 1) {
      const idea = project.startingContext.idea.trim();
      return idea
        ? [{ label: startContent.intakeLabel, text: idea }]
        : [];
    }

    return getPriorStageKeys(currentProcessStage.number).flatMap((key) => {
      const stage = project.stages[key];
      const text = (stage.feedback?.summary || stage.answer).trim();

      return text ? [{ label: priorStageLabel[key], text }] : [];
    });
  }

  function resetProject() {
    discardProject();
    setIntakeError(false);
    setConfirmingReset(false);
  }

  if (!isReady) {
    return <div className="min-h-[24rem]" aria-busy="true" />;
  }

  if (currentStage === "mvp") {
    return (
      <MvpPlaceholderView
        headingRef={headingRef}
        onBackToConcept={() => {
          updateProject((current) => ({
            ...current,
            currentStage: "summary",
            status: "completed",
          }));
        }}
      />
    );
  }

  if (currentStage === "summary" && project) {
    return (
      <ProductConceptView
        headingRef={headingRef}
        concept={buildProductConcept(project)}
        confirmingReset={confirmingReset}
        onEditConcept={() => {
          updateProject((current) => ({
            ...current,
            currentStage: "idea",
            status: "in_progress",
          }));
        }}
        onStartNew={() => setConfirmingReset(true)}
        onCancelReset={() => setConfirmingReset(false)}
        onConfirmReset={resetProject}
      />
    );
  }

  if (currentProcessStage && currentStageKey) {
    return (
      <div className="max-w-2xl">
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
            key={currentStageKey}
            headingRef={headingRef}
            stage={currentProcessStage}
            stageKey={currentStageKey}
            stageState={
              project?.stages[currentStageKey] ?? {
                answer: "",
              }
            }
            startingContext={startingContext}
            focus={getStageFocus(currentProcessStage.number)}
            contextNotes={contextNotes()}
            relatedAnswers={relatedAnswers()}
            onChangeAnswer={updateCurrentAnswer}
            onSubmitFeedback={submitStageFeedback}
            onContinue={goToNextStage}
            onPrevious={goToPreviousStage}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
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
  );
}
