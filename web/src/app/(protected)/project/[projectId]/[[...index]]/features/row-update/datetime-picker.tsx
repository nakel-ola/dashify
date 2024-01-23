"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { TimeCard, type TimeValue } from "./time-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type Props = {
  value?: Date;
  onChange?: (value?: Date) => void;
  disabled?: boolean;
};

export const DatetimePicker = (props: Props) => {
  const { onChange, value, disabled } = props;

  const [isOpen, setIsOpen] = useState(false);

  const [date, setDate] = useState<Date>(new Date());

  const updateDate = (value: Date) => {
    const newDate = new Date(date);

    newDate.setFullYear(value.getFullYear());
    newDate.setMonth(value.getMonth());
    newDate.setDate(value.getDate());

    setDate(newDate);
  };

  const updateTime = (time: TimeValue) => {
    const newDate = new Date(date);
    newDate.setHours(time.hours);
    newDate.setMinutes(time.minutes);
    newDate.setSeconds(time.seconds);

    setDate(newDate);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="w-full" disabled={disabled}>
        <div
          className={cn(
            "w-full items-center text-left font-normal border-[1.5px] border-slate-100 dark:border-neutral-800 rounded-md cursor-pointer flex justify-between",
            !value && "text-muted-foreground"
          )}
        >
          <p className="text-black dark:text-white py-2 px-3">
            {value ? (
              format(value, "PPP")
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
              hours: date.getHours(),
              minutes: date.getMinutes(),
              seconds: date.getSeconds(),
            }}
            classes={{
              root: "w-[230px]"
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
