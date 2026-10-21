import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Locale } from "@/lib/i18n/config";

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqSection = {
  heading: string;
  items: FaqItem[];
};

export type FaqDocument = {
  title: string;
  sections: FaqSection[];
};

export function parseFaqMarkdown(source: string): FaqDocument {
  const lines = source.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").split("\n");
  let title = "";
  const sections: FaqSection[] = [];
  let section: FaqSection | null = null;
  let question: string | null = null;
  let answer: string[] = [];

  function flushQuestion() {
    if (!section || !question) {
      question = null;
      answer = [];
      return;
    }

    section.items.push({
      question,
      answer: answer.join("\n").trim(),
    });
    question = null;
    answer = [];
  }

  for (const line of lines) {
    if (line.startsWith("### ")) {
      flushQuestion();
      question = line.slice(4).trim();
      continue;
    }

    if (line.startsWith("## ")) {
      flushQuestion();
      section = { heading: line.slice(3).trim(), items: [] };
      sections.push(section);
      continue;
    }

    if (line.startsWith("# ")) {
      flushQuestion();
      title = line.slice(2).trim();
      continue;
    }

    if (question) {
      answer.push(line);
    }
  }

  flushQuestion();

  if (!title || sections.some((entry) => entry.items.length === 0)) {
    throw new Error("FAQ markdown is missing a title or a question.");
  }

  return { title, sections };
}

export function answerParagraphs(answer: string): string[] {
  return answer
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\s*\n\s*/g, " ").trim())
    .filter((paragraph) => paragraph.length > 0);
}

export function loadFaq(locale: Locale): FaqDocument {
  return parseFaqMarkdown(readFaqSource(locale));
}

function readFaqSource(locale: Locale): string {
  if (locale === "de") {
    try {
      return readFileSync(join(process.cwd(), "content/de/faq.md"), "utf8");
    } catch (error) {
      if (!isMissingFile(error)) {
        throw error;
      }
    }
  }

  return readFileSync(join(process.cwd(), "public/resources/faq.md"), "utf8");
}

function isMissingFile(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}
