"use client";
import { RippleCard } from "@/components/ripple-card";
import { useNextTheme } from "@/hooks/use-next-theme";
import { cn } from "@/lib/utils";
import { Moon, Sun1 } from "iconsax-react";
import React from "react";

type Props = {
  isScrollUp: boolean;
};
export const ThemeButton = (props: Props) => {
  const { isScrollUp } = props;

  const { theme, setTheme } = useNextTheme();
  return (
    <RippleCard
      Component="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "w-[45px] text-white hover:bg-slate-100/10 flex items-center justify-center transition-transform py-1.5 rounded-full"
      )}
    >
      <Sun1
        className={cn(
          "text-white h-[25px] w-[25px] dark:block hidden",
          isScrollUp ? "text-black dark:text-white" : ""
        )}
      />

      <Moon
        className={cn(
          "text-white h-[25px] w-[25px] dark:hidden",
          isScrollUp ? "text-black dark:text-white" : ""
        )}
      />
    </RippleCard>
  );
};
