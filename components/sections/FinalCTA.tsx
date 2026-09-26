import { finalCtaContent } from "@/content/homepage";
import { StartCallToAction } from "@/components/home/HomeStartActions";
import { Section } from "@/components/ui/Section";

export function FinalCTA() {
  return (
    <Section id="start" tone="navy" className="relative overflow-hidden">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(26,86,219,0.2),transparent_42%),radial-gradient(ellipse_at_bottom_right,rgba(18,138,115,0.12),transparent_36%)]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-blue via-blue to-teal"
      />
      <div className="relative max-w-3xl">
        <StartCallToAction
          variant="final"
          inverted
          defaultHeadline={finalCtaContent.headline}
          defaultSupporting={finalCtaContent.supporting}
          defaultPrimaryLabel={finalCtaContent.primaryCta.label}
          defaultSecondaryLabel={finalCtaContent.secondaryCta.label}
          defaultSecondaryHref={finalCtaContent.secondaryCta.href}
        />
      </div>
    </Section>
  );
}
