"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { AppEntryLinks } from "@/components/app/AppEntryLinks";
import { startContent } from "@/content/start";
import { useProject } from "@/lib/project/useProject";

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
}: StartCallToActionProps) {
  const router = useRouter();
  const { isReady, isResumable, isCompleted, project, discardProject } =
    useProject();
  const [confirming, setConfirming] = useState(false);

  const showContinue = isReady && isResumable;
  const viewingConcept = isCompleted && project?.currentStage !== "mvp";
  const headline = !showContinue
    ? defaultHeadline
    : viewingConcept
      ? startContent.viewConceptHeadline
      : startContent.continueHeadline;
  const supporting = !showContinue
    ? defaultSupporting
    : viewingConcept
      ? startContent.viewConceptSupporting
      : startContent.continueSupporting;
  const primaryLabel = viewingConcept
    ? startContent.viewConceptCta
    : startContent.continueCta;
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

  function handleReplace() {
    discardProject();
    setConfirming(false);
    router.push("/start");
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
                onClick={() => setConfirming(true)}
              >
                {startContent.startNewCta}
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
        <AppEntryLinks inverted={inverted} className="mt-8" />
      ) : null}
      {confirming ? (
        <div
          className="mt-8 max-w-xl"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="replace-idea-title"
        >
          <p
            id="replace-idea-title"
            className={`text-base leading-relaxed ${inverted ? "text-white/85" : ""}`}
          >
            {startContent.replaceConfirm}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button type="button" variant={primaryVariant} onClick={handleReplace}>
              {startContent.replaceConfirmAction}
            </Button>
            <Button
              type="button"
              variant={secondaryVariant}
              onClick={() => setConfirming(false)}
            >
              {startContent.keepCurrentAction}
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
