import { getDictionary } from "@/lib/i18n/get-dictionary";

const phaseIcons = [
  UnderstandIcon,
  DefineIcon,
  ShapeIcon,
  SpecifyIcon,
  LearnIcon,
] as const;

export async function ApproachJourney() {
  const { processPhases } = await getDictionary();
  const phaseLabel = processPhases.map((phase) => phase.name).join(", ");

  return (
    <ol
      aria-label={phaseLabel}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5"
    >
      {processPhases.map((phase, index) => {
        const Icon = phaseIcons[index];
        const isLast = index === processPhases.length - 1;

        return (
          <li key={phase.id} className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center ${
                  isLast ? "text-teal" : "text-blue"
                }`}
              >
                <Icon />
              </span>
              <p className="text-[11px] font-medium tracking-[0.16em] text-blue uppercase">
                {phase.number}
              </p>
            </div>
            <h3 className="mt-2 text-[15px] font-semibold tracking-tight text-navy">
              {phase.name}
            </h3>
          </li>
        );
      })}
    </ol>
  );
}

function UnderstandIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="8" cy="8" r="1.4" fill="currentColor" />
    </svg>
  );
}

function DefineIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <path
        d="M8 2.5 13.5 8 8 13.5 2.5 8 8 2.5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShapeIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <rect x="3" y="8.5" width="10" height="3.2" rx="0.8" stroke="currentColor" strokeWidth="1.25" />
      <rect x="4.2" y="5.2" width="7.6" height="2.6" rx="0.7" stroke="currentColor" strokeWidth="1.25" />
      <rect x="5.4" y="2.4" width="5.2" height="2.2" rx="0.6" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

function SpecifyIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <rect x="2.75" y="2.75" width="4.2" height="4.2" rx="0.7" stroke="currentColor" strokeWidth="1.25" />
      <rect x="9.05" y="2.75" width="4.2" height="4.2" rx="0.7" stroke="currentColor" strokeWidth="1.25" />
      <rect x="2.75" y="9.05" width="4.2" height="4.2" rx="0.7" stroke="currentColor" strokeWidth="1.25" />
      <rect x="9.05" y="9.05" width="4.2" height="4.2" rx="0.7" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

function LearnIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <path
        d="M2.75 11.5 6.1 7.8l2.4 2.3 4.75-5.6"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.4 4.5h2.85V7.3"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
