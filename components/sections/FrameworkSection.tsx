import { frameworkContent } from "@/content/homepage";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FrameworkDiagram } from "@/components/FrameworkDiagram";
import { TraceabilityDiagram } from "@/components/TraceabilityDiagram";

export function FrameworkSection() {
  return (
    <Section id="framework">
      <SectionHeading
        eyebrow={frameworkContent.eyebrow}
        title={frameworkContent.headline}
        description={frameworkContent.introduction}
      />
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
        {frameworkContent.explanation}
      </p>

      <FrameworkDiagram />

      <p className="mt-2 text-center text-sm leading-relaxed text-muted">
        {frameworkContent.structure}
      </p>
      <p className="mt-6 text-center text-sm">
        <a
          href={frameworkContent.processLink.href}
          className="font-medium text-blue tracking-wide underline-offset-4 hover:underline"
        >
          {frameworkContent.processLink.label}
        </a>
      </p>

      <div className="mt-12 border-t border-border pt-8">
        <p className="text-xs font-medium tracking-[0.2em] text-blue uppercase">
          {frameworkContent.qualityPrinciple.label}
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          {frameworkContent.qualityPrinciple.description}
        </p>
        <div className="mt-8">
          <TraceabilityDiagram />
        </div>
      </div>
    </Section>
  );
}
