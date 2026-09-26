import { processPhases } from "./process";
import { ctas } from "./site";

export const heroContent = {
  kicker: "PLAN · BUILD · LEARN · GROW",
  headline: "Turn Ideas into Meaningful Products.",
  headlineLines: ["Turn Ideas into", "Meaningful Products."],
  supporting:
    "A systematic method for turning app ideas into valuable, viable and buildable MVPs.",
  primaryCta: ctas.primary,
  secondaryCta: ctas.secondary,
  benefits: [
    "Structured process",
    "Practical templates",
    "Better product decisions",
  ],
} as const;

export const problemContent = {
  eyebrow: "Problem",
  headline: "Most products don't start with a product. They start with an idea.",
  introduction:
    "An idea can feel exciting while important questions remain unanswered.",
  questions: [
    "Who is it for?",
    "What problem really exists?",
    "What value does it create?",
    "What should the product actually be?",
    "What belongs in the MVP?",
    "What should be learned before building more?",
  ],
  statementLead: "The hard part is not building features.",
  statementEmphasis: "The hard part is deciding what should be built.",
} as const;

export const approachContent = {
  id: "method",
  eyebrow: "Approach",
  headline: "Don't jump from idea to features.",
  principle: "Progressive clarification.",
  introduction:
    "A common path is moving directly from idea to features, screens and coding. MVPCompanion introduces a systematic clarification process before detailed implementation.",
  principleExplanation:
    "The process starts with an uncertain idea and progressively turns it into a clear, buildable MVP.",
  progression: processPhases.map((phase) => phase.name),
  progressionNote: "15 stages of progressive clarification.",
  coreIdea: "Better product decisions before you build.",
} as const;

export const frameworkContent = {
  eyebrow: "Framework",
  headline: "The MVPCompanion Framework",
  introduction:
    "The framework is the relationship between the method of thinking and the process of moving from idea to MVP.",
  method: {
    name: "MVPCompanion Method",
    focus: "Why + How",
  },
  process: {
    name: "From Idea to MVP",
    focus: "What + When",
  },
  spec: {
    name: "Integrated MVP Spec",
  },
  outcome: {
    label: "Valuable · Viable · Buildable MVP",
    dimensions: ["Valuable", "Viable", "Buildable"],
  },
  structure:
    "Method + Process → Integrated MVP Spec → Valuable · Viable · Buildable MVP",
  explanation:
    "Together they produce an Integrated MVP Spec — the basis for a valuable, viable and buildable MVP.",
  processLink: {
    label: "The 15-stage process is introduced below.",
    href: "#process",
  },
  qualityPrinciple: {
    label: "Traceability",
    description:
      "Every important requirement should be traceable backwards to a meaningful user problem and forwards to an observable outcome.",
    chain: [
      "Problem",
      "User",
      "Outcome",
      "Job",
      "Capability",
      "Requirement",
      "Acceptance Criterion",
      "Metric",
    ],
  },
} as const;

export const processContent = {
  eyebrow: "Process",
  headline: "From Idea to MVP.",
  introduction:
    "The process has 15 stages. For a first visit, they can be seen in five phases.",
  principle: "Five phases. Fifteen stages.",
  note: "These phases are a simplified overview. They do not replace the 15-stage process, and they are not the framework itself.",
  phasesLabel: "Five-phase overview",
  stagesLabel: "The 15-stage process",
} as const;

export const resultContent = {
  eyebrow: "Result",
  headline: "A Valuable, Viable and Buildable MVP.",
  introduction:
    "The aim is to move from “I have an idea” to understanding what should be built, why, for whom, what belongs in the MVP, and what needs to be learned.",
  dimensions: [
    {
      name: "Valuable",
      description: "Solves a meaningful user problem.",
    },
    {
      name: "Viable",
      description: "Creates a credible basis for the product and its context.",
    },
    {
      name: "Buildable",
      description: "Is sufficiently defined to actually build.",
    },
  ],
  statementLead: "Not everything you could build.",
  statementEmphasis:
    "The smallest coherent product worth building and learning from.",
  learningNote:
    "The MVP is also a learning instrument. It should test important assumptions and create observable learning, rather than merely demonstrate that software can be built.",
} as const;

export const ecosystemContent = {
  eyebrow: "Ecosystem",
  headline: "One Method. Three Ways to Use It.",
  introduction:
    "MVPCompanion is a shared method expressed through a book, this website and a future app.",
  methodLabel: "Shared Method",
  parts: [
    {
      name: "Book",
      role: "Understand",
      description: "Learn the thinking behind MVPCompanion.",
    },
    {
      name: "Website",
      role: "Explore",
      description: "Discover the method, resources and examples.",
    },
    {
      name: "App",
      role: "Do",
      description: "Apply the method to your own product idea.",
    },
  ],
} as const;

export const audienceContent = {
  eyebrow: "Audience",
  headline: "For people who build what matters.",
  introduction:
    "The site is for people who have an app or digital product idea and want to work more systematically before development.",
  groups: [
    {
      name: "Founders & Entrepreneurs",
      description: "People shaping an early product idea.",
    },
    {
      name: "Product People",
      description: "People responsible for what gets built and why.",
    },
    {
      name: "Builders & Developers",
      description:
        "People who may otherwise move to implementation before the product questions are clear.",
    },
    {
      name: "Idea Owners",
      description: "People with an idea who want a systematic next step.",
    },
  ],
} as const;

export const finalCtaContent = {
  headline: "Have an idea?",
  supporting: "Start making it clear.",
  primaryCta: {
    label: ctas.primary.label,
    href: ctas.primary.href,
  },
  secondaryCta: {
    label: "Explore the method",
    href: ctas.secondary.href,
  },
} as const;

export const footerContent = {
  ecosystem: ["Method", "Book", "Website", "App"],
} as const;
