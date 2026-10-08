import type { Dictionary } from "@/content/en";
import { datenschutzPage, impressumPage, legalOperator, publicContactEmail } from "./legal";
import {
  aiChallengeContent,
  approachContent,
  audienceContent,
  ecosystemContent,
  finalCtaContent,
  footerContent,
  frameworkContent,
  heroContent,
  problemContent,
  processContent,
  resultContent,
  websiteAppContent,
} from "./homepage";
import { aboutPage, contactPage, processPage, resourcesPage, templatesPage } from "./pages";
import { processPhases, processStages } from "./process";
import { bookSample, shortPaper } from "./resources";
import { appEntry, ctas, legalNavigation, navigation, site } from "./site";
import { priorStageLabel, stageFocusByNumber, startContent } from "./start";
import { ui } from "./ui";

export const dictionary = {
  site,
  navigation,
  legalNavigation,
  ctas,
  appEntry,
  heroContent,
  problemContent,
  approachContent,
  frameworkContent,
  processContent,
  resultContent,
  ecosystemContent,
  websiteAppContent,
  aiChallengeContent,
  audienceContent,
  finalCtaContent,
  footerContent,
  aboutPage,
  templatesPage,
  processPage,
  contactPage,
  resourcesPage,
  processStages,
  processPhases,
  startContent,
  stageFocusByNumber,
  priorStageLabel,
  bookSample,
  shortPaper,
  legalOperator,
  publicContactEmail,
  impressumPage,
  datenschutzPage,
  ui,
} as const satisfies Dictionary;
