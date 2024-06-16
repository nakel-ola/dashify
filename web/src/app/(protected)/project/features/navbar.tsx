'use client';
import { ThemeButton } from './theme-button';
import { UserCard } from '../../dashboard/features/user-card';
import { useProjectStore } from '../store/project-store';

import { LogoCard } from './logo-card';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  showMenuIcon?: boolean;
};

export const Navbar = (props: Props) => {
  const { className, showMenuIcon } = props;
  const project = useProjectStore((store) => store.project!);
  return (
    <div
      className={cn(
        'flex items-center justify-between px-5 border-b-[1.5px] border-slate-100 dark:border-neutral-800 py-2',
        className
      )}
    >
      <LogoCard logo={project?.logo} name={project.name} projectId={project.projectId} showMenuIcon={showMenuIcon} />

      <div className='flex items-center space-x-5'>
        <ThemeButton />
        <UserCard isScrollUp={true} />
      </div>
    </div>
  );
};
