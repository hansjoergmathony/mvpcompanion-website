import {
  formatPhaseStages,
  getStagesForPhase,
  processPhases,
} from "@/content/process";
import { processContent } from "@/content/homepage";

export function EvolvingSpecificationVisual() {
  return (
    <figure className="mt-10">
      <figcaption className="sr-only">
        The five-phase method map continuously builds one evolving MVP
        Specification through fifteen connected stages, culminating in an
        Integrated MVP Specification.
      </figcaption>

      {/* Desktop: process column + growing document */}
      <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10 lg:items-start">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-navy">
            {processContent.processColumnTitle}
          </h3>
          <ol className="mt-5 space-y-4">
            {processPhases.map((phase) => (
              <li key={phase.id} className="relative">
                <div className="rounded-xl border border-border bg-card px-5 py-4">
                  <p className="text-[11px] font-medium tracking-[0.16em] text-blue uppercase">
                    {phase.number} {phase.name}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {formatPhaseStages(phase)}
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 -right-5 hidden w-5 -translate-y-1/2 text-blue lg:block"
                >
                  →
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-tight text-navy">
            {processContent.specColumnTitle}
          </h3>
          <EvolvingSpecDocument className="mt-5 lg:sticky lg:top-28" />
        </div>
      </div>

      {/* Mobile: phase blocks with incremental spec growth */}
      <ol className="space-y-8 lg:hidden">
        {processPhases.map((phase, phaseIndex) => {
          const stages = getStagesForPhase(phase);

          return (
            <li key={phase.id}>
              <div className="rounded-xl border border-border bg-card px-5 py-4">
                <p className="text-[11px] font-medium tracking-[0.16em] text-blue uppercase">
                  {phase.number} {phase.name}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {formatPhaseStages(phase)}
                </p>
              </div>
              <p
                aria-hidden="true"
                className="my-3 text-center text-sm text-blue"
              >
                ↓
              </p>
              <div className="rounded-xl border border-border bg-white px-5 py-4">
                <p className="text-[11px] font-medium tracking-[0.16em] text-muted uppercase">
                  {processContent.mobileSpecGrowLabel}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {stages.map((stage) => (
                    <li
                      key={stage.number}
                      className="text-sm leading-relaxed text-navy"
                    >
                      {phaseIndex > 0 ? (
                        <span className="text-teal">+ </span>
                      ) : null}
                      {stage.name}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
        <li>
          <IntegratedSpecFooter />
        </li>
      </ol>

      <div className="mt-8 hidden lg:block">
        <IntegratedSpecFooter />
      </div>
    </figure>
  );
}

function EvolvingSpecDocument({ className = "" }: { className?: string }) {
  return (
    <article
      className={`overflow-hidden rounded-2xl border-2 border-navy/15 bg-white shadow-sm shadow-navy/5 ${className}`}
    >
      <header className="border-b border-border bg-ice px-5 py-3">
        <p className="text-[11px] font-medium tracking-[0.18em] text-blue uppercase">
          {processContent.specDocumentLabel}
        </p>
      </header>
      <div className="px-5 py-4">
        {processPhases.map((phase, phaseIndex) => {
          const stages = getStagesForPhase(phase);

          return (
            <div
              key={phase.id}
              className={`border-l-2 border-blue/35 pl-4 ${
                phaseIndex > 0 ? "mt-5" : ""
              }`}
            >
              <p className="text-[10px] font-medium tracking-[0.14em] text-muted uppercase">
                {processContent.specPhaseAdded} · {phase.name}
              </p>
              <ul className="mt-2 space-y-1">
                {stages.map((stage) => (
                  <li
                    key={stage.number}
                    className="text-sm leading-relaxed text-navy"
                  >
                    {phaseIndex > 0 ? (
                      <span className="font-medium text-teal">+ </span>
                    ) : null}
                    {stage.name}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function IntegratedSpecFooter() {
  return (
    <div className="rounded-2xl border border-navy bg-navy px-6 py-5 text-white">
      <p className="text-xs font-medium tracking-[0.2em] text-white/60 uppercase">
        {processContent.integratedTitle}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-white/85">
        {processContent.integratedSupporting}
      </p>
      <p className="mt-4 text-xs font-medium tracking-wide text-teal-soft">
        → {processContent.outcomeLabel}
      </p>
    </div>
  );
}
