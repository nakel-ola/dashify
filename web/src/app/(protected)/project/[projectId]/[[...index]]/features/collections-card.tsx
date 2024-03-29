"use client";

import { useProjectStore } from "../../../store/project-store";
import { arrangeValues } from "../../../utils/arrange-values";
import { convertObjectToArray } from "@/utils/convert-object-to-array";
import { Checkbox } from "@/components/ui/checkbox";
import { Maximize4 } from "iconsax-react";
import { useRowUpdateStore } from "../../../store/row-update-store";
import { useQueries } from "../../../hooks/use-queries";
import { useSelectedRowStore } from "../../../store/selected-row-store";

type Props = {
  pageName: string;
  items: any[];
  currentPage: number;
  limit: number;
  isMongodb: boolean;
};

export const CollectionsCard = (props: Props) => {
  const { pageName, items, currentPage, limit, isMongodb } = props;

  const { setRow } = useRowUpdateStore();

  const [{ projectId }] = useQueries();

  const sortedFields = useProjectStore((store) => store.getFields(pageName));

  const { isSelected, setSelectedRow } = useSelectedRowStore();

  const sortedValues = sortedFields.map((field) => field.name);

  const arrangedItems = arrangeValues(items, sortedValues!) as any[];

  return arrangedItems.map((item, index) => (
    <div
      key={index}
      className="flex items-center w-full"
    >
      <div className="min-w-[100px] h-[42.67px] p-2 py-2.5 shrink-0 border-b-[1.5px] border-r-[1.5px] border-slate-100 dark:border-neutral-800 flex items-center justify-between px-5">
        <Checkbox
          checked={isSelected({
            currentPage,
            limit,
            value: index,
          })}
          onCheckedChange={(checked) =>
            setSelectedRow({ currentPage, limit, value: index })
          }
          className="w-[20px] h-[20px] rounded-md"
        />

        <button
          type="button"
          className="rounded-md p-0.5 hover:bg-slate-100 hover:dark:bg-neutral-800 hover:scale-105 active:scale-95 transition-all duration-300"
          onClick={() =>
            setRow({
              values: item,
              field: sortedFields,
              tableName: pageName,
              projectId,
            })
          }
        >
          <Maximize4
            size={20}
            className="text-gray-dark dark:text-gray-light"
          />
        </button>
      </div>
      {convertObjectToArray(item).map((value, inx) => (
        <div
          key={inx}
          className="w-[250px] h-[42.67px] px-3 py-2 border-b-[1.5px] border-r-[1.5px] border-slate-100 dark:border-neutral-800 whitespace-nowrap break-normal overflow-hidden shrink-0"
        >
          <p className="">{formatValue(value)}</p>
        </div>
      ))}

      {!isMongodb ? (
        <div className="min-w-[100px] h-[42.67px] p-2 shrink-0 border-b-[1.5px] border-r-[1.5px] border-slate-100 dark:border-neutral-800"></div>
      ) : null}
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
