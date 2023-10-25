/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import useNextTheme from "@/hooks/useNextTheme";
import useWindowPosition from "@/hooks/useWindowPosition";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
import MenuCard from "./MenuCard";

interface HeaderProps {
  scrollY?: number[];
}

export const Header = (props: HeaderProps) => {
  const { scrollY = [100, 400, 700, 3080, 3660] } = props;
  const router = useRouter();
  const { status } = useSession();
  const { theme, setTheme } = useNextTheme();

  const scroll = useWindowPosition();

  const [isOpen, setIsOpen] = useState(false);

  const isDarkMode = theme === "dark";

  return (
    <Fragment>
      <div
        className={cn(
          "px-5 lg:px-10 py-4 flex items-center justify-between bg-transparent transition-all duration-300  sticky top-0 z-50 page-max-width",
          scroll.y > scrollY[0] ? "backdrop-blur-[12px]" : ""
        )}
      >
        <Link
          href="/"
          onClick={() => setTheme(isDarkMode ? "light" : "dark")}
          className="flex items-center cursor-pointer"
        >
          <img className="h-8 w-auto" src="/logo.png" alt="Dashify" />
          <p
            className={cn(
              "text-xl ml-2 font-medium dark:text-white",
              scroll.y > scrollY[1]
                ? "text-black lg:text-white"
                : "text-white lg:text-black",
              scroll.y > scrollY[2] ? "lg:text-black" : "lg:text-white",
              scroll.y > scrollY[3] ? "lg:text-white" : "",
              scroll.y > scrollY[4] ? "text-white" : ""
            )}
          >
            Dashify
          </p>
        </Link>

        <div className="hidden lg:flex items-center space-x-1">
          {navigation.map(({ href, name }, index) => (
            <Link key={index} href={href}>
              <Button
                variant="ghost"
                className={cn(
                  "dark:hover:bg-slate-100/10 dark:text-white text-sm shadow-none font-medium hover:scale-100 active:scale-100",
                  scroll.y > scrollY[1]
                    ? "text-black hover:bg-slate-100"
                    : "text-white ",
                  scroll.y > scrollY[3]
                    ? "text-white lg:text-white hover:bg-slate-100/10"
                    : ""
                )}
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
            className={cn(
              "font-normal w-[45px] dark:text-white dark:hover:bg-slate-100/10 dark flex lg:hidden transition-transform",
              scroll.y > scrollY[1]
                ? "hover:bg-slate-100 text-black"
                : "hover:bg-slate-100/10 text-white",
              scroll.y > scrollY[4] ? "text-white hover:bg-slate-100/10" : ""
            )}
            onClick={() => setIsOpen(true)}
          >
            <Menu size={25} className="shrink-0" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && <MenuCard onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </Fragment>
  );
};

export const navigation = [
  {
    href: "/about-us",
    name: "About Us",
  },
  {
    href: "/docs",
    name: "Docs",
  },
  {
    href: "/faq",
    name: "FAQ",
  },
];
