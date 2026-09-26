import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

type SectionTone = "default" | "ice" | "navy";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: SectionTone;
};

const toneClassName: Record<SectionTone, string> = {
  default: "border-t border-border bg-card",
  ice: "border-t border-border bg-ice",
  navy: "border-t border-navy bg-navy text-white",
};

export function Section({
  id,
  children,
  className,
  tone = "default",
}: SectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 py-16 md:py-[5.5rem] ${toneClassName[tone]} ${className ?? ""}`}
    >
      <Container>{children}</Container>
    </section>
  );
}
