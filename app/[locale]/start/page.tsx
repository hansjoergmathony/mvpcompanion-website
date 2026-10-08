import type { Metadata } from "next";
import { StartExperience } from "@/components/start/StartExperience";
import { Container } from "@/components/ui/Container";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { getDictionary, getLocale } from "@/lib/i18n/get-dictionary";
import { localeAlternates } from "@/lib/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { startContent, ui } = await getDictionary();

  return {
    title: { absolute: ui.startMetaTitle },
    description: startContent.supporting,
    alternates: localeAlternates("/start", locale),
  };
}

export default async function StartPage() {
  const locale = await getLocale();
  const copy = await getDictionary();

  return (
    <main id="content">
      <div className="border-b border-border bg-card py-5">
        <Container>
          <LocaleLink
            href="/"
            className="text-sm tracking-wide text-muted transition-colors hover:text-navy"
          >
            ← {copy.startContent.backToHome}
          </LocaleLink>
        </Container>
      </div>
      <div className="py-16 md:py-24">
        <Container>
          <StartExperience copy={copy} locale={locale} />
        </Container>
      </div>
    </main>
  );
}
