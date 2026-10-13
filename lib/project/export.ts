import { dictionary as de } from "@/content/de";
import { dictionary as en, type Dictionary } from "@/content/en";
import type { StageFeedback } from "@/lib/clarification/types";
import type { Locale } from "@/lib/i18n/config";
import {
  createIdeaSnapshotExport,
  getIdeaTitle,
  getStageSnapshotStatus,
  type SnapshotStage,
} from "@/lib/project/ideaSnapshot";
import {
  stageKeys,
  stageNumberByKey,
  type Idea,
  type StageKey,
} from "@/lib/project/types";

function copyFor(locale: Locale) {
  return locale === "de" ? de : en;
}

export function ideaExportFilename(
  idea: Idea,
  extension: "json" | "pdf" | "md",
  locale: Locale = "en",
): string {
  const title = getIdeaTitle(idea, copyFor(locale).ui.untitledIdea)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 80);

  return `mvpcompanion-${title || "idea"}.${extension}`;
}

export type ExportScope = "snapshot" | "full";

export function exportIdeaAsJson(idea: Idea, locale: Locale = "en"): void {
  download(
    JSON.stringify(createIdeaSnapshotExport(idea), null, 2),
    ideaExportFilename(idea, "json", locale),
    "application/json;charset=utf-8",
  );
}

export function exportIdeaAsPdf(
  idea: Idea,
  locale: Locale = "en",
  labels: Dictionary["ui"]["pdf"] = copyFor(locale).ui.pdf,
  scope: ExportScope = "snapshot",
): void {
  downloadPdf(
    createIdeaSnapshotPdf(idea, locale, labels, scope),
    ideaExportFilename(idea, "pdf", locale),
  );
}

export function exportIdeaAsMarkdown(
  idea: Idea,
  locale: Locale = "en",
  scope: ExportScope = "snapshot",
): void {
  download(
    createIdeaMarkdown(idea, locale, scope),
    ideaExportFilename(idea, "md", locale),
    "text/markdown;charset=utf-8",
  );
}

