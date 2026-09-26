import type { Metadata } from "next";
import Link from "next/link";
import { StartExperience } from "@/components/start/StartExperience";
import { Container } from "@/components/ui/Container";
import { startContent } from "@/content/start";

export const metadata: Metadata = {
  title: "Start with your idea — MVPCompanion",
  description: startContent.supporting,
};

export default function StartPage() {
  return (
    <main id="content">
      <div className="border-b border-border bg-card py-5">
        <Container>
          <Link
            href="/"
            className="text-sm tracking-wide text-muted transition-colors hover:text-navy"
          >
            ← {startContent.backToHome}
          </Link>
        </Container>
      </div>
      <div className="py-16 md:py-24">
        <Container>
          <StartExperience />
        </Container>
      </div>
    </main>
  );
}
