import React from "react";
import { CorsOriginsSection, TokensSection } from "./features";

export default function API() {
  return (
    <div className="px-5 lg:px-10 py-10 space-y-16">
      <CorsOriginsSection />
      <TokensSection />
    </div>
  );
}
