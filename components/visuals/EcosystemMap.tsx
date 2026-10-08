import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function EcosystemMap() {
  const { ecosystemContent } = await getDictionary();
  return (
    <figure className="mt-10">
      <figcaption className="sr-only">
        {ecosystemContent.methodLabel}:{" "}
        {ecosystemContent.parts
          .map((part) => `${part.name} → ${part.role}`)
          .join(", ")}
      </figcaption>

      <p className="text-xs font-medium tracking-[0.2em] text-blue uppercase">
        {ecosystemContent.methodLabel}
      </p>

      <ol className="mt-6 grid gap-8 border-t border-border pt-6 sm:grid-cols-3 sm:gap-6">
        {ecosystemContent.parts.map((part) => (
          <li key={part.name} className="min-w-0">
            <h3 className="text-2xl font-semibold tracking-tight text-navy">
              {part.name}
            </h3>
            <p className="mt-2 text-sm font-medium tracking-wide text-navy">
              <span aria-hidden="true" className="text-muted">
                →{" "}
              </span>
              {part.role}
            </p>
            <p className="mt-3 text-base leading-relaxed text-muted">
              {part.description}
            </p>
            <p
              className={`mt-3 text-xs font-medium tracking-[0.14em] uppercase ${
                part.available ? "text-teal" : "text-muted"
              }`}
            >
              {part.availability}
            </p>
          </li>
        ))}
      </ol>
      <p className="mt-8 max-w-3xl text-base leading-relaxed text-muted">
        {ecosystemContent.appDifference}
      </p>
    </figure>
  );
}
