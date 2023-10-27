import Image from "next/image";
import { Fragment } from "react";
import {
  CTASection,
  DatabaseSection,
  FaqSection,
  FeatureSection,
  Footer,
  HeroSection,
  Navbar,
  ProcessSection,
} from "./features";

export default function Home() {
  return (
    <Fragment>
      <Navbar />
      <HeroSection />
      <ProcessSection />
      <FeatureSection />
      <DatabaseSection />
      <FaqSection />

      <CTASection />

      <Footer />
    </Fragment>
  );
}
