/* eslint-disable @next/next/no-img-element */
import { RippleCard } from "@/components/RippleCard";
import databases from "@/data/databases.json";
import React from "react";

import { cn } from "@/lib/utils";
import { TickCircle } from "iconsax-react";

type DatabaseCardProps = {
  active: string | null;
  onChange(value: string): void;
};
export const DatabaseCard = (props: DatabaseCardProps) => {
  const { active, onChange } = props;
  return (
    <div className="flex items-center w-full overflow-x-scroll space-x-3 scrollbar-hidden">
      {databases.map(({ name, url }, index) => (
        <RippleCard
          key={index}
          className={cn(
            "relative border-[1.5px]  w-[150px] h-[80px] shrink-0 rounded-md flex flex-col justify-center items-center transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-100/10",
            active?.toLowerCase() === name.toLowerCase()
              ? "border-indigo-600 "
              : " border-slate-100 dark:border-neutral-800"
          )}
          onClick={() => onChange(name.toLowerCase())}
        >
          <div className="flex flex-col justify-center items-center relative">
            <img src={url} alt="" className="h-[40px] w-[40px]" />

            <p className="">{name}</p>
          </div>

          {active?.toLowerCase() === name.toLowerCase() ? (
            <div className="absolute top-0 right-0">
              <TickCircle variant="Bold" className="text-indigo-600" />
            </div>
          ) : null}
        </RippleCard>
      ))}
    </div>
  );
};
