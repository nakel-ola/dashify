"use client";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { FormEvent, useState } from "react";
import { LimitCard } from "./limit-card";

type Props = {
  pageCount: number;
  page: number;
  onPageChange: (value: "next" | "previous" | number) => void;
  onLimitChange: (value: "100" | "500" | "1000") => void;
  limit: "100" | "500" | "1000";
  totalItems: number;
};
export const PaginationCard = (props: Props) => {
  const { pageCount, page, limit, totalItems, onPageChange, onLimitChange } =
    props;

  const [input, setInput] = useState(page);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    onPageChange(input);
  };

  return (
    <div className=" w-full scrollbar-hide gap-5 px-5 py-2 flex items-center">
      <button
        type="button"
        className="w-[50px] h-[30px] border-[1.5px] border-slate-100 dark:border-neutral-800 hover:bg-slate-100 hover:dark:bg-neutral-800 rounded-md flex items-center justify-center hover:scale-105 active:scale-95 "
        onClick={() => onPageChange("previous")}
      >
        <ArrowLeft2 className="h-5 w-5 text-black dark:text-white" />
      </button>

      <div className="flex items-center gap-2">
        <p className="text-sm text-gray-dark dark:text-gray-light">Page</p>

        <form
          onSubmit={handleSubmit}
          className="w-[50px] h-[30px] border-[1.5px] border-slate-100 dark:border-neutral-800 rounded-md overflow-hidden "
        >
          <input
            value={input}
            type="number"
            min={1}
            max={pageCount}
            onChange={(e) =>
              setInput(Number(e.target.value.replace(/^0+/, "")))
            }
            className="h-full w-full px-2 bg-transparent border-0 outline-0"
          />

          <button type="submit" className="hidden"></button>
        </form>
        <p className="text-sm text-gray-dark dark:text-gray-light">
          of {pageCount}
        </p>
      </div>
      <button
        type="button"
        className="w-[50px] h-[30px] border-[1.5px] border-slate-100 dark:border-neutral-800 hover:bg-slate-100 hover:dark:bg-neutral-800 rounded-md flex items-center justify-center hover:scale-105 active:scale-95"
        onClick={() => onPageChange("next")}
      >
        <ArrowRight2 className="h-5 w-5 text-black dark:text-white" />
      </button>

      {/* <div className="min-w-[50px] h-[30px] border-[1.5px] border-slate-100 dark:border-neutral-800 rounded-md flex items-center justify-center px-2">
        <p className="">{limit} rows</p>
      </div> */}

      <LimitCard limit={limit} onLimitChange={onLimitChange} />

      <p className="text-sm text-gray-dark dark:text-gray-light">
        {totalItems} records
      </p>
    </div>
  );
};
