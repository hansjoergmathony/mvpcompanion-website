import { interpretStage } from "@/lib/clarification/stageRules";
import type {
  ClarificationEngine,
  ClarificationRequest,
  StageFeedback,
} from "@/lib/clarification/types";

export const deterministicClarificationEngine: ClarificationEngine = {
  interpret(request: ClarificationRequest): StageFeedback {
    return interpretStage(request);
  },
};

let activeEngine: ClarificationEngine = deterministicClarificationEngine;

export function getClarificationEngine(): ClarificationEngine {
  return activeEngine;
}

export function setClarificationEngine(engine: ClarificationEngine): void {
  activeEngine = engine;
}

export function interpretAnswer(request: ClarificationRequest): StageFeedback {
  return getClarificationEngine().interpret(request);
}
