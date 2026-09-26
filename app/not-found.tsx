import Link from "next/link";
import { Section } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <main id="content">
      <Section tone="ice">
        <div className="max-w-xl">
          <p className="text-xs font-medium tracking-[0.2em] text-blue uppercase">
            404
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-navy md:text-4xl">
            Page not found.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Looks like this path doesn&apos;t exist.
          </p>
          <p className="mt-8">
            <Link
              href="/"
              className="text-sm font-medium text-blue underline-offset-2 hover:underline"
            >
              Back to MVPCompanion →
            </Link>
          </p>
        </div>
      </Section>
    </main>
  );
}
