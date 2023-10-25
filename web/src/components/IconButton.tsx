import { cn } from "@/lib/utils";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {};
export const IconButton = (props: Props) => {
  const { children, className, type = "button", ...rest } = props;
  return (
    <button
      className={cn(
        "h-[35px] w-[35px] flex items-center justify-center bg-slate-100 dark:bg-neutral-800 rounded-lg hover:scale-105 active:scale-[0.98]",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
