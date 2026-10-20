export function resourcePublicPath(folder: string, filename: string): string {
  return `/resources/categories/${encodeURIComponent(folder)}/${encodeURIComponent(filename)}`;
}

export type LibraryLocale = "en" | "de";

export type ResourceKind =
  | "guide"
  | "brief"
  | "worksheet"
  | "template"
  | "canvas"
  | "checklist"
  | "review"
  | "example"
  | "prompt"
  | "explainer"
  | "diagram"
  | "planner"
  | "tracker";

export type ResourceAction =
  | "read-guide"
  | "read-brief"
  | "download-worksheet"
  | "download-template"
  | "download-canvas"
  | "download-checklist"
  | "download-review"
  | "open-example"
  | "use-prompt"
  | "view-diagram"
  | "download-planner"
  | "download-tracker";

type Copy = { readonly en: string; readonly de: string };

export type LibraryCategory = {
  readonly id: string;
  readonly title: Copy;
  readonly description: Copy;
};

export type LibraryResource = {
  readonly id: string;
  readonly categoryId: string;
  readonly title: Copy;
  readonly description: Copy;
  readonly benefit: Copy;
  readonly kind: ResourceKind;
  readonly action: ResourceAction;
  readonly folder: string;
  readonly filename: string;
  readonly format: "pdf" | "png";
  readonly pages?: number;
  readonly fillable?: boolean;
  readonly featured?: boolean;
  readonly imageAlt?: Copy;
  readonly relatedIds?: readonly string[];
};

const t = (en: string, de: string): Copy => ({ en, de });

export const libraryCategories: readonly LibraryCategory[] = [
  {
    id: "category-1",
    title: t("Start here", "Start"),
    description: t(
      "Orient yourself in the journey from an uncertain app idea to a coherent MVP.",
      "Orientieren Sie sich auf dem Weg von einer unsicheren App-Idee zu einem stimmigen MVP.",
    ),
  },
  {
    id: "category-2",
    title: t("Templates and worksheets", "Vorlagen und Arbeitsblätter"),
    description: t(
      "Work through the definition stages, from the idea brief to technical boundaries.",
      "Arbeiten Sie die Definitionsstufen durch, vom Ideenbrief bis zu den technischen Grenzen.",
    ),
  },
  {
    id: "category-3",
    title: t("Checklists and reviews", "Checklisten und Reviews"),
    description: t(
      "Challenge scope and check whether an idea or specification is ready to proceed.",
      "Hinterfragen Sie den Umfang und prüfen Sie, ob eine Idee oder Spezifikation weitergehen kann.",
    ),
  },
  {
    id: "category-4",
    title: t("Worked examples", "Ausgearbeitete Beispiele"),
    description: t(
      "See what a clarified idea and a useful specification look like in practice.",
      "Sehen Sie, wie eine geklärte Idee und eine brauchbare Spezifikation in der Praxis aussehen.",
    ),
  },
  {
    id: "category-5",
    title: t("AI prompts and workflows", "KI-Prompts und Abläufe"),
    description: t(
      "Use AI to challenge your thinking. You still make the product decisions.",
      "Nutzen Sie KI, um Ihr Denken herauszufordern. Die Produktentscheidungen bleiben bei Ihnen.",
    ),
  },
  {
    id: "category-6",
    title: t("MVP knowledge hub", "MVP-Wissenshub"),
    description: t(
      "Short explanations of the ideas the method depends on.",
      "Kurze Erklärungen der Ideen, auf denen die Methode aufbaut.",
    ),
  },
  {
    id: "category-7",
    title: t("Learning worksheets", "Lern-Arbeitsblätter"),
    description: t(
      "Decide what the MVP must teach you, track evidence, and plan the next experiment.",
      "Legen Sie fest, was das MVP Sie lehren muss, verfolgen Sie Evidenz und planen Sie das nächste Experiment.",
    ),
  },
] as const;

const pdf = (folder: string, filename: string) =>
  ({ folder, filename, format: "pdf" as const });

