import { getDictionary } from "@/lib/i18n/get-dictionary";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export async function AiChallengeSection() {
  const { aiChallengeContent } = await getDictionary();
  return (
    <Section id="ai-challenge" tone="ice">
      <SectionHeading
        eyebrow={aiChallengeContent.eyebrow}
        title={aiChallengeContent.headline}
        description={aiChallengeContent.introduction}
      />
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-navy">
        {aiChallengeContent.reactStatement}
      </p>

      <section aria-labelledby="ai-challenge-meaning" className="mt-12 max-w-3xl">
        <h3
          id="ai-challenge-meaning"
          className="text-xl font-semibold tracking-tight text-navy"
        >
          {aiChallengeContent.meaningTitle}
        </h3>
        <p className="mt-4 text-base leading-relaxed text-muted">
          {aiChallengeContent.meaningIntro}
        </p>
        <p className="mt-6 text-sm font-medium text-navy">
          {aiChallengeContent.meaningLead}
        </p>
        <ul className="mt-4 space-y-2">
          {aiChallengeContent.meaningExamples.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-base leading-relaxed text-muted"
            >
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-base leading-relaxed text-muted">
          {aiChallengeContent.meaningClose}
        </p>
      </section>

      <section
        aria-labelledby="ai-challenge-example"
        className="mt-12 rounded-2xl border border-border bg-card px-6 py-8 md:px-8"
      >
        <p className="text-xs font-medium tracking-[0.18em] text-blue uppercase">
          {aiChallengeContent.exampleLabel}
        </p>
        <h3 id="ai-challenge-example" className="sr-only">
          Example of AI Challenge
        </h3>

        <div className="mt-6 space-y-6">
          <div>
            <p className="text-sm font-medium text-navy">
              {aiChallengeContent.exampleYourAnswerLabel}
            </p>
            <p className="mt-2 text-base leading-relaxed text-muted">
              {aiChallengeContent.exampleYourAnswer}
            </p>
          </div>
          <p aria-hidden="true" className="text-center text-sm text-blue">
            ↓
          </p>
          <div>
            <p className="text-sm font-medium text-navy">
              {aiChallengeContent.exampleChallengeLabel}
            </p>
            <p className="mt-2 text-base leading-relaxed text-muted">
              {aiChallengeContent.exampleChallenge}
            </p>
          </div>
          <p aria-hidden="true" className="text-center text-sm text-blue">
            ↓
          </p>
          <div>
            <p className="text-sm font-medium text-navy">
              {aiChallengeContent.exampleRefinedLabel}
            </p>
            <p className="mt-2 text-base leading-relaxed text-muted">
              {aiChallengeContent.exampleRefined}
            </p>
          </div>
        </div>
        <p className="mt-6 text-sm leading-relaxed text-muted">
          {aiChallengeContent.exampleNote}
        </p>
      </section>

      <section aria-labelledby="ai-challenge-flow" className="mt-12">
        <h3
          id="ai-challenge-flow"
          className="text-xl font-semibold tracking-tight text-navy"
        >
          {aiChallengeContent.flowTitle}
        </h3>
        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {aiChallengeContent.flowSteps.map((step, index) => (
            <li
              key={step}
              className="rounded-xl border border-border bg-card px-4 py-4"
            >
              <p className="text-[11px] font-medium tracking-[0.16em] text-blue uppercase">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-2 text-sm font-medium leading-snug text-navy">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="ai-challenge-spec" className="mt-12 max-w-3xl">
        <h3
          id="ai-challenge-spec"
          className="text-xl font-semibold tracking-tight text-navy"
        >
          {aiChallengeContent.specTitle}
        </h3>
        <p className="mt-4 text-base leading-relaxed text-muted">
          {aiChallengeContent.specSupporting}
        </p>
        <p className="mt-4 text-base leading-relaxed text-muted">
          {aiChallengeContent.specClosing}
        </p>
        <p className="mt-4 text-base font-medium leading-relaxed text-navy">
          {aiChallengeContent.distinctionReminder}
        </p>
      </section>

      <div className="mt-12 max-w-3xl rounded-2xl border border-border bg-card px-6 py-8">
        <p className="text-lg font-semibold tracking-tight text-navy">
          {aiChallengeContent.principle}
        </p>
        <p className="mt-4 text-base leading-relaxed text-muted">
          {aiChallengeContent.principleSupporting}
        </p>
      </div>
    </Section>
  );
}
