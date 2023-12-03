import { formatQueries } from "@/lib/format-queries";
import React, { Fragment } from "react";
import { Navbar, Sidebar } from "../../features";
import { fetchProject } from "../../services/fetch-project";

type Props = {
  params: {
    index: [];
  };
};

export default async function Project(props: Props) {
  return <div className="col-span-8"></div>;
}
