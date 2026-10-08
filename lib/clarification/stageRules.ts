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

function summaryStillNeeds(request: ClarificationRequest) {
  const name = request.stageName;
  return request.locale === "de"
    ? `Die Phase „${name}“ braucht noch eine konkrete Aussage.`
    : `This ${name.toLowerCase()} stage still needs a concrete statement.`;
}

function pick(request: ClarificationRequest, english: string, german: string) {
  return request.locale === "de" ? german : english;
}

export function interpretStage(request: ClarificationRequest): StageFeedback {
  const answer = normalizeAnswer(request.answer);

  if (wordCount(answer) < 4) {
    return finish({
      summary: summaryStillNeeds(request),
      observations: [
        pick(
          request,
          `${request.purpose} The current answer is too brief to clarify that.`,
          `${request.purpose} Die aktuelle Antwort ist zu kurz, um das zu klären.`,
        ),
      ],
      uncertainties: [
        pick(
          request,
          `It is not yet clear how this ${request.stageName.toLowerCase()} should be framed.`,
          `Es ist noch nicht klar, wie „${request.stageName}“ gefasst werden soll.`,
        ),
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
    ? pick(
        request,
        `The idea hypothesis is ${articleLead(restated)}${decapitalize(restated)}.`,
        `Die Hypothese zur Idee lautet: ${restated}`,
      )
    : firstMeaningfulSentence(answer);
  const observations: string[] = [];
  const uncertainties: string[] = [];
  const suggestions: string[] = [];
  let blocking = false;

  const locksImplementation =
    mentionsFeatures(answer) || mentionsTechnology(answer);

  if (locksImplementation) {
    observations.push(
      pick(
        request,
        "This is already describing features, screens, or technology, before the idea itself is framed.",
        "Das beschreibt schon Funktionen, Oberflächen oder Technik, bevor die Idee selbst gefasst ist.",
      ),
    );
    suggestions.push(
      pick(
        request,
        "What could this become, before any features or implementation details?",
        "Was könnte daraus werden, noch bevor Funktionen oder Umsetzung dazukommen?",
      ),
    );
  }

  if (mentionsSolution(restated) && !mentionsCentralObject(answer) && wordCount(restated) < 12) {
    observations.push(
      pick(
        request,
        "This names a kind of product more than a product concept.",
        "Das benennt eher eine Produktart als ein Produktkonzept.",
      ),
    );
    suggestions.push(
      pick(
        request,
        "If this existed, what would someone actually be working with?",
        "Wenn es das gäbe: Womit würde jemand tatsächlich arbeiten?",
      ),
    );
  }

  if (hasMultipleFoci(answer) && !mentionsNonTarget(answer)) {
    uncertainties.push(
      pick(
        request,
        "This could be two different product ideas rather than one idea hypothesis.",
        "Das könnten zwei verschiedene Produktideen sein, nicht eine Hypothese.",
      ),
    );
    suggestions.push(
      pick(
        request,
        "If only one of these existed first, what would it be?",
        "Wenn zuerst nur eines davon existierte, was wäre es?",
      ),
    );
    blocking = true;
  }

  if (wordCount(answer) < 8 && !mentionsCentralObject(answer)) {
    uncertainties.push(
      pick(
        request,
        "The idea is still a label. It is not yet a hypothesis for what this could become.",
        "Die Idee ist noch ein Etikett. Sie ist noch keine Hypothese dafür, was daraus werden könnte.",
      ),
    );
    suggestions.push(
      pick(
        request,
        "What could this be, in one concrete sentence?",
        "Was könnte das sein, in einem konkreten Satz?",
      ),
    );
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
  const summary = pick(
    request,
    `The problem is that ${decapitalize(restated)}.`,
    `Das Problem ist, dass ${decapitalize(restated)}.`,
  );
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
      pick(
        request,
        "This restates the idea. A problem exists even if that product is never built.",
        "Das wiederholt die Idee. Ein Problem besteht auch dann, wenn das Produkt nie gebaut wird.",
      ),
    );
    suggestions.push(
      pick(
        request,
        "What is going wrong today, independently of the product?",
        "Was läuft heute schief, unabhängig vom Produkt?",
      ),
    );
    blocking = true;
  }

  if (describesSolution) {
    const split = splitProblemAndSolution(answer, idea);
    frames.push(
      {
        label: pick(request, "Problem", "Problem"),
        text:
          split.problem ||
          pick(
            request,
            "Not yet stated independently of the proposed product.",
            "Noch nicht unabhängig vom vorgeschlagenen Produkt formuliert.",
          ),
      },
      {
        label: pick(request, "Solution", "Lösung"),
        text: split.solution,
      },
    );

    if (!describesProblem) {
      uncertainties.push(
        pick(
          request,
          "The answer describes the proposed product, not the underlying problem.",
          "Die Antwort beschreibt das vorgeschlagene Produkt, nicht das zugrunde liegende Problem.",
        ),
      );
      suggestions.push(
        pick(
          request,
          "What real problem exists if this product is not built?",
          "Welches echte Problem besteht, wenn dieses Produkt nicht gebaut wird?",
        ),
      );
      blocking = true;
    } else {
      observations.push(
        pick(
          request,
          "The problem and the proposed solution are still mixed together.",
          "Problem und vorgeschlagene Lösung sind noch vermischt.",
        ),
      );
    }
  }

  if (hasMultipleFoci(answer) && describesProblem) {
    uncertainties.push(
      pick(
        request,
        "More than one problem is present. The primary problem still needs to be chosen.",
        "Es sind mehrere Probleme genannt. Das Hauptproblem muss noch gewählt werden.",
      ),
    );
    suggestions.push(
      pick(
        request,
        "Which problem must this product solve first?",
        "Welches Problem muss dieses Produkt zuerst lösen?",
      ),
    );
    blocking = true;
  }

  if (wordCount(answer) < 10 && !describesProblem) {
    uncertainties.push(
      pick(
        request,
        "The problem is still general. It is not yet clear what is failing for someone today.",
        "Das Problem ist noch allgemein. Es ist noch nicht klar, was für jemanden heute scheitert.",
      ),
    );
    suggestions.push(
      pick(
        request,
        "What specifically is difficult, missing, or going wrong?",
        "Was genau ist schwierig, fehlt oder läuft schief?",
      ),
    );
    blocking = true;
  }

  if (/\b(always|never|everyone|all readers|all users|immer|niemals|jeder|jede|alle nutzer|alle leser)\b/i.test(answer)) {
    assumptions.push(
      pick(
        request,
        "This assumes the problem is broadly true, not yet evidenced.",
        "Das nimmt an, das Problem gelte allgemein — belegt ist das noch nicht.",
      ),
    );
  } else {
    assumptions.push(
      pick(
        request,
        "This is still an assumption until there is evidence that someone actually experiences it.",
        "Das bleibt eine Annahme, bis belegt ist, dass jemand es tatsächlich erlebt.",
      ),
    );
  }

  if (idea && !describesSolution && !restatesPrior(answer, idea)) {
    observations.push(
      pick(
        request,
        "The problem is being framed separately from the idea, which is the point of this stage.",
        "Das Problem wird getrennt von der Idee gefasst. Genau darum geht es in dieser Phase.",
      ),
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
  const summary = pick(
    request,
    `The primary user is ${decapitalize(restated)}.`,
    `Der primäre Nutzer ist ${decapitalize(restated)}.`,
  );
  const observations: string[] = [];
  const uncertainties: string[] = [];
  const suggestions: string[] = [];
  let blocking = false;

  if (problem && restatesPrior(answer, problem)) {
    uncertainties.push(
      pick(
        request,
        "This restates the problem. This stage is about who experiences it.",
        "Das wiederholt das Problem. In dieser Phase geht es darum, wer es erlebt.",
      ),
    );
    suggestions.push(
      pick(
        request,
        "Who has this problem most clearly?",
        "Wer hat dieses Problem am deutlichsten?",
      ),
    );
    blocking = true;
  }

  if (mentionsEveryone(answer)) {
    uncertainties.push(
      pick(
        request,
        "A product for everyone does not yet identify a primary user.",
        "Ein Produkt für alle benennt noch keinen primären Nutzer.",
      ),
    );
    suggestions.push(
      pick(
        request,
        "Who has this problem most clearly?",
        "Wer hat dieses Problem am deutlichsten?",
      ),
    );
    blocking = true;
  }

  if (
    hasMultipleFoci(answer) &&
    !mentionsNonTarget(answer) &&
    mentionsSecondaryUsers(answer)
  ) {
    observations.push(
      pick(
        request,
        "Secondary users are named. For this stage, the primary user is the one who must be served first.",
        "Sekundäre Nutzer sind genannt. In dieser Phase zählt der primäre Nutzer, der zuerst bedient werden muss.",
      ),
    );
    suggestions.push(
      pick(
        request,
        "If the product could only serve one user first, who would that be?",
        "Wenn das Produkt zuerst nur einen Nutzer bedienen könnte, wer wäre das?",
      ),
    );
  } else if (hasMultipleFoci(answer) && !mentionsNonTarget(answer)) {
    uncertainties.push(
      pick(
        request,
        "Several possible users are named. The primary user is not yet chosen.",
        "Mehrere mögliche Nutzer sind genannt. Der primäre Nutzer ist noch nicht gewählt.",
      ),
    );
    suggestions.push(
      pick(
        request,
        "If the product could only serve one user first, who would that be?",
        "Wenn das Produkt zuerst nur einen Nutzer bedienen könnte, wer wäre das?",
      ),
    );
    blocking = true;
  }

  if (mentionsNonTarget(answer)) {
    observations.push(
      pick(
        request,
        "A non-target is set aside. The focus of this stage is the primary user.",
        "Eine Nicht-Zielgruppe ist ausgeklammert. Der Fokus dieser Phase ist der primäre Nutzer.",
      ),
    );
  } else if (wordCount(answer) >= 8 && !blocking) {
    observations.push(
      pick(
        request,
        "The primary user is named. Who is outside that target can stay implicit for now.",
        "Der primäre Nutzer ist benannt. Wer außerhalb liegt, kann vorerst unausgesprochen bleiben.",
      ),
    );
  }

  if (problem && !restatesPrior(answer, problem) && wordCount(answer) > 6) {
    observations.push(
      pick(
        request,
        "The user should be the person who has the stated problem, not a generic audience.",
        "Der Nutzer sollte die Person sein, die das genannte Problem hat, keine allgemeine Zielgruppe.",
      ),
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
  const summary = pick(
    request,
    `The desired outcome is ${articleLead(restated)}${decapitalize(restated)}.`,
    `Das gewünschte Ergebnis ist, dass ${decapitalize(restated)}.`,
  );
  const observations: string[] = [];
  const uncertainties: string[] = [];
  const suggestions: string[] = [];
  let blocking = false;

  if (problem && restatesPrior(answer, problem) && !mentionsOutcome(answer)) {
    uncertainties.push(
      pick(
        request,
        "This restates the problem. Value is what becomes better if that problem is solved.",
        "Das wiederholt das Problem. Wert ist, was besser wird, wenn das Problem gelöst ist.",
      ),
    );
    suggestions.push(
      pick(
        request,
        "What changes for the user if this works?",
        "Was verändert sich für den Nutzer, wenn das funktioniert?",
      ),
    );
    blocking = true;
  }

  if (mentionsFeatures(answer) && !mentionsOutcome(answer)) {
    observations.push(
      pick(
        request,
        "This is still a feature. Feature → capability → user outcome → value.",
        "Das ist noch eine Funktion. Funktion → Fähigkeit → Ergebnis für den Nutzer → Wert.",
      ),
    );
    uncertainties.push(
      pick(
        request,
        "It is not yet clear what outcome that feature would create for the user.",
        "Es ist noch nicht klar, welches Ergebnis diese Funktion für den Nutzer schaffen würde.",
      ),
    );
    suggestions.push(
      pick(
        request,
        "If that feature exists, what can the user do that they cannot do today?",
        "Wenn es diese Funktion gibt: Was kann der Nutzer dann, was heute nicht geht?",
      ),
    );
    blocking = true;
  } else if (mentionsCapability(answer) && !mentionsOutcome(answer)) {
    observations.push(
      pick(
        request,
        "This describes a capability. Value is the user outcome that capability makes possible.",
        "Das beschreibt eine Fähigkeit. Wert ist das Ergebnis für den Nutzer, das diese Fähigkeit möglich macht.",
      ),
    );
    suggestions.push(
      pick(
        request,
        "What becomes better for the user because of that capability?",
        "Was wird für den Nutzer besser, weil es diese Fähigkeit gibt?",
      ),
    );
  }

  if (user && problem && !blocking) {
    observations.push(
      pick(
        request,
        "Value should be the outcome for the primary user if the stated problem is solved.",
        "Wert sollte das Ergebnis für den primären Nutzer sein, wenn das genannte Problem gelöst ist.",
      ),
    );
  }

  if (hasMultipleFoci(answer) && mentionsOutcome(answer)) {
    observations.push(
      pick(
        request,
        "Several outcomes are named. One primary outcome is enough to continue.",
        "Mehrere Ergebnisse sind genannt. Ein Hauptergebnis reicht, um weiterzugehen.",
      ),
    );
    suggestions.push(
      pick(
        request,
        "What is the main outcome the product should create?",
        "Was ist das Hauptergebnis, das das Produkt schaffen soll?",
      ),
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

function interpretProduct(
  request: ClarificationRequest,
  answer: string,
): StageFeedback {
  const value = priorStatement(request, "value");
  const problem =
    priorStatement(request, "problem") || request.startingContext.problem;
  const restated = stripLeadIn(answer);
  const summary = productSummary(request, restated);
  const observations: string[] = [];
  const uncertainties: string[] = [];
  const suggestions: string[] = [];
  let blocking = false;

  if (value && restatesPrior(answer, value) && !mentionsCentralObject(answer)) {
    uncertainties.push(
      pick(
        request,
        "This restates the desired outcome. This stage names the product that would create it.",
        "Das wiederholt das gewünschte Ergebnis. Diese Phase benennt das Produkt, das es erzeugen würde.",
      ),
    );
    suggestions.push(
      pick(
        request,
        "What is the product, and what does the user work with?",
        "Was ist das Produkt, und womit arbeitet der Nutzer?",
      ),
    );
    blocking = true;
  } else if (
    problem &&
    restatesPrior(answer, problem) &&
    !mentionsCentralObject(answer)
  ) {
    uncertainties.push(
      pick(
        request,
        "This restates the problem. This stage is about what the product fundamentally is.",
        "Das wiederholt das Problem. In dieser Phase geht es darum, was das Produkt im Kern ist.",
      ),
    );
    suggestions.push(
      pick(
        request,
        "What kind of product would exist, and around what?",
        "Welche Art von Produkt würde existieren, und worum dreht es sich?",
      ),
    );
    blocking = true;
  }

  const isFeatureList =
    mentionsFeatures(answer) &&
    !/\b(is a|is an|the product is|ist ein|ist eine|das produkt ist)\b/i.test(answer);

  if (isFeatureList) {
    observations.push(
      pick(
        request,
        "This is still a feature list. A product concept names the thing itself, not its parts.",
        "Das ist noch eine Funktionsliste. Ein Produktkonzept benennt das Ding selbst, nicht seine Teile.",
      ),
    );
    uncertainties.push(
      pick(
        request,
        "The central object is not yet named — the collection, record, or thing the user works with.",
        "Das zentrale Objekt ist noch nicht benannt — die Sammlung, der Datensatz oder das Ding, mit dem der Nutzer arbeitet.",
      ),
    );
    suggestions.push(
      pick(
        request,
        "What is this product, what does it revolve around, and what does the user do with it?",
        "Was ist dieses Produkt, worum dreht es sich, und was macht der Nutzer damit?",
      ),
    );
    blocking = true;
  }

  if (
    !mentionsCentralObject(answer) &&
    !/\b(is a|is an|it is|it's|ist ein|ist eine|es ist)\b/i.test(answer) &&
    wordCount(answer) < 12
  ) {
    uncertainties.push(
      pick(
        request,
        "The product mental model is still thin. It is not yet clear what the user would be working with.",
        "Das mentale Modell des Produkts ist noch dünn. Es ist noch nicht klar, womit der Nutzer arbeiten würde.",
      ),
    );
    suggestions.push(
      pick(
        request,
        "What is the product, and what is the main thing inside it?",
        "Was ist das Produkt, und was ist das Wesentliche darin?",
      ),
    );
    blocking = true;
  }

  if (mentionsCentralObject(answer) && !mentionsFeatures(answer)) {
    observations.push(
      pick(
        request,
        "The product is being named as a concept, not as a list of screens.",
        "Das Produkt wird als Konzept benannt, nicht als Liste von Oberflächen.",
      ),
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
  const summary = pick(
    request,
    `Over time, ${decapitalize(restated)}.`,
    `Mit der Zeit: ${decapitalize(restated)}.`,
  );
  const observations: string[] = [];
  const uncertainties: string[] = [];
  const suggestions: string[] = [];
  let blocking = false;

  if (product && restatesPrior(answer, product) && !mentionsTime(answer)) {
    uncertainties.push(
      pick(
        request,
        "This restates what the product is. This stage is about what happens to it after someone starts using it.",
        "Das wiederholt, was das Produkt ist. In dieser Phase geht es darum, was danach mit ihm geschieht.",
      ),
    );
    suggestions.push(
      pick(
        request,
        "What happens to the main thing in the product first, and what happens later?",
        "Was geschieht zuerst mit dem Wesentlichen im Produkt, und was später?",
      ),
    );
    blocking = true;
  }

  if (!mentionsTime(answer)) {
    uncertainties.push(
      pick(
        request,
        "The answer is still a snapshot. It does not yet show how the main thing changes after first use.",
        "Die Antwort ist noch eine Momentaufnahme. Sie zeigt noch nicht, wie sich das Wesentliche nach der ersten Nutzung verändert.",
      ),
    );
    suggestions.push(
      pick(
        request,
        "What are the important states — for example unused, in use, and later?",
        "Welche Zustände sind wichtig — zum Beispiel ungenutzt, in Nutzung und später?",
      ),
    );
    blocking = true;
  } else if (wordCount(answer) < 10) {
    observations.push(
      pick(
        request,
        "A first change is named. A later state would make the lifecycle clearer, but this is enough to continue.",
        "Eine erste Veränderung ist genannt. Ein späterer Zustand würde den Lebenszyklus klarer machen, aber das reicht zum Weitergehen.",
      ),
    );
  }

  if (mentionsFeatures(answer) && !mentionsTime(answer)) {
    observations.push(
      pick(
        request,
        "This still describes features rather than what happens to the central object over time.",
        "Das beschreibt noch Funktionen, nicht was mit dem zentralen Objekt im Laufe der Zeit geschieht.",
      ),
    );
  }

  if (product && mentionsTime(answer)) {
    observations.push(
      pick(
        request,
        "The lifecycle should belong to the product concept already named, not to a new product.",
        "Der Lebenszyklus sollte zum bereits benannten Produktkonzept gehören, nicht zu einem neuen Produkt.",
      ),
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

function productSummary(request: ClarificationRequest, restated: string): string {
  const text = decapitalize(restated);

  if (request.locale === "de") {
    if (/^(ein|eine|der|die|das)\b/i.test(restated)) {
      return `Das Produkt ist ${text}.`;
    }

    return `Das Produkt wird beschrieben als ${text}.`;
  }

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
