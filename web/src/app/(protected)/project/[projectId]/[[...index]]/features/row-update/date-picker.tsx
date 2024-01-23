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

type Props = {
  value?: Date;
  onChange?: (value?: Date) => void;
  disabled?: boolean;
};
export const DatePicker = (props: Props) => {
  const { onChange, value, disabled } = props;

  return (
    <Popover>
      <PopoverTrigger asChild className="" disabled={disabled}>
        <div
          className={cn(
            "w-full items-center text-left font-normal border-[1.5px] border-slate-100 dark:border-neutral-800 rounded-md cursor-pointer flex justify-between",
            !value && "text-muted-foreground"
          )}
        >
          <p className="text-black dark:text-white py-2.5 px-3">
            {value ? (
              format(value, "PPP")
            ) : (
              <span className="text-[#8b8b8b]">Pick a date</span>
            )}
          </p>
          <CalendarIcon className="mr-2 h-4 w-4 text-neutral-600" />
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0 !border-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          classNames={{
            root: "bg-white dark:bg-dark !border-[1.5px] border-slate-100 dark:!border-neutral-800 rounded-md",
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
