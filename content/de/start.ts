import type { StageKey } from "@/lib/project/types";
import type { ImplementedStageNumber } from "@/content/start-path";

export const startContent = {
  title: "Klären Sie Ihren Ausgangspunkt.",
  supporting:
    "Beantworten Sie ein paar wesentliche Fragen zu Idee, Problem, Nutzern, Wert, Produkt und Lebenszyklus. Diese Klärung auf der Website deckt dieselben begrifflichen Bereiche ab wie der Anfang der gemeinsamen Methode — sie erzeugt einen Ideen-Snapshot, nicht den vollständigen MVPCompanion-Prozess.",
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
  answerLabel: "Ihre Antwort",
  refineHint:
    "Überarbeiten Sie die ganze Antwort anhand der Rückmeldung und prüfen Sie sie erneut.",
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
  fullDraftHeadline: "Ihr vollständiger Spezifikationsentwurf",
  fullDraftIntro:
    "Alle fünfzehn Stufen sind hier als zusammenhängender Arbeitsentwurf erfasst.",
  fullDraftTagline:
    "Prüfen Sie die vollständige Spezifikation, überarbeiten Sie einzelne Stufen oder exportieren Sie den gesamten Entwurf für die weitere Arbeit.",
  fullDraftContentTitle: "Inhalt der vollständigen Spezifikation",
  editFullDraftCta: "Vollständige Spezifikation bearbeiten",
  conceptDistinction: "Das ist Ihr Ausgangspunkt — nicht Ihre fertige MVP-Spezifikation.",
  conceptAppBridge:
    "Die MVPCompanion-App führt diesen Ausgangspunkt weiter, indem sie Annahmen hinterfragt, Lücken aufdeckt und Ihre MVP-Spezifikation schrittweise entwickelt.",
  startingPointTitle: "Ihr Ausgangspunkt",
  startingPointBody:
    "Sie haben jetzt einen strukturierten Blick auf Idee, Problem, Nutzer, Wert, Produkt und Lebenszyklus.",
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
    "Ein erstes Verständnis des Lebenszyklus",
  ] as const,
  whatComesNextTitle: "Was als Nächstes kommt",
  whatComesNextIntro:
    "Der Ideen-Snapshot ist bewusst nur der Ausgangspunkt. Der vollständige MVPCompanion-Prozess geht weiter in Bereiche wie:",
  whatComesNextStages: [
    "Aufgaben",
    "Umfang",
    "Erlebnis",
    "Informationsarchitektur",
    "Datenmodell",
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
    "Die weiteren Stufen können Sie in diesem Arbeitsbereich selbst ausformulieren. Vertiefende Analyse, Rückfragen und Verfeinerung sind für die MVPCompanion-App vorgesehen, die noch nicht verfügbar ist.",
  mvpBackToConcept: "Zurück zum Ideen-Snapshot",
  developSpecification: "Spezifikation weiterentwickeln",
  workspaceTitle: "Spezifikation weiterentwickeln.",
  workspaceSupporting:
    "Das ist derselbe Entwurf. Weiter mit Aufgaben und den übrigen Stufen. Die ersten sechs bleiben bearbeitbar.",
  filledFields: "{filled} von {total} ausgefüllt",
  filledNote:
    "Ausgefüllte Felder halten fest, was Sie geschrieben haben. Sie sind keine Belege und keine Marktvalidierung.",
  clarifyProgress: "Klärung",
  overallProgress: "Gesamter Entwurf",
  backToClarify: "Zurück zur Klärung",
  noAiReview:
    "Diese Stufe wird beim Schreiben gespeichert. Für die Stufen 7–15 gibt es keine eigene KI-Rückmeldung.",
  saveAndContinue: "Speichern und weiter",
  exampleEyebrow: "Lehrbeispiel",
  exampleTitle: "BookScout",
  exampleBody:
    "Ein anschauliches Beispiel, keine Kundenevidenz. Ihr eigener Entwurf bleibt getrennt, bis Sie das Beispiel als Vorlage übernehmen.",
  exampleView: "BookScout ansehen",
  exampleUse: "Als Vorlage verwenden",
  exampleClose: "Beispiel schließen",
  exampleConfirmTitle: "Den aktuellen Entwurf ersetzen?",
  exampleConfirmBody:
    "BookScout ersetzt die Antworten im aktiven Entwurf. Laden Sie vorher eine JSON-Sicherung herunter, wenn Sie sie behalten möchten. Das Ersetzen können Sie danach rückgängig machen.",
  exampleDownload: "JSON-Sicherung herunterladen",
  exampleReplace: "Entwurf ersetzen",
  exampleCancel: "Abbrechen",
  undoReplace: "Ersetzen rückgängig machen",
  showSixStages: "Die sechs Klärungsstufen zeigen",
  showAllStages: "Alle 15 Stufen zeigen",
  ideaSnapshotStages: [
    { number: "01", id: "idea", label: "Idee" },
    { number: "02", id: "problem", label: "Problem" },
    { number: "03", id: "user", label: "Nutzer" },
    { number: "04", id: "value", label: "Wert" },
    { number: "05", id: "product", label: "Produkt" },
    { number: "06", id: "context", label: "Lebenszyklus" },
  ] as const,
  assumptionsTitle: "Festgehaltene Annahmen",
  openQuestionsTitle: "Offene Fragen",
  answersLabel: "Antworten bisher",
  emptyAnswer: "Noch nicht ergänzt",
  remainingLabel: "Geht in der App weiter",
  soFarLabel: "Bisher",
  assumptionsLabel: "Unbestätigte Hypothesen",
  openQuestionsLabel: "Offene Fragen — keine Belege",
  aiHypothesisNote:
    "Hinweise aus der Klärung sind unbestätigte Hypothesen. Sie sind keine Belege und keine Marktvalidierung.",
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
      "Diese Stufe benennt die relevanten Zustände des zentralen Objekts und die Übergänge zwischen ihnen.",
    prior: ["product"],
  },
};

export const priorStageLabel: Record<StageKey, string> = {
  idea: "Idee",
  problem: "Problem",
  user: "Nutzer",
  value: "Wert",
  product: "Produkt",
  context: "Lebenszyklus",
  jobs: "Aufgaben",
  scope: "Umfang",
  experience: "Erlebnis",
  informationArchitecture: "Informationsarchitektur",
  data: "Datenmodell",
  requirements: "Anforderungen",
  learning: "Lernen",
  technicalBoundaries: "Technische Grenzen",
  mvpBoundary: "MVP-Grenze",
};
