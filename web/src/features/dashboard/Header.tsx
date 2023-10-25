/* eslint-disable @next/next/no-img-element */
import { RippleCard } from "@/components/RippleCard";
import { Button } from "@/components/ui/button";
import useNextTheme from "@/hooks/useNextTheme";
import useWindowPosition from "@/hooks/useWindowPosition";
import { cx } from "class-variance-authority";
import { ArrowDown2, Moon, Notification, Sun1 } from "iconsax-react";
import { useSession } from "next-auth/react";
import React, { Fragment } from "react";
import { Avatar, AvatarImage } from "../../components/ui/avatar";

type Props = {};

export const Header = (props: Props) => {
  const { data } = useSession();
  const { theme, setTheme } = useNextTheme();

  const isDarkMode = theme === "dark";

  const scroll = useWindowPosition();

  return (
    <Fragment>
      <div
        className="bg-black sticky top-0 z-50"
        style={{
          backgroundSize: "75px 75px",
          backgroundImage:
            "linear-gradient(to right, #262626 1px, transparent 1px), linear-gradient(to bottom, #262626 1px, transparent 1px)",
        }}
      >
        <div
          className={cx(
            "px-5 lg:px-10 py-4 flex items-center justify-between bg-transparent transition-all duration-300  page-max-width"
          )}
        >
          <div
            onClick={() => setTheme(isDarkMode ? "light" : "dark")}
            className="flex items-center cursor-pointer"
          >
            <img className="h-8 w-auto" src="/logo.png" alt="Dashify" />
            <p className="text-xl ml-2 font-medium text-white">Dashify</p>
          </div>

          <div className="flex items-center space-x-2 md:space-x-5 lg:space-x-8">
            <RippleCard
              Component="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-[45px] text-white hover:bg-slate-100/10 flex items-center justify-center transition-transform py-1.5 rounded-full"
            >
              {theme === "dark" ? (
                <Sun1 className="text-white h-[25px] w-[25px]" />
              ) : (
                <Moon className="text-white h-[25px] w-[25px]" />
              )}
            </RippleCard>
            <div className="flex items-center space-x-2 cursor-pointer">
              <Avatar className="h-[30px] w-[30px]">
                <AvatarImage src="/profile-pic.png" />
              </Avatar>

              <p className="text-lg font-medium text-white hidden lg:flex">
                {data?.user.firstName}
              </p>

              <ArrowDown2 className="text-white " />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export const navigation = [
  {
    href: "/about-us",
    name: "About Us",
  },
  {
    href: "/pricing",
    name: "Pricing",
  },
  {
    href: "/faq",
    name: "FAQ",
  },
];
