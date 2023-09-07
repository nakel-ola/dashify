import { TitleAndMetaTags } from "@/components/TitleAndMetaTags";
import { Header } from "@/features/home";
import React, { Fragment } from "react";

export default function Docs() {
  return (
    <Fragment>
      <TitleAndMetaTags title="Docs | Dashify" />

      <Header />
    </Fragment>
  );
}
