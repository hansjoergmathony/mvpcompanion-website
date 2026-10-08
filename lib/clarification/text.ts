import type { ClarificationRequest } from "@/lib/clarification/types";

const FEATURE_PATTERN =
  /\b(screens?|dashboard|buttons?|login|notifications?|chat|feed|profile|features?|ui|ux|wireframes?|pages?|settings|onboarding|bildschirm|anmeldung|benachrichtigung|funktion|seite|einstellung)\b/i;
const EVERYONE_PATTERN =
  /\b(everyone|everybody|anyone|anybody|all users|people in general|the general public|jeder|jede|jedermann|alle nutzer|alle benutzer|die allgemeinheit)\b/i;
const SOLUTION_PATTERN =
  /\b(app|application|platform|software|system|tool|website|product|anwendung|plattform|werkzeug|produkt)\b/i;
const TECHNOLOGY_PATTERN =
  /\b(api|database|sql|react|ios|android|cloud|ai|ml|machine learning|blockchain|saas|server|backend|frontend|swift|kotlin|firebase|datenbank|künstliche intelligenz)\b/i;
const PROBLEM_PATTERN =
  /\b(problem|struggle|hard|difficult|waste|forget|lose|lost|can't|cannot|unable|frustrating|pain|confusing|missing|slow|duplicate|guess|schwierig|schwer|vergessen|verlieren|frustrierend|verwirrend|fehlt|langsam|doppelt)\b/i;
const OUTCOME_PATTERN =
  /\b(so that|so they|because|outcome|result|value|matters|able to|can finally|instead of|they can|they stop|they decide|they feel|damit|weil|ergebnis|wert|endlich|stattdessen)\b/i;
const CAPABILITY_PATTERN =
  /\b(manage|track|organize|recommend|store|sync|search|filter|notify|remind|verwalten|verfolgen|organisieren|empfehlen|speichern|synchronisieren|suchen|filtern|benachrichtigen|erinnern)\b/i;
const TIME_PATTERN =
  /\b(over time|then|after|before|once|later|first|starts?|becomes?|ends?|unread|archived|draft|done|grows?|moves?|currently reading|danach|bevor|sobald|später|zuerst|beginnt|endet|ungelesen|archiviert|entwurf|fertig|mit der zeit)\b/i;
const SECONDARY_PATTERN =
  /\b(also|as well as|and also|secondary|plus|außerdem|sowie|sekundär)\b/i;
const OBJECT_PATTERN =
  /\b(library|collection|catalog|workspace|board|inbox|list|record|profile|project|note|document|playlist|inventory|account|shelf|pile|bibliothek|sammlung|katalog|arbeitsbereich|posteingang|liste|datensatz|projekt|notiz|dokument|inventar|konto|regal)\b/i;

export function normalizeAnswer(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function wordCount(value: string): number {
  const words = normalizeAnswer(value).split(" ").filter(Boolean);
  return words.length;
}

export function splitClauses(value: string): string[] {
  return normalizeAnswer(value)
    .split(/\s+and\s+|\s+und\s+|\s*,\s*|\s*;\s*|\s*\.\s+/i)
    .map((part) => part.trim())
    .filter((part) => wordCount(part) >= 2);
}

export function hasMultipleFoci(value: string): boolean {
  const andParts = normalizeAnswer(value)
    .split(/\s+and\s+|\s+und\s+/i)
    .map((part) => part.trim())
    .filter((part) => wordCount(part) >= 2);

  return andParts.length >= 2;
}

export function mentionsFeatures(value: string): boolean {
  return FEATURE_PATTERN.test(value);
}

export function mentionsEveryone(value: string): boolean {
  return EVERYONE_PATTERN.test(value);
}

export function mentionsSolution(value: string): boolean {
  return SOLUTION_PATTERN.test(value);
}

export function mentionsProblemLanguage(value: string): boolean {
  return PROBLEM_PATTERN.test(value);
}

export function mentionsOutcome(value: string): boolean {
  return OUTCOME_PATTERN.test(value);
}

export function mentionsTime(value: string): boolean {
  return TIME_PATTERN.test(value);
}

export function mentionsTechnology(value: string): boolean {
  return TECHNOLOGY_PATTERN.test(value);
}

export function mentionsCapability(value: string): boolean {
  return CAPABILITY_PATTERN.test(value);
}

export function mentionsSecondaryUsers(value: string): boolean {
  return SECONDARY_PATTERN.test(value);
}

export function mentionsCentralObject(value: string): boolean {
  return OBJECT_PATTERN.test(value);
}

export function mentionsNonTarget(value: string): boolean {
  return /\b(not|except|rather than|instead of|outside|nicht|außer|anstatt|statt|außerhalb)\b/i.test(value);
}

export function restatesPrior(answer: string, prior: string): boolean {
  return Boolean(prior) && lexicalOverlap(answer, prior) >= 0.75;
}

export function priorStatement(
  request: ClarificationRequest,
  key: ClarificationRequest["stageKey"],
): string {
  return relatedText(request, key);
}

export function lexicalOverlap(left: string, right: string): number {
  const leftWords = new Set(tokenize(left));
  const rightWords = new Set(tokenize(right));

  if (leftWords.size === 0 || rightWords.size === 0) {
    return 0;
  }

  let shared = 0;
  leftWords.forEach((word) => {
    if (rightWords.has(word)) {
      shared += 1;
    }
  });

  return shared / Math.min(leftWords.size, rightWords.size);
}

export function firstMeaningfulSentence(value: string): string {
  const sentence = normalizeAnswer(value).split(/(?<=[.!?])\s+/)[0] ?? value;
  return sentence.replace(/[.]+$/, "");
}

export function stripLeadIn(value: string): string {
  return firstMeaningfulSentence(value)
    .replace(
      /^(i (want to|would like to|wanna) (build |create |make )?|ich (möchte|will) )/i,
      "",
    )
    .replace(
      /^(an? )?(app|application|platform|tool|product|eine? )?(app|anwendung|plattform|werkzeug|produkt) (where|that|to|die|das|wo) /i,
      "",
    )
    .replace(/^(it is|it's|this is|it has|it includes|es ist|das ist) /i, "")
    .trim();
}

function tokenize(value: string): string[] {
  return normalizeAnswer(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .split(" ")
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "that",
  "this",
  "with",
  "from",
  "their",
  "they",
  "have",
  "has",
  "are",
  "was",
  "can",
  "will",
  "app",
  "want",
  "build",
  "people",
]);

export function relatedText(
  request: ClarificationRequest,
  key: ClarificationRequest["stageKey"],
): string {
  return request.relatedAnswers[key]?.trim() ?? "";
}
