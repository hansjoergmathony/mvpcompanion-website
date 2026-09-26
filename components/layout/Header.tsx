import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { PrimaryNav } from "@/components/layout/PrimaryNav";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ctas } from "@/content/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-white/90 backdrop-blur-md">
      <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-3.5">
        <Link
          href="/"
          aria-label="MVPCompanion"
          className="flex shrink-0 overflow-hidden rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
        >
          <Logo variant="compact" priority />
        </Link>

        <div className="hidden lg:block">
          <PrimaryNav variant="desktop" />
        </div>

        <div className="flex items-center gap-3">
          <Button href={ctas.primary.href}>{ctas.primary.label}</Button>
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
