import { readFileSync } from "node:fs";
import { bookScoutContent } from "../content/examples/bookscout";
import { createIdeaMarkdown, createIdeaSnapshotPdf } from "../lib/project/export";
import {
  createIdeaSnapshotExport,
  parseIdeaSnapshotImport,
} from "../lib/project/ideaSnapshot";
import { createIdea, type Idea } from "../lib/project/types";

const failures: string[] = [];

function check(name: string, condition: boolean) {
  if (!condition) {
    failures.push(name);
  }
}

function load(name: string) {
  return JSON.parse(
    readFileSync(new URL(`../fixtures/transfer/${name}`, import.meta.url), "utf8"),
  ) as unknown;
}

const englishIdea = bookScoutContent("en").idea;
const germanIdea = bookScoutContent("de").idea;
check(
  "bookscout-en-idea",
  englishIdea ===
    "BookScout recommends books to readers based on the books on their own bookshelves. The usefulness of this idea is a hypothesis.",
);
check(
  "bookscout-de-idea",
  germanIdea ===
    "BookScout empfiehlt Leserinnen und Lesern Bücher auf Basis der Bücher in ihrem eigenen Bücherregal. Die Nützlichkeit dieser Idee ist eine Hypothese.",
);

const clarify = parseIdeaSnapshotImport(load("clarify-v1.json"));
check("clarify-v1-ok", clarify.ok);
if (clarify.ok) {
  const idea = clarify.snapshot.idea;
  check("clarify-v1-source", clarify.sourceVersion === 1);
  check("clarify-v1-title", idea.title === "BookScout");
  check("clarify-v1-created", idea.createdAt === "2026-03-01T10:00:00.000Z");
  check("clarify-v1-updated", idea.updatedAt === "2026-03-02T11:30:00.000Z");
  check("clarify-v1-idea-text", idea.stages.idea.answer.includes("Bücherregal"));
  check("clarify-v1-jobs-open", idea.stages.jobs.answer === "");
  check("clarify-v1-area", idea.area === "clarify");
  check("clarify-v1-keeps-feedback-on-import", Boolean(idea.stages.idea.feedback));

  const exported = createIdeaSnapshotExport(idea);
  const raw = JSON.stringify(exported);
  check("export-keeps-suggestion", raw.includes("Nicht übernommener Vorschlag"));
  check("export-keeps-feedback-summary", raw.includes("Anbieterzusammenfassung"));
  check("export-strips-api-key-name", !/api[_-]?key|OPENAI/i.test(raw));
  check("export-keeps-field-id", raw.includes('"context"') && !raw.includes('"Lebenszyklus"'));
  check("export-includes-later-stage-key", raw.includes('"jobs"'));
  check("export-version-3", exported.formatVersion === 3);

  const roundtrip = parseIdeaSnapshotImport(exported);
  check(
    "clarify-roundtrip",
    roundtrip.ok &&
      roundtrip.snapshot.idea.stages.context.answer.includes("zurückgestellt") &&
      roundtrip.snapshot.idea.stages.idea.feedback?.summary ===
        "Interne Anbieterzusammenfassung, die nicht exportiert werden darf.",
  );
}

const backup = parseIdeaSnapshotImport(load("backup-v2.json"));
check("backup-v2-ok", backup.ok);
if (backup.ok) {
  const idea = backup.snapshot.idea;
  check("backup-source", backup.sourceVersion === 2);
  check("backup-jobs", idea.stages.jobs.answer.startsWith("Record books"));
  check("backup-area", idea.area === "workspace");
  check("backup-submitted", idea.stages.jobs.submittedAnswer === "Record owned books, then ask.");
  check("backup-value-open", idea.stages.value.answer === "");
  const again = parseIdeaSnapshotImport(createIdeaSnapshotExport(idea));
  check(
    "backup-roundtrip",
    again.ok &&
      again.snapshot.idea.stages.jobs.answer === idea.stages.jobs.answer &&
      again.snapshot.idea.updatedAt === idea.updatedAt &&
      again.snapshot.idea.stages.jobs.submittedAnswer === "Record owned books, then ask.",
  );

  const markdownSnapshot = createIdeaMarkdown(idea, "en", "snapshot");
  const markdownFull = createIdeaMarkdown(idea, "en", "full");
  check("markdown-snapshot-omits-jobs", !markdownSnapshot.includes("Record books on the shelf"));
  check("markdown-full-keeps-jobs", markdownFull.includes("Record books on the shelf"));
  check("markdown-open", markdownSnapshot.includes("Open"));
  check("markdown-additional", markdownFull.includes("Record owned books, then ask."));
  check("markdown-raw-idea", markdownFull.includes(englishIdea));
}

