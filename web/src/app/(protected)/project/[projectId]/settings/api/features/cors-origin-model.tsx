"use client";
import CustomInput from "@/components/custom-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

function isValidUrl(str: string) {
  try {
    new URL(str);
    return true;
  } catch (err) {
    return false;
  }
}

export const CorsOriginModel = (props: Props) => {
  const { open, onClose } = props;

  const [input, setInput] = useState("");

  const disabled = isValidUrl(input);

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (value === false) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[525px] p-0">
        <DialogHeader className="border-b-[1.5px] border-slate-100 dark:border-neutral-800 p-4">
          <DialogTitle>Add origin</DialogTitle>
        </DialogHeader>

        <div className="p-4">
          <p className="mb-5">
            A URL in the format of protocol://hostname[:port]
          </p>

          <CustomInput
            placeholder="https://"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <DialogFooter className="border-t-[1.5px] border-slate-100 dark:border-neutral-800 p-4 py-2 gap-5">
          <Button
            type="button"
            onClick={onClose}
            className="w-full"
            variant="ghost"
          >
            Cancel
          </Button>
          <Button
            type="button"
            // disabled={!isPending ? disabled() : isPending}
            disabled={!disabled}
            className="w-full"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
