import React, { PropsWithChildren } from 'react';
import { fetchProject } from '../services/fetch-project';
import { Navbar, Sidebar, TitleCard } from '../features';
import { DataWrapper } from '../features/data-wrapper';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { connectToDB } from '../services/connect-to-db';
import { redirect } from 'next/navigation';
import { DatabaseSection, DeleteProjectSection } from './settings/features';

type Props = {
  params: { projectId: string };
};

export default async function ProjectLayout(props: PropsWithChildren<Props>) {
  const {
    params: { projectId },
    children,
  } = props;

  const connect = await connectToDB(projectId);

  // console.log(connect);

  // if (!connect.ok) redirect(`/project/${projectId}/settings`);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['project', projectId],
    queryFn: () => fetchProject(projectId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DataWrapper projectId={projectId}>
        {connect.ok ? (
          <div className='page-max-width h-screen overflow-hidden'>
            <Navbar />
            <div className='grid grid-cols-10 h-[calc(100vh-57.4px)] overflow-hidden'>
              <Sidebar />
              <div className='col-span-10 lg:col-span-8 h-full overflow-y-auto'>{children}</div>
            </div>
          </div>
        ) : (
          <div className='page-max-width px-10 pb-10'>
            <Navbar className='sticky top-0 bg-white dark:bg-dark z-10' showMenuIcon={false} />
            <TitleCard
              title="Can't connect to your database"
              subtitle='Update your database credential or delete project'
            />
            <div className='px-10 pt-10'>
              <DatabaseSection showHR={false} />
              <DeleteProjectSection />
            </div>
          </div>
        )}
      </DataWrapper>
    </HydrationBoundary>
  );
}
