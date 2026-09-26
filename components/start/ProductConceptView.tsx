import type { RefObject } from "react";
import { ClarificationPath } from "@/components/start/ClarificationPath";
import { Button } from "@/components/ui/Button";
import { startContent } from "@/content/start";
import type { ProductConcept } from "@/lib/clarification/types";

type ProductConceptViewProps = {
  headingRef: RefObject<HTMLHeadingElement | null>;
  concept: ProductConcept;
  confirmingReset: boolean;
  onDefineMvp: () => void;
  onEditConcept: () => void;
  onStartNew: () => void;
  onCancelReset: () => void;
  onConfirmReset: () => void;
};

export function ProductConceptView({
  headingRef,
  concept,
  confirmingReset,
  onDefineMvp,
  onEditConcept,
  onStartNew,
  onCancelReset,
  onConfirmReset,
}: ProductConceptViewProps) {
  const bodies: Record<
    (typeof startContent.conceptSections)[number]["id"],
    string | string[]
  > = {
    idea: concept.idea,
    problem: concept.problem,
    primaryUser: concept.primaryUser,
    desiredOutcome: concept.desiredOutcome,
    valueProposition: concept.valueProposition,
    product: concept.product,
    lifecycle: concept.lifecycle,
    assumptions: concept.assumptions,
    openQuestions: concept.openQuestions,
  };

  return (
    <div className="max-w-2xl">
      <ClarificationPath current={2} />
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mt-8 text-4xl leading-[1.1] tracking-tight outline-none md:text-5xl"
      >
        {startContent.conceptHeadline}
      </h1>
      <p className="mt-6 text-lg leading-relaxed">{startContent.conceptUnderstood}</p>
      <p className="mt-4 text-base leading-relaxed text-muted">
        {startContent.conceptDistinction}
      </p>

      <ol className="mt-14 border-t border-border">
        {startContent.conceptSections.map((section) => {
          const body = bodies[section.id];

          return (
            <li key={section.id} className="border-b border-border py-8">
              <h2 className="text-xs uppercase tracking-[0.18em] text-muted">
                {section.title}
              </h2>
              {Array.isArray(body) ? (
                <ul className="mt-4 space-y-3">
                  {body.map((item) => (
                    <li key={item} className="break-words text-base leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 break-words text-base leading-relaxed">{body}</p>
              )}
            </li>
          );
        })}
      </ol>

      <p className="mt-12 text-lg leading-relaxed">{startContent.conceptNext}</p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button type="button" onClick={onDefineMvp}>
          {startContent.defineMvpCta}
        </Button>
        <Button type="button" variant="secondary" onClick={onEditConcept}>
          {startContent.editConceptCta}
        </Button>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
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
      <ClarificationPath current={3} />
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mt-8 text-4xl leading-[1.1] tracking-tight outline-none md:text-5xl"
      >
        {startContent.mvpHeadline}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-muted">
        {startContent.mvpSupporting}
      </p>
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
