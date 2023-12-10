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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  open: boolean;
  onClose: () => void;
};

const permissions = ["editor", "viewer"];

export const TokensModel = (props: Props) => {
  const { open, onClose } = props;

  const [name, setName] = useState("");
  const [permission, setPermission] = useState("");

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (value === false) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[525px] p-0">
        <DialogHeader className="border-b-[1.5px] border-slate-100 dark:border-neutral-800 p-4">
          <DialogTitle>Create token</DialogTitle>
        </DialogHeader>

        <div className="p-4 flex items-center gap-5">
          <CustomInput
            label="Name"
            placeholder='"Employee import", "Website preview" or "PDF generator".'
            value={name}
            required
            classes={{ root: "w-full" }}
            onChange={(e) => setName(e.target.value)}
          />

          <Select value={permission} onValueChange={setPermission}>
            <SelectTrigger className="w-[180px] !h-11 capitalize mt-8">
              <SelectValue
                defaultValue="viewer"
                placeholder="Permissions"
                className="capitalize"
              />
            </SelectTrigger>
            <SelectContent position="item-aligned">
              {permissions.map((role) => (
                <SelectItem key={role} value={role} className="capitalize">
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            className="w-full"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
