import { getStagesForPhase } from "@/content/framework";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function ProcessStagesList() {
  const { processPhases, processStages } = await getDictionary();

  return (
    <ol id="stages" className="mt-8 space-y-10">
      {processPhases.map((phase) => {
        return (
          <li
            key={phase.id}
            id={`process-${phase.id}`}
            className="scroll-mt-28 target:outline target:outline-2 target:outline-offset-8 target:outline-blue"
          >
            <p className="text-xs font-medium tracking-[0.16em] text-blue uppercase">
              {phase.number} {phase.name}
            </p>
            <ol className="mt-4">
              {getStagesForPhase(phase, processStages).map((stage) => (
                <li
                  key={stage.number}
                  className="grid gap-1 border-b border-border py-4 last:border-b-0 md:grid-cols-[3.25rem_minmax(13rem,18rem)_minmax(0,1fr)] md:items-baseline md:gap-6"
                >
                  <p className="text-xs font-medium tracking-[0.18em] text-blue uppercase">
                    {String(stage.number).padStart(2, "0")}
                  </p>
                  <h3 className="text-lg font-semibold tracking-tight text-navy">
                    {stage.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">
                    {stage.purpose}
                  </p>
                </li>
              ))}
            </ol>
          </li>
        );
      })}
    </ol>
  );
}
