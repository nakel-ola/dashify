"use client";

import { cn } from "@/lib/utils";

export type TimeValue = {
  hours: number;
  minutes: number;
  seconds: number;
};
type Props = {
  value: TimeValue;
  onChange: (value: TimeValue) => void;
  classes?: {
    root?: string;
  }
};
export const TimeCard = (props: Props) => {
  const { onChange, value, classes } = props;

  const { hours, minutes, seconds } = value;
  return (
    <div className={cn("shrink-0", classes?.root)}>
      <div className="flex items-center w-full border-b-[1.5px] border-slate-100 dark:border-neutral-800 p-1">
        <div className="p-2 w-full">
          <p className="text-center text-black dark:text-white">Hr</p>
        </div>
        <div className="p-2 w-full">
          <p className="text-center text-black dark:text-white">Min</p>
        </div>
        <div className="p-2 w-full">
          <p className="text-center text-black dark:text-white">Sec</p>
        </div>
      </div>
      <div className="flex items-center w-full h-[250px] p-2">
        <ListCard
          length={24}
          value={hours}
          onClick={(value) => onChange?.({ hours: value, minutes, seconds })}
        />
        <ListCard
          length={60}
          showBorder
          value={minutes}
          onClick={(value) => onChange?.({ hours, minutes: value, seconds })}
        />
        <ListCard
          length={60}
          value={seconds}
          onClick={(value) => onChange?.({ hours, minutes, seconds: value })}
        />
      </div>
    </div>
  );
};

export type Time = `${string}:${string}:${string}`;

type ListCardProps = {
  length: number;
  showBorder?: boolean;
  value: number;
  onClick?: (value: number) => void;
};

const ListCard = (props: ListCardProps) => {
  const { length, showBorder, onClick, value } = props;
  return (
    <div
      className={cn(
        "flex flex-col w-full space-y-1 h-full overflow-y-scroll scrollbar-hide hover:scrollbar-default  hover:pl-[5px] px-[5px]",
        showBorder ? "border-x-[1.5px] border-slate-100 dark:border-neutral-800" : ""
      )}
    >
      {generateArray(length).map((num, index) => (
        <button
          key={num}
          onClick={() => onClick?.(Number(num))}
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