import React, { PropsWithChildren } from "react";
import { fetchProject } from "../services/fetch-project";
import { Navbar, Sidebar } from "../features";
import { DataWrapper } from "../features/data-wrapper";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

type Props = {
  params: { projectId: string };
};

export default async function ProjectLayout(props: PropsWithChildren<Props>) {
  const {
    params: { projectId },
    children,
  } = props;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId),
    
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DataWrapper projectId={projectId}>
        <div className="page-max-width h-screen overflow-hidden">
          <Navbar />

          <div className="grid grid-cols-10 h-[calc(100vh-57.4px)]">
            <Sidebar />
            <div className="col-span-10 lg:col-span-8 h-full overflow-y-scroll">
              {children}
            </div>
          </div>
        </div>
      </DataWrapper>
    </HydrationBoundary>
  );
}
