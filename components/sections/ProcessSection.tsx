import { processContent } from "@/content/homepage";
import { ProcessStagesList } from "@/components/sections/ProcessStagesList";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EvolvingSpecificationVisual } from "@/components/visuals/EvolvingSpecificationVisual";
import { ProcessOverview } from "@/components/visuals/ProcessOverview";

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

      <p className="mt-10 text-xs font-medium tracking-[0.18em] text-blue uppercase">
        {processContent.phasesLabel}
      </p>
      <div className="mt-5">
        <ProcessOverview />
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {processContent.layers.map((layer) => (
          <article
            key={layer.id}
            className="rounded-2xl border border-border bg-card px-5 py-6"
          >
            <p className="text-xs font-medium tracking-[0.18em] text-blue uppercase">
              {layer.label}
            </p>
            <h3 className="mt-3 text-base font-semibold tracking-tight text-navy">
              {layer.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {layer.detail}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-12 max-w-3xl space-y-4">
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

      <div className="mt-12 max-w-3xl rounded-2xl border border-border bg-card px-6 py-6">
        <h3 className="text-lg font-semibold tracking-tight text-navy">
          {processContent.iterativeTitle}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-muted">
          {processContent.iterativeSupporting}
        </p>
      </div>

      <div className="mt-14 border-t border-border pt-10">
        <p className="mt-0 max-w-3xl text-lg font-semibold leading-relaxed text-navy">
          {processContent.distinction}
        </p>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted">
          {processContent.evolveTagline}
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

      <div className="mt-14 border-t border-border pt-10">
        <p className="text-2xl leading-snug font-semibold tracking-tight text-navy md:text-3xl">
          {processContent.principle}
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          {processContent.detailIntro}
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          {processContent.note}
        </p>

        <div className="mt-10 border-t border-border pt-8">
          <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
            {processContent.stagesLabel}
          </p>
        </div>

        <ProcessStagesList />
      </div>
    </Section>
  );
}
