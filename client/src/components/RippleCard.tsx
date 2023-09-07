import useNextTheme from "@/hooks/useNextTheme";
import ripple from "@/lib/ripple";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface RippleCardProps extends HTMLAttributes<HTMLDivElement> {}

export const RippleCard = (props: RippleCardProps) => {
  const { children, className, onMouseDown, ...rest } = props;
  const { theme } = useNextTheme();

  return (
    <div
      className={cn("cursor-pointer", className)}
      onMouseDown={(e: any) => {
        ripple(e, theme === "dark" ? "light" : "dark");
        onMouseDown?.(e);
      }}
      {...rest}
    >
      {children}
    </div>
  );
};
