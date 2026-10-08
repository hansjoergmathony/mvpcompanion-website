import { processPhases } from "./process";
import { ctas } from "./site";

export const heroContent = {
  kicker: "PLANEN · BAUEN · LERNEN · WACHSEN",
  headline: "Aus Ideen werden sinnvolle Produkte.",
  headlineLines: ["Aus Ideen werden", "sinnvolle Produkte."],
  supporting:
    "Eine systematische Methode, um App-Ideen in wertvolle, tragfähige und umsetzbare MVPs zu verwandeln.",
  primaryCta: ctas.primary,
  secondaryCta: ctas.secondary,
  benefits: [
    "Strukturierter Prozess",
    "Klare Entscheidungen",
    "Bessere Produktentscheidungen",
  ],
} as const;

export const problemContent = {
  eyebrow: "Problem",
  headline: "Eine Idee ist erst der Anfang.",
  introduction:
    "Eine Idee kann sich aufregend anfühlen, während wichtige Fragen offen bleiben.",
  questions: [
    "Für wen ist sie?",
    "Welches Problem gibt es wirklich?",
    "Welchen Wert schafft sie?",
    "Was soll das Produkt tatsächlich sein?",
    "Was gehört ins MVP?",
    "Was sollte man lernen, bevor mehr gebaut wird?",
  ],
  statementLead: "Das Schwierige ist nicht, Funktionen zu bauen.",
  statementEmphasis: "Das Schwierige ist zu entscheiden, was gebaut werden soll.",
} as const;

export const approachContent = {
  id: "method",
  eyebrow: "Ansatz",
  headline: "Springen Sie nicht von der Idee zu den Funktionen.",
  principle: "Schrittweise Klärung.",
  introduction:
    "Ein üblicher Weg führt direkt von der Idee zu Funktionen, Screens und Code. MVPCompanion bringt eine gemeinsame Methode ins Spiel, um ein Produkt zu erkunden und zu entwickeln, bevor die Umsetzung ins Detail geht.",
  principleExplanation:
    "Dieselbe Methode führt von einer unsicheren Idee zu einem stimmigen MVP — erkunden Sie sie auf der Website und wenden Sie sie dann mit KI-Unterstützung in der App an.",
  progression: processPhases.map((phase) => phase.name),
  progressionNote: "Von der Idee → zu einem stimmigen MVP.",
  coreIdea: "Bessere Produktentscheidungen, bevor Sie bauen.",
} as const;

export const frameworkContent = {
  eyebrow: "Rahmen",
  headline: "Das MVPCompanion-Framework",
  introduction:
    "Das Framework ist die Beziehung zwischen der Denkweise und dem Weg von der Idee zum MVP.",
  method: {
    name: "MVPCompanion-Methode",
    focus: "Warum + Wie",
  },
  process: {
    name: "Von der Idee zum MVP",
    focus: "Was + Wann",
  },
  spec: {
    name: "Integrierte MVP-Spezifikation",
  },
  outcome: {
    label: "Wertvolles · tragfähiges · umsetzbares MVP",
    dimensions: ["Wertvoll", "Tragfähig", "Umsetzbar"],
  },
  structure:
    "Methode + Prozess → Integrierte MVP-Spezifikation → Wertvolles · tragfähiges · umsetzbares MVP",
  explanation:
    "Zusammen führen sie zu einer integrierten MVP-Spezifikation — in der App schrittweise entwickelt als Grundlage für ein wertvolles, tragfähiges und umsetzbares MVP.",
  processLink: {
    label: "Das Framework in 15 Phasen wird unten vorgestellt.",
    href: "#process",
  },
  qualityPrinciple: {
    label: "Nachvollziehbarkeit",
    description:
      "Jede wichtige Anforderung sollte rückwärts zu einem bedeutsamen Nutzerproblem und vorwärts zu einem beobachtbaren Ergebnis führen.",
    specificationNote:
      "Jede wichtige Entscheidung fügt der MVP-Spezifikation eine weitere nachvollziehbare Schicht hinzu.",
    chain: [
      "Problem",
      "Nutzer",
      "Ergebnis",
      "Aufgabe",
      "Fähigkeit",
      "Anforderung",
      "Akzeptanzkriterium",
      "Metrik",
    ],
  },
} as const;