function download(content: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  triggerDownload(url, filename);
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function downloadPdf(bytes: Uint8Array, filename: string) {
  const binary = new Uint8Array(bytes);
  const url = URL.createObjectURL(
    new Blob([binary.buffer as ArrayBuffer], { type: "application/pdf" }),
  );
  triggerDownload(url, filename);
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function triggerDownload(url: string, filename: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

type PdfPage = { lines: string[]; y: number };
type PdfTextLine = { text: string; justify: boolean };

const PDF_LEFT_MARGIN = 46;
const PDF_RIGHT_MARGIN = 46;
const PDF_PAGE_WIDTH = 595;
const PDF_TEXT_WIDTH = PDF_PAGE_WIDTH - PDF_LEFT_MARGIN - PDF_RIGHT_MARGIN;
const HELVETICA_DEFAULT_WIDTH = 556;
const HELVETICA_WIDTHS: Record<string, number> = {
  " ": 278, "!": 278, '"': 355, "#": 556, "$": 556, "%": 889, "&": 667,
  "'": 191, "(": 333, ")": 333, "*": 389, "+": 584, ",": 278, "-": 333,
  ".": 278, "/": 278, ":": 278, ";": 278, "<": 584, "=": 584, ">": 584,
  "?": 556, "@": 1015, "[": 278, "\\": 278, "]": 278, "^": 469, "_": 556,
  "`": 222, "{": 334, "|": 260, "}": 334, "~": 584,
  A: 667, B: 667, C: 722, D: 722, E: 667, F: 611, G: 778, H: 722, I: 278,
  J: 500, K: 667, L: 556, M: 833, N: 722, O: 778, P: 667, Q: 778, R: 722,
  S: 667, T: 611, U: 722, V: 667, W: 944, X: 667, Y: 667, Z: 611,
  a: 556, b: 556, c: 500, d: 556, e: 556, f: 278, g: 556, h: 556, i: 222,
  j: 222, k: 500, l: 222, m: 833, n: 556, o: 556, p: 556, q: 556, r: 333,
  s: 500, t: 278, u: 556, v: 500, w: 722, x: 500, y: 500, z: 500,
  "0": 556, "1": 556, "2": 556, "3": 556, "4": 556, "5": 556, "6": 556,
  "7": 556, "8": 556, "9": 556,
};

/**
 * Generates a compact, standards-based PDF using built-in Helvetica fonts so exports
 * work without a server, canvas capture, or an additional browser dependency.
 */
export function createIdeaSnapshotPdf(
  idea: Idea,
  locale: Locale = "en",
  labels: Dictionary["ui"]["pdf"] = copyFor(locale).ui.pdf,
  scope: ExportScope = "snapshot",
): Uint8Array {
  const copy = copyFor(locale);
  const title = getIdeaTitle(idea, copy.ui.untitledIdea);
  const rows = exportRows(idea, locale, scope);
  const pages: PdfPage[] = [{ lines: [], y: 758 }];
  let page = pages[0];

  const addLine = (
    text: string,
    size = 10,
    color = "0.12 0.18 0.28",
    wordSpacing = 0,
  ) => {
    if (page.y < 72) {
      page = { lines: [], y: 758 };
      pages.push(page);
    }

    page.lines.push(
      `BT /F1 ${size} Tf ${color} rg ${wordSpacing.toFixed(3)} Tw ${PDF_LEFT_MARGIN} ${page.y} Td (${pdfText(text)}) Tj ET`,
    );
    page.y -= size + 6;
  };
  const addParagraph = (text: string, size = 10, color?: string) => {
    const lines = wrapPdfText(text, PDF_TEXT_WIDTH, size);
    lines.forEach((line) => {
      const spaces = line.text.split(" ").length - 1;
      const wordSpacing =
        line.justify && spaces > 0
          ? Math.max(0, (PDF_TEXT_WIDTH - pdfTextWidth(line.text, size)) / spaces)
          : 0;
      addLine(line.text, size, color, wordSpacing);
    });
    page.y -= 5;
  };
  const addHeading = (text: string) => {
    page.y -= 8;
    addLine(text.toUpperCase(), 9, "0.10 0.39 0.67");
    page.y -= 2;
  };
  const addFeedbackList = (label: string, items: readonly string[]) => {
    if (!items.length) return;

    addLine(label, 9, "0.10 0.39 0.67");
    items.forEach((item) => addParagraph(`- ${item}`, 9));
  };
  const addFeedback = (feedback: StageFeedback) => {
    page.y -= 4;
    addLine(labels.feedbackTitle, 9, "0.10 0.39 0.67");
    addParagraph(labels.feedbackNote, 8, "0.38 0.43 0.50");

    if (feedback.summary.trim()) {
      addLine(labels.feedbackSummary, 9, "0.10 0.39 0.67");
      addParagraph(feedback.summary, 10);
    }
    addFeedbackList(labels.feedbackObservations, feedback.observations);
    feedback.frames?.forEach((frame) => {
      addLine(frame.label, 9, "0.10 0.39 0.67");
      addParagraph(frame.text, 10);
    });
    addFeedbackList(labels.assumptions, feedback.assumptions ?? []);
    addFeedbackList(labels.feedbackUncertainties, feedback.uncertainties);
    addFeedbackList(labels.openQuestions, feedback.suggestions);
  };

  addLine(scope === "full" ? labels.headingFull : labels.heading, 18, "0.04 0.12 0.25");
  addParagraph(title, 15, "0.04 0.12 0.25");
  addLine(`${labels.status}: ${labels.statuses[idea.status]}`, 10);
  addLine(`${labels.currentStage}: ${readableStage(idea.currentStage, labels, copy.priorStageLabel)}`, 10);
  addLine(
    `${labels.created}: ${formatDate(idea.createdAt, locale, labels.unknownDate)}  |  ${labels.updated}: ${formatDate(idea.updatedAt, locale, labels.unknownDate)}  |  ${labels.exported}: ${formatDate(new Date().toISOString(), locale, labels.unknownDate)}`,
    9,
    "0.38 0.43 0.50",
  );
  addParagraph(labels.notValidation, 9, "0.38 0.43 0.50");
  page.y -= 8;

  for (const row of rows) {
    const number = String(row.number).padStart(2, "0");
    addHeading(`${number} ${row.label} — ${labels.stageStatus[row.status]}`);
    addParagraph(
      row.content,
      10,
      row.status === "unresolved" ? "0.38 0.43 0.50" : undefined,
    );
    if (row.additional) {
      addLine(labels.additionalField, 9, "0.10 0.39 0.67");
      addParagraph(row.additional, 10);
    }
    if (row.feedback) {
      addFeedback(row.feedback);
    }
  }

  return serializePdf(pages, title, scope === "full" ? labels.footerFull : labels.footer);
}

function serializePdf(pages: PdfPage[], title: string, footer: string): Uint8Array {
  const objects: string[] = [];
  const pageObjectIds = pages.map((_, index) => 4 + index * 2);
  const contentObjectIds = pages.map((_, index) => 5 + index * 2);
  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[2] = `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pages.length} >>`;
  objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";

  pages.forEach((page, index) => {
    const pageId = pageObjectIds[index];
    const contentId = contentObjectIds[index];
    const content = [
      "q 0.04 0.12 0.25 rg 0 790 595 52 re f Q",
      `BT /F1 15 Tf 1 1 1 rg 0 Tw ${PDF_LEFT_MARGIN} 810 Td (MVPCompanion) Tj ET`,
      ...page.lines,
      `BT /F1 8 Tf 0.38 0.43 0.50 rg 46 28 Td (${pdfText(`${footer} - ${title.slice(0, 48)} - ${index + 1}/${pages.length}`)}) Tj ET`,
    ].join("\n");
    objects[pageId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentId} 0 R >>`;
    objects[contentId] = `<< /Length ${byteLength(content)} >>\nstream\n${content}\nendstream`;
  });

  const chunks: Uint8Array[] = [asciiBytes("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n")];
  const offsets = [0];
  let offset = chunks[0].length;
  for (let id = 1; id < objects.length; id += 1) {
    offsets[id] = offset;
    const object = asciiBytes(`${id} 0 obj\n${objects[id]}\nendobj\n`);
    chunks.push(object);
    offset += object.length;
  }

  const xrefOffset = offset;
  const xref = ["xref", `0 ${objects.length}`, "0000000000 65535 f "];
  for (let id = 1; id < objects.length; id += 1) {
    xref.push(`${String(offsets[id]).padStart(10, "0")} 00000 n `);
  }
  chunks.push(
    asciiBytes(
      `${xref.join("\n")}\ntrailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`,
    ),
  );

  const result = new Uint8Array(chunks.reduce((size, chunk) => size + chunk.length, 0));
  let start = 0;
  chunks.forEach((chunk) => {
    result.set(chunk, start);
    start += chunk.length;
  });
  return result;
}

function readableStage(
  stage: Idea["currentStage"],
  labels: Dictionary["ui"]["pdf"],
  stageLabels: Record<StageKey, string>,
): string {
  if (stage === "intake" || stage === "summary" || stage === "mvp") {
    return labels.stages[stage];
  }

  return stageLabels[stage];
}

type ExportRow = {
  number: number;
  label: string;
  open: boolean;
  status: SnapshotStage["status"];
  content: string;
  additional: string;
  feedback: StageFeedback | null;
};

function exportRows(idea: Idea, locale: Locale, scope: ExportScope): ExportRow[] {
  const copy = copyFor(locale);
  const openLabel = copy.ui.pdf.openContent;
  return stageKeys
    .filter((key) => scope === "full" || stageNumberByKey[key] <= 6)
    .map((key) => {
      const stage = idea.stages[key];
      const answer = stage?.answer ?? "";
      const submitted = stage?.submittedAnswer?.trim() ?? "";
      const additional =
        submitted && submitted !== answer.trim() ? stage?.submittedAnswer ?? "" : "";
      return {
        number: stageNumberByKey[key],
        label: copy.priorStageLabel[key],
        open: !answer.trim(),
        status: getStageSnapshotStatus(stage),
        content: answer.trim() ? answer : openLabel,
        additional,
        feedback: stage?.feedback ?? null,
      };
    });
}

export function createIdeaMarkdown(idea: Idea, locale: Locale, scope: ExportScope): string {
  const copy = copyFor(locale);
  const labels = copy.ui.pdf;
  const title = getIdeaTitle(idea, copy.ui.untitledIdea);
  const rows = exportRows(idea, locale, scope);
  const lines = [
    `# ${title}`,
    "",
    `${labels.exported}: ${formatDate(new Date().toISOString(), locale, labels.unknownDate)}`,
    `${labels.updated}: ${formatDate(idea.updatedAt, locale, labels.unknownDate)}`,
    "",
    labels.notValidation,
    "",
  ];

  rows.forEach((row) => {
    const number = String(row.number).padStart(2, "0");
    const state = row.open ? labels.openContent : labels.filledField;
    lines.push(`## ${number} ${row.label}`, "", `_${state}_`, "", row.content, "");
    if (row.additional) {
      lines.push(`**${labels.additionalField}**`, "", row.additional, "");
    }
    if (row.feedback) {
      appendMarkdownFeedback(lines, row.feedback, labels);
    }
  });

  return lines.join("\n");
}

function appendMarkdownFeedback(
  lines: string[],
  feedback: StageFeedback,
  labels: Dictionary["ui"]["pdf"],
) {
  lines.push(`### ${labels.feedbackTitle}`, "", `_${labels.feedbackNote}_`, "");

  if (feedback.summary.trim()) {
    lines.push(`**${labels.feedbackSummary}**`, "", feedback.summary, "");
  }
  appendMarkdownFeedbackList(lines, labels.feedbackObservations, feedback.observations);
  feedback.frames?.forEach((frame) => {
    lines.push(`**${frame.label}**`, "", frame.text, "");
  });
  appendMarkdownFeedbackList(lines, labels.assumptions, feedback.assumptions ?? []);
  appendMarkdownFeedbackList(lines, labels.feedbackUncertainties, feedback.uncertainties);
  appendMarkdownFeedbackList(lines, labels.openQuestions, feedback.suggestions);
}

function appendMarkdownFeedbackList(
  lines: string[],
  label: string,
  items: readonly string[],
) {
  if (!items.length) return;

  lines.push(`**${label}**`, "", ...items.map((item) => `- ${item}`), "");
}

function formatDate(value: string, locale: Locale, unknown: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? unknown : date.toLocaleDateString(locale);
}

function wrapPdfText(value: string, maxWidth: number, size: number): PdfTextLine[] {
  const lines: PdfTextLine[] = [];

  for (const paragraph of value.replace(/\r\n?/g, "\n").split("\n")) {
    if (!paragraph.trim()) {
      lines.push({ text: "", justify: false });
      continue;
    }

    const isListItem = /^\s*(?:[-*•]\s+|\d+[.)]\s+)/.test(paragraph);
    const words = paragraph
      .trim()
      .split(/\s+/)
      .flatMap((word) => splitPdfWord(word, maxWidth, size));
    const wrappedLines: string[] = [];
    let currentLine = "";
    for (const word of words) {
      const candidate = `${currentLine} ${word}`.trim();
      if (pdfTextWidth(candidate, size) > maxWidth && currentLine) {
        wrappedLines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = candidate;
      }
    }
    if (currentLine) wrappedLines.push(currentLine);

    wrappedLines.forEach((text, index) => {
      lines.push({
        text,
        justify: !isListItem && index < wrappedLines.length - 1,
      });
    });
  }

  return lines.length > 0 ? lines : [{ text: "", justify: false }];
}

function splitPdfWord(word: string, maxWidth: number, size: number): string[] {
  if (pdfTextWidth(word, size) <= maxWidth) {
    return [word];
  }

  const parts: string[] = [];
  let part = "";
  for (const character of word) {
    const candidate = `${part}${character}`;
    if (part && pdfTextWidth(candidate, size) > maxWidth) {
      parts.push(part);
      part = character;
    } else {
      part = candidate;
    }
  }
  if (part) parts.push(part);
  return parts;
}

function pdfTextWidth(value: string, size: number): number {
  const width = [...value].reduce(
    (total, character) => total + (HELVETICA_WIDTHS[character] ?? HELVETICA_DEFAULT_WIDTH),
    0,
  );
  return (width * size) / 1000;
}

function pdfText(value: string): string {
  return value
    .replaceAll("ä", "\u00E4")
    .replaceAll("ö", "\u00F6")
    .replaceAll("ü", "\u00FC")
    .replaceAll("Ä", "\u00C4")
    .replaceAll("Ö", "\u00D6")
    .replaceAll("Ü", "\u00DC")
    .replaceAll("ß", "\u00DF")
    .replaceAll("–", "-")
    .replaceAll("—", "-")
    .replaceAll("„", "\"")
    .replaceAll("“", "\"")
    .replaceAll("”", "\"")
    .replaceAll("’", "'")
    .replace(/[()\\]/g, "\\$&")
    .replace(/[^\x20-\x7E\u00A0-\u00FF]/g, "?");
}

function asciiBytes(value: string): Uint8Array {
  return Uint8Array.from(value, (character) => character.charCodeAt(0) & 0xff);
}

function byteLength(value: string): number {
  return asciiBytes(value).length;
}
