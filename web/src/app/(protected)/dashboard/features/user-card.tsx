"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Menu, Transition } from "@headlessui/react";
import { Add, ArrowDown2, Logout, User, Grid2 } from "iconsax-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Fragment } from "react";
import { useModelStore } from "../../store/ModelStore";
import { cn } from "@/lib/utils";

type Props = {
  isScrollUp: boolean;
};
export const UserCard = (props: Props) => {
  const { isScrollUp } = props;
  const { data } = useSession();

  const { setIsOpen } = useModelStore();

  const user = data?.user;

  return (
    <Menu>
      {({ close }) => (
        <Fragment>
          <Menu.Button>
            <div className="flex items-center space-x-2 cursor-pointer">
              <Avatar
                fallback={
                  `${user?.lastName.charAt(0)}` + user?.firstName.charAt(0)
                }
                className="h-[40px] w-[40px]"
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
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-2 top-14 mt-2 p-2 min-w-[244px] h-fit origin-top-right bg-white dark:bg-dark shadow-lg border-[1.5px] border-slate-200 dark:border-neutral-800 rounded-lg focus:outline-none space-y-1">
              <Menu.Item
                as={Link}
                href="/dashboard"
                className="flex items-center gap-2 p-3 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-lg cursor-pointer w-full"
              >
                <Grid2 />
                <p>Dashboard</p>
              </Menu.Item>


              <Menu.Item
                as={Link}
                href="/account"
                className="flex items-center gap-2 p-3 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-lg cursor-pointer w-full"
              >
                <User />
                <p>Account</p>
              </Menu.Item>

              <Menu.Item
                as="div"
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 p-3 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-lg cursor-pointer w-full"
              >
                <Add />
                <p>New Project</p>
              </Menu.Item>

              <Menu.Item
                as="div"
                onClick={() => {
                  signOut({ redirect: true, callbackUrl: "/" });
                }}
                className="flex items-center gap-2 p-3 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-lg cursor-pointer"
              >
                <Logout />
                <p>Sign out</p>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Fragment>
      )}
    </Menu>
  );
};
