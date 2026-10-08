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

export const processStages: readonly ProcessStage[] = [
  {
    number: 1,
    name: "Idea",
    question: "What could this be?",
    purpose: "Frame the initial product idea.",
    output: "Idea hypothesis / Idea Brief",
  },
  {
    number: 2,
    name: "Problem",
    question: "What real problem exists?",
    purpose: "Define the problem independently of the proposed solution.",
    output: "Problem Statement + evidence/assumptions",
  },
  {
    number: 3,
    name: "User",
    question: "Who has the problem?",
    purpose: "Identify the primary user who has the problem.",
    output: "Primary User Profile + Target/Non-Target Segment",
  },
  {
    number: 4,
    name: "Value",
    question: "Why does solving it matter?",
    purpose: "Define the outcome and value the product should create.",
    output: "JTBD + Value Proposition + Benefits + USP + Positioning",
  },
  {
    number: 5,
    name: "Product",
    question: "What is the product fundamentally?",
    purpose: "Define what the product fundamentally is.",
    output: "Product Mental Model + high-level entity map",
  },
  {
    number: 6,
    name: "Lifecycle",
    question: "Describe its relevant states and the transitions between them.",
    purpose: "Name the relevant states of the central object and how it moves between them.",
    output: "Lifecycle model",
  },
  {
    number: 7,
    name: "Jobs",
    question: "What must users accomplish?",
    purpose: "Identify what users need to accomplish.",
    output: "Prioritized Jobs-to-be-Done / Core Use Cases",
  },
  {
    number: 8,
    name: "Scope",
    question: "What is the smallest useful solution?",
    purpose: "Derive the smallest useful solution.",
    output: "MVP Feature Map + Out-of-Scope List",
  },
  {
    number: 9,
    name: "Experience",
    question:
      "What is the complete core flow, including at least one important error or no-result case?",
    purpose:
      "Describe the complete core flow, including at least one important failure or empty result.",
    output: "Core flow including an error or no-result case",
  },
  {
    number: 10,
    name: "Information Architecture",
    question: "What central information and objects does the product organize?",
    purpose: "Name the central information and objects and how they are arranged.",
    output: "Central information, objects, and their organization",
  },
  {
    number: 11,
    name: "Data Model",
    question: "What entities and fields does the data model need?",
    purpose: "Define the data model the product needs.",
    output: "MVP data model",
  },
  {
    number: 12,
    name: "Requirements",
    question: "What exactly must be built?",
    purpose: "Define what must be built and how it should behave.",
    output: "Functional Requirements + Acceptance Criteria",
  },
  {
    number: 13,
    name: "Learning",
    question: "How will we know it works?",
    purpose: "Define what the MVP needs to test and measure.",
    output: "Success Metrics + Learning Questions",
  },
  {
    number: 14,
    name: "Technical Boundaries",
    question:
      "Which platform and architecture assumptions, dependencies, privacy constraints, technical risks, and open feasibility questions matter?",
    purpose:
      "Record platform and architecture assumptions, dependencies, privacy, technical risks, and open feasibility questions.",
    output:
      "Platform and architecture assumptions, dependencies, privacy, risks, and open feasibility questions",
  },
  {
    number: 15,
    name: "MVP Boundary",
    question: "Where exactly do we stop?",
    purpose: "Define exactly what belongs in the MVP and what does not.",
    output: "Scope statement + prioritized feature list + exclusions",
  },
];

export const processPhases: readonly ProcessPhase[] = [
  {
    id: "understand",
    number: "01",
    name: "Understand",
    purpose: "Understand what is being solved and for whom.",
    stageNumbers: [1, 2, 3],
  },
  {
    id: "define",
    number: "02",
    name: "Define",
    purpose: "Turn the initial idea into a meaningful product concept.",
    stageNumbers: [4, 5, 6],
  },
  {
    id: "shape",
    number: "03",
    name: "Shape",
    purpose: "Determine what the product must do and what it does not need to do.",
    stageNumbers: [7, 8, 9],
  },
  {
    id: "specify",
    number: "04",
    name: "Specify",
    purpose: "Make the product concrete enough to design and build.",
    stageNumbers: [10, 11, 12],
  },
  {
    id: "learn",
    number: "05",
    name: "Learn",
    purpose: "Define what the MVP needs to test and where to draw the boundary.",
    stageNumbers: [13, 14, 15],
  },
];

export function getStagesForPhase(phase: ProcessPhase): ProcessStage[] {
  return phase.stageNumbers.map((stageNumber) => {
    const stage = processStages.find((item) => item.number === stageNumber);

    if (!stage) {
      throw new Error(`Missing process stage ${stageNumber}`);
    }

    return stage;
  });
}

export function formatPhaseStages(phase: ProcessPhase): string {
  return getStagesForPhase(phase)
    .map((stage) => stage.name)
    .join(" · ");
}
