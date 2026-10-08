import type { StageKey } from "@/lib/project/types";
import type { ImplementedStageNumber } from "@/content/start-path";

export const startContent = {
  title: "Klären Sie Ihren Ausgangspunkt.",
  supporting:
    "Beantworten Sie ein paar wesentliche Fragen zu Idee, Problem, Nutzern, Wert, Produkt und Kontext. Diese Klärung auf der Website deckt dieselben begrifflichen Bereiche ab wie der Anfang der gemeinsamen Methode — sie erzeugt einen Ideen-Snapshot, nicht den vollständigen MVPCompanion-Prozess.",
  intakeLabel: "Ausgangskontext",
  startingContextDescription: "Der ursprüngliche Kontext, den Sie zu Beginn angegeben haben.",
  ideaNameLabel: "Name der Idee",
  ideaNamePlaceholder: "z. B. Gitarren-Songbook",
  backToHome: "Zur Startseite",
  backToClarification: "Zurück zur Klärung",
  submitLabel: "Klärung starten",
  continueLabel: "Weiter",
  previousLabel: "Zurück",
  reviewLabel: "Prüfen",
  reviewingLabel: "KI prüft …",
  aiGenerationError:
    "Die KI-Prüfung ist gerade nicht verfügbar. Bitte versuchen Sie es erneut.",
  hearingLabel: "Das höre ich heraus",
  unclearLabel: "Ein Punkt ist noch unklar",
  refineLabel: "Antwort schärfen",
  confirmLabel: "Passt — weiter",
  stageAnswerError: "Fügen Sie eine Antwort hinzu, bevor diese Stufe geprüft werden kann.",
  intakeError: "Fügen Sie Idee, Problem und Nutzer hinzu, um zu beginnen.",
  continueHeadline: "Setzen Sie Ihren Ideen-Snapshot fort.",
  continueSupporting: "Machen Sie dort weiter, wo Sie in der Klärung auf der Website aufgehört haben.",
  continueCta: "Weiter",
  startNewCta: "Neue Idee starten",
  pathLabel: "Pfad der Website-Klärung",
  path: ["Idee", "Klärung", "Ideen-Snapshot"] as const,
  summaryHeadline: "Ihr Ideen-Snapshot",
  summarySupporting: "Ein strukturierter Ausgangspunkt, um Ihr Produkt weiterzuentwickeln.",
  snapshotClarification: "Das ist Ihr Ausgangspunkt — nicht Ihre fertige MVP-Spezifikation.",
  snapshotAppBridge:
    "Sobald MVPCompanion verfügbar ist, können Sie Ihren Ideen-Snapshot in die App mitnehmen und den nächsten Schritt gehen: Annahmen hinterfragen, Lücken aufdecken und Ihr MVP schrittweise entwickeln.",
  appContinueHeadline: "Bereit, weiterzugehen?",
  appContinueSupporting:
    "Sobald die MVPCompanion-App verfügbar ist, können Sie Ihren Ideen-Snapshot mitnehmen. Die App prüft, was Sie festgelegt haben, hinterfragt wichtige Annahmen, erkennt Lücken und entwickelt Ihre MVP-Spezifikation schrittweise.",
  appDirectPrompt: "Sie haben schon eine Idee und wollen direkt starten?",
  conceptHeadline: "Ihr Ideen-Snapshot",
  conceptIntro: "Sie haben aus Ihrer ersten Idee einen strukturierten Ausgangspunkt gemacht.",
  conceptTagline:
    "Ihr erster strukturierter Blick auf die Idee — ein Ausgangspunkt, um das Produkt weiterzuentwickeln.",
  conceptDistinction: "Das ist Ihr Ausgangspunkt — nicht Ihre fertige MVP-Spezifikation.",
  conceptAppBridge:
    "Die MVPCompanion-App führt diesen Ausgangspunkt weiter, indem sie Annahmen hinterfragt, Lücken aufdeckt und Ihre MVP-Spezifikation schrittweise entwickelt.",
  startingPointTitle: "Ihr Ausgangspunkt",
  startingPointBody:
    "Sie haben jetzt einen strukturierten Blick auf Idee, Problem, Nutzer, Wert, Produkt und Kontext.",
  startingPointExpectation:
    "Es bleibt mehr zu klären, bevor daraus ein fokussiertes, prüfbares und umsetzbares MVP wird.",
  whatClarifiedTitle: "Was Sie geklärt haben",
  whatClarifiedIntro:
    "Ihre Antworten spiegeln Ihr derzeitiges Verständnis — erste Hypothesen, keine validierten Schlüsse.",
  whatClarifiedItems: [
    "Eine klarere Beschreibung der Idee",
    "Eine klarere Problemhypothese",
    "Eine erste Zielgruppe",
    "Ein erstes Wertversprechen",
    "Eine erste Produktdefinition",
    "Ein erstes Verständnis von Kontext und Lebenszyklus",
  ] as const,
  whatComesNextTitle: "Was als Nächstes kommt",
  whatComesNextIntro:
    "Der Ideen-Snapshot ist bewusst nur der Ausgangspunkt. Der vollständige MVPCompanion-Prozess geht weiter in Bereiche wie:",
  whatComesNextStages: [
    "Aufgaben",
    "Umfang",
    "Erlebnis",
    "Informationsarchitektur",
    "Daten",
    "Anforderungen",
    "Lernen",
    "Technische Grenzen",
    "MVP-Grenze",
  ] as const,
  whatComesNextAppIntro: "Die MVPCompanion-App führt das weiter und hilft Ihnen:",
  whatComesNextAppItems: [
    "Wichtige Annahmen zu hinterfragen",
    "Lücken und offene Fragen aufzudecken",
    "Zentrale Nutzeraufgaben zu definieren",
    "Das kleinste nützliche MVP zu formen",
    "Das zentrale Erlebnis zu beschreiben",
    "Anforderungen zu spezifizieren",
    "Festzulegen, was das MVP lernen muss",
  ] as const,
  optionalEntryNote:
    "Sobald die App verfügbar ist, können Sie direkt mit Ihrer eigenen Idee starten — der Ideen-Snapshot ist optionaler Kontext, keine Voraussetzung.",
  editConceptCta: "Ideen-Snapshot bearbeiten",
  viewConceptHeadline: "Ihr Ideen-Snapshot ist bereit.",
  viewConceptSupporting:
    "Öffnen Sie, was Sie auf der Website geklärt haben, oder starten Sie einen neuen Ausgangspunkt.",
  viewConceptCta: "Ideen-Snapshot ansehen",
  mvpHeadline: "Weiter in MVPCompanion — demnächst",
  mvpSupporting:
    "Das vollständige Framework in 15 Stufen, die KI-gestützte Analyse und die wachsende MVP-Spezifikation gibt es in der App — nicht in dieser Klärung auf der Website.",
  mvpBackToConcept: "Zurück zum Ideen-Snapshot",
  ideaSnapshotStages: [
    { number: "01", id: "idea", label: "Idee" },
    { number: "02", id: "problem", label: "Problem" },
    { number: "03", id: "user", label: "Nutzer" },
    { number: "04", id: "value", label: "Wert" },
    { number: "05", id: "product", label: "Produkt" },
    { number: "06", id: "context", label: "Kontext" },
  ] as const,
  assumptionsTitle: "Festgehaltene Annahmen",
  openQuestionsTitle: "Offene Fragen",
  answersLabel: "Antworten bisher",
  emptyAnswer: "Noch nicht ergänzt",
  remainingLabel: "Geht in der App weiter",
  soFarLabel: "Bisher",
  assumptionsLabel: "Annahmen",
  openQuestionsLabel: "Offene Fragen",
  intakeFields: [
    {
      key: "idea",
      informsStage: 1,
      label: "Idee",
      prompt: "Beschreiben Sie Ihre Produktidee in einem Satz.",
    },
    {
      key: "problem",
      informsStage: 2,
      label: "Problem",
      prompt: "Welches Problem löst sie?",
    },
    {
      key: "user",
      informsStage: 3,
      label: "Nutzer",
      prompt: "Für wen ist sie?",
    },
  ],
} as const;

