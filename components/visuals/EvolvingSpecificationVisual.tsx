import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function EvolvingSpecificationVisual() {
  const { processContent } = await getDictionary();

  return (
    <figure className="mt-10 max-w-2xl">
      <figcaption className="sr-only">{processContent.growsHeadline}</figcaption>

      <ol className="space-y-3">
        {processContent.specificationFlow.map((step, index) => (
          <li key={step}>
            <article
              className={`rounded-xl border px-5 py-4 ${
                index === processContent.specificationFlow.length - 1
                  ? "border-navy bg-navy text-white"
                  : index === processContent.specificationFlow.length - 2
                    ? "border-blue/25 bg-ice"
                    : "border-border bg-card"
              }`}
            >
              <p
                className={`text-sm font-semibold tracking-tight ${
                  index === processContent.specificationFlow.length - 1
                    ? "text-white"
                    : "text-navy"
                }`}
              >
                {step}
              </p>
            </article>
            {index < processContent.specificationFlow.length - 1 ? (
              <p aria-hidden="true" className="py-2 text-center text-sm text-blue">
                ↓
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </figure>
  );
}
