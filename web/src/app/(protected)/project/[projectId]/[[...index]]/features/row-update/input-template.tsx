import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

type Props = {
  classes?: {
    root?: string;
    label?: string;
    labelRoot?: string;
    inputRoot?: string;
    input?: string;
    inputIcon?: string;
  };
  name: string;
  dataType: string;
};
export const InputTemplate = (props: PropsWithChildren<Props>) => {
  const { name, dataType, classes, children } = props;
  return (
    <div className={cn("px-6", classes?.root)}>
      <p className="block text-base font-semibold leading-6 text-black dark:text-white mb-2">
        {name}
        <small className="text-gray-dark dark:text-gray-light text-xs ml-1">
          {dataType}
        </small>
      </p>

      {children}
    </div>
  );
};