export const processContent = {
  eyebrow: "Die MVPCompanion-Methode",
  headline: "5 Phasen. 15 Stufen. Ein zusammenhängendes Framework.",
  introduction:
    "Eine strukturierte Karte von der Idee zur MVP-Grenze — die Bereiche, die beim Entwickeln eines MVP geklärt, geformt und spezifiziert werden müssen.",
  mapLead: "Die 15 Stufen sind die Karte.",
  mapSupporting:
    "Sie strukturieren die zentralen Bereiche, die beim Entwickeln eines MVP geklärt, geformt und spezifiziert werden müssen. Die Arbeit selbst ist keine starre Checkliste: Wenn neue Erkenntnisse auftauchen, können frühere Entscheidungen erneut betrachtet und geschärft werden.",
  progressionNote:
    "Es gibt eine strukturierte Abfolge, aber echtes Produktdenken ist iterativ.",
  iterativeTitle: "Fortschritt ist strukturiert, aber nicht streng linear.",
  iterativeSupporting:
    "Neue Erkenntnisse können zeigen, dass eine frühere Entscheidung erneut betrachtet und geschärft werden muss. Das Framework gibt eine sinnvolle Abfolge und lässt zu, dass frühere Entscheidungen bei neuen Erkenntnissen wieder aufgegriffen werden.",
  keyMessageLead: "Die Stufen sind die Karte. Die App ist die geführte Reise.",
  keyMessageFollow:
    "Während Sie das Framework durchlaufen, hilft KI Ihnen, Annahmen zu hinterfragen, Entscheidungen zu schärfen und Ihre MVP-Spezifikation zu entwickeln.",
  bringToLifeTitle: "Das Framework gibt die Struktur. Die App bringt sie zum Leben.",
  bringToLifeSupporting:
    "Die 5 Phasen und 15 Stufen legen fest, was durchdacht werden muss. Die App hilft Ihnen, diese Bereiche mit KI-gestützter Analyse, Herausforderung und Schärfung zu bearbeiten.",
  bringToLifeChallenge:
    "Statt nur von Frage zu Frage zu springen, kann MVPCompanion auf das reagieren, was Sie festgelegt haben — Annahmen, Lücken, Widersprüche und offene Fragen sichtbar machen und Ihnen helfen, wichtige Entscheidungen zu schärfen.",
  appExperienceSteps: ["Analysieren", "Hinterfragen", "Schärfen", "Entscheiden"],
  specificationTitle: "Eine wachsende MVP-Spezifikation",
  distinctionLead: "Der Prozess leitet das Denken.",
  distinctionFollow: "Die Spezifikation hält die Entscheidungen fest.",
  specificationFlow: [
    "Idee",
    "Entscheidungen",
    "Schärfung",
    "Integrierte MVP-Spezifikation",
    "Wertvolles · tragfähiges · umsetzbares MVP",
  ],
  growsHeadline: "Ihre MVP-Spezifikation wächst, während das Produkt klarer wird.",
  growsSupporting:
    "Jede Stufe ergänzt, hinterfragt oder schärft einen Teil der Spezifikation. Am Ende des Frameworks haben Sie eine stimmige Beschreibung dessen, was gebaut werden soll, warum, für wen und was das MVP lernen muss.",
  growsClosing:
    "Am Ende bilden die einzelnen Entscheidungen eine stimmige Beschreibung dessen, was gebaut werden soll, warum, für wen, was ins MVP gehört und was gelernt werden muss.",
  journeyLead: "Die Stufen sind die Karte.",
  journeyFollow: "Die wachsende MVP-Spezifikation ist das, was aus der Reise entsteht.",
  integratedTitle: "Integrierte MVP-Spezifikation",
  integratedSupporting:
    "Eine stimmige, nachvollziehbare Beschreibung des MVP — welches Problem es löst, für wen, was dazugehört, was gebaut werden muss und was gelernt werden muss.",
  outcomeLabel: "Wertvolles · tragfähiges · umsetzbares MVP",
  appNote:
    "In der MVPCompanion-App hilft Ihnen Ihr KI-Begleiter, diese Spezifikation zu entwickeln, während Sie das Framework durchlaufen — Lücken erkennen, Annahmen hinterfragen und Entscheidungen unterwegs schärfen.",
  stagesLabel: "Das Framework in 15 Stufen",
} as const;

export const resultContent = {
  eyebrow: "Ergebnis",
  headline: "Ein wertvolles, tragfähiges und umsetzbares MVP.",
  introduction:
    "Das Ziel ist, von „Ich habe eine Idee“ zu verstehen, was gebaut werden soll, warum, für wen, was ins MVP gehört und was gelernt werden muss.",
  dimensions: [
    {
      name: "Wertvoll",
      description: "Löst ein bedeutsames Nutzerproblem.",
    },
    {
      name: "Tragfähig",
      description: "Schafft eine glaubwürdige Grundlage für das Produkt und seinen Kontext.",
    },
    {
      name: "Umsetzbar",
      description: "Ist ausreichend beschrieben, um tatsächlich gebaut zu werden.",
    },
  ],
  statementLead: "Nicht alles, was Sie bauen könnten.",
  statementEmphasis: "Das kleinste stimmige Produkt, das sich zu bauen und daraus zu lernen lohnt.",
  learningNote:
    "Das MVP ist auch ein Lerninstrument. Es soll wichtige Annahmen prüfen und beobachtbares Lernen erzeugen, statt nur zu zeigen, dass Software gebaut werden kann.",
} as const;

