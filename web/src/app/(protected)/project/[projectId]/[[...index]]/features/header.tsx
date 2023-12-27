"use client";

import { Add, ArrowDown2 } from "iconsax-react";
import { useProjectStore } from "../../../store/project-store";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type Props = {
  pageName: string;
};
export const Header = (props: Props) => {
  const { pageName } = props;

  const project = useProjectStore((store) => store.project!);

  const collection = project.collections.find((c) => c.name === pageName);

  const canShowField = (type: string) => {
    if (type === "object") return false;

    return true;
  };

  const sortedFields = collection?.fields.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div
      className={cn(
        "flex items-center divide-x-[1.5px] divide-slate-100 dark:divide-neutral-800 w-full"
      )}
    >
      <div className="min-w-[100px] p-2 py-2.5 shrink-0 border-y-[1.5px] border-slate-100 dark:border-neutral-800 flex items-center justify-start px-5">
        <Checkbox className="w-[20px] h-[20px] rounded-md" />
      </div>
      {sortedFields?.map((field, index) => (
        <div
          key={index}
          className="min-w-[250px] px-3 border-y-[1.5px] border-slate-100 dark:border-neutral-800 flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-1 py-2">
            <p className="">{field.name}</p>

            <small className="text-gray-dark dark:text-gray-light text-xs">
              {field.type}
            </small>
          </div>

          <button className="w-[40px] flex items-center justify-center hover:bg-slate-100 hover:dark:bg-neutral-800 py-1 rounded-md">
            <ArrowDown2 className="w-[20px] h-[20px]" />
          </button>
        </div>
      ))}

      <button className="min-w-[100px] p-2 shrink-0 flex items-center justify-center cursor-pointer hover:bg-slate-100 hover:dark:bg-neutral-800 border-y-[1.5px] border-slate-100 dark:border-neutral-800">
        <Add />
      </button>
    </div>
  );
};
