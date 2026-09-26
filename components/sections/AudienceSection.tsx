import { audienceContent } from "@/content/homepage";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function AudienceSection() {
  return (
    <Section id="audience">
      <SectionHeading
        eyebrow={audienceContent.eyebrow}
        title={audienceContent.headline}
        description={audienceContent.introduction}
      />
      <ol className="mt-10 grid border-t border-border sm:grid-cols-2 sm:gap-x-12">
        {audienceContent.groups.map((group, index) => (
          <li
            key={group.name}
            className="border-b border-border py-6"
          >
            <p className="text-[11px] font-medium tracking-[0.16em] text-blue uppercase">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-3 text-xl font-semibold tracking-tight text-navy">
              {group.name}
            </h3>
            <p className="mt-3 max-w-md text-base leading-relaxed text-muted">
              {group.description}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
