"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ThemeButton } from "./theme-button";
import { UserCard } from "./user-card";
import { useWindowPosition } from "@/hooks/use-window-position";

// bg-black sticky top-0 z-50 bg-[size:_75px_75px] bg-[image:_linear-gradient(to_right,_#262626_1px,_transparent_1px),_linear-gradient(to_bottom,_#262626_1px,_transparent_1px)]

interface Props {
  scrollY: number;
}

export const Header = (props: Props) => {
  const { scrollY } = props;

  const scroll = useWindowPosition();

  const isScrollUp = scroll.y > scrollY;

  return (
    <div className={cn("sticky top-0 z-50")}>
      <div
        className={cn(
          "px-5 lg:px-10 py-4 flex items-center justify-between bg-transparent transition-all duration-300  page-max-width",
          isScrollUp ? "backdrop-blur-[12px]" : ""
        )}
      >
        <Link href="/">
          <div className="flex items-center cursor-pointer ">
            <Image
              src="/logo.png"
              width={32}
              height={32}
              alt="Dashify logo"
              className="h-8 w-auto"
            />
            <p className="text-indigo-600 text-xl ml-2 font-bold">Dashify</p>
          </div>
        </Link>

        <div className="flex items-center space-x-2 md:space-x-5">
          <ThemeButton isScrollUp={isScrollUp} />
          <UserCard isScrollUp={isScrollUp} />
        </div>
      </div>
    </div>
  );
};
