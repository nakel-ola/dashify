"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type TimeValue = {
  hours: string;
  minutes: string;
  period: "AM" | "PM";
};
type Props = {
  value: TimeValue;
  onChange: (value: TimeValue) => void;
  classes?: {
    root?: string;
  };
};
export const TimeCard = (props: Props) => {
  const { onChange, value, classes } = props;

  const { hours, minutes, period } = value;
  return (
    <div className={cn("shrink-0", classes?.root)}>
      <div className="flex items-center w-full border-b-[1.5px] border-slate-100 dark:border-neutral-800 p-1">
        <div className="p-2 w-full">
          <p className="text-center text-black dark:text-white">Hr</p>
        </div>
        <div className="p-2 w-full">
          <p className="text-center text-black dark:text-white">Min</p>
        </div>
        <div className="p-2 w-full"></div>
      </div>
      <div className="flex items-center w-full h-[250px] p-2">
        <ListCard
          length={12}
          value={hours}
          onClick={(value) => onChange?.({ hours: value, minutes, period })}
        />
        <ListCard
          length={59}
          showBorder
          value={minutes}
          onClick={(value) => onChange?.({ hours, minutes: value, period })}
        />

        <div className="flex flex-col w-full space-y-1 h-full overflow-y-scroll hover:pl-[5px] px-[5px]">
          <button
            onClick={() => onChange?.({ hours, minutes, period: "AM" })}
            className={cn(
              " p-2 rounded-md shrink-0 transition-all duration-300",
              period === "AM"
                ? "bg-indigo-600 text-white"
                : "hover:bg-slate-100 hover:dark:bg-neutral-800 text-black dark:text-white "
            )}
          >
            AM
          </button>
          <button
            onClick={() => onChange?.({ hours, minutes, period: "PM" })}
            className={cn(
              " p-2 rounded-md shrink-0 transition-all duration-300",
              period === "PM"
                ? "bg-indigo-600 text-white"
                : "hover:bg-slate-100 hover:dark:bg-neutral-800 text-black dark:text-white "
            )}
          >
            PM
          </button>
        </div>
      </div>
    </div>
  );
};

export type Time = `${string}:${string} ${"AM" | "PM"}`;

type ListCardProps = {
  length: number;
  showBorder?: boolean;
  value: string;
  onClick?: (value: string) => void;
};

const ListCard = (props: ListCardProps) => {
  const { length, showBorder, onClick, value } = props;
  return (
    <div
      className={cn(
        "flex flex-col w-full space-y-1 h-full overflow-y-scroll scrollbar-hide hover:scrollbar-default  px-[5px] scrollbar-thumb-indigo-600",
        showBorder
          ? "border-x-[1.5px] border-slate-100 dark:border-neutral-800"
          : ""
      )}
    >
      {generateArray(length).map((num, index) => (
        <button
          key={num}
          onClick={() => onClick?.(num)}
          className={cn(
            " p-2 rounded-md shrink-0 transition-all duration-300",
            Number(value) === Number(num)
              ? "bg-indigo-600 text-white"
              : "hover:bg-slate-100 hover:dark:bg-neutral-800 text-black dark:text-white "
          )}
        >
          {num}
        </button>
      ))}
    </div>
  );
};

const generateArray = (value: number = 10) => {
  const array: string[] = [];
  for (let i = 0; i <= value; i++) {
    if (i < 10) array.push(`0${i}`);
    else array.push(i.toString());
  }

  return array;
};
