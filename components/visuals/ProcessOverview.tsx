import {
  formatPhaseStages,
  processPhases,
} from "@/content/process";

export function ProcessOverview() {
  return (
    <ol
      aria-label="Five-phase overview"
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 lg:gap-6"
    >
      {processPhases.map((phase) => {
        return (
          <li key={phase.id} className="min-w-0">
            <a
              href={`#process-${phase.id}`}
              className="block rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
            >
              <p className="text-[11px] font-medium tracking-[0.16em] text-blue uppercase">
                {phase.number}
              </p>
              <h3 className="mt-1 text-lg font-semibold tracking-tight text-navy">
                {phase.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {formatPhaseStages(phase)}
              </p>
            </a>
          </li>
        );
      })}
    </ol>
  );
}
