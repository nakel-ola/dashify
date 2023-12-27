"use client";

import { useProjectStore } from "../../../store/project-store";
import { arrangeValues } from "../../../utils/arrange-values";
import { convertObjectToArray } from "@/utils/convert-object-to-array";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  pageName: string;
  items: any[];
};

export const CollectionsCard = (props: Props) => {
  const { pageName, items } = props;

  const collection = useProjectStore((store) => store.getCollection(pageName));

  const sortedFields = collection?.fields
    .map((field) => field.name)
    .sort((a, b) => a.localeCompare(b));

  const arrangedItems = arrangeValues(items, sortedFields!);

  return arrangedItems.map((item, index) => (
    <div
      key={index}
      className="flex items-center divide-x-[1.5px] divide-slate-100 dark:divide-neutral-800 w-full"
    >
      <div className="min-w-[100px] h-[42.67px] p-2 py-2.5 shrink-0 border-b-[1.5px] border-slate-100 dark:border-neutral-800 flex items-center justify-start px-5">
        <Checkbox className="w-[20px] h-[20px] rounded-md" />
      </div>
      {convertObjectToArray(item).map((value, inx) => (
        <div
          key={inx}
          className="w-[250px] h-[42.67px] px-3 py-2 border-b-[1.5px] border-slate-100 dark:border-neutral-800 whitespace-nowrap break-normal overflow-hidden shrink-0"
        >
          <p className="">
            {Array.isArray(value)
              ? `[ ] ${value.length} elements`
              : typeof value === "object"
              ? `{ } ${Object.keys(value).length} fields`
              : value.toString()}
          </p>
        </div>
      ))}

      <div className="min-w-[100px] h-[42.67px] p-2 shrink-0 border-b-[1.5px] border-slate-100 dark:border-neutral-800"></div>
    </div>
  ));
};

const getArrayValue = (value: any[]) => {
  return `[] ${value.length} elements`;
};
