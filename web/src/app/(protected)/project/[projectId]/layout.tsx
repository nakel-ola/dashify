import { formatQueries } from "@/lib/format-queries";
import React, { PropsWithChildren } from "react";
import { fetchProject } from "../services/fetch-project";
import { Navbar, Sidebar } from "../features";
import { DataWrapper } from "../features/data-wrapper";

type Props = {
  params: {
    projectId: string;
  };
};
export default async function ProjectLayout(props: PropsWithChildren<Props>) {
  const {
    params: { projectId },
    children,
  } = props;

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
        <DataWrapper project={project}>{children}</DataWrapper>
      </div>
    </div>
  );
}
