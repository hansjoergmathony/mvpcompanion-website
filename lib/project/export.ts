import { buildProductConcept } from "@/lib/clarification";
import {
  createIdeaSnapshotExport,
  getClarificationProgress,
  getIdeaTitle,
  getSnapshotStages,
} from "@/lib/project/ideaSnapshot";
import type { Idea } from "@/lib/project/types";

export function ideaExportFilename(idea: Idea, extension: "json" | "pdf"): string {
  const title = getIdeaTitle(idea)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 80);

  return `mvpcompanion-${title || "idea"}.${extension}`;
}

export function exportIdeaAsJson(idea: Idea): void {
  download(
    JSON.stringify(createIdeaSnapshotExport(idea), null, 2),
    ideaExportFilename(idea, "json"),
    "application/json;charset=utf-8",
  );
}

export function exportIdeaAsPdf(idea: Idea): void {
  downloadPdf(createIdeaSnapshotPdf(idea), ideaExportFilename(idea, "pdf"));
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

/**
 * Generates a compact, standards-based PDF using built-in Helvetica fonts so exports
 * work without a server, canvas capture, or an additional browser dependency.
 */
export function createIdeaSnapshotPdf(idea: Idea): Uint8Array {
  const title = getIdeaTitle(idea);
  const concept = buildProductConcept(idea);
  const progress = getClarificationProgress(idea);
  const pages: PdfPage[] = [{ lines: [], y: 758 }];
  let page = pages[0];

  const addLine = (text: string, size = 10, color = "0.12 0.18 0.28") => {
    if (page.y < 72) {
      page = { lines: [], y: 758 };
      pages.push(page);
    }

    page.lines.push(
      `BT /F1 ${size} Tf ${color} rg 46 ${page.y} Td (${pdfText(text)}) Tj ET`,
    );
    page.y -= size + 6;
  };
  const addParagraph = (text: string, size = 10, color?: string) => {
    wrapPdfText(text, 84).forEach((line) => addLine(line, size, color));
    page.y -= 5;
  };
  const addHeading = (text: string) => {
    page.y -= 8;
    addLine(text.toUpperCase(), 9, "0.10 0.39 0.67");
    page.y -= 2;
  };

  addLine("IDEA SNAPSHOT", 22, "0.04 0.12 0.25");
  addParagraph(title, 15, "0.04 0.12 0.25");
  addLine(`Status: ${readableStatus(idea.status)}`, 10);
  addLine(
    `Clarification: ${progress.clarified} clarified, ${progress.inProgress} in progress, ${progress.unresolved} unresolved`,
    10,
  );
  addLine(`Current stage: ${readableStage(idea.currentStage)}`, 10);
  addLine(`Created: ${formatDate(idea.createdAt)}  |  Updated: ${formatDate(idea.updatedAt)}`, 9, "0.38 0.43 0.50");
  page.y -= 12;

  addHeading("Snapshot content");
  for (const stage of getSnapshotStages(idea)) {
    addLine(`${stage.label} - ${readableStageStatus(stage.status)}`, 11);
    addParagraph(stage.content, 10, stage.status === "unresolved" ? "0.38 0.43 0.50" : undefined);
  }

  addHeading("Recorded assumptions");
  concept.assumptions.forEach((item) => addParagraph(`- ${item}`, 10));
  addHeading("Open questions");
  concept.openQuestions.forEach((item) => addParagraph(`- ${item}`, 10));

  return serializePdf(pages, title);
}

function serializePdf(pages: PdfPage[], title: string): Uint8Array {
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
      "BT /F1 15 Tf 1 1 1 rg 46 810 Td (MVPCompanion) Tj ET",
      ...page.lines,
      `BT /F1 8 Tf 0.38 0.43 0.50 rg 46 28 Td (Idea Snapshot - ${pdfText(title)} - ${index + 1}/${pages.length}) Tj ET`,
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

function readableStatus(status: Idea["status"]): string {
  return status === "completed" ? "Completed" : status === "in_progress" ? "In progress" : "New";
}

function readableStage(stage: Idea["currentStage"]): string {
  return stage === "intake" ? "Starting context" : stage === "summary" ? "Idea Snapshot" : stage === "mvp" ? "MVPCompanion" : stage.charAt(0).toUpperCase() + stage.slice(1);
}

function readableStageStatus(status: "clarified" | "in_progress" | "unresolved"): string {
  return status === "clarified" ? "Clarified" : status === "in_progress" ? "In progress" : "Unresolved";
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Unknown" : date.toLocaleDateString();
}

function wrapPdfText(value: string, maxLength: number): string[] {
  const words = value.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if (`${line} ${word}`.trim().length > maxLength && line) {
      lines.push(line);
      line = word;
    } else {
      line = `${line} ${word}`.trim();
    }
  }
  return line ? [...lines, line] : [""];
}

function pdfText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[()\\]/g, "\\$&")
    .replace(/[^\x20-\x7E]/g, "?");
}

function asciiBytes(value: string): Uint8Array {
  return Uint8Array.from(value, (character) => character.charCodeAt(0) & 0xff);
}

function byteLength(value: string): number {
  return asciiBytes(value).length;
}
