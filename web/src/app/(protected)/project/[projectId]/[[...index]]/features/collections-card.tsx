"use client";

import { useProjectStore } from "../../../store/project-store";
import { arrangeValues } from "../../../utils/arrange-values";
import { convertObjectToArray } from "@/utils/convert-object-to-array";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  pageName: string;
  items: any[];
  isSelected: (value: number) => boolean;
  updateSelected: (value: number) => void;
};

export const CollectionsCard = (props: Props) => {
  const { pageName, items, isSelected, updateSelected } = props;

  const sortedFields = useProjectStore((store) =>
    store.getFields(pageName)
  ).map((field) => field.name);


  const arrangedItems = arrangeValues(items, sortedFields!);

  return arrangedItems.map((item, index) => (
    <div
      key={index}
      className="flex items-center divide-x-[1.5px] divide-slate-100 dark:divide-neutral-800 w-full"
    >
      <div className="min-w-[100px] h-[42.67px] p-2 py-2.5 shrink-0 border-b-[1.5px] border-slate-100 dark:border-neutral-800 flex items-center justify-start px-5">
        <Checkbox
          checked={isSelected(index)}
          onCheckedChange={(checked) => updateSelected(index)}
          className="w-[20px] h-[20px] rounded-md"
        />
      </div>
      {convertObjectToArray(item).map((value, inx) => (
        <div
          key={inx}
          className="w-[250px] h-[42.67px] px-3 py-2 border-b-[1.5px] border-slate-100 dark:border-neutral-800 whitespace-nowrap break-normal overflow-hidden shrink-0"
        >
          <p className="">{formatValue(value)}</p>
        </div>
      ))}

      <div className="min-w-[100px] h-[42.67px] p-2 shrink-0 border-b-[1.5px] border-slate-100 dark:border-neutral-800"></div>
    </div>
  ));
};

const formatValue = (value: any) => {
  if (value === null) return "null";

  if (value === "") return `""`;

  if (Array.isArray(value)) return `[ ] ${value.length} elements`;

  if (typeof value === "object")
    return `{ } ${Object.keys(value).length} fields`;

  return value?.toString();
};
