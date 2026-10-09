"use client";

import { useId, useState, type FormEvent, type RefObject } from "react";
import { Button } from "@/components/ui/Button";
import type { Dictionary } from "@/content/en";
import type { ProcessStage } from "@/content/framework";
import type { StageKey, StageState } from "@/lib/project/types";

const fieldClassName =
  "mt-3 w-full resize-y rounded-md border border-border bg-card px-4 py-3 text-base leading-relaxed text-foreground placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue";
const ideaNameFieldClassName =
  "mt-3 w-full rounded-md border border-border bg-card px-4 py-3 text-base text-foreground placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue";

export type StageContextNote = {
  label: string;
  text: string;
};

type StageClarificationProps = {
  headingRef: RefObject<HTMLHeadingElement | null>;
  stage: ProcessStage;
  stageKey: StageKey;
  stageState: StageState;
  ideaTitle: string;
  focus: string | null;
  contextNotes: StageContextNote[];
  onChangeIdeaTitle: (value: string) => void;
  onChangeAnswer: (value: string) => void;
  onContinue: () => void;
  onPrevious: () => void;
  onBackToOverview: () => void;
  onOpenAiFeedbackBeta: () => void;
  startContent: Dictionary["startContent"];
};

export function StageClarification({
  headingRef,
  stage,
  stageKey,
  stageState,
  ideaTitle,
  focus,
  contextNotes,
  onChangeIdeaTitle,
  onChangeAnswer,
  onContinue,
  onPrevious,
  onBackToOverview,
  onOpenAiFeedbackBeta,
  startContent,
}: StageClarificationProps) {
  const [answerError, setAnswerError] = useState(false);
  const answerErrorId = useId();
  const feedback = stageState.feedback ?? null;
  const canReturnToPrevious = stageKey !== "idea";
  const showsStartingContext = contextNotes[0]?.label === startContent.intakeLabel;
  const hasFeedbackForCurrentAnswer =
    Boolean(feedback) &&
    stageState.submittedAnswer === stageState.answer.trim();

  function handleContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!stageState.answer.trim()) {
      setAnswerError(true);
      return;
    }

    setAnswerError(false);
    onContinue();
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

      {!showsStartingContext ? (
        <IdeaNameField
          value={ideaTitle}
          onChange={onChangeIdeaTitle}
          startContent={startContent}
        />
      ) : null}

      {contextNotes.length ? (
        <div className="mt-8 border-t border-border pt-6">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            {showsStartingContext
              ? startContent.intakeLabel
              : startContent.soFarLabel}
          </p>
          {showsStartingContext ? (
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {startContent.startingContextDescription}
            </p>
          ) : null}
          {showsStartingContext ? (
            <IdeaNameField
          value={ideaTitle}
          onChange={onChangeIdeaTitle}
          startContent={startContent}
        />
          ) : null}
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

      {feedback && hasFeedbackForCurrentAnswer ? (
        <FeedbackPanel feedback={feedback} startContent={startContent} />
      ) : null}

      <form className="mt-10" onSubmit={handleContinue} noValidate>
          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-muted">
              {startContent.answerLabel}
            </span>
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
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {startContent.aiFeedbackBetaNote}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button type="submit">
              {startContent.saveAndContinue}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onOpenAiFeedbackBeta}
            >
              {startContent.aiFeedbackBetaCta}
            </Button>
            {canReturnToPrevious ? (
              <Button type="button" variant="secondary" onClick={onPrevious}>
                {startContent.previousLabel}
              </Button>
            ) : null}
            <Button type="button" variant="secondary" onClick={onBackToOverview}>
              {startContent.backToOverview}
            </Button>
          </div>
      </form>
    </div>
  );
}

function IdeaNameField({
  value,
  onChange,
  startContent,
}: {
  value: string;
  onChange: (value: string) => void;
  startContent: Dictionary["startContent"];
}) {
  return (
    <label className="mt-6 block">
      <span className="text-xs uppercase tracking-[0.18em] text-muted">
        {startContent.ideaNameLabel}
      </span>
      <input
        name="title"
        type="text"
        value={value}
        placeholder={startContent.ideaNamePlaceholder}
        onChange={(event) => onChange(event.target.value)}
        className={ideaNameFieldClassName}
      />
    </label>
  );
}

function FeedbackPanel({
  feedback,
  startContent,
}: {
  feedback: NonNullable<StageState["feedback"]>;
  startContent: Dictionary["startContent"];
}) {
  return (
    <div className="mt-12 border-t border-border pt-10">
      <p className="text-sm leading-relaxed text-muted">{startContent.aiHypothesisNote}</p>
      <p className="mt-6 text-xs uppercase tracking-[0.18em] text-muted">
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

      {feedback.uncertainties.length ? (
        <div className="mt-10">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            {startContent.unclearLabel}
          </p>
          {feedback.uncertainties.map((uncertainty) => (
            <p key={uncertainty} className="mt-4 text-base leading-relaxed">
              {uncertainty}
            </p>
          ))}
        </div>
      ) : null}

      {feedback.suggestions.length ? (
        <div className="mt-10">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            {startContent.openQuestionsLabel}
          </p>
          <ul className="mt-4 list-disc space-y-3 pl-5 text-base leading-relaxed text-muted">
            {feedback.suggestions.map((suggestion) => (
              <li key={suggestion}>{suggestion}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
