"use client";
import { cn } from "@/lib/utils";
import { Refresh, Trash } from "iconsax-react";
import { X } from "lucide-react";
import { FilterCard } from "./filter-card";
import { SortCard } from "./sort-card";
import { InsertCard } from "./insert-card";

type Props = {
  onRefresh: () => void;
  removeSelected: () => void;
  isRefreshing: boolean;
  isAnySelected: boolean;
  totalSelected: number;
  totalItems: number;
};
export const TabsCard = (props: Props) => {
  const {
    onRefresh,
    isRefreshing,
    isAnySelected,
    totalSelected,
    totalItems,
    removeSelected,
  } = props;
  return (
    <div className="flex items-center justify-between gap-2 bg-slate-100/60 dark:bg-neutral-800/30 py-1 px-3">
      <div className="flex items-center gap-2">
        {isAnySelected ? (
          <>
            <div className="p-1.5 px-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => removeSelected()}
                className="w-[25px] h-[25px] rounded-md flex items-center justify-center bg-slate-200/60 dark:bg-neutral-800"
              >
                <X />
              </button>

              <p className="text-black dark:text-white">
                {totalSelected} rows selected
              </p>
            </div>

            <button className="p-1.5 px-2 text-indigo-600 hover:bg-indigo-600/10 rounded-lg group flex items-center gap-2">
              Select all {totalItems} rows
            </button>

            <button className="p-1.5 px-2 text-black dark:text-white hover:bg-slate-200/60 hover:dark:bg-neutral-800 rounded-lg group flex items-center gap-2">
              <Trash className="h-[20px] w-[20px]" />
              Delete {totalSelected} rows
            </button>
          </>
        ) : (
          <>
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

            <FilterCard />

            <SortCard />
          </>
        )}
      </div>

      <InsertCard />
    </div>
  );
};
