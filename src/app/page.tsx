import Hero from "@/components/Hero";
import WhatIsVybe from "@/components/WhatIsVybe";
import WhyVybeExists from "@/components/WhyVybeExists";
import WhatYouCanBuild from "@/components/WhatYouCanBuild";
import WhyVybe from "@/components/WhyVybe";
import GenZSection from "@/components/GenZSection";
import VerbosityChart from "@/components/VerbosityChart";
import FeatureHighlight from "@/components/FeatureHighlight";
import Timeline from "@/components/Timeline";
import { VybeIdentity, TinyGameShowcase } from "@/components/Showcases";
import Terminal from "@/components/Terminal";
import Ecosystem, { Installation, Community, Footer } from "@/components/Sections";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <WhatIsVybe />
      <WhyVybeExists />
      <VybeIdentity />
      <WhatYouCanBuild />
      <WhyVybe />
      <VerbosityChart />
      <GenZSection />
      <FeatureHighlight />
      <Timeline />
      <TinyGameShowcase />
      <Terminal />
      <Ecosystem />
      <Installation />
      <Community />
      <Footer />
    </main>
  );
}
