import { startContent } from "@/content/start";

type PathIndex = 0 | 1 | 2 | 3;

type ClarificationPathProps = {
  current: PathIndex;
};

export function ClarificationPath({ current }: ClarificationPathProps) {
  return (
    <ol
      aria-label={startContent.pathLabel}
      className="flex flex-wrap items-baseline gap-x-3 gap-y-2 text-sm"
    >
      {startContent.path.map((step, index) => (
        <li key={step} className="flex items-baseline gap-3">
          <span
            aria-current={index === current ? "step" : undefined}
            className={index === current ? "text-foreground" : "text-muted"}
          >
            {step}
          </span>
          {index < startContent.path.length - 1 ? (
            <span aria-hidden="true" className="text-muted">
              →
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
