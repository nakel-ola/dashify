"use client";

import { Fragment, PropsWithChildren, useEffect } from "react";
import { useProjectStore } from "../store/project-store";
import { useQuery } from "@tanstack/react-query";
import { fetchProject } from "../services/fetch-project";
import { PageLoader } from "./page-loader";

type Props = {
  projectId: string;
};
export const DataWrapper = (props: PropsWithChildren<Props>) => {
  const { projectId, children } = props;
  const { setProject, project } = useProjectStore();

  const { data, isPending } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const data = await fetchProject(projectId);
      return data;
    },
  });

  useEffect(() => {
    if (data) setProject(data!);
  }, [data, setProject]);

  if (isPending) return <PageLoader />;

  if (data && project) return children;

  return <Fragment />;
};
