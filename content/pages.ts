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
  headline: "Templates are coming later.",
  supporting:
    "Future templates will extend the MVPCompanion method with repeatable ways of working.",
  introduction:
    "The current starting point is the website clarification process. Future templates will live on the website and in the app.",
  processLabel: "See the 15-stage framework",
  processHref: "/#process",
} as const;

export const processPage = {
  title: "Method — MVPCompanion",
  eyebrow: "Method",
  headline: "5 phases. 15 stages. One connected framework.",
  introduction:
    "A structured map from idea to MVP boundary. The stages define what needs to be thought through; the app helps you work through them with AI-supported challenge and refinement.",
  principle: "Five phases. Fifteen stages.",
  phasesLabel: "Method map — five phases",
  stagesLabel: "The 15-stage framework",
  frameworkNote:
    "The 15 stages provide the map. There is a structured progression, but real product thinking is iterative — earlier decisions can be revisited as new insights emerge.",
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
