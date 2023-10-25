import useNextTheme from "@/hooks/useNextTheme";
import ripple from "@/lib/ripple";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface RippleCardProps extends HTMLAttributes<HTMLDivElement> {
  Component?: any;
}

export const RippleCard = (props: RippleCardProps) => {
  const { className, onMouseDown, Component = "div", ...rest } = props;
  const { theme } = useNextTheme();

  return (
    <Component
      className={cn("cursor-pointer", className)}
      onMouseDown={(e: any) => {
        ripple(e, theme === "dark" ? "light" : "dark");
        onMouseDown?.(e);
      }}
      {...rest}
    />
  );
};
