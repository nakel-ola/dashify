import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDown2 } from "iconsax-react";
import React, { Fragment } from "react";

type Props = {
  firstName: string;
};
export const ProfileCard = (props: Props) => {
  const { firstName } = props;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center space-x-2 cursor-pointer py-2">
          <Avatar className="h-[35px] w-[35px]">
            <AvatarImage src="/profile-pic.png" />
          </Avatar>

          <div className="hidden lg:flex flex-col mr-3">
            <p className="text-base font-medium text-black dark:text-white  ">
              {firstName}
            </p>
            <p className="text-gray-dark dark:text-gray-light text-sm -mt-1">
              Personal Projects
            </p>
          </div>

          <ArrowDown2 size={20} className="text-black dark:text-white " />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 h-80"></DropdownMenuContent>
    </DropdownMenu>
  );
};
