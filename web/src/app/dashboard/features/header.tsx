import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { nextAuthOptions } from "@/lib/auth/next-auth-options";
import { cn } from "@/lib/utils";
import { ArrowDown2 } from "iconsax-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ThemeButton } from "./theme-button";

type Props = {};
export const Header = async (props: Props) => {
  const session = await getServerSession(nextAuthOptions);

  return (
    <div
      className="bg-black sticky top-0 z-50"
      style={{
        backgroundSize: "75px 75px",
        backgroundImage:
          "linear-gradient(to right, #262626 1px, transparent 1px), linear-gradient(to bottom, #262626 1px, transparent 1px)",
      }}
    >
      <div
        className={cn(
          "px-5 lg:px-10 py-4 flex items-center justify-between bg-transparent transition-all duration-300  page-max-width"
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
          <ThemeButton />
          <div className="flex items-center space-x-2 cursor-pointer">
            <Avatar className="h-[30px] w-[30px]">
              <AvatarImage src="/profile-pic.png" />
            </Avatar>

            <p className="text-lg font-medium text-white hidden lg:flex">
              {session?.user.firstName}
            </p>

            <ArrowDown2 className="text-white " />
          </div>
        </div>
      </div>
    </div>
  );
};
