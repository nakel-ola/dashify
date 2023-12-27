"use client";
import { cn } from "@/lib/utils";
import { Filter, Refresh, Sort } from "iconsax-react";

type Props = {
  onRefresh: () => void;
  isRefreshing: boolean;
};
export const TabsCard = (props: Props) => {
  const { onRefresh, isRefreshing } = props;
  return (
    <div className="flex items-center gap-2 bg-slate-100/60 dark:bg-neutral-800/30 py-1 px-5 ">
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="p-1.5 px-2 text-black dark:text-white hover:bg-slate-200/60 hover:dark:bg-neutral-800 rounded-lg group flex items-center gap-2 disabled:hover:bg-transparent disabled:hover:dark:bg-transparent disabled:opacity-60"
      >
        <Refresh
          className={cn(
            "h-[20px] w-[20px]",
            isRefreshing ? "animate-spin" : ""
          )}
        />
        Refresh
      </button>

      <button className="p-1.5 px-2 text-black dark:text-white hover:bg-slate-200/60 hover:dark:bg-neutral-800 rounded-lg group flex items-center gap-2">
        <Filter className="h-[20px] w-[20px]" />
        Filter
      </button>

      <button className="p-1.5 px-2 text-black dark:text-white hover:bg-slate-200/60 hover:dark:bg-neutral-800 rounded-lg group flex items-center gap-2">
        <Sort className="h-[20px] w-[20px]" />
        Sort
      </button>
    </div>
  );
};
