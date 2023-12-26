"use client";

import { useQueries } from "@/app/(protected)/project/hooks/use-queries";
import { useSidebarStore } from "../store/sidebar-store";
import { IconNames, Icons } from "./Icons";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { capitalizeFirstLetter } from "@/lib/capitalize-first-letter";
import { Fragment, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOnClickOutside, useWindowSize } from "usehooks-ts";
import { RippleCard } from "@/components/ripple-card";
import { X } from "lucide-react";
import { useProjectStore } from "../store/project-store";
import Link from "next/link";
import Image from "next/image";

export const Sidebar = () => {
  return (
    <Fragment>
      <MobileWrapper />
      <div className="col-span-2 border-r-[1.5px] border-slate-100 dark:border-neutral-800 h-full overflow-y-scroll hidden lg:block">
        <Content />
      </div>
    </Fragment>
  );
};

const MobileWrapper = () => {
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
            <Content />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

const Content = () => {
  const [{ projectId }] = useQueries();

  const { setIsOpen } = useSidebarStore();

  const project = useProjectStore((store) => store.project!);

  const items = project.collections.map((co) => ({
    icon: co.icon as IconNames,
    name: co.name,
  }));

  return (
    <div className="flex flex-col bg-white dark:bg-dark h-full">
      <div className="lg:hidden m-2 p-2 flex items-center justify-between">
        <Link
          href={`/project/${projectId}/overview`}
          className="flex items-center cursor-pointer"
        >
          {project.logo ? (
            <Image
              src={project.logo}
              width={32}
              height={32}
              alt="Dashify logo"
              className="h-8 w-auto"
            />
          ) : null}

          <p className="text-xl ml-2 font-black text-black dark:text-white">
            {capitalizeFirstLetter(project.name)}
          </p>
        </Link>

        <RippleCard
          onClick={() => setIsOpen(false)}
          className="w-[40px] h-[40px] text-black dark:text-white bg-slate-100/10 flex items-center justify-center transition-transform rounded-full lg:hidden"
        >
          <X className="text-project-text-color dark:text-project-text-color-dark" />
        </RippleCard>
      </div>

      <div className="pt-5">
        {items.map(({ icon, name }, index) => (
          <Card key={index} iconName={icon} name={name} />
        ))}
      </div>

      <Card iconName="Setting" name="settings" />
    </div>
  );
};

type CardProps = {
  iconName: IconNames;
  name: string;
};
const Card = (props: CardProps) => {
  const { iconName, name } = props;
  const pathname = usePathname();
  const router = useRouter();
  const [{ pageName, projectId }] = useQueries();

  const isActive = pathname.startsWith(`/project/${projectId}/${name}`);

  return (
    <div
      className={cn(
        "flex items-center m-2 mb-3 p-2 hover:bg-slate-100 hover:dark:bg-neutral-800 rounded-lg cursor-pointer mt-auto",
        isActive ? "bg-slate-100 dark:bg-neutral-800" : ""
      )}
      onClick={() => router.push(`/project/${projectId}/${name}`)}
    >
      <div className="">
        <Icons
          iconName={iconName}
          variant={isActive ? "Bold" : "Outline"}
          className={cn(
            isActive
              ? "text-black dark:text-white"
              : "text-gray-dark dark:text-gray-light"
          )}
        />
      </div>

      <p
        className={cn(
          "pl-2",
          isActive
            ? "text-black dark:text-white"
            : "text-gray-dark dark:text-gray-light"
        )}
      >
        {capitalizeFirstLetter(name)}
      </p>
    </div>
  );
};
