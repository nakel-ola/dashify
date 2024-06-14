"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import format from "date-fns/format";
import { Calendar } from "@/components/ui/calendar";
import { TimeCard, type TimeValue } from "./time-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useEffectOnce } from "usehooks-ts";

type Props = {
  value?: Date;
  onChange?: (value?: Date) => void;
  disabled?: boolean;
};

export const DatetimePicker = (props: Props) => {
  const { onChange, value, disabled } = props;

  const [isOpen, setIsOpen] = useState(false);

  const [date, setDate] = useState<Date>();

  const updateDate = (value: Date) => {
    const newDate = new Date(date!);

    newDate.setFullYear(value.getFullYear());
    newDate.setMonth(value.getMonth());
    newDate.setDate(value.getDate());

    setDate(newDate);
  };

  const updateTime = (time: TimeValue) => {
    const newDate = new Date(date!);

    const hours = formatHoursByPeriod(newDate, Number(time.hours), time.period);
    newDate.setHours(hours);
    newDate.setMinutes(Number(time.minutes));

    setDate(newDate);
  };

  useEffectOnce(() => {
    if (value) setDate(new Date(value));
  });

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="w-full" disabled={disabled}>
        <div
          className={cn(
            "w-full items-center text-left font-normal border-[1.5px] border-slate-100 dark:border-neutral-800 rounded-md cursor-pointer flex justify-between",
            !date && "text-muted-foreground"
          )}
        >
          <p className="text-black dark:text-white py-2 px-3">
            {date ? (
              format(date, "PPPp")
            ) : (
              <span className="text-[#8b8b8b]">Pick a date</span>
            )}
          </p>
          <CalendarIcon className="mr-2 h-4 w-4 text-neutral-600" />
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0 border-[1.5px] bg-white dark:bg-dark h-[350px]">
        <div className="flex divide-x-[1.5px] divide-slate-100 dark:divide-neutral-800 gap-5">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(day) => updateDate(day!)}
            initialFocus
            classNames={{
              root: "!border-0 rounded-md",
            }}
          />

          <TimeCard
            onChange={updateTime}
            value={{
              minutes: formatNumber(date?.getMinutes() ?? 0),
              ...convert24to12(date?.getHours() ?? 0),
            }}
            classes={{
              root: "w-[230px]",
            }}
          />
        </div>

        <div className="flex items-center justify-between p-1 px-2 border-t-[1.5px] border-slate-100 dark:border-neutral-800">
          <Button
            className="ml-auto"
            onClick={() => {
              onChange?.(date);
              setIsOpen(false);
            }}
          >
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const formatNumber = (num: number) => (num < 10 ? `0${num}` : `${num}`);

function formatHoursByPeriod(
  date: Date,
  newHours: number,
  period: "AM" | "PM"
): number {
  // Ensure newHours is within the valid range (0-23)
  newHours = Math.max(0, Math.min(23, newHours));

  // Get the current hours
  let currentHours = date.getHours();

  // Convert newHours to a 24-hour format if period is "PM" and currentHours is not already in the afternoon
  if (period === "PM" && currentHours < 12) {
    newHours += 12;
  }

  return newHours;
}

function convert24to12(hours24: number): {
  hours: string;
  period: "AM" | "PM";
} {
  // Ensure hours24 is within the valid range (0-23)
  const newHours24 = Math.max(0, Math.min(23, hours24));

  // Determine the period (AM or PM)
  const period: "AM" | "PM" = newHours24 >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  const hours = newHours24 % 12 || 12;

  return { hours: formatNumber(hours), period };
}
