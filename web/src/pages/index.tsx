import { TitleAndMetaTags } from "@/components/TitleAndMetaTags";
import {
  CTASection,
  DatabaseSection,
  FaqSection,
  FeatureSection,
  Footer,
  Header,
  Hero,
  ProcessCard,
} from "@/features/home";
import { Fragment } from "react";

export default function Home() {
  return (
    <Fragment>
      <TitleAndMetaTags title="Dashify" />

      <Header />

      <Hero />

      <ProcessCard />

      <FeatureSection />

      <DatabaseSection />

      <FaqSection />

      <CTASection />

      <Footer />
    </Fragment>
  );
}
