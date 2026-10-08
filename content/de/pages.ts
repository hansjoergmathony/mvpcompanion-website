import { audienceContent, ecosystemContent } from "./homepage";
import { bookSample, shortPaper, stageProcess } from "./resources";
import { site } from "./site";

export const aboutPage = {
  title: "Über MVPCompanion",
  eyebrow: "Über uns",
  headline: site.brandStatement,
  supporting: site.positioning,
  introduction: audienceContent.introduction,
  groups: audienceContent.groups,
} as const;

export const templatesPage = {
  title: "Vorlagen",
  eyebrow: "Vorlagen",
  headline: "Vorlagen kommen später.",
  supporting:
    "Künftige Vorlagen erweitern die MVPCompanion-Methode um wiederholbare Arbeitsweisen.",
  introduction:
    "Der aktuelle Ausgangspunkt ist die Klärung auf der Website. Künftige Vorlagen leben auf der Website und in der App.",
  processLabel: "Das Framework in 15 Stufen ansehen",
  processHref: "/#process",
} as const;

export const processPage = {
  title: "Methode — MVPCompanion",
  eyebrow: "Methode",
  headline: "5 Phasen. 15 Stufen. Ein zusammenhängendes Framework.",
  introduction:
    "Eine strukturierte Karte von der Idee zur MVP-Grenze. Die Stufen legen fest, was durchdacht werden muss; die App hilft Ihnen, sie mit KI-gestützter Herausforderung und Schärfung zu durchlaufen.",
  principle: "Fünf Phasen. Fünfzehn Stufen.",
  phasesLabel: "Methodenkarte — fünf Phasen",
  stagesLabel: "Das Framework in 15 Stufen",
  frameworkNote:
    "Die 15 Stufen sind die Karte. Es gibt eine strukturierte Abfolge, aber echtes Produktdenken ist iterativ — frühere Entscheidungen können wieder aufgegriffen werden, wenn neue Erkenntnisse auftauchen.",
} as const;

export const contactPage = {
  title: "Kontakt — MVPCompanion",
  eyebrow: "Kontakt",
  headline: "Nehmen Sie Kontakt auf.",
  supporting:
    "Fragen zur Methode, zur Website oder zur Zusammenarbeit — schreiben Sie uns.",
} as const;

export const resourcesPage = {
  title: "Ressourcen",
  eyebrow: "Ressourcen",
  headline: ecosystemContent.headline,
  supporting: ecosystemContent.introduction,
  methodLabel: ecosystemContent.methodLabel,
  parts: ecosystemContent.parts,
  bookSample,
  shortPaper,
  stageProcess,
} as const;
