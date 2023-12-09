"use client";

import { PropsWithChildren } from "react";
import { useEffectOnce } from "usehooks-ts";
import { useProjectStore } from "../store/project-store";

type Props = {
  project: Projects;
};
export const DataWrapper = (props: PropsWithChildren<Props>) => {
  const { project, children } = props;
  const { setProject } = useProjectStore();
  useEffectOnce(() => {
    setProject(project);
  });
  return <div className="col-span-10 lg:col-span-8 h-full overflow-y-scroll">{children}</div>;
};
