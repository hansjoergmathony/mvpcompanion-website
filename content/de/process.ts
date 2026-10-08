import type { ProcessPhase, ProcessStage } from "@/content/framework";

export const processStages: readonly ProcessStage[] = [
  {
    number: 1,
    name: "Idee",
    question: "Was könnte das werden?",
    purpose: "Die erste Produktidee fassen.",
    output: "Ideenhypothese / Idea Brief",
  },
  {
    number: 2,
    name: "Problem",
    question: "Welches echte Problem gibt es?",
    purpose: "Das Problem unabhängig von der vorgeschlagenen Lösung beschreiben.",
    output: "Problem Statement plus Belege und Annahmen",
  },
  {
    number: 3,
    name: "Nutzer",
    question: "Wer hat das Problem?",
    purpose: "Die primäre Person benennen, die das Problem hat.",
    output: "Profil der primären Nutzer plus Ziel- und Nicht-Zielsegment",
  },
  {
    number: 4,
    name: "Wert",
    question: "Warum ist die Lösung wichtig?",
    purpose: "Ergebnis und Wert beschreiben, den das Produkt schaffen soll.",
    output: "JTBD plus Wertversprechen, Nutzen, USP und Positionierung",
  },
  {
    number: 5,
    name: "Produkt",
    question: "Was ist das Produkt im Kern?",
    purpose: "Beschreiben, was das Produkt grundsätzlich ist.",
    output: "Mentales Produktmodell plus grobe Entitätenkarte",
  },
  {
    number: 6,
    name: "Lebenszyklus",
    question: "Beschreibe seine relevanten Zustände und die Übergänge zwischen ihnen.",
    purpose: "Die relevanten Zustände des zentralen Objekts und die Übergänge zwischen ihnen benennen.",
    output: "Lebenszyklusmodell",
  },
  {
    number: 7,
    name: "Aufgaben",
    question: "Was müssen Nutzer erreichen?",
    purpose: "Benennen, was Nutzer erledigen müssen.",
    output: "Priorisierte Jobs-to-be-Done / zentrale Anwendungsfälle",
  },
  {
    number: 8,
    name: "Umfang",
    question: "Was ist die kleinste nützliche Lösung?",
    purpose: "Die kleinste nützliche Lösung ableiten.",
    output: "MVP-Feature-Karte plus Liste außerhalb des Umfangs",
  },
  {
    number: 9,
    name: "Erlebnis",
    question:
      "Beschreiben Sie den vollständigen Kernablauf, einschließlich mindestens eines wichtigen Fehler- oder No-Result-Falls.",
    purpose:
      "Den vollständigen Kernablauf beschreiben, einschließlich mindestens eines wichtigen Fehlers oder leeren Ergebnisses.",
    output: "Kernablauf einschließlich eines Fehler- oder No-Result-Falls",
  },
  {
    number: 10,
    name: "Informationsarchitektur",
    question: "Welche zentralen Informationen und Objekte umfasst das Produkt?",
    purpose: "Die zentralen Informationen und Objekte und ihre Anordnung benennen.",
    output: "Zentrale Informationen, Objekte und ihre Anordnung",
  },
  {
    number: 11,
    name: "Datenmodell",
    question: "Welche Entitäten und Felder braucht das Datenmodell?",
    purpose: "Das Datenmodell beschreiben, das das Produkt braucht.",
    output: "MVP-Datenmodell",
  },
  {
    number: 12,
    name: "Anforderungen",
    question: "Was genau muss gebaut werden?",
    purpose: "Beschreiben, was gebaut werden muss und wie es sich verhalten soll.",
    output: "Funktionale Anforderungen plus Akzeptanzkriterien",
  },
  {
    number: 13,
    name: "Lernen",
    question: "Woran erkennen wir, dass es funktioniert?",
    purpose: "Beschreiben, was das MVP prüfen und messen muss.",
    output: "Erfolgsmetriken plus Lernfragen",
  },
  {
    number: 14,
    name: "Technische Grenzen",
    question:
      "Welche Plattform- und Architekturannahmen, Abhängigkeiten, Datenschutzgrenzen, technischen Risiken und offenen Machbarkeitsfragen zählen?",
    purpose:
      "Plattform- und Architekturannahmen, Abhängigkeiten, Datenschutz, technische Risiken und offene Machbarkeitsfragen festhalten.",
    output:
      "Plattform- und Architekturannahmen, Abhängigkeiten, Datenschutz, Risiken und offene Machbarkeitsfragen",
  },
  {
    number: 15,
    name: "MVP-Grenze",
    question: "Wo genau hören wir auf?",
    purpose: "Genau festlegen, was ins MVP gehört und was nicht.",
    output: "Umfangsbeschreibung plus priorisierte Feature-Liste plus Ausschlüsse",
  },
];

export const processPhases: readonly ProcessPhase[] = [
  {
    id: "understand",
    number: "01",
    name: "Verstehen",
    purpose: "Verstehen, was gelöst wird und für wen.",
    stageNumbers: [1, 2, 3],
  },
  {
    id: "define",
    number: "02",
    name: "Definieren",
    purpose: "Aus der ersten Idee ein tragfähiges Produktkonzept machen.",
    stageNumbers: [4, 5, 6],
  },
  {
    id: "shape",
    number: "03",
    name: "Gestalten",
    purpose: "Festlegen, was das Produkt tun muss und was es nicht tun muss.",
    stageNumbers: [7, 8, 9],
  },
  {
    id: "specify",
    number: "04",
    name: "Spezifizieren",
    purpose: "Das Produkt konkret genug machen, um es zu entwerfen und zu bauen.",
    stageNumbers: [10, 11, 12],
  },
  {
    id: "learn",
    number: "05",
    name: "Lernen",
    purpose: "Festlegen, was das MVP prüfen muss und wo die Grenze liegt.",
    stageNumbers: [13, 14, 15],
  },
];
