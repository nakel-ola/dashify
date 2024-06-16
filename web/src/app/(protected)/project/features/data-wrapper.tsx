'use client';

import { Fragment, PropsWithChildren, memo, useCallback, useEffect } from 'react';
import { useProjectStore } from '../store/project-store';
import { useQuery } from '@tanstack/react-query';
import { fetchProject } from '../services/fetch-project';
import { PageLoader } from './page-loader';
import { connectToDB } from '../services/connect-to-db';
import { redirect, usePathname, useRouter } from 'next/navigation';

type Props = {
  projectId: string;
};
export const DataWrapper = memo((props: PropsWithChildren<Props>) => {
  const { projectId, children } = props;
  const { setProject, project } = useProjectStore();
  const router = useRouter();
  const pathname = usePathname();

  const { data, isPending } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const data = await fetchProject(projectId);
      return data;
    },
  });

  const getConnect = useCallback(async () => {
    const connect = await connectToDB(projectId);
    if (!connect.ok && pathname !== `/project/${projectId}/settings`) router.push(`/project/${projectId}/settings`);
  }, [pathname, projectId, router]);

  useEffect(() => {
    // getConnect();
    if (data) setProject(data!);
  }, [data, setProject, getConnect]);

  if (isPending) return <PageLoader />;

  if (data && project) return children;

  return <Fragment />;
});

DataWrapper.displayName = 'DataWrapper';
