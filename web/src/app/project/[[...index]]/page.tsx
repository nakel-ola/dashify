import { formatQueries } from "@/lib/format-queries";
import React, { Fragment } from "react";
import { Navbar } from "../features";
import { fetchProject } from "../services/fetch-project";

type Props = {
  params: {
    index: [];
  };
};

export default async function Project(props: Props) {
  const { params } = props;
  const [{ pageName, projectId }] = formatQueries(params.index);

  const project = await fetchProject(projectId);

  return (
    <div className="page-max-width">
      <Navbar logo={project.logo} name={project.name} projectId={projectId} />
    </div>
  );
}
