import { processPhases } from "@/content/process";

const phaseIcons = [
  UnderstandIcon,
  DefineIcon,
  ShapeIcon,
  SpecifyIcon,
  LearnIcon,
] as const;

export function HeroProgression() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[0_16px_40px_-28px_rgba(11,31,58,0.22)] sm:p-5">
      <ol
        aria-label="Five phases of the MVPCompanion process"
        className="relative"
      >
        <span
          aria-hidden="true"
          className="absolute top-5 bottom-5 left-[19px] w-px bg-linear-to-b from-blue via-blue to-teal"
        />
        {processPhases.map((phase, index) => {
          const Icon = phaseIcons[index];
          const isLast = index === processPhases.length - 1;

          return (
            <li
              key={phase.id}
              className="hero-journey-step relative grid grid-cols-[40px_minmax(0,1fr)] items-start gap-3 pb-3 last:pb-0"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <span
                className={`relative z-10 mt-0.5 flex h-10 w-10 items-center justify-center rounded-full border bg-card ${
                  isLast
                    ? "border-teal/40 text-teal"
                    : "border-blue/25 text-blue"
                }`}
              >
                <Icon />
              </span>
              <article className="min-w-0 rounded-xl border border-border/80 bg-ice/70 px-3.5 py-2.5">
                <p className="text-[11px] font-medium tracking-[0.16em] text-blue uppercase">
                  {phase.number}
                </p>
                <h3 className="mt-0.5 text-[15px] font-semibold tracking-tight text-navy">
                  {phase.name}
                </h3>
              </article>
            </li>
          );
        })}
      </ol>
    </div>
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
