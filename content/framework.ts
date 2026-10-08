export type ProcessStage = {
  number: number;
  name: string;
  question: string;
  purpose: string;
  output: string;
};

export type ProcessPhase = {
  id: string;
  number: string;
  name: string;
  purpose: string;
  stageNumbers: readonly number[];
};

export function getStagesForPhase(
  phase: ProcessPhase,
  stages: readonly ProcessStage[],
): ProcessStage[] {
  return phase.stageNumbers.map((stageNumber) => {
    const stage = stages.find((item) => item.number === stageNumber);

    if (!stage) {
      throw new Error(`Missing process stage ${stageNumber}`);
    }

    return stage;
  });
}

export function formatPhaseStages(
  phase: ProcessPhase,
  stages: readonly ProcessStage[],
): string {
  return getStagesForPhase(phase, stages)
    .map((stage) => stage.name)
    .join(" · ");
}
