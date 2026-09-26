"use client";

import { useId, useState, type FormEvent, type RefObject } from "react";
import { Button } from "@/components/ui/Button";
import { startContent } from "@/content/start";
import { interpretAnswer } from "@/lib/clarification";
import type { ProcessStage } from "@/content/process";
import type { StageKey, StageState, StartingContext } from "@/lib/project/types";

const fieldClassName =
  "mt-3 w-full resize-y rounded-md border border-border bg-card px-4 py-3 text-base leading-relaxed text-foreground placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue";

export type StageContextNote = {
  label: string;
  text: string;
};

type StageClarificationProps = {
  headingRef: RefObject<HTMLHeadingElement | null>;
  stage: ProcessStage;
  stageKey: StageKey;
  stageState: StageState;
  startingContext: StartingContext;
  focus: string | null;
  contextNotes: StageContextNote[];
  relatedAnswers: Partial<Record<StageKey, string>>;
  onChangeAnswer: (value: string) => void;
  onSubmitFeedback: (next: StageState) => void;
  onContinue: () => void;
  onPrevious: () => void;
};

export function StageClarification({
  headingRef,
  stage,
  stageKey,
  stageState,
  startingContext,
  focus,
  contextNotes,
  relatedAnswers,
  onChangeAnswer,
  onSubmitFeedback,
  onContinue,
  onPrevious,
}: StageClarificationProps) {
  const [answerError, setAnswerError] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const answerErrorId = useId();
  const feedback = stageState.feedback ?? null;
  const hasReviewedAnswer =
    Boolean(feedback) &&
    stageState.submittedAnswer === stageState.answer.trim() &&
    !isRefining;

  function handleReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const answer = stageState.answer.trim();

    if (!answer) {
      setAnswerError(true);
      return;
    }

    const nextFeedback = interpretAnswer({
      stageKey,
      stageName: stage.name,
      question: stage.question,
      purpose: stage.purpose,
      answer,
      startingContext,
      relatedAnswers,
    });

    setAnswerError(false);
    setIsRefining(false);
    onSubmitFeedback({
      answer,
      submittedAnswer: answer,
      feedback: nextFeedback,
    });
  }

  return (
    <div>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-4xl leading-[1.1] font-semibold tracking-tight text-navy outline-none md:text-5xl"
      >
        {stage.name}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-muted">{stage.question}</p>
      {focus ? (
        <p className="mt-4 text-base leading-relaxed text-muted">{focus}</p>
      ) : null}

      {contextNotes.length ? (
        <div className="mt-8 border-t border-border pt-6">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            {contextNotes[0]?.label === startContent.intakeLabel
              ? startContent.intakeLabel
              : startContent.soFarLabel}
          </p>
          {contextNotes.map((note) => (
            <div key={`${note.label}-${note.text}`} className="mt-5">
              {note.label !== startContent.intakeLabel ? (
                <p className="text-xs uppercase tracking-[0.18em] text-muted">
                  {note.label}
                </p>
              ) : null}
              <p
                className={
                  note.label === startContent.intakeLabel
                    ? "mt-3 text-base leading-relaxed text-muted"
                    : "mt-2 break-words text-base leading-relaxed text-muted"
                }
              >
                {note.text}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {feedback && (hasReviewedAnswer || isRefining) ? (
        <FeedbackPanel feedback={feedback} />
      ) : null}

      {hasReviewedAnswer && feedback ? (
        <div className="mt-8">
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={onContinue}>
              {startContent.confirmLabel}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsRefining(true)}
            >
              {startContent.refineLabel}
            </Button>
          </div>
          <div className="mt-4">
            <Button type="button" variant="secondary" onClick={onPrevious}>
              {startContent.previousLabel}
            </Button>
          </div>
        </div>
      ) : (
        <form className="mt-10" onSubmit={handleReview} noValidate>
          <label className="block">
            <span className="sr-only">{stage.question}</span>
            <textarea
              value={stageState.answer}
              aria-invalid={answerError}
              aria-describedby={answerError ? answerErrorId : undefined}
              onChange={(event) => {
                setAnswerError(false);
                onChangeAnswer(event.target.value);
              }}
              rows={6}
              className={fieldClassName}
            />
          </label>
          {answerError ? (
            <p id={answerErrorId} className="mt-4 text-sm" role="alert">
              {startContent.stageAnswerError}
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button type="submit">{startContent.reviewLabel}</Button>
            <Button type="button" variant="secondary" onClick={onPrevious}>
              {startContent.previousLabel}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

function FeedbackPanel({
  feedback,
}: {
  feedback: NonNullable<StageState["feedback"]>;
}) {
  return (
    <div className="mt-12 border-t border-border pt-10">
      <p className="text-xs uppercase tracking-[0.18em] text-muted">
        {startContent.hearingLabel}
      </p>
          <p className="mt-4 break-words text-xl leading-snug tracking-tight">
            {feedback.summary}
          </p>
      {feedback.observations.map((observation) => (
        <p
          key={observation}
          className="mt-4 text-base leading-relaxed text-muted"
        >
          {observation}
        </p>
      ))}

      {feedback.frames?.length ? (
        <div className="mt-10 space-y-6">
          {feedback.frames.map((frame) => (
            <div key={`${frame.label}-${frame.text}`}>
              <p className="text-xs uppercase tracking-[0.18em] text-muted">
                {frame.label}
              </p>
              <p className="mt-3 text-base leading-relaxed">{frame.text}</p>
            </div>
          ))}
        </div>
      ) : null}

      {feedback.assumptions?.length ? (
        <div className="mt-10">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            {startContent.assumptionsLabel}
          </p>
          {feedback.assumptions.map((assumption) => (
            <p
              key={assumption}
              className="mt-3 text-base leading-relaxed text-muted"
            >
              {assumption}
            </p>
          ))}
        </div>
      ) : null}

      {feedback.uncertainties[0] ? (
        <div className="mt-10">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            {startContent.unclearLabel}
          </p>
          <p className="mt-4 text-base leading-relaxed">
            {feedback.uncertainties[0]}
          </p>
          {feedback.suggestions[0] ? (
            <p className="mt-4 text-base leading-relaxed text-muted">
              {feedback.suggestions[0]}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
