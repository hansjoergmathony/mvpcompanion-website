import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function WebsiteAppSection() {
  const { appEntry, websiteAppContent } = await getDictionary();
  return (
    <Section id="website-vs-app" tone="default">
      <SectionHeading
        eyebrow={websiteAppContent.eyebrow}
        title={websiteAppContent.headline}
        description={websiteAppContent.introduction}
      />
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted">
        {websiteAppContent.bridge}
      </p>
      <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-navy">
        {websiteAppContent.distinctionNote}
      </p>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {websiteAppContent.columns.map((column) => (
          <article
            key={column.id}
            className="rounded-2xl border border-border bg-ice px-6 py-8 md:px-8"
          >
            <p className="text-xs font-medium tracking-[0.18em] text-blue uppercase">
              {column.label}
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-navy">
              {column.title}
            </h3>
            <ul className="mt-6 space-y-3">
              {column.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-base leading-relaxed text-muted"
                >
                  <span
                    aria-hidden="true"
                    className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                      column.id === "app" ? "bg-teal" : "bg-blue"
                    }`}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <p className="mt-10 max-w-3xl text-base leading-relaxed text-muted">
        {websiteAppContent.entryPathsNote}
      </p>

      {appEntry.href ? (
        <div className="mt-8">
          <Button href={appEntry.href}>{appEntry.directStartLabel}</Button>
        </div>
      ) : (
        <p className="mt-8 text-sm text-muted">
          {appEntry.unavailableDirectLabel}
        </p>
      )}
    </Section>
  );
}
