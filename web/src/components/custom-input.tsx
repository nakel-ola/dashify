import { cn } from "@/lib/utils";
import React from "react";
import { Input, InputProps } from "./ui/input";

export interface Props extends Omit<InputProps, "error"> {
  label?: string;
  classes?: {
    root?: string;
    label?: string;
    labelRoot?: string;
    inputRoot?: string;
    input?: string;
    inputIcon?: string;
  };
  labelRight?: React.ReactNode;
  error?: string;
  showErrorMessage?: boolean;
}

const CustomInput = (props: Props) => {
  const {
    id,
    name,
    label,
    classes,
    className,
    onClick,
    labelRight,
    error,
    showErrorMessage = true,
    ...rest
  } = props;

  return (
    <div className={classes?.root}>
      {label || labelRight ? (
        <div
          className={cn(
            "flex items-center justify-between mb-2",
            classes?.labelRoot
          )}
        >
          {label && (
            <label
              htmlFor={name || id}
              className={cn(
                "block text-base font-semibold leading-6 text-black dark:text-white",
                classes?.label
              )}
            >
              {label}
            </label>
          )}

          {labelRight}
        </div>
      ) : null}
      <Input
        classes={{
          root: classes?.inputRoot,
          input: classes?.input,
          icon: classes?.inputIcon,
        }}
        id={id}
        name={name}
        error={!!error}
        {...rest}
      />

      {showErrorMessage && error ? (
        <div className="mt-2">
          <p className="text-red-500">{error}</p>
        </div>
      ) : null}
    </div>
  );
};

export default CustomInput;
