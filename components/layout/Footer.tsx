import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { publicContactEmail } from "@/content/legal";
import { footerContent } from "@/content/homepage";
import { legalNavigation, navigation, site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-navy text-white">
      <Container className="flex flex-col gap-10 py-14 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md">
          <span className="inline-flex rounded-md bg-white px-2.5 py-1.5">
            <Logo />
          </span>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            {site.positioning}
          </p>
        </div>

        <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
          <nav aria-label="Footer">
            <ul className="space-y-2 text-sm text-white/75">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Legal">
            <ul className="space-y-2 text-sm text-white/75">
              {legalNavigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-3 text-sm text-white/55">
            <p>
              <a
                href={`mailto:${publicContactEmail}`}
                className="text-white/75 transition-colors hover:text-white"
              >
                {publicContactEmail}
              </a>
            </p>
            <p>{footerContent.ecosystem.join(" · ")}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
