/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import useNextTheme from "@/hooks/useNextTheme";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { useLockedBody, useOnClickOutside, useWindowSize } from "usehooks-ts";
import { navigation } from "./Header";

type Props = {
  onClose(): void;
};

const MenuCard = (props: Props) => {
  const { onClose } = props;

  const ref = useRef<HTMLDivElement>(null);
  const [_, setIsLocked] = useLockedBody(true);

  const { theme } = useNextTheme();

  const screen = useWindowSize();

  useOnClickOutside(ref, () => {
    setIsLocked(false);
    onClose();
  });

  useEffect(() => {
    if (screen && screen?.width > 1024) {
      setIsLocked(false);
      onClose();
    }
  }, [onClose, screen, setIsLocked]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="z-50 lg:hidden fixed top-0 left-0 w-full h-screen bg-dark/60"
    >
      <motion.div
        initial={{ marginRight: "-80%" }}
        animate={{ marginRight: "0%" }}
        exit={{ marginRight: "-80%" }}
        ref={ref}
        className="w-[75%] bg-white dark:bg-dark h-screen float-right rounded-tl-lg rounded-bl-lg"
      >
        <div className="px-5 flex items-center justify-between pt-5">
          <Link href="" className="flex items-center cursor-pointer">
            <img className="h-8 w-auto" src="/logo.png" alt="Dashify" />
            <p className={cn("text-xl ml-2 font-medium text-black dark:text-white")}>
              Dashify
            </p>
          </Link>
          <Button
            variant="ghost"
            className="hover:bg-slate-100 dark:hover:bg-slate-100/10 text-black dark:text-white font-normal w-[45px] flex lg:hidden"
            onClick={() => onClose()}
          >
            <X size={25} className="shrink-0" />
          </Button>
        </div>
        <ul className="py-5 border-b border-slate-100 dark:border-neutral-800 px-5">
          {navigation.map((nav, index) => (
            <Link key={index} href={nav.href}>
              <li className="hover:bg-slate-100 dark:hover:bg-slate-100/10 text-black dark:text-white py-3 mb-2 rounded-md pl-3 font-medium">
                {nav.name}
              </li>
            </Link>
          ))}
        </ul>

        <div className="px-5 space-y-8 py-5">
          <Button
            variant="outline"
            className="flex items-center justify-center w-full"
          >
            Log in
          </Button>
          <Button className="flex items-center justify-center w-full">
            Sign up
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MenuCard;