export const ecosystemContent = {
  eyebrow: "Ökosystem",
  headline: "Eine Methode. Drei Wege, sie zu nutzen.",
  introduction:
    "Eine gemeinsame MVPCompanion-Methode — lernen Sie sie, erkunden Sie sie auf dieser Website und wenden Sie sie in der App an.",
  methodLabel: "Gemeinsame Methode",
  appDifference:
    "Der Unterschied ist nicht ein weiterer Fragenkatalog. Es ist ein interaktiver Prozess, der auf Ihr Denken reagiert.",
  parts: [
    {
      name: "Buch",
      role: "Verstehen",
      description: "Lernen Sie die Prinzipien und die Begründung der Methode.",
      availability: "Demnächst",
      available: false,
    },
    {
      name: "Website",
      role: "Erkunden",
      description: "Erkunden Sie die Methode und klären Sie Ihren Ausgangspunkt.",
      availability: "Jetzt verfügbar",
      available: true,
    },
    {
      name: "App",
      role: "Tun",
      description:
        "Wenden Sie die Methode mit KI-gestützter Herausforderung und Führung an. Entwickeln Sie Ihre MVP-Spezifikation schrittweise.",
      availability: "Demnächst",
      available: false,
    },
  ],
} as const;

export const websiteAppContent = {
  eyebrow: "Website und App",
  headline: "Die Methode erkunden. Dann anwenden.",
  introduction:
    "Die Website hilft Ihnen, Ihren Ausgangspunkt zu klären. Die App wird helfen, ihn zu hinterfragen und weiterzuentwickeln.",
  bridge:
    "Beide nutzen dieselbe zugrunde liegende Methode. Die Website führt in die Begriffe ein und schafft einen ersten Kontext; die App wird diesen Kontext mit KI-Unterstützung prüfen, hinterfragen und weiterentwickeln.",
  distinctionNote:
    "Strukturierte Klärung auf der Website. KI-gestütztes Denken und Hinterfragen in der künftigen App.",
  entryPathsNote:
    "Sie müssen nicht auf der Website beginnen. Sobald die App verfügbar ist, können Sie auch dort mit einer klar gefassten Idee starten. Wenn Sie die Website zuerst genutzt haben, kann Ihr Ideen-Snapshot als Ausgangskontext für die App dienen — die App beginnt trotzdem bei Stufe 1 und prüft diesen Kontext, statt dieselben Fragen mechanisch zu wiederholen.",
  columns: [
    {
      id: "website",
      label: "Website",
      title: "Erkunden und klären",
      items: [
        "Die MVPCompanion-Methode erkunden",
        "Strukturierte Klärungsfragen durchgehen",
        "Idee, Problem, Nutzer, Wert, Produkt und Lebenszyklus klären",
        "Einen Ideen-Snapshot erstellen",
        "Einen nützlichen Ausgangspunkt für die weitere Arbeit schaffen",
      ],
    },
    {
      id: "app",
      label: "App",
      title: "Tun, hinterfragen und entwickeln",
      items: [
        "Das Framework in 15 Stufen durchgehen",
        "KI wird Ihre Antworten analysieren",
        "Annahmen und Lücken erkennen",
        "Widersprüche und unklare Definitionen aufdecken",
        "Gezielte Nachfragen stellen",
        "Wichtige Entscheidungen hinterfragen und schärfen",
        "Die MVP-Spezifikation schrittweise entwickeln",
      ],
    },
  ],
} as const;

