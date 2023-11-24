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

      <div className="px-5 grid grid-cols-10 h-[calc(100vh-57.4px)]">
        <div className="col-span-2 border-r-[1.5px] border-slate-100 dark:border-neutral-800"></div>
        <div className="col-span-8"></div>
      </div>
    </div>
  );
}
