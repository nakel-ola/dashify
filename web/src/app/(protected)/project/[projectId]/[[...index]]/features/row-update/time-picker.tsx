"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ClockIcon } from "lucide-react";
import { useState } from "react";
import { type Time, TimeCard } from "./time-card";
import { Button } from "@/components/ui/button";

type Props = {
  value?: Time;
  onChange?: (value?: Time) => void;
};
export const TimePicker = (props: Props) => {
  const { onChange, value = "00:00:00" } = props;

  const [isOpen, setIsOpen] = useState(false);

  const [time, setTime] = useState<Time>("00:00:00");

  const { hours, minutes, seconds } = getTime(time);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal>
      <PopoverTrigger asChild className="">
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

      <PopoverContent className="w-[280px] p-0 h-[300px] !bg-white dark:!bg-dark !border-[1.5px] !border-neutral-800 rounded-md">
        <TimeCard
          onChange={(newValue) =>
            setTime(`${newValue.hours}:${newValue.minutes}:${newValue.seconds}`)
          }
          value={{
            hours: Number(hours),
            minutes: Number(minutes),
            seconds: Number(seconds),
          }}
        />
        <div className="flex items-center justify-between p-1 px-2 border-t-[1.5px] border-neutral-800">
          <Button
            className="ml-auto"
            onClick={() => {
              onChange?.(time);
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

const getTime = (value: Time) => {
  const arr = value.split(":");

  return {
    hours: arr[0] ?? "00",
    minutes: arr[1] ?? "00",
    seconds: arr[2] ?? "00",
  };
};
