import type { StageKey } from "@/lib/project/types";
import { processStages, type ProcessStage } from "./process";

export const implementedStageNumbers = [1, 2, 3, 4, 5, 6] as const;

export type ImplementedStageNumber = (typeof implementedStageNumbers)[number];

export const totalStageCount = processStages.length;

export const startContent = {
  title: "Clarify your starting point.",
  supporting:
    "Answer a few essential questions about your idea, problem, users, value, product and lifecycle. This website clarification covers the same conceptual areas as the beginning of the shared method — it creates an Idea Snapshot, not the full MVPCompanion process.",
  intakeLabel: "Starting context",
  startingContextDescription:
    "The original context you provided when you started.",
  ideaNameLabel: "Idea name",
  ideaNamePlaceholder: "e.g. Guitar Songbook",
  backToHome: "Back to homepage",
  backToClarification: "Back to clarification",
  submitLabel: "Start clarification",
  continueLabel: "Continue",
  previousLabel: "Previous",
  reviewLabel: "Get AI feedback",
  reviewingLabel: "AI is reviewing …",
  aiGenerationError:
    "AI feedback is temporarily unavailable. Please try again.",
  hearingLabel: "Here's what I'm hearing",
  unclearLabel: "One thing is still unclear",
  answerLabel: "Your answer",
  coreQuestionsTitle: "Core Questions",
  coreQuestionsIntro: "Optional prompts to help you think through this stage.",
  coreQuestionsCompletionNote:
    "These prompts support exploration. They do not define whether this stage is complete.",
  stageAnswerError: "Add an answer before you continue or request feedback.",
  aiFeedbackOptional:
    "AI feedback is optional. You can save and continue at any time.",
  aiFeedbackBetaCta: "AI feedback — beta",
  aiFeedbackBetaNote:
    "AI feedback is in preparation. You can register interest without sending your specification to AI.",
  runAiFeedback: "Run AI feedback (private)",
  runningAiFeedback: "AI is reviewing …",
  aiFeedbackPrivateNote:
    "Private pilot: this answer is sent to the OpenAI API for feedback.",
  intakeError: "Add your idea, the problem, and the user to begin.",
  continueHeadline: "Continue your Idea Snapshot.",
  continueSupporting: "Pick up where you left off in the website clarification.",
  continueCta: "Continue",
  startNewCta: "Start a new idea",
  pathLabel: "Website clarification path",
  path: ["Idea", "Clarification", "Idea Snapshot"] as const,
  summaryHeadline: "Your Idea Snapshot",
  summarySupporting:
    "A structured starting point for developing your product further.",
  snapshotClarification:
    "This is your starting point — not your finished MVP specification.",
  snapshotAppBridge:
    "When MVPCompanion is available, you can bring your Idea Snapshot into the app to take the next step: challenge assumptions, uncover gaps and progressively develop your MVP.",
  appContinueHeadline: "Ready to take it further?",
  appContinueSupporting:
    "When the MVPCompanion app is available, you can bring your Idea Snapshot into it. The app will review what you've defined, challenge important assumptions, identify gaps and progressively develop your MVP specification.",
  appDirectPrompt: "Already have an idea and want to start directly?",
  conceptHeadline: "Your Idea Snapshot",
  conceptIntro:
    "You've turned your initial idea into a structured starting point.",
  conceptTagline:
    "Your first structured view of the idea — a starting point for developing your product further.",
  fullDraftHeadline: "Your full specification draft",
  fullDraftIntro:
    "All fifteen stages are collected here as one connected working draft.",
  fullDraftTagline:
    "Review the complete specification, revise any stage, or export the full draft for further work.",
  fullDraftContentTitle: "Full specification content",
  editFullDraftCta: "Edit full specification",
  conceptDistinction:
    "This is your starting point — not your finished MVP specification.",
  conceptAppBridge:
    "The MVPCompanion app will take this starting point further by challenging assumptions, uncovering gaps and progressively developing your MVP specification.",
  startingPointTitle: "Your starting point",
  startingPointBody:
    "You now have a structured view of your idea, problem, user, value, product and lifecycle.",
  startingPointExpectation:
    "There is more to resolve before this becomes a focused, testable and buildable MVP.",
  whatClarifiedTitle: "What you've clarified",
  whatClarifiedIntro:
    "Your answers reflect your current understanding — initial hypotheses, not validated conclusions.",
  whatClarifiedItems: [
    "A clearer description of the idea",
    "A clearer problem hypothesis",
    "An initial target user",
    "An initial value proposition",
    "An initial product definition",
    "An initial understanding of the lifecycle",
  ] as const,
  whatComesNextTitle: "What comes next",
  whatComesNextIntro:
    "The Idea Snapshot is intentionally only the starting point. The full MVPCompanion process goes further into areas such as:",
  whatComesNextStages: [
    "Jobs",
    "Scope",
    "Experience",
    "Information Architecture",
    "Data Model",
    "Requirements",
    "Learning",
    "Technical Boundaries",
    "MVP Boundary",
  ] as const,
  whatComesNextAppIntro:
    "The MVPCompanion app will take this further by helping you:",
  whatComesNextAppItems: [
    "Challenge important assumptions",
    "Uncover gaps and open questions",
    "Define core user jobs",
    "Shape the smallest useful MVP",
    "Define the core experience",
    "Specify requirements",
    "Define what the MVP needs to learn",
  ] as const,
  optionalEntryNote:
    "When the app is available, you will be able to start directly with your own idea — the Idea Snapshot is optional context, not a prerequisite.",
  editConceptCta: "Edit Idea Snapshot",
  viewConceptHeadline: "Your Idea Snapshot is ready.",
  viewConceptSupporting:
    "Open what you clarified on the website, or start a new starting point.",
  viewConceptCta: "View your Idea Snapshot",
  mvpHeadline: "Continue in MVPCompanion — coming soon",
  mvpSupporting:
    "You can keep drafting the remaining stages in this workspace. Deeper analysis, follow-up questions and refinement are planned for the MVPCompanion app, which is not available yet.",
  mvpBackToConcept: "Back to Idea Snapshot",
  developSpecification: "Develop your specification",
  workspaceTitle: "Develop your specification.",
  workspaceSupporting:
    "This is the same draft. Continue from Jobs through the remaining stages. The first six stay editable.",
  filledFields: "{filled} of {total} completed fields",
  filledNote:
    "Completed fields record what you have written. They are not evidence or market validation.",
  clarifyProgress: "Clarify",
  overallProgress: "Full draft",
  backToOverview: "Back to overview",
  backToClarify: "Back to Clarify",
  noAiReview:
    "This stage is saved as you write it. Stages 7–15 have no separate AI review.",
  saveAndContinue: "Save and continue",
  exampleEyebrow: "Teaching example",
  exampleTitle: "BookScout",
  exampleBody:
    "An illustrative example, not customer evidence. Your own draft stays separate until you choose to use the example as a template.",
  exampleView: "View BookScout",
  exampleUse: "Use as a template",
  exampleClose: "Close example",
  exampleConfirmTitle: "Replace the current draft?",
  exampleConfirmBody:
    "BookScout will replace the answers in the active draft. Download a JSON backup first if you want to keep them. You can undo the replacement afterwards.",
  exampleDownload: "Download JSON backup",
  exampleReplace: "Replace draft",
  exampleCancel: "Cancel",
  undoReplace: "Undo replacement",
  showSixStages: "Show the six Clarify stages",
  showAllStages: "Show all 15 stages",
  ideaSnapshotStages: [
    { number: "01", id: "idea", label: "Idea" },
    { number: "02", id: "problem", label: "Problem" },
    { number: "03", id: "user", label: "User" },
    { number: "04", id: "value", label: "Value" },
    { number: "05", id: "product", label: "Product" },
    { number: "06", id: "context", label: "Lifecycle" },
  ] as const,
  assumptionsTitle: "Recorded assumptions",
  openQuestionsTitle: "Open questions",
  answersLabel: "Answers so far",
  emptyAnswer: "Not added yet",
  remainingLabel: "Continues in the app",
  soFarLabel: "So far",
  assumptionsLabel: "Unconfirmed hypotheses",
  openQuestionsLabel: "Open questions — not evidence",
  aiHypothesisNote:
    "Notes from clarification are unconfirmed hypotheses. They are not evidence or market validation.",
  intakeFields: [
    {
      key: "idea",
      informsStage: 1,
      label: "Idea",
      prompt: "Describe your product idea in one sentence.",
    },
    {
      key: "problem",
      informsStage: 2,
      label: "Problem",
      prompt: "What problem does it solve?",
    },
    {
      key: "user",
      informsStage: 3,
      label: "User",
      prompt: "Who is it for?",
    },
  ],
  coreQuestions: {
    idea: {
      canonical: "What could this be?",
      supporting: [
        "What is the initial idea, and what triggered it?",
        "Who might use it, provisionally?",
        "What outcome or benefit do I currently expect?",
        "Which parts are evidence, hypotheses, derived insights, or open questions?",
        "What are the major assumptions that need clarification?",
      ],
    },
    problem: {
      canonical: "What real problem exists?",
      supporting: [
        "What difficulty occurs, and in what situation or context?",
        "What does the person currently do when this problem occurs?",
        "What alternatives or workarounds are used today?",
        "How frequent is the problem, and what are its consequences?",
        "What evidence supports the problem hypothesis, and what remains an assumption or open question?",
      ],
    },
    user: {
      canonical: "Who has the problem?",
      supporting: [
        "Which candidate user segments experience this problem?",
        "Which segment appears to experience it most strongly, and in what context?",
        "What constraints, goals, current behaviors, and alternatives characterize this user?",
        "Who are the secondary users, and who is explicitly outside the target?",
        "What is the current rationale and evidence for selecting this primary user segment?",
      ],
    },
    value: {
      canonical: "Why does solving it matter?",
      supporting: [
        "What outcome does the primary user want to achieve?",
        "What Job is the user trying to accomplish or make progress on in this situation?",
        "What benefits would solving the problem create?",
        "What alternatives—including the status quo—does the user have?",
        "What value proposition and differentiating promise can be stated without listing features, and what supports those claims?",
      ],
    },
    product: {
      canonical: "What is the product fundamentally?",
      supporting: [
        "What is the central object or concept around which the product is organized?",
        "Which supporting entities or objects are needed?",
        "How are the central and supporting entities related?",
        "Which concepts are durable objects, and which are actions?",
        "What information should be structured, and what may remain free-form?",
      ],
    },
    context: {
      canonical: "In what context does value arise, and how do relevant users, objects, or processes evolve?",
      supporting: [
        "In what situations or contexts does the product need to create value?",
        "Which states of relevant users, objects, or processes matter?",
        "What conditions cause entry into each meaningful state?",
        "What actions or information are needed in each state?",
        "What transitions or recurring loops matter, and which states can be excluded because they have no operational value?",
      ],
    },
    jobs: {
      canonical: "What must users accomplish?",
      supporting: [
        "Which candidate Jobs must the primary user accomplish to receive the promised value?",
        "In what situation does each Job arise, and what progress or outcome is the user trying to achieve?",
        "What action, information, or decision is needed to make progress on each Job?",
        "Which Jobs are essential and should be prioritized, and which are secondary or outside the MVP?",
        "What evidence, hypotheses, derived insights, or open questions inform the prioritization?",
      ],
    },
    scope: {
      canonical: "What is the smallest useful solution?",
      supporting: [
        "What capability is needed to support each prioritized Core Job?",
        "Which capabilities are essential for the smallest coherent solution?",
        "Which capabilities are Must, Should, Later, or Not in MVP?",
        "What is the rationale for each Must Have?",
        "What dependencies and explicit exclusions are needed to keep the scope coherent?",
      ],
    },
    experience: {
      canonical: "How does the user receive the value?",
      supporting: [
        "How does the user enter or begin using the product?",
        "What is the first object created or imported, if applicable?",
        "What is the first-value moment?",
        "What is the simplest complete path from entry to the core outcome?",
        "Which essential empty, loading, error, or permission states must be handled?",
      ],
    },
    informationArchitecture: {
      canonical: "How is the product organized?",
      supporting: [
        "What top-level navigation best reflects the product mental model and Core Jobs?",
        "How should the main objects and information be grouped or nested?",
        "Which list, detail, or overview views are needed?",
        "Where should users move between related objects or tasks?",
        "Does every MVP capability have a natural place in the information architecture?",
      ],
    },
    data: {
      canonical: "What information must exist?",
      supporting: [
        "Which entities are essential for the MVP?",
        "Which fields are required and which are optional?",
        "How are entities related, and what cardinality applies?",
        "Which status, lifecycle, ownership, or workspace fields are needed?",
        "Which data is entered manually, imported, or computed—and which fields can be removed because they serve no MVP purpose?",
      ],
    },
    requirements: {
      canonical: "What exactly must the system do?",
      supporting: [
        "What observable behavior is required for each in-scope capability?",
        "What inputs, outputs, and validation rules apply?",
        "What should happen in empty, loading, success, error, and disabled states?",
        "What permissions or integration behaviors must be specified?",
        "What acceptance criteria would allow another person to determine whether the required behavior is implemented correctly?",
      ],
    },
    learning: {
      canonical: "What must the MVP teach us?",
      supporting: [
        "Which important hypotheses should the MVP help test?",
        "What is the activation event and the core value event?",
        "Which continued-use or retention signals matter, where relevant?",
        "What quality indicators would help interpret the results?",
        "What learning question does each signal address, and what evidence would change the next decision?",
      ],
    },
    technicalBoundaries: {
      canonical: "What technical conditions constrain the MVP?",
      supporting: [
        "What platform or client assumptions constrain the MVP?",
        "What backend, API, database, or storage needs are required?",
        "What authentication, workspace, or ownership model is needed?",
        "Which external integrations or AI/service dependencies are necessary, if any?",
        "What major technical risks, operating-cost considerations, decisions, and open questions must be visible before implementation planning?",
      ],
    },
    mvpBoundary: {
      canonical: "What exactly is the smallest coherent product?",
      supporting: [
        "What core promise and primary user does the MVP serve?",
        "Which Core Jobs and capabilities are essential to deliver that promise?",
        "Does the proposed experience, information architecture, and minimum data support a complete end-to-end journey?",
        "How do market alternatives and the business-model hypothesis affect the proposed MVP boundary?",
        "Is the role of AI and each integration bounded and justified, where applicable?",
        "What belongs in Must, Should, Later, and Not in MVP—and why?",
        "Are learning hypotheses, technical constraints, dependencies, exclusions, and open questions explicit, and is the resulting MVP realistic to build and test?",
      ],
    },
  },
} as const;

