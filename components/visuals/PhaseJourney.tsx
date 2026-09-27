import {
  formatPhaseStages,
  processPhases,
  type ProcessPhase,
} from "@/content/process";

type PhaseJourneyVariant = "hero" | "compact" | "featured";

type PhaseJourneyProps = {
  variant: PhaseJourneyVariant;
};

const phaseTone = [
  "from-blue/10 to-transparent",
  "from-blue/12 to-transparent",
  "from-blue/8 to-teal/5",
  "from-teal/8 to-transparent",
  "from-teal/12 to-transparent",
] as const;

export function PhaseJourney({ variant }: PhaseJourneyProps) {
  if (variant === "compact") {
    return <CompactJourney />;
  }

  if (variant === "featured") {
    return <FeaturedJourney />;
  }

  return <HeroJourney />;
}

function HeroJourney() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[0_20px_50px_-28px_rgba(11,31,58,0.28)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(26,86,219,0.06),transparent_42%,rgba(18,138,115,0.07))]"
      />
      <div className="relative border-b border-border px-5 py-4">
        <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
          Method map
        </p>
        <p className="mt-1 text-sm text-navy">
          Understand → Define → Shape → Specify → Learn
        </p>
      </div>
      <ol aria-label="Five phases of the MVPCompanion method" className="relative p-5">
        <span
          aria-hidden="true"
          className="absolute top-10 bottom-10 left-[29px] w-px bg-linear-to-b from-blue via-blue to-teal"
        />
        {processPhases.map((phase, index) => (
          <li key={phase.id} className={index === processPhases.length - 1 ? "" : "pb-4"}>
            <PhaseNode phase={phase} index={index} />
          </li>
        ))}
      </ol>
    </div>
  );
}

function PhaseNode({ phase, index }: { phase: ProcessPhase; index: number }) {
  const isLast = index === processPhases.length - 1;

  return (
    <div className="relative grid grid-cols-[22px_minmax(0,1fr)] items-start gap-4">
      <span
        aria-hidden="true"
        className={`relative z-10 mt-3.5 h-[11px] w-[11px] rounded-full border-2 bg-card ${
          isLast ? "border-teal bg-teal" : "border-blue"
        }`}
      />
      <article
        className={`rounded-xl border border-border bg-linear-to-r px-4 py-3 ${phaseTone[index]}`}
      >
        <p className="text-[11px] font-medium tracking-[0.16em] text-muted uppercase">
          {phase.number}
        </p>
        <h3 className="mt-1 text-base font-semibold tracking-tight text-navy">
          {phase.name}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          {formatPhaseStages(phase)}
        </p>
      </article>
    </div>
  );
}

function CompactJourney() {
  return (
    <ol
      aria-label="Understand, Define, Shape, Specify, Learn"
      className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
    >
      {processPhases.map((phase, index) => (
        <li
          key={phase.id}
          className="flex shrink-0 snap-start items-center gap-3 md:shrink"
        >
          <article className="min-w-[11.5rem] rounded-xl border border-border bg-card px-4 py-3 md:min-w-0">
            <p className="text-[11px] font-medium tracking-[0.16em] text-blue uppercase">
              {phase.number}
            </p>
            <p className="mt-1 text-sm font-semibold tracking-tight text-navy">
              {phase.name}
            </p>
          </article>
          {index < processPhases.length - 1 ? (
            <span aria-hidden="true" className="hidden text-blue/50 md:inline">
              →
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

function FeaturedJourney() {
  return (
    <ol
      aria-label="Five-phase overview"
      className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-3 md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0"
    >
      {processPhases.map((phase, index) => {
        const isLast = index === processPhases.length - 1;

        return (
          <li key={phase.id} className="relative min-w-[16rem] snap-start md:min-w-0">
            {index < processPhases.length - 1 ? (
              <span
                aria-hidden="true"
                className="absolute top-7 right-[-0.55rem] z-10 hidden h-px w-4 bg-linear-to-r from-blue to-teal md:block"
              />
            ) : null}
            <article className="h-full rounded-2xl border border-border bg-card p-5">
              <p
                className={`text-[11px] font-medium tracking-[0.16em] uppercase ${
                  isLast ? "text-teal" : "text-blue"
                }`}
              >
                {phase.number}
              </p>
              <h3 className="mt-3 text-lg font-semibold tracking-tight text-navy">
                {phase.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {formatPhaseStages(phase)}
              </p>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
