import React from "react";
import { DeleteProjectSection, InfoSection } from "./features";

export default function Settings() {
  return (
    <div className="px-5 lg:px-10 py-10">
      <InfoSection />
      <DeleteProjectSection />
    </div>
  );
}
