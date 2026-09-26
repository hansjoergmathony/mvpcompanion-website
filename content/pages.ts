import { audienceContent, ecosystemContent } from "./homepage";
import { site } from "./site";

export const aboutPage = {
  title: "About",
  eyebrow: "About",
  headline: site.brandStatement,
  supporting: site.positioning,
  introduction: audienceContent.introduction,
  groups: audienceContent.groups,
} as const;

export const templatesPage = {
  title: "Templates",
  eyebrow: "Templates",
  headline: "Practical templates.",
  supporting:
    "Templates make the MVPCompanion process usable. They turn the 15 stages into a repeatable way of working.",
  introduction:
    "The website and future app are the places where those templates will live. The current starting point is the clarification process itself.",
  processLabel: "See the 15-stage process",
  processHref: "/#process",
} as const;

export const processPage = {
  title: "Process — MVPCompanion",
  eyebrow: "Process",
  headline: "From Idea to MVP.",
  introduction:
    "The process has 15 stages. For a first visit, they can be seen in five phases.",
  principle: "Five phases. Fifteen stages.",
  phasesLabel: "Five phases",
  stagesLabel: "All 15 stages",
  frameworkNote:
    "The five phases are a high-level view of the 15-stage process. The MVPCompanion framework is Method + Process → Integrated MVP Spec → Valuable · Viable · Buildable MVP.",
} as const;

export const contactPage = {
  title: "Contact — MVPCompanion",
  eyebrow: "Contact",
  headline: "Get in touch.",
  supporting:
    "Questions about the method, the website, or working together — send a message.",
} as const;

export const resourcesPage = {
  title: "Resources",
  eyebrow: "Resources",
  headline: ecosystemContent.headline,
  supporting: ecosystemContent.introduction,
  methodLabel: ecosystemContent.methodLabel,
  parts: ecosystemContent.parts,
} as const;
