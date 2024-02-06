import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { arrangeValues } from "../../../utils/arrange-values";
import { convertObjectToArray } from "@/utils/convert-object-to-array";
import { InfoCircle } from "iconsax-react";

type Props = {
  tableName: string;
  items: { [key: string]: any }[];
  header: string[];
  errors: string[];
};
export const PreviewTable = (props: Props) => {
  const { items, tableName, header, errors } = props;

  const [columnsName, setColumnsName] = useState(
    header.map((key) => ({
      name: key,
      selected: true,
    }))
  );

  const arrangedItems = arrangeValues(
    items.slice(0, 20),
    columnsName
      .map(({ name, selected }) => (selected ? name : null))
      .filter((value) => value !== null) as string[]
  );

  const updateColumnName = (index: number) => {
    let arr = [...columnsName];

    arr[index].selected = !arr[index].selected;

    setColumnsName(arr);
  };

  return (
    <div className="">
      {/* column list */}
      <div className="pl-6">
        <p className="text-xs text-gray-dark dark:text-gray-light">
          Select which columns to import
        </p>
        <p className="text-xs text-gray-dark dark:text-gray-light">
          By default, all columns are selected to be imported from your csv
        </p>

        <div className="flex gap-2 items-center mt-2 overflow-x-scroll">
          {columnsName.map((value, index) => (
            <button
              key={value.name}
              className={cn(
                "py-0.5 px-2.5 rounded-md group flex items-center gap-2 disabled:hover:bg-transparent disabled:hover:dark:bg-transparent disabled:opacity-60 transition-all duration-300",
                value.selected
                  ? "bg-indigo-600 text-white"
                  : "text-black dark:text-white"
              )}
              onClick={() => updateColumnName(index)}
            >
              {value.name}
            </button>
          ))}
        </div>
      </div>

      <Separator className="my-5" />

      {/* preview */}

      <div className="px-6">
        {errors.length > 0 ? (
          <div className="mb-3 bg-red-500/10 border-[0.5px] border-red-500 rounded-full px-2 w-fit">
            <p className="text-sm text-red-500">Data incompatible</p>
          </div>
        ) : null}
        <p className="text-xs text-gray-dark dark:text-gray-light">
          A total {items.length} of rows will be added to the table &quot;
          {tableName}&quot;
        </p>
        <p className="text-xs mb-5 text-gray-dark dark:text-gray-light">
          Here is a preview of the data that will be added (up to the first 20
          columns and first 20 rows)
        </p>

        {items.length > 0 ? (
          <div className="overflow-scroll w-full h-full max-h-[360px] border-[1.5px] border-slate-100 dark:border-neutral-800 rounded-md ">
            <div className="flex sticky top-0">
              {columnsName.map(({ name, selected }, index) =>
                selected ? (
                  <div
                    key={index}
                    className="w-[150px] shrink-0 px-3 h-[40px] bg-slate-50 dark:bg-neutral-900 border-b-[1.5px] border-r-[1.5px] border-slate-100 dark:border-neutral-800 flex items-center"
                  >
                    <p className="">{name}</p>
                  </div>
                ) : null
              )}
            </div>

            {arrangedItems.map((item, index) => (
              <div key={index} className="flex items-center w-full ">
                {convertObjectToArray(item).map((value, inx) => (
                  <div
                    key={inx}
                    className="flex items-center whitespace-nowrap break-normal overflow-hidden shrink-0 w-[150px] border-b-[1.5px] border-slate-100 dark:border-neutral-800 h-[40px] px-3 border-r-[1.5px]"
                  >
                    <p className="text-sm">{value}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full border-[1.5px] border-slate-100 dark:border-neutral-800 rounded-md flex items-center justify-center gap-2 py-3">
            <InfoCircle size={20} />

            <p className="text-sm">Your CSV contains no data</p>
          </div>
        )}

        <div className="mt-5 space-y-2">
          <p className="font-medium text-sm text-black dark:text-white">
            Issues found in the the csv file
          </p>

          {errors.map((error, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="h-[1.5px] w-[1.5px] shrink-0 rounded-full bg-gray-dark dark:bg-gray-light"></span>

              <p className="text-gray-dark dark:text-gray-light text-sm">
                {error}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
