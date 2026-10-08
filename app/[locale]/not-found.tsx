import { LocaleLink } from "@/components/i18n/LocaleLink";
import { Section } from "@/components/ui/Section";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function NotFound() {
  const { ui } = await getDictionary();

  return (
    <main id="content">
      <Section tone="ice">
        <div className="max-w-xl">
          <p className="text-xs font-medium tracking-[0.2em] text-blue uppercase">
            {ui.notFound.eyebrow}
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-navy md:text-4xl">
            {ui.notFound.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{ui.notFound.body}</p>
          <p className="mt-8">
            <LocaleLink
              href="/"
              className="text-sm font-medium text-blue underline-offset-2 hover:underline"
            >
              {ui.notFound.back}
            </LocaleLink>
          </p>
        </div>
      </Section>
    </main>
  );
}