export type IntakeKey = (typeof startContent.intakeFields)[number]["key"];

export type IntakeValues = Record<IntakeKey, string>;

export const emptyIntakeValues: IntakeValues = {
  idea: "",
  problem: "",
  user: "",
};

export function getImplementedStages(): ProcessStage[] {
  return implementedStageNumbers.map((stageNumber) => {
    const stage = processStages.find((item) => item.number === stageNumber);

    if (!stage) {
      throw new Error(`Missing implemented stage ${stageNumber}`);
    }

    return stage;
  });
}

export function getStartingContext(
  stageNumber: number,
  values: IntakeValues,
): string | null {
  const field = startContent.intakeFields.find(
    (item) => item.informsStage === stageNumber,
  );

  if (!field) {
    return null;
  }

  const value = values[field.key].trim();
  return value || null;
}

export function isImplementedStage(stageNumber: number): boolean {
  return implementedStageNumbers.includes(
    stageNumber as ImplementedStageNumber,
  );
}

export const stageFocusByNumber: Record<
  ImplementedStageNumber,
  { uncertainty: string; prior: readonly StageKey[] }
> = {
  1: {
    uncertainty:
      "Your current idea hypothesis. This stage frames what the idea could become, before features or implementation.",
    prior: [],
  },
  2: {
    uncertainty:
      "This stage defines the problem independently of the product you want to build.",
    prior: ["idea"],
  },
  3: {
    uncertainty:
      "This stage identifies the primary user who experiences the problem.",
    prior: ["problem"],
  },
  4: {
    uncertainty:
      "This stage names the outcome that would make solving the problem valuable.",
    prior: ["problem", "user"],
  },
  5: {
    uncertainty:
      "This stage names what the product is, what it revolves around, and what the user does with it.",
    prior: ["problem", "user", "value"],
  },
  6: {
    uncertainty:
      "This stage names the relevant states of the central object and the transitions between them.",
    prior: ["product"],
  },
};

export const priorStageLabel: Record<StageKey, string> = {
  idea: "Idea",
  problem: "Problem",
  user: "User",
  value: "Value",
  product: "Product",
  context: "Lifecycle",
  jobs: "Jobs",
  scope: "Scope",
  experience: "Experience",
  informationArchitecture: "Information Architecture",
  data: "Data Model",
  requirements: "Requirements",
  learning: "Learning",
  technicalBoundaries: "Technical Boundaries",
  mvpBoundary: "MVP Boundary",
};

export function getStageFocus(stageNumber: number): string | null {
  if (!isImplementedStage(stageNumber)) {
    return null;
  }

  return stageFocusByNumber[stageNumber as ImplementedStageNumber].uncertainty;
}

export function getPriorStageKeys(stageNumber: number): StageKey[] {
  if (!isImplementedStage(stageNumber)) {
    return [];
  }

  return [...stageFocusByNumber[stageNumber as ImplementedStageNumber].prior];
}
