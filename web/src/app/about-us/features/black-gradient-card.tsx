import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

type Props = {
  classes?: {
    root?: string;
    child?: string;
  };
};
export const BlackGradientCard = (props: PropsWithChildren<Props>) => {
  const { children, classes } = props;
  return (
    <div
      className={cn(
        "-mt-[68px] bg-black [background-size:_75px_75px] [background-image:_linear-gradient(to_right,_#262626_1px,_transparent_1px),_linear-gradient(to_bottom,_#262626_1px,_transparent_1px)]",
        classes?.root
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-2xl text-center pt-[110px] pb-[42px] [background:_radial-gradient(ellipse_50%_80%_at_50%_50%,rgba(93,52,221,0.4),transparent)]",
          classes?.child
        )}
      >
        {children}
      </div>
    </div>
  );
};