export const libraryResources: readonly LibraryResource[] = [
  {
    id: "1-1",
    categoryId: "category-1",
    title: t(
      "From App Idea to MVP: Complete Guide",
      "Von der App-Idee zum MVP: Der vollständige Leitfaden",
    ),
    description: t(
      "A guide through the journey from an uncertain app idea to a coherent MVP definition.",
      "Ein Leitfaden für den Weg von einer unsicheren App-Idee zu einer stimmigen MVP-Definition.",
    ),
    benefit: t(
      "See the whole journey before you work through individual stages.",
      "Sehen Sie den gesamten Weg, bevor Sie einzelne Stufen bearbeiten.",
    ),
    kind: "guide",
    action: "read-guide",
    ...pdf("category 1", "MVPCompanion_From_App_Idea_to_MVP_Complete_Guide.pdf"),
    pages: 11,
    featured: true,
    relatedIds: ["1-4"],
  },
  {
    id: "1-2",
    categoryId: "category-1",
    title: t(
      "Stop Building Features Before Questions",
      "Erst Fragen, dann Funktionen",
    ),
    description: t(
      "A short brief on why a feature list is not a substitute for unanswered product questions.",
      "Ein kurzes Briefing, warum eine Funktionsliste unbeantwortete Produktfragen nicht ersetzt.",
    ),
    benefit: t(
      "Pause building until the problem, user, and value are clear enough.",
      "Halten Sie mit dem Bauen inne, bis Problem, Nutzer und Wert klar genug sind.",
    ),
    kind: "brief",
    action: "read-brief",
    ...pdf("category 1", "MVPC_Resource_1_2_Stop_Building_Features_Before_Questions.pdf"),
    pages: 2,
  },
  {
    id: "1-3",
    categoryId: "category-1",
    title: t(
      "The 15 Stages Data Model Landscape",
      "Die Datenmodell-Landschaft der 15 Stufen",
    ),
    description: t(
      "A one-page view of how the data model sits in the wider 15-stage landscape.",
      "Eine einseitige Sicht, wie das Datenmodell in der weiteren Landschaft der 15 Stufen liegt.",
    ),
    benefit: t(
      "Place entities and fields in the method instead of designing them in isolation.",
      "Ordnen Sie Entitäten und Felder in die Methode ein, statt sie isoliert zu entwerfen.",
    ),
    kind: "explainer",
    action: "read-brief",
    ...pdf("category 1", "MVPCompanion_The_15_Stages_Data_Model_Landscape.pdf"),
    pages: 1,
  },
  {
    id: "1-4",
    categoryId: "category-1",
    title: t("The 15-Stage Process", "Der Prozess in 15 Stufen"),
    description: t(
      "A diagram of fifteen stages, cross-cutting lenses, and the market-discovery and business-model workstreams.",
      "Ein Diagramm mit fünfzehn Stufen, übergreifenden Perspektiven und den Workstreams Markterkundung und Geschäftsmodell.",
    ),
    benefit: t(
      "Get a single picture of the journey before you open a worksheet.",
      "Verschaffen Sie sich ein Gesamtbild, bevor Sie ein Arbeitsblatt öffnen.",
    ),
    kind: "diagram",
    action: "view-diagram",
    folder: "category 1",
    filename: "The 15-stages Process.png",
    format: "png",
    featured: true,
    imageAlt: t(
      "Diagram titled The 15 Stages of MVPCompanion. Five columns group fifteen numbered stages, with cross-cutting lenses and continuous market-discovery and business-model workstreams underneath.",
      "Diagramm mit dem Titel The 15 Stages of MVPCompanion. Fünf Spalten fassen fünfzehn nummerierte Stufen zusammen, darunter übergreifende Perspektiven und die fortlaufenden Workstreams Markterkundung und Geschäftsmodell.",
    ),
    relatedIds: ["1-1"],
  },
  {
    id: "2-1",
    categoryId: "category-2",
    title: t("Idea Brief", "Ideenbrief"),
    description: t(
      "Capture the initial idea and why it might be worth pursuing.",
      "Halten Sie die erste Idee fest und warum sie sich weiterzuverfolgen lohnt.",
    ),
    benefit: t(
      "Start with a framed idea instead of a loose feature wish.",
      "Beginnen Sie mit einer gefassten Idee statt mit einem losen Funktionswunsch.",
    ),
    kind: "template",
    action: "download-template",
    ...pdf("category 2", "2.1_Idea_Brief_Template.pdf"),
    pages: 2,
    fillable: true,
    relatedIds: ["5-1"],
  },
  {
    id: "2-2",
    categoryId: "category-2",
    title: t("Problem Definition", "Problemdefinition"),
    description: t(
      "Define the problem independently of the solution you already have in mind.",
      "Definieren Sie das Problem unabhängig von der Lösung, die Sie schon im Kopf haben.",
    ),
    benefit: t(
      "Separate the problem from the app you hope to build.",
      "Trennen Sie das Problem von der App, die Sie bauen möchten.",
    ),
    kind: "worksheet",
    action: "download-worksheet",
    ...pdf("category 2", "2.2_Problem_Definition_Worksheet.pdf"),
    pages: 2,
    fillable: true,
    relatedIds: ["5-2"],
  },
  {
    id: "2-3",
    categoryId: "category-2",
    title: t("Primary User Profile", "Profil der primären Nutzerin oder des primären Nutzers"),
    description: t(
      "Describe who has the problem, and who is outside the MVP.",
      "Beschreiben Sie, wer das Problem hat und wer außerhalb des MVP liegt.",
    ),
    benefit: t(
      "Name a primary user before you design for everyone.",
      "Benennen Sie eine primäre Nutzergruppe, bevor Sie für alle entwerfen.",
    ),
    kind: "worksheet",
    action: "download-worksheet",
    ...pdf("category 2", "2.3_Primary_User_Profile.pdf"),
    pages: 2,
    fillable: true,
    relatedIds: ["5-3"],
  },
  {
    id: "2-4",
    categoryId: "category-2",
    title: t("Value Proposition", "Wertversprechen"),
    description: t(
      "State the outcome, the benefits, and why this solution is worth choosing.",
      "Formulieren Sie das Ergebnis, den Nutzen und warum diese Lösung wählenswert ist.",
    ),
    benefit: t(
      "Connect the problem to an outcome a user would care about.",
      "Verbinden Sie das Problem mit einem Ergebnis, das Nutzenden wichtig ist.",
    ),
    kind: "worksheet",
    action: "download-worksheet",
    ...pdf("category 2", "2.4_Value_Proposition_Worksheet.pdf"),
    pages: 2,
    fillable: true,
    relatedIds: ["5-3"],
  },
  {
    id: "2-5",
    categoryId: "category-2",
    title: t("Product Mental Model", "Mentales Produktmodell"),
    description: t(
      "Describe what the product fundamentally is, before screens and feature lists.",
      "Beschreiben Sie, was das Produkt im Kern ist, bevor Bildschirme und Funktionslisten kommen.",
    ),
    benefit: t(
      "Agree the product concept before you design the interface.",
      "Klären Sie das Produktkonzept, bevor Sie die Oberfläche entwerfen.",
    ),
    kind: "canvas",
    action: "download-canvas",
    ...pdf("category 2", "2.5_Product_Mental_Model_Canvas.pdf"),
    pages: 2,
    fillable: true,
  },
  {
    id: "2-6",
    categoryId: "category-2",
    title: t("Core Jobs Prioritization", "Priorisierung der Kernaufgaben"),
    description: t(
      "Identify and prioritize what users must be able to accomplish.",
      "Ermitteln und priorisieren Sie, was Nutzende erledigen können müssen.",
    ),
    benefit: t(
      "Choose the jobs that belong in the MVP and the ones that can wait.",
      "Wählen Sie die Aufgaben, die ins MVP gehören, und die, die warten können.",
    ),
    kind: "worksheet",
    action: "download-worksheet",
    ...pdf("category 2", "2.6_Core_Jobs_Prioritization_Worksheet.pdf"),
    pages: 2,
    fillable: true,
    relatedIds: ["5-4", "6-3"],
  },
  {
    id: "2-7",
    categoryId: "category-2",
    title: t("MVP Scope and Exclusions", "MVP-Umfang und Ausschlüsse"),
    description: t(
      "Decide the smallest useful solution and write down what stays out.",
      "Legen Sie die kleinste nützliche Lösung fest und schreiben Sie auf, was draußen bleibt.",
    ),
    benefit: t(
      "Make the MVP boundary explicit instead of letting the scope drift.",
      "Machen Sie die MVP-Grenze ausdrücklich, statt den Umfang treiben zu lassen.",
    ),
    kind: "template",
    action: "download-template",
    ...pdf("category 2", "2.7_MVP_Scope_and_Exclusions_Template.pdf"),
    pages: 2,
    fillable: true,
    relatedIds: ["3-2"],
  },
  {
    id: "2-8",
    categoryId: "category-2",
    title: t("MVP Specification", "MVP-Spezifikation"),
    description: t(
      "Assemble the integrated MVP specification from the decisions made across the stages.",
      "Stellen Sie die integrierte MVP-Spezifikation aus den Entscheidungen der Stufen zusammen.",
    ),
    benefit: t(
      "Hold problem, user, jobs, scope, requirements, and learning in one specification.",
      "Halten Sie Problem, Nutzer, Aufgaben, Umfang, Anforderungen und Lernen in einer Spezifikation.",
    ),
    kind: "template",
    action: "download-template",
    ...pdf("category 2", "2.8_MVP_Specification_Template.pdf"),
    pages: 3,
    fillable: true,
    relatedIds: ["4-2", "3-3"],
  },
  {
    id: "2-9",
    categoryId: "category-2",
    title: t("Context and Lifecycle", "Kontext und Lebenszyklus"),
    description: t(
      "Map the relevant states of the central object and how it moves between them.",
      "Ordnen Sie die relevanten Zustände des zentralen Objekts und die Übergänge dazwischen.",
    ),
    benefit: t(
      "See the product over time, not only as a set of screens.",
      "Sehen Sie das Produkt über die Zeit, nicht nur als eine Menge von Bildschirmen.",
    ),
    kind: "worksheet",
    action: "download-worksheet",
    ...pdf("category 2", "2.9_Context_and_Lifecycle_Worksheet.pdf"),
    pages: 2,
    fillable: true,
  },
  {
    id: "2-10",
    categoryId: "category-2",
    title: t("Core Experience and User Flows", "Kernerlebnis und Nutzerabläufe"),
    description: t(
      "Describe the core flow, including an important empty or error case.",
      "Beschreiben Sie den Kernablauf, einschließlich eines wichtigen Leer- oder Fehlerfalls.",
    ),
    benefit: t(
      "Check that a user can reach the outcome, and what happens when they cannot.",
      "Prüfen Sie, ob Nutzende das Ergebnis erreichen und was geschieht, wenn das nicht gelingt.",
    ),
    kind: "worksheet",
    action: "download-worksheet",
    ...pdf("category 2", "2.10_Core_Experience_and_User_Flows_Worksheet.pdf"),
    pages: 2,
    fillable: true,
  },
  {
    id: "2-11",
    categoryId: "category-2",
    title: t("Information Architecture", "Informationsarchitektur"),
    description: t(
      "Organize the information and objects the product has to make findable.",
      "Ordnen Sie die Informationen und Objekte, die das Produkt auffindbar machen muss.",
    ),
    benefit: t(
      "Give every MVP capability a place before you invent navigation.",
      "Geben Sie jeder MVP-Fähigkeit einen Ort, bevor Sie die Navigation erfinden.",
    ),
    kind: "worksheet",
    action: "download-worksheet",
    ...pdf("category 2", "2.11_Information_Architecture_Worksheet.pdf"),
    pages: 2,
    fillable: true,
  },
  {
    id: "2-12",
    categoryId: "category-2",
    title: t("Data Model", "Datenmodell"),
    description: t(
      "Name the entities, fields, and relationships the MVP needs.",
      "Benennen Sie die Entitäten, Felder und Beziehungen, die das MVP braucht.",
    ),
    benefit: t(
      "Define the data the product must remember, not a full database design.",
      "Definieren Sie die Daten, die das Produkt behalten muss, nicht ein vollständiges Datenbankdesign.",
    ),
    kind: "worksheet",
    action: "download-worksheet",
    ...pdf("category 2", "2.12_Data_Model_Worksheet.pdf"),
    pages: 2,
    fillable: true,
    relatedIds: ["1-3"],
  },
  {
    id: "2-13",
    categoryId: "category-2",
    title: t("Requirements and Acceptance Criteria", "Anforderungen und Abnahmekriterien"),
    description: t(
      "Write what must be built and how you will recognize that it behaves correctly.",
      "Schreiben Sie auf, was gebaut werden muss und woran Sie korrektes Verhalten erkennen.",
    ),
    benefit: t(
      "Turn jobs and flows into requirements you can trace and accept.",
      "Machen Sie aus Aufgaben und Abläufen Anforderungen, die Sie nachverfolgen und abnehmen können.",
    ),
    kind: "worksheet",
    action: "download-worksheet",
    ...pdf("category 2", "2.13_Requirements_and_Acceptance_Criteria_Worksheet.pdf"),
    pages: 2,
    fillable: true,
    relatedIds: ["5-5", "6-5"],
  },
  {
    id: "2-14",
    categoryId: "category-2",
    title: t("Learning and Metrics", "Lernen und Kennzahlen"),
    description: t(
      "Define what the MVP must test and which signals would change your mind.",
      "Legen Sie fest, was das MVP prüfen muss und welche Signale Ihre Meinung ändern würden.",
    ),
    benefit: t(
      "Treat the MVP as a learning instrument, not only as a smaller build.",
      "Behandeln Sie das MVP als Lerninstrument, nicht nur als einen kleineren Bau.",
    ),
    kind: "worksheet",
    action: "download-worksheet",
    ...pdf("category 2", "2.14_Learning_and_Metrics_Worksheet.pdf"),
    pages: 2,
    fillable: true,
    relatedIds: ["7-2"],
  },
  {
    id: "2-15",
    categoryId: "category-2",
    title: t("Technical Boundaries", "Technische Grenzen"),
    description: t(
      "Record platform, privacy, dependencies, technical risks, and open feasibility questions.",
      "Halten Sie Plattform, Datenschutz, Abhängigkeiten, technische Risiken und offene Machbarkeitsfragen fest.",
    ),
    benefit: t(
      "Surface constraints before they surprise the build.",
      "Machen Sie Grenzen sichtbar, bevor sie den Bau überraschen.",
    ),
    kind: "worksheet",
    action: "download-worksheet",
    ...pdf("category 2", "2.15_Technical_Boundaries_Worksheet.pdf"),
    pages: 2,
    fillable: true,
  },
  {
    id: "3-1",
    categoryId: "category-3",
    title: t(
      "App Idea Ready for MVP Definition",
      "App-Idee bereit für die MVP-Definition",
    ),
    description: t(
      "Check whether an app idea is ready to enter a structured MVP definition.",
      "Prüfen Sie, ob eine App-Idee bereit ist für eine strukturierte MVP-Definition.",
    ),
    benefit: t(
      "Find the gaps before you invest in a full specification.",
      "Finden Sie die Lücken, bevor Sie in eine vollständige Spezifikation investieren.",
    ),
    kind: "checklist",
    action: "download-checklist",
    ...pdf("category 3", "MVPCompanion_Resource_3_1_App_Idea_Ready_for_MVP_Definition.pdf"),
    pages: 4,
    fillable: true,
  },
  {
    id: "3-2",
    categoryId: "category-3",
    title: t("MVP Scope Challenge", "MVP-Umfang hinterfragen"),
    description: t(
      "Challenge whether the proposed scope is the smallest coherent product.",
      "Hinterfragen Sie, ob der vorgeschlagene Umfang das kleinste stimmige Produkt ist.",
    ),
    benefit: t(
      "Cut work that does not belong in the first testable product.",
      "Streichen Sie Arbeit, die nicht ins erste testbare Produkt gehört.",
    ),
    kind: "worksheet",
    action: "download-worksheet",
    ...pdf("category 3", "MVPCompanion_Resource_3_2_The_MVP_Scope_Challenge_Interactive_Worksheet.pdf"),
    pages: 4,
    fillable: true,
    relatedIds: ["2-7"],
  },
  {
    id: "3-3",
    categoryId: "category-3",
    title: t(
      "MVP Specification Readiness Checklist",
      "Checkliste: Reife der MVP-Spezifikation",
    ),
    description: t(
      "Review whether the specification is coherent enough to proceed.",
      "Prüfen Sie, ob die Spezifikation stimmig genug ist, um weiterzugehen.",
    ),
    benefit: t(
      "See what is still open before you treat the specification as ready.",
      "Sehen Sie, was noch offen ist, bevor Sie die Spezifikation als bereit behandeln.",
    ),
    kind: "checklist",
    action: "download-checklist",
    ...pdf("category 3", "Resource_3_3_MVP_Specification_Readiness_Checklist_Interactive.pdf"),
    pages: 3,
    fillable: true,
    featured: true,
    relatedIds: ["5-6", "2-8"],
  },
  {
    id: "3-4",
    categoryId: "category-3",
    title: t("Stage Gate Review", "Stufen-Review"),
    description: t(
      "Review a stage before you treat its output as settled.",
      "Prüfen Sie eine Stufe, bevor Sie ihr Ergebnis als geklärt behandeln.",
    ),
    benefit: t(
      "Catch a weak stage decision before later stages build on it.",
      "Erkennen Sie eine schwache Stufenentscheidung, bevor spätere Stufen darauf aufbauen.",
    ),
    kind: "review",
    action: "download-review",
    ...pdf("category 3", "Resource_3_4_Stage_Gate_Review_Sheet_Interactive.pdf"),
    pages: 3,
    fillable: true,
  },
  {
    id: "4-1",
    categoryId: "category-4",
    title: t("From Idea to MVP: A Worked Example", "Von der Idee zum MVP: Ein durchgearbeitetes Beispiel"),
    description: t(
      "Follow one idea through the method to a coherent MVP.",
      "Folgen Sie einer Idee durch die Methode bis zu einem stimmigen MVP.",
    ),
    benefit: t(
      "See the shape of the work before you fill in your own answers.",
      "Sehen Sie die Form der Arbeit, bevor Sie Ihre eigenen Antworten eintragen.",
    ),
    kind: "example",
    action: "open-example",
    ...pdf("category 4", "MVPCompanion_Resource_4_1_From_Idea_to_MVP_A_Worked_Example.pdf"),
    pages: 9,
    featured: true,
  },
  {
    id: "4-2",
    categoryId: "category-4",
    title: t("Good vs. Bad MVP Specifications", "Gute und schwache MVP-Spezifikationen"),
    description: t(
      "Compare a useful specification with one that looks complete but does not hold together.",
      "Vergleichen Sie eine brauchbare Spezifikation mit einer, die vollständig wirkt, aber nicht zusammenhält.",
    ),
    benefit: t(
      "Recognize the difference between a long document and a traceable specification.",
      "Erkennen Sie den Unterschied zwischen einem langen Dokument und einer nachvollziehbaren Spezifikation.",
    ),
    kind: "example",
    action: "open-example",
    ...pdf(
      "category 4",
      "MVPCompanion_Resource_4_2_Good_vs_Bad_MVP_Specifications_Interactive_Corrected.pdf",
    ),
    pages: 5,
    fillable: true,
    relatedIds: ["2-8"],
  },
  {
    id: "5-1",
    categoryId: "category-5",
    title: t("AI Idea Clarifier", "KI-Ideenklärer"),
    description: t(
      "A prompt for clarifying an idea. The product judgment stays with you.",
      "Ein Prompt, um eine Idee zu klären. Das Produkturteil bleibt bei Ihnen.",
    ),
    benefit: t(
      "Pressure-test a fuzzy idea before you commit it to a brief.",
      "Prüfen Sie eine unscharfe Idee, bevor Sie sie in einen Ideenbrief schreiben.",
    ),
    kind: "prompt",
    action: "use-prompt",
    ...pdf("category 5 ", "MVPCompanion_Resource_5_1_AI_Idea_Clarifier_Final.pdf"),
    pages: 4,
    fillable: true,
    relatedIds: ["2-1"],
  },
  {
    id: "5-2",
    categoryId: "category-5",
    title: t("AI Problem Challenger", "KI-Problemherausforderer"),
    description: t(
      "A prompt that challenges the problem statement rather than polishing the solution.",
      "Ein Prompt, der die Problemformulierung herausfordert, statt die Lösung zu glätten.",
    ),
    benefit: t(
      "Find out whether the problem is real, distinct, and worth solving.",
      "Finden Sie heraus, ob das Problem real, unterscheidbar und lösenswert ist.",
    ),
    kind: "prompt",
    action: "use-prompt",
    ...pdf("category 5 ", "MVPCompanion_Resource_5_2_AI_Problem_Challenger.pdf"),
    pages: 4,
    fillable: true,
    relatedIds: ["2-2"],
  },
  {
    id: "5-3",
    categoryId: "category-5",
    title: t("AI User and Value Analyst", "KI-Analyse von Nutzer und Wert"),
    description: t(
      "A prompt for pressure-testing the primary user and the value proposition.",
      "Ein Prompt, um die primäre Nutzergruppe und das Wertversprechen zu prüfen.",
    ),
    benefit: t(
      "Check that the user and the promised outcome belong together.",
      "Prüfen Sie, ob Nutzergruppe und versprochenes Ergebnis zusammengehören.",
    ),
    kind: "prompt",
    action: "use-prompt",
    ...pdf("category 5 ", "MVPCompanion_Resource_5_3_AI_User_and_Value_Analyst.pdf"),
    pages: 4,
    fillable: true,
    relatedIds: ["2-3", "2-4"],
  },
  {
    id: "5-4",
    categoryId: "category-5",
    title: t("AI Core Jobs and Scope Assistant", "KI-Assistent für Kernaufgaben und Umfang"),
    description: t(
      "A prompt for challenging core jobs and the resulting MVP scope.",
      "Ein Prompt, um Kernaufgaben und den daraus folgenden MVP-Umfang herauszufordern.",
    ),
    benefit: t(
      "See which jobs actually justify a place in the MVP.",
      "Sehen Sie, welche Aufgaben einen Platz im MVP wirklich begründen.",
    ),
    kind: "prompt",
    action: "use-prompt",
    ...pdf("category 5 ", "MVPCompanion_Resource_5_4_AI_Core_Jobs_and_Scope_Assistant.pdf"),
    pages: 4,
    fillable: true,
    relatedIds: ["2-6"],
  },
  {
    id: "5-5",
    categoryId: "category-5",
    title: t("AI Requirements Reviewer", "KI-Review der Anforderungen"),
    description: t(
      "A prompt for reviewing requirements and acceptance criteria.",
      "Ein Prompt für das Review von Anforderungen und Abnahmekriterien.",
    ),
    benefit: t(
      "Look for requirements that cannot be traced back to a job or an outcome.",
      "Suchen Sie Anforderungen, die sich nicht auf eine Aufgabe oder ein Ergebnis zurückführen lassen.",
    ),
    kind: "prompt",
    action: "use-prompt",
    ...pdf("category 5 ", "MVPCompanion_Resource_5_5_AI_Requirements_Reviewer.pdf"),
    pages: 4,
    fillable: true,
    relatedIds: ["2-13"],
  },
  {
    id: "5-6",
    categoryId: "category-5",
    title: t("AI MVP Readiness Reviewer", "KI-Review der MVP-Reife"),
    description: t(
      "A prompt for reviewing whether the MVP definition is ready to proceed.",
      "Ein Prompt, um zu prüfen, ob die MVP-Definition bereit zum Weitergehen ist.",
    ),
    benefit: t(
      "Get a structured challenge of the whole definition, then decide yourself.",
      "Holen Sie eine strukturierte Herausforderung der gesamten Definition ein und entscheiden Sie selbst.",
    ),
    kind: "prompt",
    action: "use-prompt",
    ...pdf("category 5 ", "MVPCompanion_Resource_5_6_AI_MVP_Readiness_Reviewer.pdf"),
    pages: 4,
    fillable: true,
    relatedIds: ["3-3"],
  },
  {
    id: "6-1",
    categoryId: "category-6",
    title: t("What Is an MVP?", "Was ist ein MVP?"),
    description: t(
      "A short explanation of an MVP as the smallest coherent product worth building and learning from.",
      "Eine kurze Erklärung des MVP als kleinstes stimmiges Produkt, das sich zu bauen und daraus zu lernen lohnt.",
    ),
    benefit: t(
      "Share a definition before the word MVP turns into a smaller feature list.",
      "Teilen Sie eine Definition, bevor das Wort MVP zu einer kürzeren Funktionsliste wird.",
    ),
    kind: "explainer",
    action: "read-brief",
    ...pdf("category 6", "MVPCompanion_Resource_6_1_What_Is_an_MVP.pdf"),
    pages: 4,
    fillable: true,
  },
  {
    id: "6-2",
    categoryId: "category-6",
    title: t(
      "Why Progressive Clarification Matters",
      "Warum schrittweise Klärung zählt",
    ),
    description: t(
      "Why product decisions become clearer in stages instead of all at once.",
      "Warum Produktentscheidungen stufenweise klarer werden, statt auf einmal.",
    ),
    benefit: t(
      "Understand why earlier decisions can be revisited as evidence appears.",
      "Verstehen Sie, warum frühere Entscheidungen mit neuer Evidenz überdacht werden können.",
    ),
    kind: "explainer",
    action: "read-brief",
    ...pdf("category 6", "MVPCompanion_Resource_6.2_Why_Progressive_Clarification_Matters.pdf"),
    pages: 4,
    fillable: true,
  },
  {
    id: "6-3",
    categoryId: "category-6",
    title: t("What Is a Core Job?", "Was ist eine Kernaufgabe?"),
    description: t(
      "What a core job is, and why it is not the same thing as a feature.",
      "Was eine Kernaufgabe ist und warum sie nicht dasselbe ist wie eine Funktion.",
    ),
    benefit: t(
      "Describe what users must accomplish before you list capabilities.",
      "Beschreiben Sie, was Nutzende erledigen müssen, bevor Sie Fähigkeiten auflisten.",
    ),
    kind: "explainer",
    action: "read-brief",
    ...pdf("category 6", "MVPCompanion_Resource_6.3_What_Is_a_Core_Job.pdf"),
    pages: 4,
    fillable: true,
    relatedIds: ["2-6"],
  },
  {
    id: "6-4",
    categoryId: "category-6",
    title: t("Evidence vs. Hypothesis", "Evidenz und Hypothese"),
    description: t(
      "How to tell evidence, hypothesis, derived decisions, and open questions apart.",
      "Wie Sie Evidenz, Hypothese, abgeleitete Entscheidungen und offene Fragen auseinanderhalten.",
    ),
    benefit: t(
      "Mark what you know, what you assume, and what is still open.",
      "Kennzeichnen Sie, was Sie wissen, was Sie annehmen und was noch offen ist.",
    ),
    kind: "explainer",
    action: "read-brief",
    ...pdf("category 6", "MVPCompanion_Resource_6.4_Evidence_vs._Hypothesis.pdf"),
    pages: 4,
    fillable: true,
    relatedIds: ["7-1"],
  },
  {
    id: "6-5",
    categoryId: "category-6",
    title: t("What Is Traceability?", "Was ist Nachvollziehbarkeit?"),
    description: t(
      "How problem, user, outcome, core job, capability, requirement, acceptance criterion, and metric stay connected.",
      "Wie Problem, Nutzer, Ergebnis, Kernaufgabe, Fähigkeit, Anforderung, Abnahmekriterium und Kennzahl verbunden bleiben.",
    ),
    benefit: t(
      "See why a requirement with no upstream job is a warning.",
      "Sehen Sie, warum eine Anforderung ohne vorgelagerte Aufgabe ein Warnsignal ist.",
    ),
    kind: "explainer",
    action: "read-brief",
    ...pdf("category 6", "MVPCompanion_Resource_6.5_What_Is_Traceability.pdf"),
    pages: 4,
    fillable: true,
    relatedIds: ["2-13"],
  },
  {
    id: "6-6",
    categoryId: "category-6",
    title: t(
      "What Should an MVP Specification Contain?",
      "Was sollte eine MVP-Spezifikation enthalten?",
    ),
    description: t(
      "What belongs in the integrated specification that comes out of the 15 stages.",
      "Was in die integrierte Spezifikation gehört, die aus den 15 Stufen entsteht.",
    ),
    benefit: t(
      "Know the outcome of the method before you assemble your own specification.",
      "Kennen Sie das Ergebnis der Methode, bevor Sie Ihre eigene Spezifikation zusammensetzen.",
    ),
    kind: "explainer",
    action: "read-brief",
    ...pdf("category 6", "MVPCompanion_Resource_6.6_What_Should_an_MVP_Specification_Contain.pdf"),
    pages: 4,
    fillable: true,
    relatedIds: ["2-8"],
  },
  {
    id: "7-1",
    categoryId: "category-7",
    title: t("MVP Hypothesis and Evidence Tracker", "Tracker für MVP-Hypothesen und Evidenz"),
    description: t(
      "Track hypotheses and the evidence that would support or weaken them.",
      "Verfolgen Sie Hypothesen und die Evidenz, die sie stützen oder schwächen würde.",
    ),
    benefit: t(
      "Keep learning visible instead of burying assumptions in the specification.",
      "Halten Sie das Lernen sichtbar, statt Annahmen in der Spezifikation zu vergraben.",
    ),
    kind: "tracker",
    action: "download-tracker",
    ...pdf("category 7", "MVPCompanion_Resource_7_1_MVP_Hypothesis_and_Evidence_Tracker.pdf"),
    pages: 5,
    fillable: true,
    relatedIds: ["7-3", "6-4"],
  },
  {
    id: "7-2",
    categoryId: "category-7",
    title: t(
      "Define What Your MVP Must Teach You",
      "Legen Sie fest, was Ihr MVP Sie lehren muss",
    ),
    description: t(
      "Decide the learning the MVP has to produce before you plan how to build it.",
      "Legen Sie das Lernen fest, das das MVP erzeugen muss, bevor Sie den Bau planen.",
    ),
    benefit: t(
      "Choose the questions the first product is responsible for answering.",
      "Wählen Sie die Fragen, für deren Antwort das erste Produkt zuständig ist.",
    ),
    kind: "worksheet",
    action: "download-worksheet",
    ...pdf("category 7", "MVPCompanion_Resource_7_2_Define_What_Your_MVP_Must_Teach_You.pdf"),
    pages: 4,
    fillable: true,
    relatedIds: ["7-3", "2-14"],
  },
  {
    id: "7-3",
    categoryId: "category-7",
    title: t("The MVP Experiment Planner", "Der MVP-Experimentplaner"),
    description: t(
      "Plan the experiment that can produce the learning the MVP is for.",
      "Planen Sie das Experiment, das das Lernen erzeugen kann, für das das MVP da ist.",
    ),
    benefit: t(
      "Connect a hypothesis to an observable test and a decision you might change.",
      "Verbinden Sie eine Hypothese mit einem beobachtbaren Test und einer Entscheidung, die Sie ändern könnten.",
    ),
    kind: "planner",
    action: "download-planner",
    ...pdf("category 7", "MVPCompanion_Resource_7_3_The_MVP_Experiment_Planner.pdf"),
    pages: 1,
    fillable: true,
    featured: true,
    relatedIds: ["7-1", "7-2"],
  },
];

/** Files present on disk that are intentionally not separate catalog entries. */
export const acknowledgedUnlistedFiles: readonly {
  folder: string;
  filename: string;
  reason: string;
}[] = [
  {
    folder: "category 6",
    filename: "MVPCompanion_Resource_7_1_MVP_Hypothesis_and_Evidence_Tracker.pdf",
    reason:
      "Byte-identical copy of resource 7-1. Cataloged once, in category 7.",
  },
];

export const contentFlags: readonly { id: string; note: string }[] = [
  {
    id: "1-4",
    note:
      "The diagram groups the fifteen stages differently from the canonical method on this website. It names the lenses User, Value, Feasibility, Business, and Learning, rather than Desirability, Differentiation, Viability, Feasibility, and Learning. Market Discovery appears both as a numbered stage and as a cross-cutting workstream.",
  },
];

export function resourceHref(resource: Pick<LibraryResource, "folder" | "filename">): string {
  return resourcePublicPath(resource.folder, resource.filename);
}
