import {
  firstMeaningfulSentence,
  hasMultipleFoci,
  mentionsCapability,
  mentionsCentralObject,
  mentionsEveryone,
  mentionsFeatures,
  mentionsNonTarget,
  mentionsOutcome,
  mentionsProblemLanguage,
  mentionsSecondaryUsers,
  mentionsSolution,
  mentionsTechnology,
  mentionsTime,
  normalizeAnswer,
  priorStatement,
  restatesPrior,
  stripLeadIn,
  wordCount,
} from "@/lib/clarification/text";
import type {
  ClarificationRequest,
  FeedbackFrame,
  StageFeedback,
} from "@/lib/clarification/types";

export function interpretStage(request: ClarificationRequest): StageFeedback {
  const answer = normalizeAnswer(request.answer);

  if (wordCount(answer) < 4) {
    return finish({
      summary: `This ${request.stageName.toLowerCase()} stage still needs a concrete statement.`,
      observations: [
        `${request.purpose} The current answer is too brief to clarify that.`,
      ],
      uncertainties: [
        `It is not yet clear how this ${request.stageName.toLowerCase()} should be framed.`,
      ],
      suggestions: [request.question],
      blocking: true,
    });
  }

  switch (request.stageKey) {
    case "idea":
      return interpretIdea(request, answer);
    case "problem":
      return interpretProblem(request, answer);
    case "user":
      return interpretUser(request, answer);
    case "value":
      return interpretValue(request, answer);
    case "product":
      return interpretProduct(request, answer);
    case "context":
      return interpretContext(request, answer);
    default:
      return finish({
        summary: firstMeaningfulSentence(answer),
      });
  }
}

function interpretIdea(
  request: ClarificationRequest,
  answer: string,
): StageFeedback {
  const restated = stripLeadIn(answer);
  const summary = restated
    ? `The idea hypothesis is ${articleLead(restated)}${decapitalize(restated)}.`
    : firstMeaningfulSentence(answer);
  const observations: string[] = [];
  const uncertainties: string[] = [];
  const suggestions: string[] = [];
  let blocking = false;

  const locksImplementation =
    mentionsFeatures(answer) || mentionsTechnology(answer);

  if (locksImplementation) {
    observations.push(
      "This is already describing features, screens, or technology, before the idea itself is framed.",
    );
    suggestions.push(
      "What could this become, before any features or implementation details?",
    );
  }

  if (mentionsSolution(restated) && !mentionsCentralObject(answer) && wordCount(restated) < 12) {
    observations.push(
      "This names a kind of product more than a product concept.",
    );
    suggestions.push(
      "If this existed, what would someone actually be working with?",
    );
  }

  if (hasMultipleFoci(answer) && !mentionsNonTarget(answer)) {
    uncertainties.push(
      "This could be two different product ideas rather than one idea hypothesis.",
    );
    suggestions.push("If only one of these existed first, what would it be?");
    blocking = true;
  }

  if (wordCount(answer) < 8 && !mentionsCentralObject(answer)) {
    uncertainties.push(
      "The idea is still a label. It is not yet a hypothesis for what this could become.",
    );
    suggestions.push("What could this be, in one concrete sentence?");
    blocking = true;
  }

  return finish({
    summary,
    observations,
    uncertainties,
    suggestions,
    blocking,
  });
}

