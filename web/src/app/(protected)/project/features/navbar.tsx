import { capitalizeFirstLetter } from "@/lib/capitalize-first-letter";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ThemeButton } from ".";
import { UserCard } from "../../dashboard/features/user-card";

type Props = {
  name: string;
  logo: string | null;
  projectId: string;
};

export const Navbar = async (props: Props) => {
  const { logo, name, projectId } = props;

  return (
    <div className="flex items-center justify-between px-5 lg:px-10 border-b-[1.5px] border-slate-100 dark:border-neutral-800 py-2">
      <Link
        href={`/project/${projectId}/overview`}
        className="flex items-center cursor-pointer"
      >
        {logo ? (
          <Image
            src={logo}
            width={32}
            height={32}
            alt="Dashify logo"
            className="h-8 w-auto"
          />
        ) : null}

        <p className="text-xl ml-2 font-black text-black dark:text-white">
          {capitalizeFirstLetter(name)}
        </p>
      </Link>

      <div className="flex items-center space-x-5">
        <ThemeButton />
        <UserCard isScrollUp={true} />
      </div>
    </div>
  );
};