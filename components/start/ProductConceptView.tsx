import type { RefObject } from "react";
import { AppEntryLinks } from "@/components/app/AppEntryLinks";
import { ClarificationPath } from "@/components/start/ClarificationPath";
import { SnapshotExportMenu } from "@/components/start/SnapshotExportMenu";
import { Button } from "@/components/ui/Button";
import { startContent } from "@/content/start";
import {
  getClarificationProgress,
  getIdeaTitle,
  getSnapshotStages,
} from "@/lib/project/ideaSnapshot";
import type { Idea } from "@/lib/project/types";
import type { ProductConcept } from "@/lib/clarification/types";

type ProductConceptViewProps = {
  headingRef: RefObject<HTMLHeadingElement | null>;
  idea: Idea;
  concept: ProductConcept;
  onEditConcept: () => void;
  onStartNew: () => void;
  editLabel?: string;
};

export function ProductConceptView({
  headingRef,
  idea,
  concept,
  onEditConcept,
  onStartNew,
  editLabel = startContent.editConceptCta,
}: ProductConceptViewProps) {
  const progress = getClarificationProgress(idea);
  const snapshotStages = getSnapshotStages(idea);

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

      <div className="mt-8 rounded-2xl border border-border bg-card px-6 py-5">
        <p className="text-xs uppercase tracking-[0.14em] text-muted">Idea name</p>
        <p className="text-xl font-semibold tracking-tight text-navy">
          {getIdeaTitle(idea)}
        </p>
        <dl className="mt-4 grid gap-3 text-sm text-muted sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-[0.14em]">Status</dt>
            <dd className="mt-1 text-foreground">{idea.status.replace("_", " ")}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.14em]">Clarification progress</dt>
            <dd className="mt-1 text-foreground">
              {progress.clarified} clarified · {progress.inProgress} in progress · {progress.unresolved} unresolved
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.14em]">Created</dt>
            <dd className="mt-1 text-foreground">{formatDate(idea.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.14em]">Updated</dt>
            <dd className="mt-1 text-foreground">{formatDate(idea.updatedAt)}</dd>
          </div>
        </dl>
      </div>

      <article
        aria-labelledby="idea-snapshot-artifact"
        className="mt-10 rounded-2xl border border-border bg-ice px-6 py-8 md:px-8"
      >
        <h2 id="idea-snapshot-artifact" className="sr-only">
          Idea Snapshot contents
        </h2>
        <ol className="space-y-8">
          {snapshotStages.map((stage, index) => (
            <li key={stage.key}>
              <h3 className="text-xs font-medium tracking-[0.18em] text-blue uppercase">
                {String(index + 1).padStart(2, "0")} {stage.label}
              </h3>
              <p className="mt-2 text-sm text-muted">
                {stage.status === "clarified"
                  ? "Clarified"
                  : stage.status === "in_progress"
                    ? "In progress"
                    : "Unresolved"}
              </p>
              <p className="mt-3 break-words text-base leading-relaxed text-navy">
                {stage.content}
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
        <SnapshotExportMenu idea={idea} />
        <Button type="button" variant="secondary" onClick={onEditConcept}>
          {editLabel}
        </Button>
        <Button type="button" variant="secondary" onClick={onStartNew}>
          {startContent.startNewCta}
        </Button>
        <Button href="/" variant="secondary">
          {startContent.backToHome}
        </Button>
      </div>

    </div>
  );
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Unknown" : date.toLocaleDateString();
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
