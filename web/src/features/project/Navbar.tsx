import { IconButton } from "@/components/IconButton";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import useNextTheme from "@/hooks/useNextTheme";
import { HambergerMenu, Moon, SearchNormal, Sun1 } from "iconsax-react";
import React, { FormEvent } from "react";

type Props = {
  onMenuClick(): void;
  title: string;
};
export const Navbar = (props: Props) => {
  const { onMenuClick, title } = props;
  const { theme, setTheme } = useNextTheme();

  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };
  return (
    <div className="p-2 px-4 flex items-start justify-between">
      {/* search bar */}

      <div className="flex">
        <IconButton onClick={onMenuClick} className="lg:hidden">
          <HambergerMenu className="text-project-text-color dark:text-project-text-color-dark" />
        </IconButton>

        <h1 className="text-4xl text-project-text-color dark:text-project-text-color-dark">
          {title}
        </h1>
      </div>

      <div className="flex items-center space-x-3">
        <IconButton
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun1
              size={20}
              className="text-project-text-color dark:text-project-text-color-dark"
            />
          ) : (
            <Moon
              size={20}
              className="text-project-text-color dark:text-project-text-color-dark"
            />
          )}
        </IconButton>

        <Avatar className="h-[30px] w-[30px]">
          <AvatarImage src="/profile-pic.png" />
        </Avatar>
      </div>
    </div>
  );
};
