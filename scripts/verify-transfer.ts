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
  check("export-strips-suggestion", !raw.includes("Nicht übernommener Vorschlag"));
  check("export-strips-provider-summary", !raw.includes("Anbieterzusammenfassung"));
  check("export-strips-api-key-name", !/api[_-]?key|OPENAI/i.test(raw));
  check("export-keeps-field-id", raw.includes('"context"') && !raw.includes('"Lebenszyklus"'));
  check("export-includes-later-stage-key", raw.includes('"jobs"'));
  check("export-version-2", exported.formatVersion === 2);

  const roundtrip = parseIdeaSnapshotImport(exported);
  check("clarify-roundtrip", roundtrip.ok && roundtrip.ok && roundtrip.snapshot.idea.stages.context.answer.includes("zurückgestellt"));
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
  summary: "hidden provider text",
  observations: [],
  uncertainties: [],
  suggestions: ["SECRET-SUGGESTION"],
  assumptions: [],
  status: "needs_clarification",
};
const pdf = createIdeaSnapshotPdf(long, "de", undefined, "full");
const pdfText = Buffer.from(pdf).toString("latin1");
check("pdf-a4", pdfText.includes("/MediaBox [0 0 595 842]"));
check("pdf-pages", /1\/\d+/.test(pdfText) && pdfText.includes("2/"));
check("pdf-umlaut", pdfText.includes("Bücherregal"));
check("pdf-project-name", pdfText.includes("Bücherregal"));
check("pdf-no-suggestion", !pdfText.includes("SECRET-SUGGESTION"));
check("pdf-open-later-stage", pdfText.includes("Offen"));

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
