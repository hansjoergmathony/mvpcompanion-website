"use client";

import { useId, useState, type FormEvent, type RefObject } from "react";
import { Button } from "@/components/ui/Button";
import type { Dictionary } from "@/content/en";
import type { ProcessStage } from "@/content/framework";
import type { StageKey, StageState } from "@/lib/project/types";
import type { CompletenessReview } from "@/lib/completeness/types";
import {
  countCompletedTemplateFields,
  templateExampleByStage,
  templateFieldKey,
} from "@/lib/project/stageTemplate";

const fieldClassName =
  "mt-3 w-full resize-y rounded-md border border-border bg-card px-4 py-3 text-base leading-relaxed text-foreground placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue";
const ideaNameFieldClassName =
  "mt-3 w-full rounded-md border border-border bg-card px-4 py-3 text-base text-foreground placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue";

export type StageContextNote = {
  label: string;
  text: string;
};

type CoreQuestionsContent = {
  canonical: string;
  supporting: readonly string[];
};

type StageClarificationProps = {
  headingRef: RefObject<HTMLHeadingElement | null>;
  stage: ProcessStage;
  stageKey: StageKey;
  stageState: StageState;
  ideaTitle: string;
  focus: string | null;
  contextNotes: StageContextNote[];
  coreQuestions: CoreQuestionsContent;
  onChangeIdeaTitle: (value: string) => void;
  onChangeAnswer: (value: string) => void;
  onChangeTemplateField: (field: string, value: string) => void;
  onContinue: () => void;
  onPrevious: () => void;
  onBackToOverview: () => void;
  onOpenAiFeedbackBeta: () => void;
  isAdmin: boolean;
  isAiFeedbackLoading: boolean;
  aiFeedbackError: string | null;
  onRequestAiFeedback: () => void;
  completenessReview: CompletenessReview | null | undefined;
  isCompletenessReviewCurrent: boolean;
  isCompletenessReviewLoading: boolean;
  onRequestCompletenessReview: () => void;
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
  coreQuestions,
  onChangeIdeaTitle,
  onChangeAnswer,
  onChangeTemplateField,
  onContinue,
  onPrevious,
  onBackToOverview,
  onOpenAiFeedbackBeta,
  isAdmin,
  isAiFeedbackLoading,
  aiFeedbackError,
  onRequestAiFeedback,
  completenessReview,
  isCompletenessReviewCurrent,
  isCompletenessReviewLoading,
  onRequestCompletenessReview,
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

      <CoreQuestionsPanel
        content={coreQuestions}
        startContent={startContent}
      />

      <StageTemplate
        stageKey={stageKey}
        fields={coreQuestions.supporting}
        values={stageState.templateData}
        onChange={onChangeTemplateField}
        copy={startContent}
      />

      {feedback && hasFeedbackForCurrentAnswer ? (
        <FeedbackPanel feedback={feedback} startContent={startContent} />
      ) : null}

      {completenessReview ? (
        <CompletenessReviewPanel
          review={completenessReview}
          isCurrent={isCompletenessReviewCurrent}
          copy={startContent}
        />
      ) : null}

      <form className="mt-10" onSubmit={handleContinue} noValidate>
          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-muted">
              {startContent.stageDescriptionLabel}
            </span>
            <span className="mt-2 block text-sm leading-relaxed text-muted">
              {startContent.stageDescriptionHelp}
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
          {aiFeedbackError ? (
            <p className="mt-4 text-sm" role="alert">{aiFeedbackError}</p>
          ) : null}
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {isAdmin ? startContent.aiFeedbackPrivateNote : startContent.aiFeedbackBetaNote}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button type="submit">
              {startContent.saveAndContinue}
            </Button>
            {isAdmin ? (
              <Button
                type="button"
                variant="secondary"
                disabled={isCompletenessReviewLoading}
                onClick={onRequestCompletenessReview}
              >
                {isCompletenessReviewLoading
                  ? startContent.reviewingCompleteness
                  : startContent.reviewCompleteness}
              </Button>
            ) : null}
            {isAdmin ? (
              <Button
                type="button"
                variant="secondary"
                disabled={isAiFeedbackLoading}
                onClick={onRequestAiFeedback}
              >
                {isAiFeedbackLoading
                  ? startContent.runningAiFeedback
                  : startContent.runAiFeedback}
              </Button>
            ) : (
              <Button
                type="button"
                variant="secondary"
                onClick={onOpenAiFeedbackBeta}
              >
                {startContent.aiFeedbackBetaCta}
              </Button>
            )}
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

export function CompletenessReviewPanel({
  review,
  isCurrent,
  copy,
}: {
  review: CompletenessReview;
  isCurrent: boolean;
  copy: Pick<
    Dictionary["startContent"],
    | "reviewReady"
    | "reviewNeedsWork"
    | "reviewOutdated"
    | "reviewCriteria"
    | "reviewMissing"
    | "reviewContradictions"
    | "reviewNextStep"
  >;
}) {
  return (
    <section className="mt-8 rounded-lg border border-border bg-card p-5" aria-live="polite">
      <p className="text-xs uppercase tracking-[0.18em] text-muted">
        {isCurrent
          ? review.overall === "ready" ? copy.reviewReady : copy.reviewNeedsWork
          : copy.reviewOutdated}
      </p>
      <p className="mt-3 text-base leading-relaxed text-navy">{review.summary}</p>
      <h2 className="mt-6 text-sm font-semibold text-navy">{copy.reviewCriteria}</h2>
      <div className="mt-3 space-y-4">
        {review.criteria.map((criterion) => (
          <div key={criterion.criterion} className="border-l-2 border-border pl-3">
            <p className="text-sm font-medium text-navy">{criterion.criterion} · {criterion.status.replace("_", " ")}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{criterion.evidence}</p>
            {criterion.evidenceQuote ? (
              <blockquote className="mt-2 border-l-2 border-blue pl-3 text-sm leading-relaxed text-muted">
                “{criterion.evidenceQuote}”
              </blockquote>
            ) : null}
            {criterion.improvement ? <p className="mt-1 text-sm leading-relaxed text-muted">{criterion.improvement}</p> : null}
          </div>
        ))}
      </div>
      {review.missingInformation.length ? <ReviewList title={copy.reviewMissing} items={review.missingInformation} /> : null}
      {review.contradictions.length ? <ReviewList title={copy.reviewContradictions} items={review.contradictions} /> : null}
      <h2 className="mt-5 text-sm font-semibold text-navy">{copy.reviewNextStep}</h2>
      <p className="mt-1 text-sm leading-relaxed text-muted">{review.suggestedNextStep}</p>
    </section>
  );
}

function ReviewList({ title, items }: { title: string; items: string[] }) {
  return <><h2 className="mt-5 text-sm font-semibold text-navy">{title}</h2><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted">{items.map((item) => <li key={item}>{item}</li>)}</ul></>;
}

export function StageTemplate({
  stageKey,
  fields,
  values,
  onChange,
  copy,
}: {
  stageKey: StageKey;
  fields: readonly string[];
  values: Record<string, string> | undefined;
  onChange: (field: string, value: string) => void;
  copy: Pick<
    Dictionary["startContent"],
    | "guidedTemplateTitle"
    | "guidedTemplateIntro"
    | "guidedTemplateProgress"
    | "examplePrefix"
  >;
}) {
  const progress = countCompletedTemplateFields(fields, values);
  const example = templateExampleByStage[stageKey];

  return (
    <section className="mt-8 rounded-lg border border-border bg-card p-5" aria-labelledby={`${stageKey}-template-title`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 id={`${stageKey}-template-title`} className="text-base font-semibold text-navy">
            {copy.guidedTemplateTitle}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {copy.guidedTemplateIntro}
          </p>
        </div>
        <p className="text-sm text-muted" aria-live="polite">
          {copy.guidedTemplateProgress
            .replace("{filled}", String(progress.completed))
            .replace("{total}", String(progress.total))}
        </p>
      </div>
      <div className="mt-6 space-y-6">
        {fields.map((field, index) => {
          const key = templateFieldKey(index);
          return (
            <label key={key} className="block">
              <span className="text-sm font-medium leading-relaxed text-navy">{field}</span>
              <span className="mt-1 block text-xs leading-relaxed text-muted">
                {copy.examplePrefix} {example}
              </span>
              <textarea
                value={values?.[key] ?? ""}
                onChange={(event) => onChange(key, event.target.value)}
                rows={3}
                className={fieldClassName}
              />
            </label>
          );
        })}
      </div>
    </section>
  );
}

export function CoreQuestionsPanel({
  content,
  startContent,
}: {
  content: CoreQuestionsContent;
  startContent: Pick<
    Dictionary["startContent"],
    "coreQuestionsTitle" | "coreQuestionsIntro" | "coreQuestionsCompletionNote"
  >;
}) {
  return (
    <details className="group mt-8 rounded-lg border border-border bg-card">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-navy marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">
        <span>{startContent.coreQuestionsTitle}</span>
        <span
          aria-hidden="true"
          className="text-xl leading-none text-muted transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="border-t border-border px-5 py-5">
        <p className="text-sm leading-relaxed text-muted">
          {startContent.coreQuestionsIntro}
        </p>
        <p className="mt-4 text-lg leading-relaxed text-navy">{content.canonical}</p>
        <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-muted">
          {content.supporting.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ol>
        <p className="mt-5 text-sm leading-relaxed text-muted">
          {startContent.coreQuestionsCompletionNote}
        </p>
      </div>
    </details>
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

export function FeedbackPanel({
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
