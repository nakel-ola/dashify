import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

type Props = {
  title: string;
  subtitle: string;

  classes?: {
    root?: string;
    left?: {
      root?: string;
      title?: string;
      subtitle?: string;
    };
    right?: string;
  };
};
export const TitleSection = (props: PropsWithChildren<Props>) => {
  const { children, subtitle, title, classes } = props;
  return (
    <div
      className={cn("flex flex-col lg:flex-row gap-10 w-full", classes?.root)}
    >
      <div className={cn("lg:w-[40%]", classes?.left?.root)}>
        <p
          className={cn(
            "text-4xl text-black dark:text-white",
            classes?.left?.title
          )}
        >
          {title}
        </p>
        <p
          className={cn(
            "text-gray-dark dark:text-gray-light",
            classes?.left?.subtitle
          )}
        >
          {subtitle}
        </p>
      </div>

      <div className={cn("w-full", classes?.right)}>{children}</div>
    </div>
  );
};
