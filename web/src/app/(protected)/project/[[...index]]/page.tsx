import { formatQueries } from "@/lib/format-queries";
import React, { Fragment } from "react";
import { Navbar, Sidebar } from "../features";
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

  const items = project.collections.map((co) => ({
    icon: co.icon,
    name: co.name,
  }));

  return (
    <div className="page-max-width">
      <Navbar logo={project.logo} name={project.name} projectId={projectId} />

      <div className="px-5 grid grid-cols-10 h-[calc(100vh-57.4px)]">
        <Sidebar items={items} logo={project.logo} name={project.name} />
        <div className="col-span-8"></div>
      </div>
    </div>
  );
}
