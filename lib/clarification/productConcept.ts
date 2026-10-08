import {
  firstMeaningfulSentence,
  normalizeAnswer,
  wordCount,
} from "@/lib/clarification/text";
import type { ProductConcept } from "@/lib/clarification/types";
import {
  stageKeys,
  type Idea,
  type StageKey,
  type StageState,
} from "@/lib/project/types";

const MISSING = {
  en: "This has not been clarified yet.",
  de: "Das ist noch nicht geklärt.",
} as const;

const SUMMARY_PREFIX: Record<StageKey, RegExp> = {
  idea: /^(?:the idea hypothesis is (?:that )?|die hypothese zur idee lautet:\s*)/i,
  problem: /^(?:the problem is that |das problem ist, dass )/i,
  user: /^(?:the primary user is |der primäre nutzer ist )/i,
  value: /^(?:the desired outcome is (?:that )?|das gewünschte ergebnis ist, dass )/i,
  product: /^(?:the product is (?:being described as )?|das produkt (?:ist |wird beschrieben als ))/i,
  context: /^(?:over time, |mit der zeit:\s*)/i,
};

export function buildProductConcept(
  ideaSnapshot: Idea,
  locale: "en" | "de" = "en",
): ProductConcept {
  const idea = understood(ideaSnapshot.stages.idea, "idea");
  const problem = understood(ideaSnapshot.stages.problem, "problem");
  const primaryUser = understood(ideaSnapshot.stages.user, "user");
  const desiredOutcome = understood(ideaSnapshot.stages.value, "value");
  const product = understood(ideaSnapshot.stages.product, "product");
  const lifecycle = understood(ideaSnapshot.stages.context, "context");

  return {
    idea: asStatement(idea, locale),
    problem: asStatement(problem, locale),
    primaryUser: asStatement(primaryUser, locale),
    desiredOutcome: asStatement(desiredOutcome, locale),
    valueProposition: composeValueProposition(
      {
        user: primaryUser,
        product,
        outcome: desiredOutcome,
      },
      locale,
    ),
    product: asStatement(product, locale),
    lifecycle: asStatement(lifecycle, locale),
    assumptions: collectAssumptions(ideaSnapshot, locale),
    openQuestions: collectOpenQuestions(
      ideaSnapshot,
      {
        idea,
        problem,
        primaryUser,
        desiredOutcome,
        product,
        lifecycle,
      },
      locale,
    ),
  };
}

function understood(stage: StageState, key: StageKey): string {
  const answer = normalizeAnswer(stage.answer);
  const summary = normalizeAnswer(stage.feedback?.summary ?? "");
  const cleanedSummary = stripEngineLead(summary, key);

  if (isPlaceholderSummary(summary)) {
    return answer;
  }

  if (
    cleanedSummary &&
    answer &&
    wordCount(answer) > wordCount(cleanedSummary) &&
    answer.toLowerCase().includes(cleanedSummary.toLowerCase().slice(0, 40))
  ) {
    return answer;
  }

  return cleanedSummary || answer;
}

function stripEngineLead(value: string, key: StageKey): string {
  if (!value) {
    return value;
  }

  const stripped = value.replace(SUMMARY_PREFIX[key], "").replace(/[.]+$/, "");
  return capitalize(stripped);
}

function isPlaceholderSummary(value: string): boolean {
  return /still needs a concrete statement|braucht noch eine konkrete aussage/i.test(
    value,
  );
}

function composeValueProposition(
  {
    user,
    product,
    outcome,
  }: {
    user: string;
    product: string;
    outcome: string;
  },
  locale: "en" | "de",
): string {
  if (user && product && outcome) {
    const userBit = firstMeaningfulSentence(user);
    const productBit = firstMeaningfulSentence(product);
    const outcomeBit = firstMeaningfulSentence(outcome);

    if (locale === "de") {
      return `Für ${decapitalize(stripPeriod(userBit))} soll ${decapitalize(stripPeriod(productBit))} dieses Ergebnis erzeugen: ${decapitalize(stripPeriod(outcomeBit))}.`;
    }

    return `For ${decapitalize(stripPeriod(userBit))}, ${decapitalize(stripPeriod(productBit))} is intended to create this outcome: ${decapitalize(stripPeriod(outcomeBit))}.`;
  }

  if (outcome) {
    return locale === "de"
      ? `Der beabsichtigte Wert ist, dass ${decapitalize(stripPeriod(outcome))}.`
      : `The intended value is that ${decapitalize(stripPeriod(outcome))}.`;
  }

  return MISSING[locale];
}

function collectAssumptions(idea: Idea, locale: "en" | "de"): string[] {
  const fromStages = stageKeys.flatMap((key) => {
    return (idea.stages[key].feedback?.assumptions ?? []).map((item) =>
      normalizeAnswer(item),
    );
  });

  const standing =
    locale === "de"
      ? "Diese Momentaufnahme spiegelt Ihr aktuelles Verständnis aus der Klärung auf der Website. Sie ist nicht mit Nutzern oder Marktdaten belegt."
      : "This snapshot reflects your current understanding from website clarification. It has not been validated with users or market evidence.";

  return unique([...fromStages, standing]);
}

function collectOpenQuestions(
  idea: Idea,
  understoodParts: Record<string, string>,
  locale: "en" | "de",
): string[] {
  const fromFeedback = stageKeys.flatMap((key) => {
    const feedback = idea.stages[key].feedback;

    if (!feedback) {
      return [];
    }

    return [...feedback.uncertainties, ...feedback.suggestions]
      .map((item) => normalizeAnswer(item))
      .filter(
        (item) =>
          item.endsWith("?") || /still|not yet|unclear|noch|nicht|unklar/i.test(item),
      );
  });

  const missing = Object.entries(understoodParts).flatMap(([part, value]) => {
    if (value) {
      return [];
    }

    const label = labelForPart(part, locale);
    return locale === "de"
      ? [`${label} ist noch nicht klar genug, um aufgenommen zu werden.`]
      : [`The ${label} is not yet clear enough to include.`];
  });

  const questions = unique([...fromFeedback, ...missing]);

  if (questions.length === 0) {
    return [
      locale === "de"
        ? "Während der Klärung wurden keine offenen Fragen festgehalten. Das heißt nicht, dass die Annahmen belegt sind."
        : "No unresolved questions were recorded during clarification. That does not mean your assumptions are validated.",
    ];
  }

  return questions;
}

function labelForPart(part: string, locale: "en" | "de"): string {
  const labels = {
    en: {
      primaryUser: "primary user",
      desiredOutcome: "desired outcome",
      lifecycle: "context / lifecycle",
    },
    de: {
      primaryUser: "Der primäre Nutzer",
      desiredOutcome: "Das gewünschte Ergebnis",
      lifecycle: "Der Kontext / Lebenszyklus",
    },
  } as const;

  if (part === "primaryUser" || part === "desiredOutcome" || part === "lifecycle") {
    return labels[locale][part];
  }

  if (locale === "de") {
    const german: Record<string, string> = {
      idea: "Die Idee",
      problem: "Das Problem",
      product: "Das Produkt",
    };
    return german[part] ?? part;
  }

  return part;
}

function asStatement(value: string, locale: "en" | "de"): string {
  if (!value) {
    return MISSING[locale];
  }

  return `${stripPeriod(value)}.`;
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function stripPeriod(value: string): string {
  return value.replace(/[.]+$/, "");
}

function decapitalize(value: string): string {
  if (!value) {
    return value;
  }

  return value.charAt(0).toLowerCase() + value.slice(1);
}

function capitalize(value: string): string {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}
