"use client"

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import React, { PropsWithChildren, useEffect, useRef } from "react";
import { useLockedBody, useOnClickOutside } from "usehooks-ts";

type ModalProps = {
  open: boolean;
  onOpenChange?(value: boolean): void;
  className?: string;
  classes?: {
    root?: string;
    button?: string;
    buttonIcon?: string;
  };
};

export const Modal = (props: PropsWithChildren<ModalProps>) => {
  const { open, onOpenChange, children, className, classes } = props;

  const [_, setLock] = useLockedBody(false);

  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => {
    onOpenChange?.(false);
    setLock(false);
  });

  useEffect(() => {
    if (open) setLock(true);
  }, [open, setLock]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-full h-full bg-black/50 grid place-items-center z-50"
        >
          <motion.div
            ref={ref}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.12 }}
            className="relative"
          >
            <div
              className={cn(
                "relative max-h-[85vh] overflow-y-scroll w-[90%] md:w-full bg-white dark:bg-dark rounded-lg shadow p-5",
                className,
                classes?.root
              )}
            >
              {children}
            </div>

            <button
              type="button"
              className={cn(
                "absolute -top-2 -right-2 z-50 h-[35px] w-[35px] border-[1.5px] border-slate-100 dark:border-neutral-700 bg-white dark:bg-dark grid place-items-center rounded-full hover:scale-[1.02] active:scale-[0.99] cursor-pointer",
                classes?.button
              )}
              onClick={() => onOpenChange?.(false)}
            >
              <X
                className={cn(
                  "text-black dark:text-white",
                  classes?.buttonIcon
                )}
              />
            </button>
          </motion.div>
        </motion.div>
      ): null}
    </AnimatePresence>
  );
};
