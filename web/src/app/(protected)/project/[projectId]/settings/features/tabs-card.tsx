"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useQueries } from "../../../hooks/use-queries";

type Props = {};
export const TabsCard = (props: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [{ projectId }] = useQueries();

  return (
    <div className="flex items-center gap-5 ">
      {items.map(({ href, name }, index) => (
        <div
          key={index}
          className={cn(
            "border-b-[1.5px] ",
            pathname === `/project/${projectId}${href}`
              ? "group border-slate-200 dark:border-slate-100 "
              : "border-transparent"
          )}
        >
          <button
            onClick={() => router.push(`/project/${projectId}${href}`)}
            className="p-2 px-4 mb-2 text-black dark:text-white hover:bg-slate-200/60 hover:dark:bg-neutral-800 rounded-lg group "
          >
            {name}
          </button>
        </div>
      ))}
    </div>
  );
};

const items = [
  {
    name: "Overview",
    href: "/settings",
  },
  {
    name: "Members",
    href: "/settings/members",
  },
  {
    name: "API",
    href: "/settings/api",
  },
];
