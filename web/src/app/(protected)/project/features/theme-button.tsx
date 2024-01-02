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
      className="w-[35px] h-[35px] text-black dark:text-white bg-slate-100 dark:bg-slate-100/10 flex items-center justify-center transition-transform rounded-full"
    >
      <Sun1 className="text-white dark:block hidden" size={20}   />

      <Moon className="text-black dark:hidden" size={20} />
    </RippleCard>
  );
};