function interpretProblem(
  request: ClarificationRequest,
  answer: string,
): StageFeedback {
  const idea =
    priorStatement(request, "idea") || request.startingContext.idea;
  const restated = stripLeadIn(answer);
  const summary = `The problem is that ${decapitalize(restated)}.`;
  const observations: string[] = [];
  const uncertainties: string[] = [];
  const suggestions: string[] = [];
  const assumptions: string[] = [];
  const frames: FeedbackFrame[] = [];
  let blocking = false;

  const describesSolution =
    mentionsSolution(answer) ||
    mentionsFeatures(answer) ||
    mentionsTechnology(answer);
  const describesProblem = mentionsProblemLanguage(answer);

  if (idea && restatesPrior(answer, idea)) {
    uncertainties.push(
      "This restates the idea. A problem exists even if that product is never built.",
    );
    suggestions.push("What is going wrong today, independently of the product?");
    blocking = true;
  }

  if (describesSolution) {
    const split = splitProblemAndSolution(answer, idea);
    frames.push(
      {
        label: "Problem",
        text:
          split.problem ||
          "Not yet stated independently of the proposed product.",
      },
      {
        label: "Solution",
        text: split.solution,
      },
    );

    if (!describesProblem) {
      uncertainties.push(
        "The answer describes the proposed product, not the underlying problem.",
      );
      suggestions.push(
        "What real problem exists if this product is not built?",
      );
      blocking = true;
    } else {
      observations.push(
        "The problem and the proposed solution are still mixed together.",
      );
    }
  }

  if (hasMultipleFoci(answer) && describesProblem) {
    uncertainties.push(
      "More than one problem is present. The primary problem still needs to be chosen.",
    );
    suggestions.push("Which problem must this product solve first?");
    blocking = true;
  }

  if (wordCount(answer) < 10 && !describesProblem) {
    uncertainties.push(
      "The problem is still general. It is not yet clear what is failing for someone today.",
    );
    suggestions.push("What specifically is difficult, missing, or going wrong?");
    blocking = true;
  }

  if (/\b(always|never|everyone|all readers|all users)\b/i.test(answer)) {
    assumptions.push("This assumes the problem is broadly true, not yet evidenced.");
  } else {
    assumptions.push(
      "This is still an assumption until there is evidence that someone actually experiences it.",
    );
  }

  if (idea && !describesSolution && !restatesPrior(answer, idea)) {
    observations.push(
      "The problem is being framed separately from the idea, which is the point of this stage.",
    );
  }

  return finish({
    summary,
    observations,
    uncertainties,
    suggestions,
    assumptions,
    frames,
    blocking,
  });
}

function interpretUser(
  request: ClarificationRequest,
  answer: string,
): StageFeedback {
  const problem =
    priorStatement(request, "problem") || request.startingContext.problem;
  const restated = stripLeadIn(answer);
  const summary = `The primary user is ${decapitalize(restated)}.`;
  const observations: string[] = [];
  const uncertainties: string[] = [];
  const suggestions: string[] = [];
  let blocking = false;

  if (problem && restatesPrior(answer, problem)) {
    uncertainties.push(
      "This restates the problem. This stage is about who experiences it.",
    );
    suggestions.push("Who has this problem most clearly?");
    blocking = true;
  }

  if (mentionsEveryone(answer)) {
    uncertainties.push(
      "A product for everyone does not yet identify a primary user.",
    );
    suggestions.push("Who has this problem most clearly?");
    blocking = true;
  }

  if (
    hasMultipleFoci(answer) &&
    !mentionsNonTarget(answer) &&
    mentionsSecondaryUsers(answer)
  ) {
    observations.push(
      "Secondary users are named. For this stage, the primary user is the one who must be served first.",
    );
    suggestions.push(
      "If the product could only serve one user first, who would that be?",
    );
  } else if (hasMultipleFoci(answer) && !mentionsNonTarget(answer)) {
    uncertainties.push(
      "Several possible users are named. The primary user is not yet chosen.",
    );
    suggestions.push(
      "If the product could only serve one user first, who would that be?",
    );
    blocking = true;
  }

  if (mentionsNonTarget(answer)) {
    observations.push(
      "A non-target is set aside. The focus of this stage is the primary user.",
    );
  } else if (wordCount(answer) >= 8 && !blocking) {
    observations.push(
      "The primary user is named. Who is outside that target can stay implicit for now.",
    );
  }

  if (problem && !restatesPrior(answer, problem) && wordCount(answer) > 6) {
    observations.push(
      "The user should be the person who has the stated problem, not a generic audience.",
    );
  }

  return finish({
    summary,
    observations,
    uncertainties,
    suggestions,
    blocking,
  });
}

