export const legalOperator = {
  operatorName: "Hans-Jörg Mathony, PhD",
  streetAddress: "Schorndorfer Weg 34",
  postalCode: "71732",
  city: "Tamm",
  country: "Germany",
} as const;

export const publicContactEmail = "hello@mvpcompanion.com" as const;

export const impressumPage = {
  title: "Impressum — MVPCompanion",
  description: "Impressum und Kontaktangaben von MVPCompanion.",
  eyebrow: "Rechtliches",
  headline: "Impressum",
  sectionTitle: "Angaben gemäß § 5 DDG",
  contactTitle: "Kontakt",
  emailLabel: "E-Mail:",
  country: "Deutschland",
} as const;

/**
 * Privacy policy content reflects V1 website behavior only.
 * LEGAL REVIEW: Have a qualified advisor review this text before production launch.
 */
export const datenschutzPage = {
  title: "Datenschutz — MVPCompanion",
  description:
    "Datenschutzerklärung der Website MVPCompanion — Hosting, Kontaktformular und Datenverarbeitung.",
  eyebrow: "Datenschutz",
  headline: "Datenschutzerklärung",
  lastUpdatedLabel: "Stand:",
  lastUpdated: "September 2025",
  intro:
    "Diese Erklärung beschreibt, wie personenbezogene Daten verarbeitet werden, wenn Sie die Website MVPCompanion unter mvpcompanion.com nutzen.",
  controllerTitle: "Verantwortlicher",
  controllerBefore:
    "Verantwortlicher für die Datenverarbeitung auf dieser Website ist der Betreiber, der im ",
  controllerLink: "Impressum",
  controllerAfter: " genannt ist. Für Anfragen zum Datenschutz schreiben Sie an ",
  hostingTitle: "Hosting und Server-Logs",
  hostingBody:
    "Die Website wird auf einer Cloud-Plattform betrieben (in der Regel Vercel oder ein vergleichbarer Anbieter). Beim Aufruf der Seiten verarbeitet der Hoster Verbindungsdaten wie IP-Adresse, Datum und Uhrzeit der Anfrage, aufgerufene URL, Referrer, Browsertyp und Betriebssystem in Server-Logs zur Sicherheit, zum Betrieb und zur Fehleranalyse. Die Verarbeitung stützt sich auf das berechtigte Interesse an einer sicheren und zuverlässigen Website.",
  contactTitle: "Kontaktformular und E-Mail",
  contactBody:
    "Wenn Sie das Kontaktformular nutzen, verarbeiten wir die von Ihnen eingegebenen Daten (Name, E-Mail, optionaler Betreff und Nachricht), um Ihre Anfrage zu beantworten. Nachrichten werden über einen serverseitigen E-Mail-Dienst mit Umgebungsvariablen auf dem Server übermittelt; Zugangsdaten sind im Browser nicht sichtbar. Einsendungen gehen an",
  contactAfter:
    "(Postfach in Google Workspace / Gmail). Rechtsgrundlage: Ihre Anfrage und unser berechtigtes Interesse an der Kommunikation, oder vorvertragliche Schritte, soweit sie einschlägig sind.",
  fontsTitle: "Schriften",
  fontsBody:
    "Die Typografie nutzt Plus Jakarta Sans über die Schriftoptimierung von Next.js. Schriftdateien werden beim Build geladen und von dieser Website ausgeliefert, nicht zur Laufzeit von Schrift-CDNs Dritter im Browser der Besucher.",
  cookiesTitle: "Cookies und Analyse",
  cookiesBody:
    "Diese Website in Version 1 nutzt kein Google Analytics, kein Meta Pixel, kein Hotjar, keine Werbe-Tracker und keine Marketing-Automation. Wir setzen keine nicht erforderlichen Cookies zur Nachverfolgung. Technische Cookies oder Speicher können nur anfallen, wenn die Hosting-Plattform sie für Sicherheit oder Auslieferung braucht; Analyse-Cookies werden nicht absichtlich eingesetzt. Die Sprachwahl wird in einem Cookie gespeichert, damit die Website in der von Ihnen gewählten Sprache wieder öffnet.",
  rightsTitle: "Ihre Rechte",
  rightsBefore:
    "Soweit die DSGVO gilt, können Ihnen Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch und Datenübertragbarkeit zustehen sowie das Recht, sich bei einer Aufsichtsbehörde zu beschweren. Wenden Sie sich an ",
  rightsAfter: ", um diese Rechte auszuüben.",
} as const;
