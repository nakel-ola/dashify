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
      className="w-[45px] text-white hover:bg-slate-100/10 flex items-center justify-center transition-transform py-1.5 rounded-full"
    >
      <Sun1 className="text-white h-[25px] w-[25px] dark:block hidden" />

      <Moon className="text-white h-[25px] w-[25px] dark:hidden" />
    </RippleCard>
  );
};