const invalid = parseIdeaSnapshotImport(load("invalid-snapshot.json"));
check("invalid-rejected", !invalid.ok && invalid.reason === "malformed_idea");
const unknown = parseIdeaSnapshotImport(load("unknown-envelope.json"));
check("unknown-prototype-rejected", !unknown.ok && unknown.reason === "not_snapshot");
check("plain-json-rejected", !parseIdeaSnapshotImport({ hello: "world" }).ok);

const long = createIdea();
long.title = "Bücherregal";
long.stages.idea.answer = `${germanIdea} ${"Sehr langer Satz über das eigene Bücherregal. ".repeat(80)}`;
long.stages.idea.feedback = {
  summary: "Das erwartete Ergebnis ist klar beschrieben.",
  observations: ["Die Antwort beschreibt den geplanten Ablauf."],
  uncertainties: ["Die wichtigste Nutzergruppe braucht noch Belege."],
  suggestions: ["Benennen Sie zuerst eine konkrete Nutzergruppe zum Testen."],
  assumptions: ["Nutzerinnen und Nutzer teilen ihre Bücherregale."],
  frames: [{ label: "Entscheidungsrahmen", text: "Fokussieren Sie die erste Nutzergruppe." }],
  status: "ready_to_continue",
};
long.stages.problem.answer = "Arbeitsantwort";
const pdf = createIdeaSnapshotPdf(long, "de", undefined, "full");
const pdfText = Buffer.from(pdf).toString("latin1");
check("pdf-a4", pdfText.includes("/MediaBox [0 0 595 842]"));
check("pdf-pages", /1\/\d+/.test(pdfText) && pdfText.includes("2/"));
check("pdf-umlaut", pdfText.includes("Bücherregal"));
check("pdf-project-name", pdfText.includes("Bücherregal"));
check("pdf-feedback-title", pdfText.includes("KI-Feedback"));
check("pdf-feedback-summary", pdfText.includes("Das erwartete Ergebnis ist klar beschrieben."));
check("pdf-feedback-observation", pdfText.includes("Die Antwort beschreibt den geplanten Ablauf."));
check("pdf-feedback-frame", pdfText.includes("Entscheidungsrahmen"));
check("pdf-feedback-uncertainty", pdfText.includes("Die wichtigste Nutzergruppe braucht noch Belege."));
check("pdf-feedback-suggestion", pdfText.includes("Benennen Sie zuerst eine konkrete Nutzergruppe zum Testen."));
check("pdf-justified-text", / [1-9]\d*(?:\.\d+)? Tw/.test(pdfText));
check("pdf-clarified-stage", pdfText.includes("GEKLÄRT"));
check("pdf-in-progress-stage", pdfText.includes("IN ARBEIT"));
check("pdf-unresolved-stage", pdfText.includes("OFFEN"));
check("pdf-no-filled-status", !pdfText.includes("- AUSGEFÜLLT)"));

const listIdea = createIdea();
listIdea.stages.idea.answer = [
  "A list should preserve its natural spacing in the exported document.",
  "1. First list item",
  "2. Second list item",
].join("\n");
const listPdfText = Buffer.from(createIdeaSnapshotPdf(listIdea)).toString("latin1");
check("pdf-stage-per-page", listPdfText.includes("/Count 7"));
check(
  "pdf-list-not-justified",
  /0\.000 Tw 46 \d+ Td \(1\. First list item\) Tj ET/.test(listPdfText),
);

const feedbackExport = createIdeaSnapshotExport(long);
const feedbackRoundtrip = parseIdeaSnapshotImport(feedbackExport);
check("json-feedback-version", feedbackExport.formatVersion === 3);
check(
  "json-feedback-kept",
  feedbackExport.idea.stages.idea.feedback?.frames?.[0]?.text ===
    "Fokussieren Sie die erste Nutzergruppe.",
);
check(
  "json-feedback-roundtrip",
  feedbackRoundtrip.ok &&
    feedbackRoundtrip.snapshot.idea.stages.idea.feedback?.suggestions[0] ===
      "Benennen Sie zuerst eine konkrete Nutzergruppe zum Testen.",
);

const feedbackMarkdown = createIdeaMarkdown(long, "en", "snapshot");
check("markdown-feedback-title", feedbackMarkdown.includes("### AI feedback"));
check("markdown-feedback-summary", feedbackMarkdown.includes("Das erwartete Ergebnis ist klar beschrieben."));
check("markdown-feedback-list", feedbackMarkdown.includes("- Die Antwort beschreibt den geplanten Ablauf."));

const untouched: Idea = createIdea();
const before = JSON.stringify(untouched);
if (!invalid.ok && !unknown.ok) {
  check("rejected-files-do-not-mutate-sample", JSON.stringify(untouched) === before);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("transfer checks passed");
