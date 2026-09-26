import { resultContent } from "@/content/homepage";

export function ResultDimensions() {
  return (
    <ol
      aria-label="Valuable, Viable, Buildable"
      className="grid border-y border-border lg:grid-cols-3"
    >
      {resultContent.dimensions.map((dimension, index) => {
        const isLast = index === resultContent.dimensions.length - 1;

        return (
          <li
            key={dimension.name}
            className={`py-6 lg:px-8 lg:py-7 ${
              index === 0 ? "lg:pl-0" : "lg:border-l lg:border-border"
            } ${isLast ? "" : "border-b border-border lg:border-b-0"}`}
          >
            <h3
              className={`text-xl font-semibold tracking-tight ${
                isLast ? "text-teal" : "text-navy"
              }`}
            >
              {dimension.name}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-muted">
              {dimension.description}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
