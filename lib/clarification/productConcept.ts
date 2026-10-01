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

const MISSING = "This has not been clarified yet.";

const SUMMARY_PREFIX: Record<StageKey, RegExp> = {
  idea: /^the idea hypothesis is (that )?/i,
  problem: /^the problem is that /i,
  user: /^the primary user is /i,
  value: /^the desired outcome is (that )?/i,
  product: /^the product is (being described as )?/i,
  context: /^over time, /i,
};

export function buildProductConcept(ideaSnapshot: Idea): ProductConcept {
  const idea = understood(ideaSnapshot.stages.idea, "idea");
  const problem = understood(ideaSnapshot.stages.problem, "problem");
  const primaryUser = understood(ideaSnapshot.stages.user, "user");
  const desiredOutcome = understood(ideaSnapshot.stages.value, "value");
  const product = understood(ideaSnapshot.stages.product, "product");
  const lifecycle = understood(ideaSnapshot.stages.context, "context");

  return {
    idea: asStatement(idea),
    problem: asStatement(problem),
    primaryUser: asStatement(primaryUser),
    desiredOutcome: asStatement(desiredOutcome),
    valueProposition: composeValueProposition({
      user: primaryUser,
      product,
      outcome: desiredOutcome,
    }),
    product: asStatement(product),
    lifecycle: asStatement(lifecycle),
    assumptions: collectAssumptions(ideaSnapshot),
    openQuestions: collectOpenQuestions(ideaSnapshot, {
      idea,
      problem,
      primaryUser,
      desiredOutcome,
      product,
      lifecycle,
    }),
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
  return /still needs a concrete statement/i.test(value);
}

function composeValueProposition({
  user,
  product,
  outcome,
}: {
  user: string;
  product: string;
  outcome: string;
}): string {
  if (user && product && outcome) {
    const userBit = firstMeaningfulSentence(user);
    const productBit = firstMeaningfulSentence(product);
    const outcomeBit = firstMeaningfulSentence(outcome);

    return `For ${decapitalize(stripPeriod(userBit))}, ${decapitalize(stripPeriod(productBit))} is intended to create this outcome: ${decapitalize(stripPeriod(outcomeBit))}.`;
  }

  if (outcome) {
    return `The intended value is that ${decapitalize(stripPeriod(outcome))}.`;
  }

  return MISSING;
}

function collectAssumptions(idea: Idea): string[] {
  const fromStages = stageKeys.flatMap((key) => {
    return (idea.stages[key].feedback?.assumptions ?? []).map((item) =>
      normalizeAnswer(item),
    );
  });

  const standing = [
    "This snapshot reflects your current understanding from website clarification. It has not been validated with users or market evidence.",
  ];

  return unique([...fromStages, ...standing]);
}

function collectOpenQuestions(
  idea: Idea,
  understoodParts: Record<string, string>,
): string[] {
  const fromFeedback = stageKeys.flatMap((key) => {
    const feedback = idea.stages[key].feedback;

    if (!feedback) {
      return [];
    }

    return [...feedback.uncertainties, ...feedback.suggestions]
      .map((item) => normalizeAnswer(item))
      .filter((item) => item.endsWith("?") || /still|not yet|unclear/i.test(item));
  });

  const missing = Object.entries(understoodParts).flatMap(([part, value]) => {
    if (value) {
      return [];
    }

    return [`The ${labelForPart(part)} is not yet clear enough to include.`];
  });

  const questions = unique([...fromFeedback, ...missing]);

  if (questions.length === 0) {
    return [
      "No unresolved questions were recorded during clarification. That does not mean your assumptions are validated.",
    ];
  }

  return questions;
}

function labelForPart(part: string): string {
  switch (part) {
    case "primaryUser":
      return "primary user";
    case "desiredOutcome":
      return "desired outcome";
    case "lifecycle":
      return "context / lifecycle";
    default:
      return part;
  }
}

function asStatement(value: string): string {
  if (!value) {
    return MISSING;
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