function interpretValue(
  request: ClarificationRequest,
  answer: string,
): StageFeedback {
  const problem =
    priorStatement(request, "problem") || request.startingContext.problem;
  const user =
    priorStatement(request, "user") || request.startingContext.user;
  const restated = stripLeadIn(answer);
  const summary = `The desired outcome is ${articleLead(restated)}${decapitalize(restated)}.`;
  const observations: string[] = [];
  const uncertainties: string[] = [];
  const suggestions: string[] = [];
  let blocking = false;

  if (problem && restatesPrior(answer, problem) && !mentionsOutcome(answer)) {
    uncertainties.push(
      "This restates the problem. Value is what becomes better if that problem is solved.",
    );
    suggestions.push("What changes for the user if this works?");
    blocking = true;
  }

  if (mentionsFeatures(answer) && !mentionsOutcome(answer)) {
    observations.push(
      "This is still a feature. Feature → capability → user outcome → value.",
    );
    uncertainties.push(
      "It is not yet clear what outcome that feature would create for the user.",
    );
    suggestions.push(
      "If that feature exists, what can the user do that they cannot do today?",
    );
    blocking = true;
  } else if (mentionsCapability(answer) && !mentionsOutcome(answer)) {
    observations.push(
      "This describes a capability. Value is the user outcome that capability makes possible.",
    );
    suggestions.push("What becomes better for the user because of that capability?");
  }

  if (user && problem && !blocking) {
    observations.push(
      "Value should be the outcome for the primary user if the stated problem is solved.",
    );
  }

  if (hasMultipleFoci(answer) && mentionsOutcome(answer)) {
    observations.push(
      "Several outcomes are named. One primary outcome is enough to continue.",
    );
    suggestions.push("What is the main outcome the product should create?");
  }

  return finish({
    summary,
    observations,
    uncertainties,
    suggestions,
    blocking,
  });
}