export const stageFocusByNumber: Record<
  ImplementedStageNumber,
  { uncertainty: string; prior: readonly StageKey[] }
> = {
  1: {
    uncertainty:
      "Ihre aktuelle Ideenhypothese. Diese Stufe fasst, was aus der Idee werden könnte, bevor Funktionen oder Umsetzung dazukommen.",
    prior: [],
  },
  2: {
    uncertainty:
      "Diese Stufe beschreibt das Problem unabhängig von dem Produkt, das Sie bauen wollen.",
    prior: ["idea"],
  },
  3: {
    uncertainty: "Diese Stufe benennt die primäre Person, die das Problem erlebt.",
    prior: ["problem"],
  },
  4: {
    uncertainty:
      "Diese Stufe benennt das Ergebnis, das die Lösung des Problems wertvoll machen würde.",
    prior: ["problem", "user"],
  },
  5: {
    uncertainty:
      "Diese Stufe benennt, was das Produkt ist, worum es sich dreht und was der Nutzer damit tut.",
    prior: ["problem", "user", "value"],
  },
  6: {
    uncertainty:
      "Diese Stufe benennt, was mit der Hauptsache im Produkt nach der ersten Nutzung und später passiert.",
    prior: ["product"],
  },
};

export const priorStageLabel: Record<StageKey, string> = {
  idea: "Idee",
  problem: "Problem",
  user: "Nutzer",
  value: "Wert",
  product: "Produkt",
  context: "Kontext",
};
