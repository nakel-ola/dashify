/* eslint-disable @next/next/no-img-element */
import { Icons } from "@/components/Icons";
import { useQueries } from "@/hooks/useQueries";
import { capitalizeFirstLetter } from "@/lib/capitalizeFirstLetter";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useRef } from "react";
import { useOnClickOutside, useWindowSize } from "usehooks-ts";

type Props = {
  name: string;
  logo: string | null;
  items: { name: string; icon: string | null }[];
  isOpen: boolean;
  setIsOpen(value: boolean): void;
};

export const Sidebar = (props: Props) => {
  const { isOpen } = props;

  return (
    <Fragment>
      <AnimatePresence>
        {isOpen ? <MobileCard {...props} /> : null}
      </AnimatePresence>

      <div className="col-span-2  hidden lg:block">
        <SidebarContent {...props} />
      </div>
    </Fragment>
  );
};

const MobileCard = (props: Props) => {
  const { setIsOpen } = props;
  const ref = useRef<HTMLDivElement>(null);

  const screen = useWindowSize();

  useOnClickOutside(ref, () => {
    if (screen && screen?.width < 1024) {
      // setIsLocked(false);
      setIsOpen(false);
    }
  });

  useEffect(() => {
    if (screen && screen?.width > 1024) {
      // setIsLocked(false);
      setIsOpen(false);
    }
  }, [screen, setIsOpen]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="lg:hidden fixed top-0 left-0 z-50 w-full h-full bg-black/40 "
    >
      <motion.div
        ref={ref}
        className="w-[70%] h-full"
        initial={{ marginLeft: "-70%" }}
        animate={{ marginLeft: "0%" }}
        exit={{ marginLeft: "-70%" }}
      >
        <SidebarContent {...props} />
      </motion.div>
    </motion.div>
  );
};

type SidebarContentProps = Omit<Props, "isOpen" | "setIsOpen"> & {
  className?: string;
};

export const SidebarContent = (props: SidebarContentProps) => {
  const { items = [], logo, name, className } = props;

  const router = useRouter();

  const [{ pageName, projectId }] = useQueries();

  return (
    <div
      className={cn(
        "h-full bg-project-sidebar-bg dark:bg-project-sidebar-bg-dark border-r border-project-divide dark:border-project-divide-dark flex flex-col",
        className
      )}
    >
      <div className="flex items-center gap-2 p-1.5 mb-5">
        <div className="h-10 w-10">
          {logo ? (
            <img
              src={logo}
              alt={name}
              className="h-full w-full object-contain"
            />
          ) : null}
        </div>

        <p className="text-project-sidebar-text dark:text-project-sidebar-text-dark text-2xl">
          {capitalizeFirstLetter(name)}
        </p>
      </div>

      <div className="">
        {items.map(({ icon, name }, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center m-2 p-2 hover:bg-project-sidebar-hover hover:dark:bg-project-sidebar-hover-dark rounded-lg cursor-pointer",
              pageName === name
                ? "bg-project-sidebar-hover dark:bg-project-sidebar-hover"
                : ""
            )}
            onClick={() => router.push(`/project/${projectId}/${name}`)}
          >
            <div className="">
              <Icons
                iconName={icon! as any}
                variant={pageName === name ? "Bold" : "Outline"}
                className="text-project-sidebar-text dark:text-project-sidebar-text-dark"
              />
            </div>

            <p className="text-project-sidebar-text dark:text-project-sidebar-text-dark pl-2">
              {capitalizeFirstLetter(name)}
            </p>
          </div>
        ))}
      </div>

      <div
        className={cn(
          "flex items-center m-2 mb-3 p-2 hover:bg-project-sidebar-hover hover:dark:bg-project-sidebar-hover-dark rounded-lg cursor-pointer mt-auto",
          pageName === "settings"
            ? "bg-project-sidebar-hover dark:bg-project-sidebar-hover"
            : ""
        )}
        onClick={() => router.push(`/project/${projectId}/settings`)}
      >
        <div className="">
          <Icons
            iconName="Setting"
            variant={pageName === "settings" ? "Bold" : "Outline"}
            className="text-project-sidebar-text dark:text-project-sidebar-text-dark"
          />
        </div>

        <p className="text-project-sidebar-text dark:text-project-sidebar-text-dark pl-2">
          Settings
        </p>
      </div>
    </div>
  );
};
