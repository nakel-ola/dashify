"use client";

import { Add } from "iconsax-react";
import { useProjectStore } from "../../../store/project-store";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { HeaderCard } from "./header-card";

type Props = {
  pageName: string;
  projectId: string;
  onSelectAll: () => void;
  isAllSelected: boolean;
  isMongodb: boolean;
};
export const Header = (props: Props) => {
  const { pageName, onSelectAll, isAllSelected, projectId, isMongodb } = props;

  const sortedFields = useProjectStore((store) => store.getFields(pageName));

  return (
    <div
      className={cn(
        "sticky top-0 bg-white dark:bg-black flex items-center divide-x-[1.5px] divide-slate-100 dark:divide-neutral-800 w-full"
      )}
    >
      <div className="min-w-[100px] p-2 py-2.5 shrink-0 border-y-[1.5px] border-slate-100 dark:border-neutral-800 flex items-center justify-start px-5">
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={() => onSelectAll()}
          className="w-[20px] h-[20px] rounded-md"
        />
      </div>
      {sortedFields?.map((field, index) => (
        <HeaderCard
          key={index}
          {...field}
          tableName={pageName}
          projectId={projectId}
          isMongodb={isMongodb}
        />
      ))}

      <button className="min-w-[100px] bg-white dark:bg-black p-2 shrink-0 flex items-center justify-center cursor-pointer hover:bg-slate-100 hover:dark:bg-neutral-800 border-y-[1.5px] border-slate-100 dark:border-neutral-800">
        <Add />
      </button>
    </div>
  );
};
