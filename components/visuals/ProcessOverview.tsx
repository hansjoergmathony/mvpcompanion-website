import {
  getStagesForPhase,
  processPhases,
} from "@/content/process";

export function ProcessOverview() {
  return (
    <ol
      aria-label="MVPCompanion method map — five phases and fifteen stages"
      className="space-y-6"
    >
      {processPhases.map((phase, index) => {
        const stages = getStagesForPhase(phase);

        return (
          <li key={phase.id} className="min-w-0">
            {index > 0 ? (
              <p
                aria-hidden="true"
                className="mb-4 text-center text-sm text-blue/50"
              >
                ↓
              </p>
            ) : null}
            <div className="rounded-2xl border border-border bg-card px-5 py-5 md:px-6">
              <a
                href={`#process-${phase.id}`}
                className="inline-block rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
              >
                <p className="text-[11px] font-medium tracking-[0.16em] text-blue uppercase">
                  {phase.number}
                </p>
                <h3 className="mt-1 text-xl font-semibold tracking-tight text-navy">
                  {phase.name}
                </h3>
              </a>
              <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                {stages.map((stage) => (
                  <li
                    key={stage.number}
                    className="rounded-xl border border-border bg-ice px-4 py-3"
                  >
                    <p className="text-[10px] font-medium tracking-[0.16em] text-muted uppercase">
                      {String(stage.number).padStart(2, "0")}
                    </p>
                    <p className="mt-1 text-sm font-medium tracking-tight text-navy">
                      {stage.name}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