export const aiChallengeContent = {
  eyebrow: "KI-Herausforderung",
  headline: "Die App stellt nicht nur Fragen. Sie hinterfragt Ihr Denken.",
  introduction:
    "Die Website hilft Ihnen, die Methode zu erkunden und Ihren Ausgangspunkt zu klären. Die MVPCompanion-App geht weiter: KI analysiert Ihre Antworten, erkennt Annahmen und Lücken, stellt gezielte Nachfragen und hilft Ihnen, Entscheidungen zu schärfen, während Sie das Framework in 15 Stufen durchlaufen.",
  reactStatement:
    "Statt nur von Frage zu Frage zu gehen, reagiert die App auf das, was Sie sagen.",
  meaningTitle: "Was bedeutet KI-Herausforderung?",
  meaningIntro:
    "KI-Herausforderung heißt, dass MVPCompanion mehr tut, als Antworten zu sammeln. Es betrachtet, was Sie festgelegt haben, und hilft Ihnen, es genauer zu prüfen.",
  meaningLead: "Die KI kann zum Beispiel erkennen, dass:",
  meaningExamples: [
    "eine wichtige Annahme nicht belegt ist",
    "eine Nutzerdefinition noch zu weit ist",
    "ein genanntes Problem nicht klar zum vorgeschlagenen Produkt passt",
    "zwei Antworten einander zu widersprechen scheinen",
    "eine wichtige Entscheidung noch unklar ist",
    "der vorgeschlagene MVP-Umfang von einer offenen Frage abhängt",
  ],
  meaningClose:
    "Statt still weiterzugehen, kann MVPCompanion eine gezielte Nachfrage stellen und Ihnen helfen, den Punkt zu klären.",
  principle: "KI unterstützt das Denken. Sie treffen die Entscheidungen.",
  principleSupporting:
    "MVPCompanion entscheidet nicht, was Ihr Produkt sein soll. Die KI hilft Ihnen, Annahmen, Lücken, Widersprüche und offene Fragen zu sehen, damit Sie selbst besser informiert entscheiden.",
  exampleLabel: "Antwort → Herausforderung → Klären → Schärfen",
  exampleYourAnswerLabel: "Ihre Antwort",
  exampleYourAnswer:
    "„Unsere App ist für alle, die produktiver werden wollen.“",
  exampleChallengeLabel: "KI-Herausforderung",
  exampleChallenge:
    "„Wer erlebt das Problem, das Sie lösen wollen, konkret? Welche Situation macht das Problem für diese Person besonders relevant?“",
  exampleRefinedLabel: "Geschärftes Denken",
  exampleRefined:
    "„Die erste Zielgruppe sind Studierende, die Aufgaben über mehrere Kurse hinweg schlecht organisieren können.“",
  exampleNote:
    "Dieses Beispiel zeigt das Muster der Interaktion — nicht die Behauptung, eine bestimmte Antwort sei objektiv richtig.",
  flowTitle: "Wie Herausforderung in die Spezifikation fließt",
  flowSteps: [
    "Ihre Antwort",
    "KI analysiert",
    "Annahmen · Lücken · Widersprüche · Offene Fragen",
    "Gezielte Herausforderung",
    "Ihre geschärfte Entscheidung",
    "Die MVP-Spezifikation entwickelt sich",
  ],
  specTitle: "Herausforderung gehört zum Aufbau der Spezifikation.",
  specSupporting:
    "Während Sie das Framework durchlaufen, werden Ihre Antworten genauer. KI hilft zu erkennen, wo weitere Klärung nötig ist, bevor wichtige Entscheidungen weitergetragen werden.",
  specClosing:
    "Die MVP-Spezifikation wird also nicht einfach am Ende erzeugt. Sie wächst, während Ihr Denken klarer wird.",
  distinctionReminder:
    "Der Prozess leitet das Denken. Die Spezifikation hält die Entscheidungen fest.",
} as const;

export const audienceContent = {
  eyebrow: "Für wen",
  headline: "Für Menschen, die bauen, was zählt.",
  introduction:
    "Die Website ist für Menschen mit einer App- oder Produktidee, die vor der Entwicklung systematischer arbeiten wollen.",
  groups: [
    {
      name: "Gründerinnen und Gründer",
      description: "Menschen, die eine frühe Produktidee formen.",
    },
    {
      name: "Produktmenschen",
      description: "Menschen, die dafür verantwortlich sind, was gebaut wird und warum.",
    },
    {
      name: "Bauende und Entwickelnde",
      description:
        "Menschen, die sonst zur Umsetzung übergehen, bevor die Produktfragen klar sind.",
    },
    {
      name: "Ideengeber",
      description: "Menschen mit einer Idee, die einen systematischen nächsten Schritt wollen.",
    },
  ],
} as const;

export const finalCtaContent = {
  headline: "Sie haben eine Idee?",
  supporting: "Klären Sie Ihren Ausgangspunkt.",
  detail:
    "Beantworten Sie ein paar wesentliche Fragen zu Idee, Problem, Nutzern, Wert, Produkt und Lebenszyklus.",
  snapshotNote:
    "Sie erstellen einen Ideen-Snapshot — einen strukturierten Ausgangspunkt, keine fertige MVP-Spezifikation.",
  primaryCta: {
    label: ctas.clarify.label,
    href: ctas.clarify.href,
  },
  secondaryCta: {
    label: "Methode entdecken",
    href: ctas.secondary.href,
  },
} as const;

export const footerContent = {
  ecosystem: ["Methode", "Buch", "Website", "App"],
} as const;
