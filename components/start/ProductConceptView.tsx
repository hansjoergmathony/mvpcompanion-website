import type { RefObject } from "react";
import { AppEntryLinks } from "@/components/app/AppEntryLinks";
import { ClarificationPath } from "@/components/start/ClarificationPath";
import { Button } from "@/components/ui/Button";
import { startContent } from "@/content/start";
import type { ProductConcept } from "@/lib/clarification/types";

type ProductConceptViewProps = {
  headingRef: RefObject<HTMLHeadingElement | null>;
  concept: ProductConcept;
  confirmingReset: boolean;
  onEditConcept: () => void;
  onStartNew: () => void;
  onCancelReset: () => void;
  onConfirmReset: () => void;
};

function snapshotStageContent(
  id: (typeof startContent.ideaSnapshotStages)[number]["id"],
  concept: ProductConcept,
): string {
  switch (id) {
    case "idea":
      return concept.idea;
    case "problem":
      return concept.problem;
    case "user":
      return concept.primaryUser;
    case "value":
      return concept.valueProposition;
    case "product":
      return concept.product;
    case "context":
      return concept.lifecycle;
    default:
      return "";
  }
}

export function ProductConceptView({
  headingRef,
  concept,
  confirmingReset,
  onEditConcept,
  onStartNew,
  onCancelReset,
  onConfirmReset,
}: ProductConceptViewProps) {
  return (
    <div className="max-w-2xl">
      <ClarificationPath current={2} />
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mt-8 text-4xl leading-[1.1] font-semibold tracking-tight text-navy outline-none md:text-5xl"
      >
        {startContent.conceptHeadline}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-navy">
        {startContent.conceptIntro}
      </p>
      <p className="mt-3 text-base leading-relaxed text-muted">
        {startContent.conceptTagline}
      </p>

      <article
        aria-labelledby="idea-snapshot-artifact"
        className="mt-10 rounded-2xl border border-border bg-ice px-6 py-8 md:px-8"
      >
        <h2 id="idea-snapshot-artifact" className="sr-only">
          Idea Snapshot contents
        </h2>
        <ol className="space-y-8">
          {startContent.ideaSnapshotStages.map((stage) => (
            <li key={stage.id}>
              <h3 className="text-xs font-medium tracking-[0.18em] text-blue uppercase">
                {stage.number} {stage.label}
              </h3>
              <p className="mt-3 break-words text-base leading-relaxed text-navy">
                {snapshotStageContent(stage.id, concept)}
              </p>
            </li>
          ))}
        </ol>
      </article>

      {(concept.assumptions.length > 0 || concept.openQuestions.length > 0) && (
        <div className="mt-8 space-y-6 rounded-2xl border border-border bg-card px-6 py-8">
          {concept.assumptions.length > 0 ? (
            <section aria-labelledby="snapshot-assumptions">
              <h2
                id="snapshot-assumptions"
                className="text-sm font-semibold tracking-tight text-navy"
              >
                {startContent.assumptionsTitle}
              </h2>
              <ul className="mt-3 space-y-2">
                {concept.assumptions.map((item) => (
                  <li
                    key={item}
                    className="text-sm leading-relaxed text-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {concept.openQuestions.length > 0 ? (
            <section aria-labelledby="snapshot-open-questions">
              <h2
                id="snapshot-open-questions"
                className="text-sm font-semibold tracking-tight text-navy"
              >
                {startContent.openQuestionsTitle}
              </h2>
              <ul className="mt-3 space-y-2">
                {concept.openQuestions.map((item) => (
                  <li
                    key={item}
                    className="text-sm leading-relaxed text-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      )}

      <section aria-labelledby="snapshot-starting-point" className="mt-12">
        <h2
          id="snapshot-starting-point"
          className="text-xl font-semibold tracking-tight text-navy"
        >
          {startContent.startingPointTitle}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted">
          {startContent.startingPointBody}
        </p>
        <p className="mt-4 text-base font-medium leading-relaxed text-navy">
          {startContent.conceptDistinction}
        </p>
        <p className="mt-3 text-base leading-relaxed text-muted">
          {startContent.conceptAppBridge}
        </p>
        <p className="mt-4 text-base leading-relaxed text-muted">
          {startContent.startingPointExpectation}
        </p>
      </section>

      <section aria-labelledby="snapshot-what-clarified" className="mt-12">
        <h2
          id="snapshot-what-clarified"
          className="text-xl font-semibold tracking-tight text-navy"
        >
          {startContent.whatClarifiedTitle}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          {startContent.whatClarifiedIntro}
        </p>
        <ul className="mt-5 space-y-2">
          {startContent.whatClarifiedItems.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-base leading-relaxed text-muted"
            >
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="snapshot-what-next" className="mt-12">
        <h2
          id="snapshot-what-next"
          className="text-xl font-semibold tracking-tight text-navy"
        >
          {startContent.whatComesNextTitle}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted">
          {startContent.whatComesNextIntro}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {startContent.whatComesNextStages.join(" · ")}
        </p>
        <p className="mt-6 text-base leading-relaxed text-muted">
          {startContent.whatComesNextAppIntro}
        </p>
        <ul className="mt-4 space-y-2">
          {startContent.whatComesNextAppItems.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-base leading-relaxed text-muted"
            >
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm leading-relaxed text-muted">
          {startContent.optionalEntryNote}
        </p>
      </section>

      <section aria-labelledby="idea-snapshot-app-cta" className="mt-12">
        <h2
          id="idea-snapshot-app-cta"
          className="text-xl font-semibold tracking-tight text-navy"
        >
          {startContent.appContinueHeadline}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted">
          {startContent.appContinueSupporting}
        </p>
        <AppEntryLinks
          className="mt-6"
          directPrompt={startContent.appDirectPrompt}
        />
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button type="button" variant="secondary" onClick={onEditConcept}>
          {startContent.editConceptCta}
        </Button>
        <Button type="button" variant="secondary" onClick={onStartNew}>
          {startContent.startNewCta}
        </Button>
        <Button href="/" variant="secondary">
          {startContent.backToHome}
        </Button>
      </div>

      {confirmingReset ? (
        <div
          className="mt-8 max-w-xl"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="concept-reset-title"
        >
          <p id="concept-reset-title" className="text-base leading-relaxed">
            {startContent.replaceConfirm}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button type="button" onClick={onConfirmReset}>
              {startContent.replaceConfirmAction}
            </Button>
            <Button type="button" variant="secondary" onClick={onCancelReset}>
              {startContent.keepCurrentAction}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

type MvpPlaceholderViewProps = {
  headingRef: RefObject<HTMLHeadingElement | null>;
  onBackToConcept: () => void;
};

export function MvpPlaceholderView({
  headingRef,
  onBackToConcept,
}: MvpPlaceholderViewProps) {
  return (
    <div className="max-w-2xl">
      <ClarificationPath current={2} />
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mt-8 text-4xl leading-[1.1] font-semibold tracking-tight text-navy outline-none md:text-5xl"
      >
        {startContent.mvpHeadline}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-muted">
        {startContent.mvpSupporting}
      </p>
      <AppEntryLinks className="mt-8" directPrompt={startContent.appDirectPrompt} />
      <div className="mt-10 flex flex-wrap gap-3">
        <Button type="button" onClick={onBackToConcept}>
          {startContent.mvpBackToConcept}
        </Button>
        <Button href="/" variant="secondary">
          {startContent.backToHome}
        </Button>
      </div>
    </div>
  );
}
