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
  headline: "An idea is only the beginning.",
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
    "A common path is moving directly from idea to features, screens and coding. MVPCompanion introduces a shared method for exploring and developing a product before detailed implementation.",
  principleExplanation:
    "The same method runs from an uncertain idea toward a coherent MVP — explore it on the website, then apply it with AI support in the app.",
  progression: processPhases.map((phase) => phase.name),
  progressionNote: "From Idea → to a coherent MVP.",
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
    "Together they lead toward an Integrated MVP Spec — progressively developed in the app as the basis for a valuable, viable and buildable MVP.",
  processLink: {
    label: "The 15-stage framework is introduced below.",
    href: "#process",
  },
  qualityPrinciple: {
    label: "Traceability",
    description:
      "Every important requirement should be traceable backwards to a meaningful user problem and forwards to an observable outcome.",
    specificationNote:
      "Every important decision adds another traceable layer to the MVP Specification.",
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
  eyebrow: "The MVPCompanion Method",
  headline: "5 phases. 15 stages. One connected framework.",
  introduction:
    "A structured map from idea to MVP boundary — the areas that need to be clarified, shaped and specified when developing an MVP.",
  mapLead: "The 15 stages provide the map.",
  mapSupporting:
    "They structure the key areas that need to be clarified, shaped and specified when developing an MVP. The work itself is not a rigid checklist: as new insights emerge, earlier decisions can be revisited and refined.",
  progressionNote:
    "There is a structured progression, but real product thinking is iterative.",
  iterativeTitle: "Progress is structured, but not strictly linear.",
  iterativeSupporting:
    "New insights can reveal that an earlier decision needs to be revisited and refined. The framework provides a meaningful progression, while allowing earlier decisions to be revisited when new insights emerge.",
  keyMessageLead: "The stages provide the map. The app provides the guided journey.",
  keyMessageFollow:
    "As you move through the framework, AI helps you challenge assumptions, refine decisions and develop your MVP Specification.",
  bringToLifeTitle:
    "The framework provides the structure. The app brings it to life.",
  bringToLifeSupporting:
    "The 5 phases and 15 stages define what needs to be thought through. The app helps you work through those areas with AI-supported analysis, challenge and refinement.",
  bringToLifeChallenge:
    "Instead of simply moving from question to question, MVPCompanion can respond to what you have defined — surfacing assumptions, gaps, contradictions and open questions and helping you refine important decisions.",
  appExperienceSteps: ["Analyze", "Challenge", "Refine", "Decide"],
  specificationTitle: "One evolving MVP Specification",
  distinctionLead: "The process guides the thinking.",
  distinctionFollow: "The specification captures the decisions.",
  specificationFlow: [
    "Idea",
    "Decisions",
    "Refinement",
    "Integrated MVP Specification",
    "Valuable · Viable · Buildable MVP",
  ],
  growsHeadline:
    "Your MVP Specification grows as your product becomes clearer.",
  growsSupporting:
    "Each stage adds, challenges or refines part of the specification. By the end of the framework, you have a coherent definition of what to build, why, for whom and what the MVP needs to learn.",
  growsClosing:
    "By the end, the separate decisions form a coherent definition of what to build, why, for whom, what belongs in the MVP and what needs to be learned.",
  journeyLead: "The stages provide the map.",
  journeyFollow: "The evolving MVP Specification is what emerges from the journey.",
  integratedTitle: "Integrated MVP Specification",
  integratedSupporting:
    "A coherent, traceable definition of the MVP — what it solves, for whom, what belongs in it, what needs to be built and what needs to be learned.",
  outcomeLabel: "Valuable · Viable · Buildable MVP",
  appNote:
    "In the MVPCompanion app, your AI Companion helps you develop this specification as you work through the framework — identifying gaps, challenging assumptions and refining decisions along the way.",
  stagesLabel: "The 15-stage framework",
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
    "One shared MVPCompanion Method — learn it, explore it on this website, and apply it in the app.",
  methodLabel: "Shared Method",
  appDifference:
    "The difference is not another set of questions. It is an interactive process that responds to your thinking.",
  parts: [
    {
      name: "Book",
      role: "Understand",
      description: "Learn the principles and reasoning behind the method.",
    },
    {
      name: "Website",
      role: "Explore",
      description: "Explore the method and clarify your starting point.",
    },
    {
      name: "App",
      role: "Do",
      description:
        "Apply the method with AI-supported challenge and guidance. Develop your MVP Specification progressively.",
    },
  ],
} as const;

