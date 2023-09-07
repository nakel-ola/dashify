"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";

import constant from "@/lib/constant";
import { cn } from "@/lib/utils";

interface Color {
  id: string;
  bg: string;
  text: string;
}

let selectedColors: Color[] = [];

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, alt, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    alt={alt}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, children, style, ...props }, ref) => {
  const colors = constant.avatarColors;

  const getText = () => {
    const alt = typeof children === "string" ? children : "";
    if (!children) return "";

    const textArray = alt.split(" ");
    if (textArray.length === 1) return alt.substring(0, 2);
    else return `${textArray[0].charAt(0)}${textArray[1].charAt(0)}`;
  };

  const text = getText();

  const getNextNum = () => {
    if (selectedColors.length === 0) return 0;

    const lastInx = colors.findIndex(
      (c) => c.text === selectedColors[selectedColors.length - 1].text
    );

    if (lastInx === colors.length - 1) return 0;

    return lastInx + 1;
  };

  const color = React.useMemo(() => {
    const inx = selectedColors.findIndex((c) => c.id === text);

    if (inx !== -1) return selectedColors[inx];

    let color = colors[getNextNum()];

    selectedColors.push({ id: text, ...color });

    return color;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors]);

  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-slate-100 dark:bg-neutral-800",
        className
      )}
      style={
        typeof children === "string"
          ? {
              backgroundColor: color.bg,
              color: color.text,
              ...style,
            }
          : style
      }
      {...props}
    >
      {typeof children === "string" ? text : children}
    </AvatarPrimitive.Fallback>
  );
});
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarFallback, AvatarImage };
