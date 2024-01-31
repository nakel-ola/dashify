"use client";
import { cn } from "@/lib/utils";
import { Refresh, Trash } from "iconsax-react";
import { X } from "lucide-react";
import { FilterCard } from "./filter-card";
import { SortCard } from "./sort-card";
import { InsertCard } from "./insert-card";
import { Fragment, useState } from "react";
import { DeleteAlertCard } from "./delete-alert-card";
import { useSelectedRowStore } from "../../../store/selected-row-store";

type Props = {
  onRefresh: () => void;
  isRefreshing: boolean;
  totalItems: number;
  showSelectAll: boolean;
};
export const TabsCard = (props: Props) => {
  const { onRefresh, isRefreshing, totalItems, showSelectAll } = props;

  const { removeSelected, selectedRows, setIsDeleteOpen } =
    useSelectedRowStore();

  const totalSelected = selectedRows.length;

  return (
    <Fragment>
      <div className="flex items-center justify-between gap-2 bg-slate-100/60 dark:bg-neutral-800/30 py-1 px-3">
        {selectedRows.length > 0 ? (
          <div className="flex items-center gap-2">
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

            {showSelectAll && totalSelected !== totalItems ? (
              <button className="p-1.5 px-2 text-indigo-600 hover:bg-indigo-600/10 rounded-lg group flex items-center gap-2 hover:scale-105 active:scale-95 transition-all duration-300">
                Select all {totalItems} rows
              </button>
            ) : null}

            <button
              onClick={() => setIsDeleteOpen(true)}
              className="p-1.5 px-2 text-black dark:text-white hover:bg-slate-200/60 hover:dark:bg-neutral-800 rounded-lg group flex items-center gap-2 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <Trash className="h-[20px] w-[20px]" />
              Delete {totalSelected} rows
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="p-1.5 px-2 text-black dark:text-white hover:bg-slate-200/60 hover:dark:bg-neutral-800 rounded-lg group flex items-center gap-2 disabled:hover:bg-transparent disabled:hover:dark:bg-transparent disabled:opacity-60 hover:scale-105 active:scale-95 transition-all duration-300"
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
            </div>

            <InsertCard />
          </>
        )}
      </div>

      {/* <DeleteAlertCard
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        selectedCount={totalSelected}
        isLoading={false}
        onDelete={() => {}}
      /> */}
    </Fragment>
  );
};
