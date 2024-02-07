"use client";

import { Add } from "iconsax-react";
import { useProjectStore } from "../../../store/project-store";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { HeaderCard } from "./header-card";
import { useAddColumnStore } from "../../../store/add-column-store";
import { useSelectedRowStore } from "../../../store/selected-row-store";

type Props = {
  pageName: string;
  projectId: string;
  currentPage: number;
  totalItems: number;
  limit: number;
  isMongodb: boolean;
};
export const Header = (props: Props) => {
  const { pageName, projectId, isMongodb, limit, totalItems, currentPage } =
    props;

  const sortedFields = useProjectStore((store) => store.getFields(pageName));
  const { setIsOpen } = useAddColumnStore();
  const { onSelectAll, selectedRows } = useSelectedRowStore();

  const isAllSelected =
    totalItems > 0 ? totalItems === selectedRows.length : false;

  return (
    <div
      className={cn(
        "sticky top-0 bg-white dark:bg-black flex items-center w-full"
      )}
    >
      {sortedFields.length > 0 ? (
        <div className="min-w-[100px] p-2 py-2.5 shrink-0 border-y-[1.5px] border-r-[1.5px] border-slate-100 dark:border-neutral-800 flex items-center justify-start px-5">
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={() =>
              onSelectAll({ currentPage, limit, totalItems })
            }
            className="w-[20px] h-[20px] rounded-md"
          />
        </div>
      ) : null}
      {sortedFields?.map((field, index) => (
        <HeaderCard
          key={index}
          {...field}
          tableName={pageName}
          projectId={projectId}
          isMongodb={isMongodb}
        />
      ))}

      {!isMongodb ? (
        <button
          onClick={() => setIsOpen(true)}
          className="min-w-[100px] bg-white dark:bg-black p-2 shrink-0 flex items-center justify-center cursor-pointer hover:bg-slate-100 hover:dark:bg-neutral-800 border-y-[1.5px] border-r-[1.5px] border-slate-100 dark:border-neutral-800"
        >
          <Add />
        </button>
      ) : null}
    </div>
  );
};
