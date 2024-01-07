import { Setting2 } from "iconsax-react";
import type { ColumnType } from "../schema";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

type Props = Pick<
  ColumnType,
  "isArray" | "isIdentify" | "isNullable" | "isUnique" | "dataType"
> & {
  updateColumn: <T extends keyof ColumnType>(
    key: T,
    value: ColumnType[T]
  ) => void;
};

type Item = {
  key: "isArray" | "isIdentify" | "isNullable" | "isUnique";
  name: string;
  description: string;
  checked: boolean;
};

export const MoreOptionCard = (props: Props) => {
  const { isArray, isIdentify, isNullable, isUnique, updateColumn, dataType } =
    props;

  const items = [
    {
      key: "isNullable",
      name: "Is Nullable",
      description:
        "Specify if the column can assume a NULL value if no value is provided",
      checked: isNullable,
    },
    {
      key: "isUnique",
      name: "Is Unique",
      description:
        "Enforce if values in the column should be unique across rows",
      checked: isUnique,
    },
    ["int2", "int4", "int8"].includes(dataType)
      ? {
          key: "isIdentify",
          name: "Is Identify",
          description:
            "Automatically assign a sequential unique number to the column",
          checked: isIdentify,
        }
      : false,
    {
      key: "isArray",
      name: "Define as Array",
      description:
        "Allow column to be defined as variable-length multidimensional arrays",
      checked: isArray,
    },
  ].filter(Boolean) as Item[];

  const checks = items.filter((item) => item.checked);

  return (
    <Popover>
      <PopoverTrigger>
        <div className="h-9 w-9 rounded-md flex items-center justify-center hover:bg-slate-100 dark:hover:bg-neutral-800 shrink-0 -space-x-3 lg:-space-x-2">
          {checks.length > 0 ? (
            <div className="h-5 w-5 lg:h-4 lg:w-4 bg-black dark:bg-white z-10 shrink-0 rounded-full flex items-center justify-center">
              <p className="text-sm lg:text-xs text-center text-white dark:text-black">
                {checks.length}
              </p>
            </div>
          ) : null}
          <Setting2 className="w-[25px] h-[25px] lg:w-[20px] lg:h-[20px] shrink-0" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="!p-0 !w-80">
        <div className="border-b-[1.5px] border-slate-100 dark:border-neutral-800 px-4 py-2">
          <p className="">Extra options</p>
        </div>

        <div className="px-4 py-2 space-y-5">
          {items.map(({ name, description, checked, key }, index) => (
            <div key={index} className="flex ">
              <Checkbox
                id={"option-" + index}
                className="w-[20px] h-[20px] rounded-md mt-1"
                checked={checked}
                onCheckedChange={() => updateColumn(key, !checked)}
              />

              <label htmlFor={"option-" + index} className="ml-2">
                <p className="text-base text-black dark:text-white">{name}</p>
                <p className="text-sm text-gray-dark dark:text-gray-light">
                  {description}
                </p>
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
