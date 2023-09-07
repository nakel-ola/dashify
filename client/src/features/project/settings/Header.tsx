import { IconButton } from "@/components/IconButton";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import useNextTheme from "@/hooks/useNextTheme";
import { cn } from "@/lib/utils";
import { HambergerMenu, Moon, Sun1 } from "iconsax-react";

type HeaderProps = {
  onMenuClick: () => void;
  active: number;
  setActive: (value: number) => void;
};

export const Header = (props: HeaderProps) => {
  const { active, setActive, onMenuClick } = props;
  const { theme, setTheme } = useNextTheme();

  const tabs = ["Theme", "Schema"];

  return (
    <div className="p-2 px-4 flex items-start justify-between h-[50px] border-b border-project-hover dark:border-project-hover-dark">
      {/* search bar */}

      <div className="flex items-center">
        <IconButton onClick={onMenuClick} className="-mt-2 lg:hidden mr-5">
          <HambergerMenu className="text-project-text-color dark:text-project-text-color-dark" />
        </IconButton>

        {tabs.map((tab, index) => (
          <button
            type="button"
            key={index}
            className={cn("flex flex-col h-[42px] mr-5")}
            onClick={() => setActive(index)}
          >
            <p
              className={cn(
                "text-lg",
                active === index
                  ? "text-project-primary"
                  : "text-project-text-color dark:text-project-text-color-dark"
              )}
            >
              {tab}
            </p>

            <span
              className={cn(
                "h-[1.5px] w-full mt-auto",
                active === index ? "bg-project-primary" : ""
              )}
            ></span>
          </button>
        ))}
      </div>

      <div className="flex items-center space-x-3">
        <IconButton
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun1 className="text-project-text-color dark:text-project-text-color-dark" />
          ) : (
            <Moon className="text-project-text-color dark:text-project-text-color-dark" />
          )}
        </IconButton>

        <Avatar className="h-[35px] w-[35px]">
          <AvatarImage src="/profile-pic.png" />
        </Avatar>
      </div>
    </div>
  );
};
