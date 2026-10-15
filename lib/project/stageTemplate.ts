import type { StageKey } from "@/lib/project/types";

export function templateFieldKey(index: number) {
  return `question-${index + 1}`;
}

export function countCompletedTemplateFields(
  fields: readonly string[],
  values: Record<string, string> | undefined,
) {
  const completed = fields.filter((_, index) =>
    Boolean(values?.[templateFieldKey(index)]?.trim()),
  ).length;

  return { completed, total: fields.length };
}

/** Creates the portable narrative used by exports and existing AI feedback. */
export function buildStageNarrative(
  fields: readonly string[],
  values: Record<string, string>,
) {
  return fields
    .flatMap((field, index) => {
      const value = values[templateFieldKey(index)]?.trim();
      return value ? [`${field}\n${value}`] : [];
    })
    .join("\n\n");
}

export const templateExampleByStage: Record<StageKey, string> = {
  idea: "A guided workspace that helps founders turn an uncertain product idea into a testable MVP specification.",
  problem: "Early-stage teams often start designing features before they have articulated the underlying problem or evidence.",
  user: "A first-time founder who is shaping a digital product and needs a practical way to make product decisions explicit.",
  value: "The founder gains a clearer, shared product definition and can focus learning on the assumptions that matter most.",
  product: "The product is a project workspace organized around an idea, its stages, decisions, evidence, and open questions.",
  context: "A project moves from a raw idea through clarification, definition, and a build-ready MVP boundary.",
  jobs: "When preparing a product decision, the founder needs to capture and prioritize the work required to create value.",
  scope: "Include only the capabilities needed to guide one founder through a coherent first MVP specification; defer collaboration and advanced reporting.",
  experience: "A founder creates an idea, works through the stages, and reaches a clear MVP-boundary summary without hitting a dead end.",
  informationArchitecture: "Top-level areas are the project overview, stages, evidence and assumptions, and the final MVP boundary.",
  data: "An idea has stages; each stage has structured answers, a narrative summary, and optional evidence or open questions.",
  requirements: "When a founder saves a stage, the system preserves the structured answers and a readable stage description.",
  learning: "Test whether founders who complete the guided stages can name a smaller, more coherent MVP and its key assumptions.",
  technicalBoundaries: "The MVP is a responsive web app with local draft storage and optional cloud sync; real-time collaboration is deferred.",
  mvpBoundary: "A single founder can create an idea, complete guided stage templates, review the resulting specification, and export it.",
};
