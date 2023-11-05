"use client";
import { RippleCard } from "@/components/ripple-card";
import { useNextTheme } from "@/hooks/use-next-theme";
import { Moon, Sun1 } from "iconsax-react";
import React from "react";

export const ThemeButton = () => {
  const { theme, setTheme } = useNextTheme();

  return (
    <RippleCard
      Component="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-[40px] h-[40px] text-black dark:text-white bg-slate-100 dark:bg-neutral-800 flex items-center justify-center transition-transform rounded-md"
    >
      <Sun1 className="text-white dark:block hidden" />

      <Moon className="text-black dark:hidden" />
    </RippleCard>
  );
};
