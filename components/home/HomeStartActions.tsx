"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { AppEntryLinks } from "@/components/app/AppEntryLinks";
import type { Dictionary } from "@/content/en";
import { localeFromPathname, localizePath } from "@/lib/i18n/paths";
import { useIdeaLibrary } from "@/lib/project/useProject";

type StartCallToActionProps = {
  variant: "hero" | "final";
  inverted?: boolean;
  defaultHeadline?: string;
  defaultSupporting: string;
  defaultPrimaryLabel: string;
  defaultSecondaryLabel: string;
  defaultSecondaryHref: string;
  defaultDetail?: string;
  defaultSnapshotNote?: string;
  showAppEntry?: boolean;
  resume: Pick<
    Dictionary["startContent"],
    | "viewConceptHeadline"
    | "viewConceptSupporting"
    | "viewConceptCta"
    | "continueHeadline"
    | "continueSupporting"
    | "continueCta"
    | "startNewCta"
  >;
  appEntry: Dictionary["appEntry"];
};

export function StartCallToAction({
  variant,
  inverted = false,
  defaultHeadline,
  defaultSupporting,
  defaultPrimaryLabel,
  defaultSecondaryLabel,
  defaultSecondaryHref,
  defaultDetail,
  defaultSnapshotNote,
  showAppEntry = false,
  resume,
  appEntry,
}: StartCallToActionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isReady, isResumable, isCompleted, activeIdea, createIdea } =
    useIdeaLibrary();

  const showContinue = isReady && isResumable;
  const viewingConcept = isCompleted && activeIdea?.currentStage !== "mvp";
  const headline = !showContinue
    ? defaultHeadline
    : viewingConcept
      ? resume.viewConceptHeadline
      : resume.continueHeadline;
  const supporting = !showContinue
    ? defaultSupporting
    : viewingConcept
      ? resume.viewConceptSupporting
      : resume.continueSupporting;
  const primaryLabel = viewingConcept
    ? resume.viewConceptCta
    : resume.continueCta;
  const headlineClassName = inverted
    ? "text-4xl leading-[1.1] font-semibold tracking-tight text-white md:text-5xl"
    : "text-4xl leading-[1.1] font-semibold tracking-tight text-navy md:text-5xl";
  const supportingClassName =
    variant === "final"
      ? inverted
        ? "mt-6 text-xl leading-relaxed text-white/70"
        : "mt-6 text-xl leading-relaxed text-muted"
      : inverted
        ? "max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl"
        : "max-w-2xl text-lg leading-relaxed text-muted md:text-xl";
  const primaryVariant = inverted ? "inverse" : "primary";
  const secondaryVariant = inverted ? "inverseSecondary" : "secondary";

  function handleCreateIdea() {
    createIdea();
    router.push(localizePath("/start", localeFromPathname(pathname)));
  }

  return (
    <>
      {variant === "final" && headline ? (
        <h2 className={headlineClassName}>{headline}</h2>
      ) : null}
      <p className={supportingClassName}>{supporting}</p>
      {variant === "final" && defaultDetail && !showContinue ? (
        <p
          className={
            inverted
              ? "mt-4 max-w-2xl text-base leading-relaxed text-white/65"
              : "mt-4 max-w-2xl text-base leading-relaxed text-muted"
          }
        >
          {defaultDetail}
        </p>
      ) : null}
      {variant === "final" && defaultSnapshotNote && !showContinue ? (
        <p
          className={
            inverted
              ? "mt-3 max-w-2xl text-sm leading-relaxed text-white/55"
              : "mt-3 max-w-2xl text-sm leading-relaxed text-muted"
          }
        >
          {defaultSnapshotNote}
        </p>
      ) : null}
      {isReady ? (
        <div className="mt-10 flex flex-wrap gap-3">
          {showContinue ? (
            <>
              <Button href="/start" variant={primaryVariant}>
                {primaryLabel}
              </Button>
              <Button
                type="button"
                variant={secondaryVariant}
                onClick={handleCreateIdea}
              >
                {resume.startNewCta}
              </Button>
            </>
          ) : (
            <>
              <Button href="/start" variant={primaryVariant}>
                {defaultPrimaryLabel}
              </Button>
              <Button href={defaultSecondaryHref} variant={secondaryVariant}>
                {defaultSecondaryLabel}
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="mt-10 min-h-[3.25rem]" aria-hidden="true" />
      )}
      {showAppEntry && !showContinue ? (
        <AppEntryLinks appEntry={appEntry} inverted={inverted} className="mt-8" />
      ) : null}
    </>
  );
}
