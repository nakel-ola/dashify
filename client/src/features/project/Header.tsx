/* eslint-disable @next/next/no-img-element */
import useWindowPosition from "@/hooks/useWindowPosition";
import { cn } from "@/lib/utils";

export const Header = () => {
  const scroll = useWindowPosition();

  return (
    <div
      className="bg-black"
      style={{
        backgroundSize: "75px 75px",
        backgroundImage:
          "linear-gradient(to right, #262626 1px, transparent 1px), linear-gradient(to bottom, #262626 1px, transparent 1px)",
      }}
    >
      <div
        className={cn(
          "px-5 lg:px-10 py-4 flex items-center justify-between bg-transparent transition-all duration-300  sticky top-0 z-50 page-max-width"
        )}
      >
        <div className="flex items-center cursor-pointer">
          <img className="h-8 w-auto" src="/logo.png" alt="Dashify" />
          <p
            className={cn(
              "text-xl ml-2 font-medium dark:text-white",
              scroll.y > 400
                ? "text-black lg:text-white"
                : "text-white lg:text-black",
              scroll.y > 700 ? "lg:text-black" : "lg:text-white",
              scroll.y > 3080 ? "lg:text-white" : "",
              scroll.y > 3660 ? "text-white" : ""
            )}
          >
            Dashify
          </p>
        </div>
      </div>
    </div>
  );
};