export const websiteAppContent = {
  eyebrow: "Website & App",
  headline: "Explore the method. Then apply it.",
  introduction:
    "The website helps you clarify your starting point. The app helps you challenge and develop it.",
  bridge:
    "Both use the same underlying method. The website introduces the vocabulary and creates initial context; the app reviews, challenges and develops that context with AI support.",
  distinctionNote:
    "Structured clarification on the website. AI-supported reasoning and challenge in the app.",
  entryPathsNote:
    "You don’t have to start on the website. If you already have a well-defined idea, you can start directly in the app. If you have used the website first, your Idea Snapshot can serve as the starting context for the app — the app still begins with Stage 1 and reviews that context rather than mechanically repeating the same questions.",
  columns: [
    {
      id: "website",
      label: "Website",
      title: "Explore & Clarify",
      items: [
        "Explore the MVPCompanion method",
        "Work through structured clarification questions",
        "Clarify Idea, Problem, User, Value, Product and Context",
        "Create an Idea Snapshot",
        "Establish a useful starting point for deeper work",
      ],
    },
    {
      id: "app",
      label: "App",
      title: "Do, Challenge & Develop",
      items: [
        "Work through the 15-stage framework",
        "AI analyzes your answers",
        "Identify assumptions and gaps",
        "Detect contradictions and unclear definitions",
        "Ask targeted follow-up questions",
        "Challenge and refine important decisions",
        "Progressively develop the MVP Specification",
      ],
    },
  ],
} as const;

export const aiChallengeContent = {
  eyebrow: "AI Challenge",
  headline: "The App doesn’t just ask questions. It challenges your thinking.",
  introduction:
    "The website helps you explore the method and clarify your starting point. The MVPCompanion app goes further: AI analyzes your answers, identifies assumptions and gaps, asks targeted follow-up questions and helps you refine your decisions as you work through the 15-stage framework.",
  reactStatement:
    "Instead of simply moving from question to question, the app reacts to what you say.",
  meaningTitle: "What does AI Challenge mean?",
  meaningIntro:
    "AI Challenge means that MVPCompanion does more than collect your answers. It looks at what you have defined and helps you examine it more closely.",
  meaningLead: "For example, the AI may recognize that:",
  meaningExamples: [
    "an important assumption has not been supported",
    "a user definition is still too broad",
    "a stated problem does not clearly connect to the proposed product",
    "two answers appear to contradict each other",
    "an important decision is still unclear",
    "the proposed MVP scope depends on an unresolved question",
  ],
  meaningClose:
    "Instead of silently moving on, MVPCompanion can ask a targeted follow-up question and help you resolve the issue.",
  principle: "AI supports the thinking. You make the decisions.",
  principleSupporting:
    "MVPCompanion does not decide what your product should be. The AI helps you see assumptions, gaps, contradictions and open questions so that you can make better-informed decisions yourself.",
  exampleLabel: "Answer → Challenge → Clarify → Refine",
  exampleYourAnswerLabel: "Your answer",
  exampleYourAnswer:
    "“Our app is for everyone who wants to become more productive.”",
  exampleChallengeLabel: "AI Challenge",
  exampleChallenge:
    "“Who specifically experiences the problem you want to solve? What situation makes the problem particularly relevant to them?”",
  exampleRefinedLabel: "Refined thinking",
  exampleRefined:
    "“The initial target is university students who struggle to organize assignments across multiple courses.”",
  exampleNote:
    "This example shows the interaction pattern — not a claim that any particular answer is objectively correct.",
  flowTitle: "How challenge feeds the specification",
  flowSteps: [
    "Your answer",
    "AI analyzes",
    "Assumptions · Gaps · Contradictions · Open questions",
    "Targeted challenge",
    "Your refined decision",
    "MVP Specification evolves",
  ],
  specTitle: "Challenge is part of the specification-building process.",
  specSupporting:
    "As you work through the framework, your answers become increasingly precise. AI helps identify where further clarification is needed before important decisions are carried forward.",
  specClosing:
    "This means the MVP Specification is not simply generated at the end. It evolves as your thinking becomes clearer.",
  distinctionReminder:
    "The process guides the thinking. The specification captures the decisions.",
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
  supporting: "Start clarifying your starting point.",
  detail:
    "Answer a few essential questions about your idea, problem, users, value, product and context.",
  snapshotNote:
    "You will create an Idea Snapshot — a structured starting point, not a finished MVP specification.",
  primaryCta: {
    label: ctas.clarify.label,
    href: ctas.clarify.href,
  },
  secondaryCta: {
    label: "Explore the method",
    href: ctas.secondary.href,
  },
} as const;

export const footerContent = {
  ecosystem: ["Method", "Book", "Website", "App"],
} as const;
