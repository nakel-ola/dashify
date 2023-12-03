"use client";

import { useQueries } from "@/hooks/use-queries";
import { useSidebarStore } from "../store/sidebar-store";
import { Icons } from "./Icons";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { capitalizeFirstLetter } from "@/lib/capitalize-first-letter";
import { Fragment, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOnClickOutside, useWindowSize } from "usehooks-ts";
import { LogoCard } from "./logo-card";
import { RippleCard } from "@/components/ripple-card";
import { X } from "lucide-react";

type Props = {
  name: string;
  logo: string | null;
  items: { name: string; icon: string | null }[];
};
export const Sidebar = (props: Props) => {
  return (
    <Fragment>
      <MobileWrapper {...props} />
      <div className="col-span-2 border-r-[1.5px] border-slate-100 dark:border-neutral-800 h-full overflow-y-scroll hidden lg:block">
        <Content {...props} />
      </div>
    </Fragment>
  );
};

const MobileWrapper = (props: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const { setIsOpen, isOpen } = useSidebarStore();

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
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed top-0 left-0 z-50 w-full h-full bg-black/40 "
        >
          <motion.div
            ref={ref}
            className="w-[70%] h-screen overflow-y-scroll"
            initial={{ marginLeft: "-70%" }}
            animate={{ marginLeft: "0%" }}
            exit={{ marginLeft: "-70%" }}
          >
            <Content {...props} />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

const Content = (props: Props) => {
  const { items, logo, name } = props;

  const [{ pageName, projectId }] = useQueries();

  const router = useRouter();

  const { setIsOpen } = useSidebarStore();

  return (
    <div className="flex flex-col bg-white dark:bg-dark h-full">
      <div className="lg:hidden m-2 p-2 flex items-center justify-between">
        <LogoCard
          logo={logo}
          name={name}
          projectId={projectId}
          showMenuIcon={false}
        />

        <RippleCard
          onClick={() => setIsOpen(false)}
          className="w-[40px] h-[40px] text-black dark:text-white bg-slate-100/10 flex items-center justify-center transition-transform rounded-full lg:hidden"
        >
          <X className="text-project-text-color dark:text-project-text-color-dark" />
        </RippleCard>
      </div>

      <div>
        {items.map(({ icon, name }, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center m-2 p-2 hover:bg-slate-100 hover:dark:bg-neutral-800 rounded-lg cursor-pointer",
              pageName === name ? "bg-slate-100 dark:bg-neutral-800" : ""
            )}
            onClick={() => router.push(`/project/${projectId}/${name}`)}
          >
            <div className="">
              <Icons
                iconName={icon! as any}
                variant={pageName === name ? "Bold" : "Outline"}
                className={cn(
                  pageName === name
                    ? "text-black dark:text-white"
                    : "text-gray-dark dark:text-gray-light"
                )}
              />
            </div>

            <p
              className={cn(
                "pl-2",
                pageName === name
                  ? "text-black dark:text-white"
                  : "text-gray-dark dark:text-gray-light"
              )}
            >
              {capitalizeFirstLetter(name)}
            </p>
          </div>
        ))}
      </div>

      <div
        className={cn(
          "flex items-center m-2 mb-3 p-2 hover:bg-slate-100 hover:dark:bg-neutral-800 rounded-lg cursor-pointer mt-auto",
          pageName === "settings" ? "bg-slate-100 dark:bg-neutral-800" : ""
        )}
        onClick={() => router.push(`/project/${projectId}/settings`)}
      >
        <div className="">
          <Icons
            iconName="Setting"
            variant={pageName === "settings" ? "Bold" : "Outline"}
            className={cn(
              pageName === "settings"
                ? "text-black dark:text-white"
                : "text-gray-dark dark:text-gray-light"
            )}
          />
        </div>

        <p
          className={cn(
            "pl-2",
            pageName === "settings"
              ? "text-black dark:text-white"
              : "text-gray-dark dark:text-gray-light"
          )}
        >
          Settings
        </p>
      </div>
    </div>
  );
};
