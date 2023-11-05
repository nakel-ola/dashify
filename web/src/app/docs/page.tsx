import { Metadata } from "next";
import React, { Fragment } from "react";
import { Navbar } from "../features";

export const metadata: Metadata = {
  title: "Docs | Dashify",
};

export default function Docs() {
  return (
    <Fragment>
      <Navbar />
    </Fragment>
  );
}
