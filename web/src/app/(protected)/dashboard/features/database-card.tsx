import { RippleCard } from "@/components/ripple-card";
import databases from "@/data/databases.json";
import { cn } from "@/lib/utils";
import { TickCircle } from "iconsax-react";
import Image from "next/image";

type DatabaseCardProps = {
  active: string | null;
  onChange(value: string): void;
};
export const DatabaseCard = (props: DatabaseCardProps) => {
  const { active, onChange } = props;
  return (
    <div className="flex items-center overflow-x-scroll mt-2 space-x-3 scrollbar-hidden !max-w-[calc(450px-50px)] !w-[100%] lg:!w-[100%] ">
      {databases.map(({ name, url }, index) => (
        <RippleCard
          key={index}
          className={cn(
            "relative border-[1.5px] w-[150px] h-[80px] shrink-0 rounded-md flex flex-col justify-center items-center transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-100/10",
            active?.toLowerCase() === name.toLowerCase()
              ? "border-indigo-600 "
              : " border-slate-100 dark:border-neutral-800"
          )}
          onClick={() => onChange(name.toLowerCase())}
        >
          <div className="flex flex-col justify-center items-center relative">
            <Image
              src={url}
              alt=""
              width={40}
              height={40}
              className="h-[40px] w-[40px]"
            />

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