function interpretProduct(
  request: ClarificationRequest,
  answer: string,
): StageFeedback {
  const value = priorStatement(request, "value");
  const problem =
    priorStatement(request, "problem") || request.startingContext.problem;
  const restated = stripLeadIn(answer);
  const summary = productSummary(restated);
  const observations: string[] = [];
  const uncertainties: string[] = [];
  const suggestions: string[] = [];
  let blocking = false;

  if (value && restatesPrior(answer, value) && !mentionsCentralObject(answer)) {
    uncertainties.push(
      "This restates the desired outcome. This stage names the product that would create it.",
    );
    suggestions.push("What is the product, and what does the user work with?");
    blocking = true;
  } else if (
    problem &&
    restatesPrior(answer, problem) &&
    !mentionsCentralObject(answer)
  ) {
    uncertainties.push(
      "This restates the problem. This stage is about what the product fundamentally is.",
    );
    suggestions.push("What kind of product would exist, and around what?");
    blocking = true;
  }

  const isFeatureList =
    mentionsFeatures(answer) &&
    !/\b(is a|is an|the product is)\b/i.test(answer);

  if (isFeatureList) {
    observations.push(
      "This is still a feature list. A product concept names the thing itself, not its parts.",
    );
    uncertainties.push(
      "The central object is not yet named — the collection, record, or thing the user works with.",
    );
    suggestions.push(
      "What is this product, what does it revolve around, and what does the user do with it?",
    );
    blocking = true;
  }

  if (
    !mentionsCentralObject(answer) &&
    !/\b(is a|is an|it is|it's)\b/i.test(answer) &&
    wordCount(answer) < 12
  ) {
    uncertainties.push(
      "The product mental model is still thin. It is not yet clear what the user would be working with.",
    );
    suggestions.push(
      "What is the product, and what is the main thing inside it?",
    );
    blocking = true;
  }

  if (mentionsCentralObject(answer) && !mentionsFeatures(answer)) {
    observations.push(
      "The product is being named as a concept, not as a list of screens.",
    );
  }

  return finish({
    summary,
    observations,
    uncertainties,
    suggestions,
    blocking,
  });
}

function interpretContext(
  request: ClarificationRequest,
  answer: string,
): StageFeedback {
  const product = priorStatement(request, "product");
  const restated = stripLeadIn(answer);
  const summary = `Over time, ${decapitalize(restated)}.`;
  const observations: string[] = [];
  const uncertainties: string[] = [];
  const suggestions: string[] = [];
  let blocking = false;

  if (product && restatesPrior(answer, product) && !mentionsTime(answer)) {
    uncertainties.push(
      "This restates what the product is. This stage is about what happens to it after someone starts using it.",
    );
    suggestions.push(
      "What happens to the main thing in the product first, and what happens later?",
    );
    blocking = true;
  }

  if (!mentionsTime(answer)) {
    uncertainties.push(
      "The answer is still a snapshot. It does not yet show how the main thing changes after first use.",
    );
    suggestions.push(
      "What are the important states — for example unused, in use, and later?",
    );
    blocking = true;
  } else if (wordCount(answer) < 10) {
    observations.push(
      "A first change is named. A later state would make the lifecycle clearer, but this is enough to continue.",
    );
  }

  if (mentionsFeatures(answer) && !mentionsTime(answer)) {
    observations.push(
      "This still describes features rather than what happens to the central object over time.",
    );
  }

  if (product && mentionsTime(answer)) {
    observations.push(
      "The lifecycle should belong to the product concept already named, not to a new product.",
    );
  }

  return finish({
    summary,
    observations,
    uncertainties,
    suggestions,
    blocking,
  });
}

function finish({
  summary,
  observations = [],
  uncertainties = [],
  suggestions = [],
  assumptions,
  frames,
  blocking = false,
}: {
  summary: string;
  observations?: string[];
  uncertainties?: string[];
  suggestions?: string[];
  assumptions?: string[];
  frames?: FeedbackFrame[];
  blocking?: boolean;
}): StageFeedback {
  const nextUncertainties = unique(uncertainties).slice(0, 1);
  const nextAssumptions = assumptions?.length
    ? unique(assumptions).slice(0, 2)
    : undefined;
  const nextFrames = frames?.length ? frames.slice(0, 3) : undefined;

  return {
    summary,
    observations: unique(observations),
    uncertainties: nextUncertainties,
    suggestions: unique(suggestions).slice(0, 2),
    assumptions: nextAssumptions,
    frames: nextFrames,
    status:
      blocking && nextUncertainties.length > 0
        ? "needs_clarification"
        : "ready_to_continue",
  };
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function decapitalize(value: string): string {
  if (!value) {
    return value;
  }

  return value.charAt(0).toLowerCase() + value.slice(1);
}

function articleLead(value: string): string {
  return /^(a|an|the)\b/i.test(value) ? "" : "that ";
}

function productSummary(restated: string): string {
  const text = decapitalize(restated);

  if (/^(a|an|the)\b/i.test(restated)) {
    return `The product is ${text}.`;
  }

  return `The product is being described as ${text}.`;
}

function splitProblemAndSolution(
  answer: string,
  idea: string,
): { problem: string; solution: string } {
  const sentences = normalizeAnswer(answer)
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);
  const problemParts = sentences.filter(
    (sentence) =>
      mentionsProblemLanguage(sentence) &&
      !mentionsFeatures(sentence) &&
      !mentionsTechnology(sentence),
  );
  const solutionParts = sentences.filter(
    (sentence) =>
      mentionsSolution(sentence) ||
      mentionsFeatures(sentence) ||
      mentionsTechnology(sentence),
  );

  return {
    problem: problemParts.join(" "),
    solution: solutionParts.join(" ") || idea || firstMeaningfulSentence(answer),
  };
}
