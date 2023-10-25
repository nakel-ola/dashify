import { TitleAndMetaTags } from "@/components/TitleAndMetaTags";
import { Navbar } from "@/features/docs";
import React, { Fragment } from "react";

export default function Docs() {
  return (
    <Fragment>
      <TitleAndMetaTags title="Docs | Dashify" />

      <Navbar />
    </Fragment>
  );
}
