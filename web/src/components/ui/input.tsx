"use client";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  error?: boolean;
  classes?: {
    root?: string;
    input?: string;
    icon?: string;
  };
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    className,
    type,
    endIcon,
    startIcon,
    error,
    onFocus,
    readOnly,
    classes,
    onBlur,
    ...rest
  } = props;
  const [focus, setFocus] = React.useState(false);
  return (
    <div
      className={cn(
        "flex items-center justify-between bg-transparent rounded-md overflow-hidden border-[1.5px] w-full transition-all duration-300",
        classes?.root,
        error
          ? "border-red-500"
          : focus && !readOnly
          ? "border-indigo-600"
          : "  border-slate-100 dark:border-neutral-800"
      )}
    >
      {startIcon && <span className={cn("px-2", classes?.icon)}>{startIcon}</span>}

      <input
        type={type}
        className={cn(
          "flex h-10 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 outline-none border-0  disabled:cursor-not-allowed disabled:opacity-50  dark:placeholder:text-slate-400 transition-all duration-300 w-full",
          className,
          classes?.input
        )}
        ref={ref}
        readOnly={readOnly}
        onFocus={(e) => {
          onFocus?.(e);
          setFocus(true);
        }}
        onBlur={(e) => {
          onBlur?.(e);
          setFocus(false);
        }}
        {...rest}
      />

      {endIcon && <span className={cn("px-2", classes?.icon)}>{endIcon}</span>}
    </div>
  );
});
Input.displayName = "Input";

export { Input };
