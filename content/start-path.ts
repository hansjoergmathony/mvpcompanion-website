import type { StageKey } from "@/lib/project/types";
import type { ProcessStage } from "@/content/framework";

export const implementedStageNumbers = [1, 2, 3, 4, 5, 6] as const;

export type ImplementedStageNumber = (typeof implementedStageNumbers)[number];

export type IntakeKey = "idea" | "problem" | "user";

export type IntakeValues = Record<IntakeKey, string>;

export const emptyIntakeValues: IntakeValues = {
  idea: "",
  problem: "",
  user: "",
};

const priorStageKeysByNumber: Record<
  ImplementedStageNumber,
  readonly StageKey[]
> = {
  1: [],
  2: ["idea"],
  3: ["problem"],
  4: ["problem", "user"],
  5: ["problem", "user", "value"],
  6: ["product"],
};

export function isImplementedStage(
  stageNumber: number,
): stageNumber is ImplementedStageNumber {
  return implementedStageNumbers.includes(stageNumber as ImplementedStageNumber);
}

export function getImplementedStages(
  stages: readonly ProcessStage[],
): ProcessStage[] {
  return implementedStageNumbers.map((stageNumber) => {
    const stage = stages.find((item) => item.number === stageNumber);

    if (!stage) {
      throw new Error(`Missing implemented stage ${stageNumber}`);
    }

    return stage;
  });
}

export function getStartingContext(
  stageNumber: number,
  values: IntakeValues,
  intakeFields: readonly { informsStage: number; key: IntakeKey }[],
): string | null {
  const field = intakeFields.find((item) => item.informsStage === stageNumber);

  if (!field) {
    return null;
  }

  const value = values[field.key].trim();
  return value || null;
}

export function getStageFocus(
  stageNumber: number,
  focusByNumber: Record<ImplementedStageNumber, { uncertainty: string }>,
): string | null {
  if (!isImplementedStage(stageNumber)) {
    return null;
  }

  return focusByNumber[stageNumber].uncertainty;
}

export function getPriorStageKeys(stageNumber: number): StageKey[] {
  if (!isImplementedStage(stageNumber)) {
    return [];
  }

  return [...priorStageKeysByNumber[stageNumber]];
}
