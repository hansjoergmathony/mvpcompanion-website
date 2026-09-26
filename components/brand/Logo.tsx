import Image from "next/image";

type LogoProps = {
  className?: string;
  priority?: boolean;
  variant?: "full" | "compact";
};

export function Logo({
  className,
  priority = false,
  variant = "full",
}: LogoProps) {
  if (variant === "compact") {
    return (
      <span className="relative block h-8 w-[12.75rem] overflow-hidden md:h-9 md:w-[14.25rem]">
        <Image
          src="/brand/mvpcompanion-logo-compact.png"
          alt="MVPCompanion"
          width={2119}
          height={430}
          priority={priority}
          unoptimized
          className="block h-[128%] w-auto max-w-none object-left object-top"
        />
      </span>
    );
  }

  return (
    <Image
      src="/brand/mvpcompanion-logo-compact.png"
      alt="MVPCompanion"
      width={2119}
      height={430}
      priority={priority}
      unoptimized
      className={
        className ??
        "block h-8 w-auto max-w-none shrink-0 object-contain object-left md:h-9"
      }
    />
  );
}
