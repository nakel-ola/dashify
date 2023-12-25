"use client";
import { ThemeButton } from "./theme-button";
import { UserCard } from "../../dashboard/features/user-card";
import { useProjectStore } from "../store/project-store";

import { LogoCard } from "./logo-card";

type Props = {
  // name: string;
  // logo: string | null;
  // projectId: string;
};

export const Navbar = (props: Props) => {
  const project = useProjectStore((store) => store.project!);
  return (
    <div className="flex items-center justify-between px-5 border-b-[1.5px] border-slate-100 dark:border-neutral-800 py-2">
      <LogoCard
        logo={project?.logo}
        name={project.name}
        projectId={project.projectId}
      />

      <div className="flex items-center space-x-5">
        <ThemeButton />
        <UserCard isScrollUp={true} />
      </div>
    </div>
  );
};
