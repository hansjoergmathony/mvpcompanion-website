import type { Locale } from "@/lib/i18n/config";
import {
  createEmptyStages,
  type IdeaStages,
  type StartingContext,
} from "@/lib/project/types";

const english = {
  title: "BookScout",
  idea: "BookScout recommends books to readers based on the books on their own bookshelves. The usefulness of this idea is a hypothesis.",
  problem:
    "Readers with a shelf of their own books still struggle to choose what to read next, and generic bestseller lists ignore the books they already own.",
  user: "An adult reader who keeps a personal bookshelf and wants a next book without starting from a blank catalog.",
  value:
    "The reader can ask for a next book and see a suggestion that starts from titles they already own.",
  product:
    "BookScout is a recommendation companion organized around the reader's own shelf. Recommendations may include further books. Owning a book does not mean the reader liked it.",
  context:
    "A shelf entry has the states owned, considered, and set aside. It moves from owned to considered when it is used for a recommendation, then to set aside or back to owned.",
  jobs: "Record books on the shelf and ask for one next-book recommendation.",
  scope:
    "Illustrative scope decision, not customer evidence. The example MVP covers one personal shelf and one recommendation that may name additional books. It does not include a social network, a store checkout, or proof that the idea is useful.",
  experience:
    "The reader adds owned books, asks for a next book, and sees a suggestion that cites those books. If the shelf is empty, BookScout returns no recommendation and asks for at least one owned book.",
  informationArchitecture:
    "The central objects are the shelf, the owned book, and the recommendation. The central information is which owned books a suggestion refers to.",
  data: "Data model: a shelf entry (title, optional note) and a recommendation (suggested title, referenced shelf entries). Ownership is not a liking field.",
  requirements:
    "Illustrative checks, not a record of customer tests. The reader can add an owned book and receive one recommendation that cites at least one owned book. The suggestion must not treat ownership as liking.",
  learning:
    "Illustrative measurement example, not customer evidence. One example question is whether a recommendation based on an owned shelf feels useful. No figure here is a measured result.",
  technicalBoundaries:
    "Illustrative assumptions only, not customer evidence. Platform: one personal shelf. Architecture: recommendations without a live bookstore catalog. Dependency: no external catalog. Privacy: no account data beyond the shelf. Technical risk: a suggestion may name a book the reader cannot obtain. Open feasibility question: whether a useful recommendation can be produced from the shelf alone.",
  mvpBoundary:
    "In: one shelf and one next-book request. Out: ratings as proof of taste, social features, and purchasing.",
} as const;

const german = {
  title: "BookScout",
  idea: "BookScout empfiehlt Leserinnen und Lesern Bücher auf Basis der Bücher in ihrem eigenen Bücherregal. Die Nützlichkeit dieser Idee ist eine Hypothese.",
  problem:
    "Leserinnen und Leser mit einem eigenen Bücherregal tun sich schwer, das nächste Buch zu wählen. Bestsellerlisten ignorieren die Bücher, die sie schon besitzen.",
  user: "Eine erwachsene Person mit eigenem Bücherregal, die ein nächstes Buch sucht, ohne bei einem leeren Katalog zu beginnen.",
  value:
    "Die Person kann nach einem nächsten Buch fragen und einen Vorschlag sehen, der von Titeln ausgeht, die sie bereits besitzt.",
  product:
    "BookScout ist ein Empfehlungsbegleiter, der um das eigene Regal herum organisiert ist. Empfehlungen dürfen weitere Bücher umfassen. Besitz allein bedeutet nicht, dass ein Buch gefällt.",
  context:
    "Ein Regaleintrag hat die Zustände vorhanden, geprüft und zurückgestellt. Er wechselt von vorhanden zu geprüft, wenn er für eine Empfehlung genutzt wird, und danach zu zurückgestellt oder zurück zu vorhanden.",
  jobs: "Bücher im Regal erfassen und eine Empfehlung für das nächste Buch erfragen.",
  scope:
    "Illustrative Umfangsentscheidung, keine Kundenevidenz. Das Beispiel-MVP umfasst ein persönliches Regal und eine Empfehlung, die weitere Bücher nennen darf. Kein soziales Netzwerk, kein Kaufabschluss und kein Beleg, dass die Idee nützlich ist.",
  experience:
    "Die Person trägt vorhandene Bücher ein, bittet um ein nächstes Buch und sieht einen Vorschlag, der diese Bücher nennt. Ist das Regal leer, gibt BookScout keine Empfehlung zurück und bittet um mindestens ein vorhandenes Buch.",
  informationArchitecture:
    "Die zentralen Objekte sind das Regal, das vorhandene Buch und die Empfehlung. Die zentrale Information ist, auf welche eigenen Bücher sich ein Vorschlag bezieht.",
  data: "Datenmodell: ein Regaleintrag (Titel, optionale Notiz) und eine Empfehlung (vorgeschlagener Titel, zugehörige Regaleinträge). Besitz ist kein Gefallen-Feld.",
  requirements:
    "Illustrative Prüfpunkte, kein Protokoll von Kundentests. Die Person kann ein vorhandenes Buch eintragen und eine Empfehlung erhalten, die mindestens ein eigenes Buch nennt. Der Vorschlag darf Besitz nicht mit Gefallen gleichsetzen.",
  learning:
    "Illustratives Messziel, keine Kundenevidenz. Eine Beispielfrage ist, ob eine Empfehlung auf Basis des eigenen Regals nützlich wirkt. Keine Zahl hier ist ein gemessenes Ergebnis.",
  technicalBoundaries:
    "Nur illustrative Annahmen, keine Kundenevidenz. Plattform: ein persönliches Regal. Architektur: Empfehlungen ohne Live-Katalog einer Buchhandlung. Abhängigkeit: kein externer Katalog. Datenschutz: keine Kontodaten über das Regal hinaus. Technisches Risiko: ein Vorschlag kann ein Buch nennen, das nicht beschafft werden kann. Offene Machbarkeitsfrage: ob eine nützliche Empfehlung allein aus dem Regal entstehen kann.",
  mvpBoundary:
    "Drin: ein Regal und eine Anfrage nach dem nächsten Buch. Draußen: Bewertungen als Geschmacksbeleg, soziale Funktionen und Kaufen.",
} as const;

export function bookScoutContent(locale: Locale) {
  return locale === "de" ? german : english;
}

export function bookScoutStages(locale: Locale): IdeaStages {
  const content = bookScoutContent(locale);
  const stages = createEmptyStages();
  const answers = {
    idea: content.idea,
    problem: content.problem,
    user: content.user,
    value: content.value,
    product: content.product,
    context: content.context,
    jobs: content.jobs,
    scope: content.scope,
    experience: content.experience,
    informationArchitecture: content.informationArchitecture,
    data: content.data,
    requirements: content.requirements,
    learning: content.learning,
    technicalBoundaries: content.technicalBoundaries,
    mvpBoundary: content.mvpBoundary,
  };

  for (const [key, answer] of Object.entries(answers)) {
    stages[key as keyof IdeaStages] = { answer };
  }

  return stages;
}

export function bookScoutContext(locale: Locale): StartingContext {
  const content = bookScoutContent(locale);
  return {
    idea: content.idea,
    problem: content.problem,
    user: content.user,
  };
}
