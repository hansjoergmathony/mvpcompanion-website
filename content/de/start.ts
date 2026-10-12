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
  reviewLabel: "KI-Feedback anfordern",
  reviewingLabel: "KI prüft …",
  aiGenerationError:
    "Die KI-Prüfung ist gerade nicht verfügbar. Bitte versuchen Sie es erneut.",
  hearingLabel: "Das höre ich heraus",
  unclearLabel: "Ein Punkt ist noch unklar",
  answerLabel: "Ihre Antwort",
  coreQuestionsTitle: "Kernfragen",
  coreQuestionsIntro:
    "Optionale Impulse, die Ihnen helfen, diese Stufe zu durchdenken.",
  coreQuestionsCompletionNote:
    "Diese Fragen unterstützen die Auseinandersetzung. Sie entscheiden nicht darüber, ob diese Stufe abgeschlossen ist.",
  stageAnswerError:
    "Fügen Sie eine Antwort hinzu, bevor Sie fortfahren oder Feedback anfordern.",
  aiFeedbackOptional:
    "KI-Feedback ist optional. Sie können jederzeit speichern und weitergehen.",
  aiFeedbackBetaCta: "KI-Feedback – Beta",
  aiFeedbackBetaNote:
    "KI-Feedback ist in Vorbereitung. Sie können Interesse vormerken, ohne Ihre Spezifikation an eine KI zu senden.",
  runAiFeedback: "KI-Feedback ausführen (privat)",
  runningAiFeedback: "KI prüft …",
  aiFeedbackPrivateNote:
    "Privater Pilot: Diese Antwort wird für die Rückmeldung an die OpenAI API gesendet.",
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
  backToOverview: "Zur Übersicht",
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
  coreQuestions: {
    idea: {
      canonical: "Was könnte das werden?",
      supporting: [
        "Was ist die ursprüngliche Idee, und wodurch wurde sie ausgelöst?",
        "Wer könnte sie vorläufig nutzen?",
        "Welches Ergebnis oder welchen Nutzen erwarte ich derzeit?",
        "Welche Teile sind Belege, Hypothesen, abgeleitete Erkenntnisse oder offene Fragen?",
        "Welche wichtigen Annahmen müssen noch geklärt werden?",
      ],
    },
    problem: {
      canonical: "Welches echte Problem gibt es?",
      supporting: [
        "Welche Schwierigkeit tritt auf und in welcher Situation oder welchem Kontext?",
        "Was tut die Person derzeit, wenn dieses Problem auftritt?",
        "Welche Alternativen oder Behelfslösungen werden heute genutzt?",
        "Wie häufig tritt das Problem auf, und welche Folgen hat es?",
        "Welche Belege stützen die Problemhypothese, und was bleibt Annahme oder offene Frage?",
      ],
    },
    user: {
      canonical: "Wer hat das Problem?",
      supporting: [
        "Welche möglichen Nutzersegmente erleben dieses Problem?",
        "Welches Segment erlebt es offenbar am stärksten und in welchem Kontext?",
        "Welche Einschränkungen, Ziele, aktuellen Verhaltensweisen und Alternativen kennzeichnen diesen Nutzer?",
        "Wer sind die sekundären Nutzer, und wer gehört ausdrücklich nicht zur Zielgruppe?",
        "Welche Begründung und welche Belege gibt es derzeit für die Auswahl dieses primären Nutzersegments?",
      ],
    },
    value: {
      canonical: "Warum ist die Lösung wichtig?",
      supporting: [
        "Welches Ergebnis möchte der primäre Nutzer erreichen?",
        "Welche Aufgabe versucht der Nutzer in dieser Situation zu erledigen oder bei der er voranzukommen versucht?",
        "Welchen Nutzen würde die Lösung des Problems schaffen?",
        "Welche Alternativen – einschließlich des Status quo – hat der Nutzer?",
        "Welches Wertversprechen und welches Differenzierungsversprechen lassen sich ohne Funktionsliste formulieren, und was stützt diese Aussagen?",
      ],
    },
    product: {
      canonical: "Was ist das Produkt im Kern?",
      supporting: [
        "Welches zentrale Objekt oder Konzept steht im Mittelpunkt des Produkts?",
        "Welche unterstützenden Entitäten oder Objekte werden benötigt?",
        "Wie hängen das zentrale Objekt und die unterstützenden Entitäten zusammen?",
        "Welche Konzepte sind dauerhafte Objekte und welche sind Handlungen?",
        "Welche Informationen sollten strukturiert sein, und was kann frei formuliert bleiben?",
      ],
    },
    context: {
      canonical:
        "In welchem Kontext entsteht Wert, und wie entwickeln sich relevante Nutzer, Objekte oder Prozesse?",
      supporting: [
        "In welchen Situationen oder Kontexten muss das Produkt Wert schaffen?",
        "Welche Zustände relevanter Nutzer, Objekte oder Prozesse sind wichtig?",
        "Welche Bedingungen führen in jeden bedeutsamen Zustand?",
        "Welche Handlungen oder Informationen werden in jedem Zustand benötigt?",
        "Welche Übergänge oder wiederkehrenden Schleifen sind wichtig, und welche Zustände können ausgeschlossen werden, weil sie keinen operativen Nutzen haben?",
      ],
    },
    jobs: {
      canonical: "Was müssen Nutzer erreichen?",
      supporting: [
        "Welche möglichen Kernaufgaben muss der primäre Nutzer erledigen, um den versprochenen Wert zu erhalten?",
        "In welcher Situation entsteht jede Aufgabe, und welchen Fortschritt oder welches Ergebnis versucht der Nutzer zu erreichen?",
        "Welche Handlung, Information oder Entscheidung ist nötig, um bei jeder Aufgabe voranzukommen?",
        "Welche Aufgaben sind wesentlich und sollten priorisiert werden, und welche sind nachrangig oder liegen außerhalb des MVP?",
        "Welche Belege, Hypothesen, abgeleiteten Erkenntnisse oder offenen Fragen informieren die Priorisierung?",
      ],
    },
    scope: {
      canonical: "Was ist die kleinste nützliche Lösung?",
      supporting: [
        "Welche Fähigkeit wird benötigt, um jede priorisierte Kernaufgabe zu unterstützen?",
        "Welche Fähigkeiten sind für die kleinste in sich stimmige Lösung wesentlich?",
        "Welche Fähigkeiten sind Muss, Sollte, Später oder Nicht im MVP?",
        "Was ist die Begründung für jedes Muss?",
        "Welche Abhängigkeiten und ausdrücklichen Ausschlüsse sind nötig, damit der Umfang stimmig bleibt?",
      ],
    },
    experience: {
      canonical: "Wie erhält der Nutzer den Wert?",
      supporting: [
        "Wie gelangt der Nutzer in das Produkt oder beginnt es zu nutzen?",
        "Welches erste Objekt wird gegebenenfalls erstellt oder importiert?",
        "Was ist der Moment des ersten wahrgenommenen Werts?",
        "Was ist der einfachste vollständige Weg vom Einstieg zum Kernergebnis?",
        "Welche wesentlichen leeren, Lade-, Fehler- oder Berechtigungszustände müssen behandelt werden?",
      ],
    },
    informationArchitecture: {
      canonical: "Wie ist das Produkt organisiert?",
      supporting: [
        "Welche Hauptnavigation bildet das mentale Produktmodell und die Kernaufgaben am besten ab?",
        "Wie sollten die wichtigsten Objekte und Informationen gruppiert oder verschachtelt werden?",
        "Welche Listen-, Detail- oder Übersichtsansichten werden benötigt?",
        "Wo wechseln Nutzer zwischen zusammenhängenden Objekten oder Aufgaben?",
        "Hat jede MVP-Fähigkeit einen natürlichen Platz in der Informationsarchitektur?",
      ],
    },
    data: {
      canonical: "Welche Informationen müssen vorhanden sein?",
      supporting: [
        "Welche Entitäten sind für das MVP wesentlich?",
        "Welche Felder sind erforderlich und welche optional?",
        "Wie hängen Entitäten zusammen, und welche Kardinalität gilt?",
        "Welche Status-, Lebenszyklus-, Eigentums- oder Arbeitsbereichsfelder werden benötigt?",
        "Welche Daten werden manuell eingegeben, importiert oder berechnet, und welche Felder können entfallen, weil sie keinen MVP-Zweck erfüllen?",
      ],
    },
    requirements: {
      canonical: "Was genau muss das System tun?",
      supporting: [
        "Welches beobachtbare Verhalten ist für jede Fähigkeit im Umfang erforderlich?",
        "Welche Eingaben, Ausgaben und Validierungsregeln gelten?",
        "Was soll in leeren, Lade-, Erfolgs-, Fehler- und deaktivierten Zuständen geschehen?",
        "Welche Berechtigungs- oder Integrationsverhalten müssen festgelegt werden?",
        "Welche Akzeptanzkriterien würden einer anderen Person erlauben festzustellen, ob das geforderte Verhalten korrekt umgesetzt ist?",
      ],
    },
    learning: {
      canonical: "Was muss uns das MVP lehren?",
      supporting: [
        "Welche wichtigen Hypothesen soll das MVP prüfen helfen?",
        "Was ist das Aktivierungsereignis und was das zentrale Wertereignis?",
        "Welche Signale für weitere Nutzung oder Bindung sind gegebenenfalls wichtig?",
        "Welche Qualitätsindikatoren würden helfen, die Ergebnisse einzuordnen?",
        "Welche Lernfrage beantwortet jedes Signal, und welche Belege würden die nächste Entscheidung verändern?",
      ],
    },
    technicalBoundaries: {
      canonical: "Welche technischen Bedingungen begrenzen das MVP?",
      supporting: [
        "Welche Plattform- oder Client-Annahmen begrenzen das MVP?",
        "Welche Anforderungen an Backend, API, Datenbank oder Speicherung bestehen?",
        "Welches Modell für Authentifizierung, Arbeitsbereiche oder Eigentum wird benötigt?",
        "Welche externen Integrationen oder KI-/Service-Abhängigkeiten sind gegebenenfalls notwendig?",
        "Welche wichtigen technischen Risiken, Betriebskostenaspekte, Entscheidungen und offenen Fragen müssen vor der Implementierungsplanung sichtbar sein?",
      ],
    },
    mvpBoundary: {
      canonical: "Was genau ist das kleinste in sich stimmige Produkt?",
      supporting: [
        "Welches Kernversprechen und welchen primären Nutzer bedient das MVP?",
        "Welche Kernaufgaben und Fähigkeiten sind wesentlich, um dieses Versprechen einzulösen?",
        "Unterstützen das vorgeschlagene Erlebnis, die Informationsarchitektur und die minimalen Daten eine vollständige End-to-End-Reise?",
        "Wie beeinflussen Marktalternativen und die Hypothese zum Geschäftsmodell die vorgeschlagene MVP-Grenze?",
        "Ist die Rolle von KI und jeder Integration – sofern vorhanden – begrenzt und begründet?",
        "Was gehört zu Muss, Sollte, Später und Nicht im MVP – und warum?",
        "Sind Lernhypothesen, technische Grenzen, Abhängigkeiten, Ausschlüsse und offene Fragen ausdrücklich festgehalten, und ist das resultierende MVP realistisch zu bauen und zu testen?",
      ],
    },
  },
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
