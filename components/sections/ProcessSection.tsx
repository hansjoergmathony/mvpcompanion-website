import { processContent } from "@/content/homepage";
import { ProcessStagesList } from "@/components/sections/ProcessStagesList";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EvolvingSpecificationVisual } from "@/components/visuals/EvolvingSpecificationVisual";

export function ProcessSection() {
  return (
    <Section id="process" tone="ice">
      <SectionHeading
        eyebrow={processContent.eyebrow}
        title={processContent.headline}
        description={processContent.introduction}
      />

      <p className="mt-6 max-w-3xl text-lg font-semibold leading-relaxed text-navy">
        {processContent.mapLead}
      </p>
      <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted">
        {processContent.mapSupporting}
      </p>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">
        {processContent.progressionNote}
      </p>

      <div className="mt-10 border-t border-border pt-8">
        <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
          {processContent.stagesLabel}
        </p>
      </div>
      <ProcessStagesList />

      <div className="mt-12 max-w-3xl rounded-2xl border border-border bg-card px-6 py-6">
        <h3 className="text-lg font-semibold tracking-tight text-navy">
          {processContent.iterativeTitle}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-muted">
          {processContent.iterativeSupporting}
        </p>
      </div>

      <div className="mt-14 border-t border-border pt-10">
        <div className="max-w-3xl space-y-4">
          <h3 className="text-xl font-semibold tracking-tight text-navy">
            {processContent.bringToLifeTitle}
          </h3>
          <p className="text-base leading-relaxed text-muted">
            {processContent.bringToLifeSupporting}
          </p>
          <p className="text-base leading-relaxed text-muted">
            {processContent.bringToLifeChallenge}
          </p>
          <p className="text-base font-medium leading-relaxed text-navy">
            {processContent.keyMessageLead}
          </p>
          <p className="text-base leading-relaxed text-muted">
            {processContent.keyMessageFollow}
          </p>
        </div>

        <ol className="mt-8 flex flex-col lg:flex-row lg:items-stretch">
          {processContent.appExperienceSteps.map((step, index) => (
            <li
              key={step}
              className="flex flex-col lg:flex-1 lg:flex-row lg:items-center"
            >
              <article className="flex-1 rounded-xl border border-border bg-card px-4 py-4">
                <p className="text-sm font-semibold tracking-tight text-navy">
                  {step}
                </p>
              </article>
              {index < processContent.appExperienceSteps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="py-2 text-center text-sm text-blue lg:px-3 lg:py-0"
                >
                  <span className="lg:hidden">↓</span>
                  <span className="hidden lg:inline">→</span>
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-14 border-t border-border pt-10">
        <h3 className="text-xs font-medium tracking-[0.18em] text-blue uppercase">
          {processContent.specificationTitle}
        </h3>
        <p className="mt-4 max-w-3xl text-lg font-semibold leading-relaxed text-navy">
          {processContent.distinctionLead}
        </p>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted">
          {processContent.distinctionFollow}
        </p>

        <EvolvingSpecificationVisual />

        <div className="mt-12 max-w-3xl space-y-4">
          <h3 className="text-xl font-semibold tracking-tight text-navy">
            {processContent.growsHeadline}
          </h3>
          <p className="text-base leading-relaxed text-muted">
            {processContent.growsSupporting}
          </p>
          <p className="text-base leading-relaxed text-muted">
            {processContent.growsClosing}
          </p>
          <p className="text-base leading-relaxed text-muted">
            <span className="font-medium text-navy">
              {processContent.journeyLead}
            </span>{" "}
            {processContent.journeyFollow}
          </p>
          <p className="text-sm leading-relaxed text-muted">
            {processContent.appNote}
          </p>
        </div>
      </div>
    </Section>
  );
}
