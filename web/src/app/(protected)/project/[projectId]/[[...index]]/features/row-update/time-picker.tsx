"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ClockIcon } from "lucide-react";
import { useState } from "react";
import { TimeCard } from "./time-card";
import { Button } from "@/components/ui/button";

type Time = `${string}:${string}:${string}`;

type Props = {
  value?: Time;
  onChange?: (value?: Time) => void;
  disabled?: boolean;
};
export const TimePicker = (props: Props) => {
  const { onChange, value = "00:00:00 AM", disabled } = props;

  const [isOpen, setIsOpen] = useState(false);

  const [time, setTime] = useState<Time>("00:00:00 AM");

  const { hours, minutes, period } = getTime(time);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal>
      <PopoverTrigger asChild className="" disabled={disabled}>
        <div
          className={cn(
            "w-full items-center text-left font-normal border-[1.5px] border-slate-100 dark:border-neutral-800 rounded-md cursor-pointer flex justify-between",
            !value && "text-muted-foreground"
          )}
        >
          <p className="text-black dark:text-white py-2.5 px-3">
            {value.length > 0 ? (
              value
            ) : (
              <span className="text-[#8b8b8b]">Pick a time</span>
            )}
          </p>
          <ClockIcon className="mr-2 h-4 w-4 text-neutral-600" />
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-[280px] p-0 h-[350px] !bg-white dark:!bg-dark !border-[1.5px] border-slate-100 dark:!border-neutral-800 rounded-md">
        <TimeCard
          onChange={(newValue) =>
            setTime(
              `${newValue.hours}:${newValue.minutes}:00 ${newValue.period}`
            )
          }
          value={{
            hours,
            minutes,
            period,
          }}
        />
        <div className="flex items-center justify-between p-1 px-2 border-t-[1.5px] border-slate-100 dark:border-neutral-800">
          <Button
            className="ml-auto"
            onClick={() => {
              onChange?.(convertTo24HourFormat(time));
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

const getTime = (timeString: string) => {
  const match = timeString.match(/^(\d{2}):(\d{2}):(\d{2})\s(AM|PM)$/);

  if (!match)
    return {
      hours: "00",
      minutes: "00",
      seconds: "00",
      period: "AM" as const,
    };

  const hours = formatNumber(parseInt(match[1], 10));
  const minutes = match[2];
  const seconds = match[3];
  const period = match[4] as "AM" | "PM";

  return { hours, minutes, seconds, period };
};

function convertTo24HourFormat(timeString: string): Time {
  const match = timeString.match(/^(\d{2}):(\d{2}):(\d{2})\s(AM|PM)$/);

  if (!match) return "00:00:00";

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const seconds = match[3];
  const period = match[4];

  if (period === "PM" && hours < 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }

  // Convert to string with leading zeros
  const formattedHours = hours.toString().padStart(2, "0");

  return `${formattedHours}:${minutes}:${seconds}`;
}

const formatNumber = (num: number) => (num < 10 ? `0${num}` : `${num}`);
