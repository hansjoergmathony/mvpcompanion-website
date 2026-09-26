import { ApproachSection } from "@/components/sections/ApproachSection";
import { AudienceSection } from "@/components/sections/AudienceSection";
import { EcosystemSection } from "@/components/sections/EcosystemSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { FrameworkSection } from "@/components/sections/FrameworkSection";
import { Hero } from "@/components/sections/Hero";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ResultSection } from "@/components/sections/ResultSection";

export default function Home() {
  return (
    <main id="content">
      <Hero />
      <ProblemSection />
      <ApproachSection />
      <FrameworkSection />
      <ProcessSection />
      <ResultSection />
      <EcosystemSection />
      <AudienceSection />
      <FinalCTA />
    </main>
  );
}
