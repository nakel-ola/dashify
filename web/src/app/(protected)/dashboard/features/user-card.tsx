"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Menu, Transition } from "@headlessui/react";
import { Add, ArrowDown2, Logout, User, Grid2 } from "iconsax-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Fragment } from "react";
import { useModelStore } from "../../store/ModelStore";
import { cn } from "@/lib/utils";
import { useSignOut } from "@/hooks/use-sign-out";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

type Props = {
  isScrollUp: boolean;
};
export const UserCard = (props: Props) => {
  const { isScrollUp } = props;
  const { data } = useSession();

  const { setIsOpen } = useModelStore();

  const signOut = useSignOut();

  const router = useRouter();

  const user = data?.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center space-x-2 cursor-pointer">
          <Avatar
            fallback={`${user?.lastName.charAt(0)}` + user?.firstName.charAt(0)}
            className="h-[35px] w-[35px]"
          >
            <AvatarImage src={user?.photoUrl} />
          </Avatar>

          <p
            className={cn(
              "text-lg font-medium text-white hidden lg:flex",
              isScrollUp ? "text-black dark:text-white" : ""
            )}
          >
            {user?.firstName}
          </p>

          <ArrowDown2
            className={cn(
              "text-white",
              isScrollUp ? "text-black dark:text-white" : ""
            )}
          />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60 h-fit space-y-2" align="end">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          <Grid2 size={25} className="mr-2" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push("/account")}
        >
          <User size={25} className="mr-2" />
          Account
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <Add size={25} className="mr-2" />
          New Project
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => signOut({ redirect: false })}
        >
          <Logout size={25} className="mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
