import { ThemeButton } from ".";
import { UserCard } from "../../dashboard/features/user-card";

import { LogoCard } from "./logo-card";

type Props = {
  name: string;
  logo: string | null;
  projectId: string;
};

export const Navbar = (props: Props) => {
  return (
    <div className="flex items-center justify-between px-5 lg:px-10 border-b-[1.5px] border-slate-100 dark:border-neutral-800 py-2">
      <LogoCard {...props} />

      <div className="flex items-center space-x-5">
        <ThemeButton />
        <UserCard isScrollUp={true} />
      </div>
    </div>
  );
};
