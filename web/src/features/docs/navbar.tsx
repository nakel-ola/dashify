/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import useNextTheme from "@/hooks/useNextTheme";
import { AnimatePresence } from "framer-motion";
import { HambergerMenu } from "iconsax-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
import { navigation } from "../home/Header";
import MenuCard from "../home/MenuCard";
type Props = {};
export const Navbar = (props: Props) => {
  const router = useRouter();
  const { status } = useSession();
  const { theme, setTheme } = useNextTheme();

  const [isOpen, setIsOpen] = useState(false);

  const isDarkMode = theme === "dark";

  return (
    <Fragment>
      <div className="px-5 lg:px-10 py-4 flex items-center justify-between bg-transparent transition-all duration-300  sticky top-0 z-50 page-max-width">
        <Link
          href="/"
          onClick={() => setTheme(isDarkMode ? "light" : "dark")}
          className="flex items-center cursor-pointer"
        >
          <img className="h-8 w-auto" src="/logo.png" alt="Dashify" />
          <p className="text-xl ml-2 font-medium text-black dark:text-white">
            Dashify
          </p>
        </Link>

        <div className="hidden lg:flex items-center space-x-1">
          {navigation.map(({ href, name }, index) => (
            <Link key={index} href={href}>
              <Button
                variant="ghost"
                className="hover:bg-slate-100 dark:hover:bg-slate-100/10 text-black dark:text-white text-sm shadow-none font-medium hover:scale-100 active:scale-100"
              >
                {name}
              </Button>
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-5">
          {status !== "authenticated" ? (
            <Button
              onClick={() => router.push("/auth/login")}
              className=""
              variant="solid"
            >
              Login now
            </Button>
          ) : (
            <Button
              onClick={() => router.push("/dashboard")}
              className=""
              variant="solid"
            >
              Dashboard
            </Button>
          )}

          <Button
            variant="ghost"
            className="font-normal w-[45px] text-black dark:text-white hover:bg-slate-100 dark:hover:bg-slate-100/10 dark flex lg:hidden transition-transform"
            onClick={() => setIsOpen(true)}
          >
            <HambergerMenu size={25} className="shrink-0" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && <MenuCard onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </Fragment>
  );
};
