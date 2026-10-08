import { LocaleLink } from "@/components/i18n/LocaleLink";
import { LanguageSwitch } from "@/components/i18n/LanguageSwitch";
import { Logo } from "@/components/brand/Logo";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { PrimaryNav } from "@/components/layout/PrimaryNav";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function Header() {
  const { ctas, navigation, ui } = await getDictionary();

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-white/90 backdrop-blur-md">
      <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-3.5">
        <LocaleLink
          href="/"
          aria-label="MVPCompanion"
          className="flex shrink-0 overflow-hidden rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
        >
          <Logo variant="compact" priority />
        </LocaleLink>

        <div className="hidden lg:block">
          <PrimaryNav
            variant="desktop"
            items={navigation}
            label={ui.chrome.primaryNav}
          />
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitch label={ui.chrome.language} />
          <Button href={ctas.primary.href}>{ctas.primary.label}</Button>
          <MobileMenu
            items={navigation}
            menuLabel={ui.chrome.menu}
            navLabel={ui.chrome.mobileNav}
            languageLabel={ui.chrome.language}
          />
        </div>
      </Container>
    </header>
  );
}
