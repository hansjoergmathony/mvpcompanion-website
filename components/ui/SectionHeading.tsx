type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  inverted?: boolean;
  className?: string;
  descriptionClassName?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  inverted = false,
  className,
  descriptionClassName,
}: SectionHeadingProps) {
  return (
    <div className={`max-w-3xl ${className ?? ""}`}>
      {eyebrow ? (
        <p
          className={`mb-4 text-xs font-medium uppercase tracking-[0.2em] ${
            inverted ? "text-white/55" : "text-blue"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`text-3xl leading-[1.15] font-semibold tracking-tight text-balance md:text-4xl ${
          inverted ? "text-white" : "text-navy"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-5 max-w-2xl text-lg leading-relaxed ${
            inverted ? "text-white/70" : "text-muted"
          } ${descriptionClassName ?? ""}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
