import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function TraceabilityDiagram() {
  const { frameworkContent } = await getDictionary();
  const chain = frameworkContent.qualityPrinciple.chain;
  const caption = chain.join(" → ");

  return (
    <figure>
      <figcaption className="sr-only">{caption}</figcaption>
      <ol
        aria-label={caption}
        className="-mx-6 flex items-center overflow-x-auto px-6 pb-2 md:mx-0 md:px-0 lg:overflow-visible lg:pb-0"
      >
        {chain.map((item, index) => {
          const isLast = index === chain.length - 1;
          const isMetric = index === chain.length - 1;
          const isAcceptanceCriterion = index === chain.length - 2;

          return (
            <li key={item} className="contents">
              <div
                className={`flex h-[4.5rem] min-w-36 shrink-0 snap-start items-center justify-center rounded-xl border px-3 text-center text-sm font-semibold tracking-tight lg:min-w-0 lg:flex-1 ${
                  isAcceptanceCriterion ? "min-w-44 lg:flex-[1.45]" : ""
                } ${
                  isMetric
                    ? "border-teal/40 bg-teal/5 text-teal"
                    : "border-border bg-card text-navy"
                }`}
              >
                {item}
              </div>
              {isLast ? null : <Connector />}
            </li>
          );
        })}
      </ol>
    </figure>
  );
}

function Connector() {
  return (
    <span
      aria-hidden="true"
      className="relative h-px w-6 shrink-0 bg-blue after:absolute after:top-1/2 after:right-0 after:h-1.5 after:w-1.5 after:-translate-y-1/2 after:rotate-45 after:border-t after:border-r after:border-blue"
    />
  );
}
