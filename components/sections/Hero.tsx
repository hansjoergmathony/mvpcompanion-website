import { StartCallToAction } from "@/components/home/HomeStartActions";
import { Container } from "@/components/ui/Container";
import { HeroProgression } from "@/components/visuals/HeroProgression";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function Hero() {
  const { appEntry, heroContent, startContent } = await getDictionary();
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f3f7fc_0%,#f7f9fc_56%,#ffffff_100%)] py-16 md:py-20 lg:py-24">
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(17rem,0.7fr)] lg:gap-16 xl:gap-20">
          <div className="max-w-2xl pt-1 lg:pt-6">
            <p className="text-xs font-medium tracking-[0.22em] text-blue uppercase">
              {heroContent.kicker}
            </p>
            <h1 className="mt-5 text-4xl leading-[1.05] font-semibold tracking-tight text-balance text-navy md:text-6xl">
              {heroContent.headlineLines[0]}{" "}
              <br />
              {heroContent.headlineLines[1]}
            </h1>
            <div className="mt-7">
              <StartCallToAction
                variant="hero"
                defaultSupporting={heroContent.supporting}
                defaultPrimaryLabel={heroContent.primaryCta.label}
                defaultSecondaryLabel={heroContent.secondaryCta.label}
                defaultSecondaryHref={heroContent.secondaryCta.href}
                resume={startContent}
                appEntry={appEntry}
              />
            </div>
          </div>
          <HeroProgression />
        </div>

        <ul className="mt-10 grid gap-4 border-t border-border pt-7 sm:grid-cols-3">
          {heroContent.benefits.map((benefit) => (
            <li key={benefit} className="text-sm font-medium tracking-wide text-navy">
              {benefit}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
