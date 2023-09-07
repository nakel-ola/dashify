import useNextTheme from "@/hooks/useNextTheme";
import ripple from "@/lib/ripple";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-semibold ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-800 hover:scale-[1.02] active:scale-[0.98] shadow-sm",
  {
    variants: {
      variant: {
        solid: "bg-indigo-600 text-white hover:bg-indigo-600/90",
        faded: "bg-indigo-600/10 text-indigo-600 hover:bg-indigo-600/20",
        outline:
          "border  border-indigo-600 bg-transparent hover:bg-indigo-600/10 text-indigo-600",
        ghost: "hover:bg-indigo-600/10 text-indigo-600 shadow-none",
      },
      size: {
        default: "h-9 px-3.5 py-2.5",
        sm: "h-9 rounded-md px-4",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const { theme } = useNextTheme();
    return (
      <Comp
        onMouseDown={(e: any) => ripple(e, theme!)}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
