"use client";

import { RippleCard } from "@/components/ripple-card";
import { useSidebarStore } from "../store/sidebar-store";
import { HambergerMenu } from "iconsax-react";
import Link from "next/link";
import Image from "next/image";
import { capitalizeFirstLetter } from "@/lib/capitalize-first-letter";

type Props = {
  name: string;
  logo: string | null;
  projectId: string;
  showMenuIcon?: boolean;
};

export const LogoCard = (props: Props) => {
  const { logo, name, projectId, showMenuIcon = true } = props;

  const { setIsOpen } = useSidebarStore();
  return (
    <div className="flex items-center gap-5">
      {showMenuIcon ? (
        <RippleCard
          onClick={() => setIsOpen(true)}
          className="w-[40px] h-[40px] text-black dark:text-white bg-slate-100/10 flex items-center justify-center transition-transform rounded-full lg:hidden"
        >
          <HambergerMenu className="text-project-text-color dark:text-project-text-color-dark" />
        </RippleCard>
      ) : null}

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
    </div>
  );
};
